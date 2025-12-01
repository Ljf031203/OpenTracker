import { ApiMonitorOptions } from '../plugins/api-error'
import { JsErrorOptions } from '../plugins/js-error'

export interface MonitoringOptions {
  api?: ApiMonitorOptions
  jsError?: JsErrorOptions
}