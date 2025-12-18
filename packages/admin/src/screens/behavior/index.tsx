import React from 'react'
import { useNavigate } from 'react-router-dom'

const BehaviorPage: React.FC = () => {
  const navigate = useNavigate()

  React.useEffect(() => {
    navigate('/home/behavior/event')
  }, [navigate])

  return null
}

export default BehaviorPage
