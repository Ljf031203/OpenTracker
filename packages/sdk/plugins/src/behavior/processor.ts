// 行为监控数据处理器
import { IMetrics } from './types'

// 数据处理器接口
interface DataProcessor {
  process(data: IMetrics): IMetrics
}

// 基础处理器类
export class BaseProcessor implements DataProcessor {
  process(data: IMetrics): IMetrics {
    return data
  }
}

// 点击事件处理器
export class ClickProcessor extends BaseProcessor {
  process(data: IMetrics): IMetrics {
    // 处理点击事件数据
    const processedData = { ...data }

    // 对文本内容进行处理，防止过长
    if (processedData.textContent && typeof processedData.textContent === 'string') {
      processedData.textContent = processedData.textContent.slice(0, 200)
    }

    // 移除可能的敏感信息
    if (processedData.id && this.isSensitiveId(processedData.id)) {
      processedData.id = 'sensitive_id_removed'
    }

    return processedData
  }

  private isSensitiveId(id: string): boolean {
    // 简单的敏感ID检测，实际项目中可能需要更复杂的规则
    const sensitiveKeywords = ['password', 'token', 'secret', 'credit_card', 'ssn']
    const lowerId = id.toLowerCase()
    return sensitiveKeywords.some((keyword) => lowerId.includes(keyword))
  }
}

// PV事件处理器
export class PVProcessor extends BaseProcessor {
  process(data: IMetrics): IMetrics {
    return {
      ...data,
      timestamp: typeof data.timestamp === 'string' ? parseInt(data.timestamp, 10) : data.timestamp,
    }
  }
}

// HTTP请求处理器
export class HttpProcessor extends BaseProcessor {
  process(data: IMetrics): IMetrics {
    const processedData = { ...data }
    // 脱敏处理
    if (processedData.url && typeof processedData.url === 'string') {
      processedData.url = this.maskSensitiveInfo(processedData.url)
    }

    // 确保时间戳格式正确
    processedData.timestamp =
      typeof processedData.timestamp === 'string'
        ? parseInt(processedData.timestamp, 10)
        : processedData.timestamp

    // 确保duration是数字类型
    processedData.duration =
      typeof processedData.duration === 'string'
        ? parseFloat(processedData.duration)
        : processedData.duration

    return processedData
  }

  private maskSensitiveInfo(url: string): string {
    try {
      const parsedUrl = new URL(url)
      // 检查并脱敏查询参数
      const sensitiveParams = ['password', 'token', 'secret', 'credit_card', 'ssn', 'api_key']
      let hasMasked = false

      sensitiveParams.forEach((param) => {
        if (parsedUrl.searchParams.has(param)) {
          parsedUrl.searchParams.set(param, '******')
          hasMasked = true
        }
      })

      // 如果有脱敏，返回处理后的URL
      if (hasMasked) {
        return parsedUrl.toString()
      }

      return url
    } catch (error) {
      // 如果解析失败，返回原始URL
      return url
    }
  }
}

// 路由变化处理器
export class RouteChangeProcessor extends BaseProcessor {
  process(data: IMetrics): IMetrics {
    return {
      ...data,
      timestamp: typeof data.timestamp === 'string' ? parseInt(data.timestamp, 10) : data.timestamp,
      pathname: typeof data.pathname === 'string' ? data.pathname : window.location.pathname,
    }
  }
}

// 数据清洗器
export class DataCleaner {
  clean(data: IMetrics): IMetrics {
    const cleanedData = { ...data }

    // 移除undefined和null值
    Object.keys(cleanedData).forEach((key) => {
      if (cleanedData[key] === undefined || cleanedData[key] === null) {
        delete cleanedData[key]
      }
    })

    // 确保timestamp是数字类型
    cleanedData.timestamp =
      typeof cleanedData.timestamp === 'string'
        ? parseInt(cleanedData.timestamp, 10)
        : cleanedData.timestamp

    return cleanedData
  }
}

// 数据格式化器
export class DataFormatter {
  format(data: IMetrics): IMetrics {
    const formattedData = { ...data }

    // 确保所有字符串值都被正确格式化
    Object.keys(formattedData).forEach((key) => {
      if (typeof formattedData[key] === 'string') {
        // 去除首尾空格
        formattedData[key] = formattedData[key].trim()

        // 限制字符串长度
        if (formattedData[key].length > 500) {
          formattedData[key] = formattedData[key].slice(0, 500) + '...'
        }
      }
    })

    return formattedData
  }
}

// 处理器管理器
export class ProcessorManager {
  private processors: Map<string, DataProcessor>
  private dataCleaner: DataCleaner
  private dataFormatter: DataFormatter

  constructor() {
    this.processors = new Map()
    this.dataCleaner = new DataCleaner()
    this.dataFormatter = new DataFormatter()

    // 注册默认处理器
    this.registerProcessor('click', new ClickProcessor())
    this.registerProcessor('pv', new PVProcessor())
    this.registerProcessor('http', new HttpProcessor())
    this.registerProcessor('routeChange', new RouteChangeProcessor())
    this.registerProcessor('default', new BaseProcessor())
  }

  // 注册处理器
  registerProcessor(type: string, processor: DataProcessor): void {
    this.processors.set(type, processor)
  }

  // 处理数据
  process(data: IMetrics): IMetrics {
    // 获取对应类型的处理器
    const processor = this.processors.get(data.type) || this.processors.get('default')

    if (!processor) {
      throw new Error(`No processor found for data type: ${data.type}`)
    }

    // 1. 使用特定类型处理器处理数据
    let processedData = processor.process(data)

    // 2. 清洗数据
    processedData = this.dataCleaner.clean(processedData)

    // 3. 格式化数据
    processedData = this.dataFormatter.format(processedData)

    return processedData
  }
}
