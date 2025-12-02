// 行为监控相关的类型定义

// 指标数据接口
export interface IMetrics {
  type: string
  page: string
  timestamp: number | string
  [key: string]: any
}

// 页面信息接口
export interface PageInfo {
  pathname: string
  title?: string
  url?: string
}

// 来源信息接口
export interface OriginInfo {
  referrer: string
  userAgent: string
}

// 点击事件数据接口
export interface ClickData extends IMetrics {
  type: 'click'
  tagName: string
  className: string
  id: string
  textContent?: string
}

// PV数据接口
export interface PVData extends IMetrics {
  type: 'pv'
}

// 用户指标存储类
export class UserMetricsStore {
  private store: Map<string, any>

  constructor() {
    this.store = new Map()
  }

  set(key: string, value: any): void {
    this.store.set(key, value)
  }

  get(key: string): any {
    return this.store.get(key)
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  getAll(): Map<string, any> {
    return this.store
  }
}

// 行为存储配置接口
interface BehaviorStoreConfig {
  maxBehaviorRecords: number
}

// 行为数据接口
export interface BehaviorData extends IMetrics {
  type: string
  page: string
  timestamp: number | string
  [key: string]: any
}

// 行为存储类
export class BehaviorStore {
  private store: BehaviorData[]
  private maxRecords: number

  constructor(config: BehaviorStoreConfig) {
    this.store = []
    this.maxRecords = config.maxBehaviorRecords
  }

  add(data: BehaviorData): void {
    this.store.push(data)

    // 如果超过最大记录数，删除最早的记录
    if (this.store.length > this.maxRecords) {
      this.store.shift()
    }
  }

  getAll(): BehaviorData[] {
    return this.store
  }

  clear(): void {
    this.store = []
  }

  getCount(): number {
    return this.store.length
  }
}

// 引擎实例接口
export interface EngineInstance {
  send(data: IMetrics): void
  [key: string]: any
}
