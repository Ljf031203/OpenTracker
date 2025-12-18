import React from 'react'
import { useNavigate } from 'react-router-dom'

const VisitorPage: React.FC = () => {
  const navigate = useNavigate()

  React.useEffect(() => {
    navigate('/home/visitor/trends')
  }, [navigate])

  return null
}

export default VisitorPage
