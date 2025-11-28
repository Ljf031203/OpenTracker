import React from 'react'
import { useNavigate } from 'react-router-dom'

const VisitorPage: React.FC = () => {
  const navigate = useNavigate()

  // 重定向到访客趋势页面
  React.useEffect(() => {
    navigate('/home/visitor-Trends')
  }, [navigate])

  return null
}

export default VisitorPage
