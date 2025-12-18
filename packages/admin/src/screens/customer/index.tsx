import React from 'react'
import { useNavigate } from 'react-router-dom'

const CustomerPage: React.FC = () => {
  const navigate = useNavigate()

  React.useEffect(() => {
    navigate('/home/customer/growth')
  }, [navigate])

  return null
}
