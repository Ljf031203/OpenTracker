// 行为监控插件的主入口文件
import {
  UserMetricsStore,
  BehaviorStore,
  IMetrics,
  PageInfo,
  OriginInfo,
  ClickData,
  PVData,
  EngineInstance,
} from './types'
import {
  wrHistory,
  ClickCollector,
  RouteChangeCollector,
  PVCollector,
  HttpCollector,
} from './collector'
import { ProcessorManager } from './processor'

export default class UserVitals {
  private engineInstance: EngineInstance

  // 本地暂存数据在 Map 里 （也可以自己用对象来存储）
  public metrics: UserMetricsStore

  public breadcrumbs: BehaviorStore

  public customHandler: Function

  // 最大行为追踪记录数
  public maxBehaviorRecords: number

  // 允许捕获click事件的DOM标签 eg:button div img canvas
  clickMountList: Array<string>

  // 数据处理器管理器
  private processorManager: ProcessorManager

  // 收集器实例
  private clickCollector!: ClickCollector
  private routeChangeCollector!: RouteChangeCollector
  private httpCollector!: HttpCollector

  constructor(engineInstance: EngineInstance) {
    this.engineInstance = engineInstance
    this.metrics = new UserMetricsStore()
    // 限制最大行为追踪记录数为 100，真实场景下需要外部传入自定义;
    this.maxBehaviorRecords = 100
    // 初始化行为追踪记录
    this.breadcrumbs = new BehaviorStore({ maxBehaviorRecords: this.maxBehaviorRecords })
    // 初始化数据处理器管理器
    this.processorManager = new ProcessorManager()
    // 初始化 用户自定义 事件捕获
    this.customHandler = this.initCustomerHandler()
    // 作为 真实sdk 的时候，需要在初始化时传入与默认值合并;
    this.clickMountList = ['button'].map((x) => x.toLowerCase())
    // 重写事件
    wrHistory()
    // 初始化页面基本信息
    this.initPageInfo()
    // 初始化路由跳转获取
    this.initRouteChange()
    // 初始化用户来路信息获取
    this.initOriginInfo()
    // 初始化 PV 的获取;
    this.initPV()
    // 初始化 click 事件捕获
    this.initClickHandler(this.clickMountList)
    // 初始化 Http 请求事件捕获
    this.initHttpHandler()
    // 上报策略在后几篇细说
  }

  // 封装用户行为的上报入口
  userSendHandler = (data: IMetrics) => {
    // 处理数据
    const processedData = this.processorManager.process(data)
    // 进行通知内核实例进行上报;
    this.engineInstance.send(processedData)
  }

  // 补齐 pathname 和 timestamp 参数
  getExtends = (): { page: string; timestamp: number | string } => {
    return {
      page: this.getPageInfo().pathname,
      timestamp: new Date().getTime(),
    }
  }

  // 获取页面信息
  getPageInfo = (): PageInfo => {
    return {
      pathname: window.location.pathname,
      title: document.title,
      url: window.location.href,
    }
  }

  // 初始化用户自定义埋点数据的获取上报
  initCustomerHandler = (): Function => {
    // 实现用户自定义埋点的逻辑
    return (data: any) => {
      // 处理自定义埋点数据
      const metrics = {
        ...data,
        ...this.getExtends(),
      }
      this.userSendHandler(metrics)
    }
  }

  // 初始化 PI 页面基本信息的获取以及返回
  initPageInfo = (): void => {
    // 实现页面基本信息获取的逻辑
    const pageInfo = this.getPageInfo()
    this.metrics.set('pageInfo', pageInfo)
  }

  // 初始化 RCR 路由跳转的获取以及返回
  initRouteChange = (): void => {
    // 创建路由变化收集器
    this.routeChangeCollector = new RouteChangeCollector(this.userSendHandler)
    // 启动路由变化监控
    this.routeChangeCollector.start()
  }

  // 初始化 PV 的获取以及返回
  initPV = (): void => {
    // 创建PV收集器
    const pvCollector = new PVCollector(this.userSendHandler)
    // 收集PV数据
    pvCollector.collect()

    // 监听页面可见性变化，处理页面重新获得焦点时的PV
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        pvCollector.collect()
      }
    })
  }

  // 初始化 OI 用户来路的获取以及返回
  initOriginInfo = (): void => {
    // 实现用户来路信息获取的逻辑
    const originInfo: OriginInfo = {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    }
    this.metrics.set('originInfo', originInfo)
  }

  // 初始化 CBR 点击事件的获取和返回
  initClickHandler = (mountList: Array<string>): void => {
    // 创建点击事件收集器
    this.clickCollector = new ClickCollector(this.breadcrumbs, mountList, this.userSendHandler)
    // 启动点击事件监控
    this.clickCollector.start()
  }

  // 初始化 http 请求的数据获取和上报
  initHttpHandler = (): void => {
    // 创建HTTP请求收集器
    this.httpCollector = new HttpCollector(this.userSendHandler)
    // 启动HTTP请求监控
    this.httpCollector.start()
  }

  // 设置点击监控的DOM标签列表
  setClickMountList = (list: Array<string>): void => {
    this.clickMountList = list.map((x) => x.toLowerCase())
    // 重新初始化点击事件处理器
    if (this.clickCollector) {
      this.clickCollector.stop()
    }
    this.initClickHandler(this.clickMountList)
  }

  // 添加点击监控的DOM标签
  addClickMountTag = (tag: string): void => {
    const lowerTag = tag.toLowerCase()
    if (!this.clickMountList.includes(lowerTag)) {
      this.clickMountList.push(lowerTag)
      this.setClickMountList(this.clickMountList)
    }
  }

  // 移除点击监控的DOM标签
  removeClickMountTag = (tag: string): void => {
    const lowerTag = tag.toLowerCase()
    const index = this.clickMountList.indexOf(lowerTag)
    if (index > -1) {
      this.clickMountList.splice(index, 1)
      this.setClickMountList(this.clickMountList)
    }
  }

  // 设置最大行为记录数
  setMaxBehaviorRecords = (max: number): void => {
    this.maxBehaviorRecords = max
    // 重新创建行为存储
    this.breadcrumbs = new BehaviorStore({ maxBehaviorRecords: this.maxBehaviorRecords })
    // 如果点击收集器已存在，重新初始化
    if (this.clickCollector) {
      this.clickCollector.stop()
      this.initClickHandler(this.clickMountList)
    }
  }

  // 获取所有行为记录
  getBreadcrumbs = (): Array<IMetrics> => {
    return this.breadcrumbs.getAll()
  }

  // 清空行为记录
  clearBreadcrumbs = (): void => {
    this.breadcrumbs.clear()
  }

  // 销毁实例，清理事件监听
  destroy = (): void => {
    if (this.clickCollector) {
      this.clickCollector.stop()
    }
    if (this.routeChangeCollector) {
      this.routeChangeCollector.stop()
    }
    if (this.httpCollector) {
      this.httpCollector.stop()
    }
    // 清空数据
    this.metrics.clear()
    this.clearBreadcrumbs()
  }
}
