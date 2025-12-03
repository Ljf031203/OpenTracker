// 行为监控数据收集器
import { IMetrics, ClickData, PVData, PageInfo, OriginInfo, BehaviorStore } from './types'

// 重写历史记录函数
export function wrHistory() {
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  // 保存原始的history API方法引用
  window.history.pushState = function (...args) {
    // 调用原始方法
    const result = originalPushState.apply(this, args)
    // 触发自定义事件
    window.dispatchEvent(new Event('pushState'))
    window.dispatchEvent(new Event('routeChange'))
    return result
  }

  window.history.replaceState = function (...args) {
    // 调用原始方法
    const result = originalReplaceState.apply(this, args)
    // 触发自定义事件
    window.dispatchEvent(new Event('replaceState'))
    window.dispatchEvent(new Event('routeChange'))
    return result
  }

  // 监听popstate事件
  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('routeChange'))
  })
}

// 基础收集器类
class BaseCollector {
  protected sendHandler: (data: IMetrics) => void

  constructor(sendHandler: (data: IMetrics) => void) {
    this.sendHandler = sendHandler
  }

  // 获取扩展信息
  protected getExtends(): { page: string; timestamp: number | string } {
    return {
      page: window.location.pathname,
      timestamp: new Date().getTime(),
    }
  }

  // 开始收集
  start(): void {}

  // 停止收集
  stop(): void {}
}

// 页面信息收集器
export class PageInfoCollector extends BaseCollector {
  collect(): PageInfo {
    return {
      pathname: window.location.pathname,
      title: document.title,
      url: window.location.href,
    }
  }
}

// 来源信息收集器
export class OriginInfoCollector extends BaseCollector {
  collect(): OriginInfo {
    return {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    }
  }
}

// PV收集器
export class PVCollector extends BaseCollector {
  collect(): void {
    const pvData: PVData = {
      type: 'pv',
      page: window.location.pathname,
      timestamp: new Date().getTime(),
    }
    this.sendHandler(pvData)
  }
}

// 点击事件收集器
export class ClickCollector extends BaseCollector {
  private breadcrumbs: BehaviorStore
  private mountList: string[]
  private clickHandler: (event: MouseEvent) => void

  constructor(
    breadcrumbs: BehaviorStore,
    mountList: string[],
    sendHandler: (data: IMetrics) => void
  ) {
    super(sendHandler)
    this.breadcrumbs = breadcrumbs
    this.mountList = mountList
    this.clickHandler = this.handleClick.bind(this)
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    const tagName = target.tagName.toLowerCase()

    // 检查是否在监控列表中
    if (this.mountList.includes(tagName)) {
      const clickData: ClickData = {
        type: 'click',
        tagName,
        className: target.className,
        id: target.id,
        textContent: target.textContent ? target.textContent.slice(0, 100) : '',
        page: window.location.pathname,
        timestamp: new Date().getTime(),
      }

      // 添加到行为记录
      this.breadcrumbs.add(clickData)
      // 发送数据
      this.sendHandler(clickData)
    }
  }

  start(): void {
    document.addEventListener('click', this.clickHandler, { passive: true })
  }

  stop(): void {
    document.removeEventListener('click', this.clickHandler)
  }
}

// 路由变化收集器
export class RouteChangeCollector extends BaseCollector {
  private routeChangeHandler: () => void

  constructor(sendHandler: (data: IMetrics) => void) {
    super(sendHandler)
    this.routeChangeHandler = this.handleRouteChange.bind(this)
  }

  private handleRouteChange(): void {
    const routeChangeData: IMetrics = {
      type: 'routeChange',
      page: window.location.pathname,
      timestamp: new Date().getTime(),
      pathname: window.location.pathname,
      title: document.title,
    }
    this.sendHandler(routeChangeData)
  }

  start(): void {
    window.addEventListener('routeChange', this.routeChangeHandler)
  }

  stop(): void {
    window.removeEventListener('routeChange', this.routeChangeHandler)
  }
}

// HTTP请求收集器
export class HttpCollector extends BaseCollector {
  private originalFetch: typeof fetch
  private originalXHROpen: XMLHttpRequest['open']
  private originalXHRSend: XMLHttpRequest['send']

  constructor(sendHandler: (data: IMetrics) => void) {
    super(sendHandler)
    this.originalFetch = window.fetch
    this.originalXHROpen = XMLHttpRequest.prototype.open
    this.originalXHRSend = XMLHttpRequest.prototype.send
  }

  private trackFetch(): void {
    window.fetch = async (...args) => {
      const [url, options] = args
      const startTime = performance.now()
      let endTime: number
      let success = true
      let errorMsg = ''

      try {
        const response = await this.originalFetch(...args)
        endTime = performance.now()
        success = response.ok
        return response
      } catch (error) {
        endTime = performance.now()
        success = false
        errorMsg = error instanceof Error ? error.message : 'Unknown error'
        throw error
      } finally {
        this.reportHttpRequest({
          url: typeof url === 'string' ? url : url.toString(),
          method: options?.method || 'GET',
          startTime,
          endTime: performance.now(),
          duration: performance.now() - startTime,
          success,
          errorMsg,
        })
      }
    }
  }

  private trackXHR(): void {
    const originalOpen = this.originalXHROpen
    const originalSend = this.originalXHRSend
    const reportHttpRequest = this.reportHttpRequest.bind(this)

    XMLHttpRequest.prototype.open = function (this: XMLHttpRequest, ...args: any[]) {
      const [method, url] = args
      ;(this as any)._xhrData = {
        method,
        url: typeof url === 'string' ? url : url.toString(),
        startTime: performance.now(),
      }
      return (originalOpen as any).apply(this, args)
    }

    XMLHttpRequest.prototype.send = function (...args) {
      this.addEventListener('loadend', () => {
        if ((this as any)._xhrData) {
          const endTime = performance.now()
          reportHttpRequest({
            ...(this as any)._xhrData,
            endTime,
            duration: endTime - (this as any)._xhrData.startTime,
            success: this.status >= 200 && this.status < 300,
            errorMsg: this.status >= 400 ? `HTTP ${this.status}` : '',
          })
          delete (this as any)._xhrData
        }
      })
      return originalSend.apply(this, args)
    }
  }

  private reportHttpRequest(data: {
    url: string
    method: string
    startTime: number
    endTime: number
    duration: number
    success: boolean
    errorMsg: string
  }): void {
    if (data.url.includes('/api/track/report')) {
      return
    }

    const httpData: IMetrics = {
      type: 'http',
      page: window.location.pathname,
      timestamp: new Date().getTime(),
      ...data,
    }
    this.sendHandler(httpData)
  }

  start(): void {
    this.trackFetch()
    this.trackXHR()
  }

  stop(): void {
    // 恢复原始方法（简化版，实际实现可能需要更复杂的处理）
    window.fetch = this.originalFetch
    XMLHttpRequest.prototype.open = this.originalXHROpen
    XMLHttpRequest.prototype.send = this.originalXHRSend
  }
}
