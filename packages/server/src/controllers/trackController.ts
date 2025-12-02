import { Context } from 'koa'
import trackService from '../services/trackService'

interface ReportBody {
  type: string
  data: any
}

class TrackController {
  // 统一上报接口
  async report(ctx: Context) {
    const { type, data } = ctx.request.body as ReportBody

    if (!type || !data) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '参数错误：缺少 type 或 data',
      }
      return
    }

    trackService.handleReport(type, data)

    ctx.body = {
      code: 200,
      message: '上报成功',
    }
  }
}

export default new TrackController()
