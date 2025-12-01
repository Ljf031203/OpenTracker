// src/types/index.ts
export interface User {
  id: number
  username: string
  password: string
  role: 'admin' | 'user'
}

export interface LoginResponse {
  success: boolean
  token?: string
  user?: Omit<User, 'password'> // 登录成功后隐藏密码
  message?: string
}

export interface RegisterParams {
  username: string
  password: string
  role?: 'admin' | 'user'
}

// 行为监控部分
export interface BehaviorEvent {
  id: string
  userId: string
  timestamp: string
  type: string 
  element: string
  url: string
  metadata: {
    [key: string]: any
  }
}