import { ApiErrorInfo } from '../../../../types/src/plugins/api-error'
export default class ApiReporter {
  private serverUrl: string
  constructor(serverUrl: string) {
    this.serverUrl = serverUrl
  }
  public async report(errorinfo: ApiErrorInfo): Promise<void> {
    if (!this.serverUrl) {
      console.error('serverUrl is not set')
      return
    }
    try {
      const response = await fetch(this.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorinfo),
        keepalive: true,
      })
      if (!response.ok) {
        console.error('report failed', response.statusText)
      }
    } catch (error) {
      console.error('API 错误上报失败', error)
    }
  }
}
