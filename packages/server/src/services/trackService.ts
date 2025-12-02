import { IErrorlog, IBehaviorLog, IPerformanceLog, IBlankScreenLog } from '../types'

class TrackService {
  //临时内存存储
  errorLogs: IErrorlog[] = []
  behaviorLogs: IBehaviorLog[] = []
  performanceLogs: IPerformanceLog[] = []
  blankLogs: IBlankScreenLog[] = []

  //分类处理
  handleReport(type: string, data: any) {
    data.time = data.time || Date.now()

    switch (type) {
      case 'error':
        this.errorLogs.push(data)
        break
      case 'behavior':
        this.behaviorLogs.push(data)
        break
      case 'performance':
        this.performanceLogs.push(data)
        break
      case 'blank':
        this.blankLogs.push(data)
        break
      default:
        console.warn('未知上报类型：', type)
    }
  }
}

export default new TrackService()
