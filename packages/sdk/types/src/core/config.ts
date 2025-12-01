import { EventTypes } from '../../../common'
import { ApiMonitorOptions } from '../plugins/api-error'

export interface OpenTrackerConfig {
  apiKey: string
  serverUrl: string
}

export interface BaseEvent {
  event: string
  type: EventTypes  
  timestamp: number
}

export interface ReporterConfig {
  serverUrl: string
}

