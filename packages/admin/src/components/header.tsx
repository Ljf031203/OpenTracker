import React, { useState, useEffect } from 'react'
import {
  Layout,
  Button,
  Typography,
  Space,
  Dropdown,
  Select,
  DatePicker,
  Input,
  Badge,
  Avatar,
} from 'antd'
import {
  BellOutlined,
  CloseOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { removeToken, getToken, parseToken } from '@/utils/token'

const { Header } = Layout
const { Title } = Typography
const { RangePicker } = DatePicker

const HeaderComponent: React.FC = () => {
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [username, setUsername] = useState<string>('')

  // 从token中获取用户信息
  useEffect(() => {
    const token = getToken()
    console.log('Token from localStorage:', token)
    if (token) {
      try {
        // 尝试解析token
        const userInfo = parseToken(token)
        console.log('Parsed token using parseToken function:', userInfo)
        if (userInfo && userInfo.username) {
          console.log('Username from parseToken:', userInfo.username)
          setUsername(userInfo.username)
        } else {
          // 如果解析失败，尝试直接解析JSON格式的token（兼容当前的存储方式）
          const parsedToken = JSON.parse(token)
          console.log('Parsed token as JSON:', parsedToken)
          if (parsedToken && (parsedToken.username || parsedToken.login)) {
            const finalUsername = parsedToken.username || parsedToken.login
            console.log('Username from JSON parse:', finalUsername)
            setUsername(finalUsername)
          } else {
            console.log('No username found in token, using default')
            setUsername('管理员')
          }
        }
      } catch (error) {
        console.error('Error parsing token:', error)
        // 解析失败时设置默认用户名
        setUsername('管理员')
      }
    } else {
      console.log('No token found, using default username')
      setUsername('管理员')
    }
  }, [])

  // 监听username变化并打印
  useEffect(() => {
    console.log('Current username state:', username)
  }, [username])

  const handleLogout = () => {
    removeToken()
    navigate('/')
  }

  const handleSearchToggle = () => {
    // 解析 token 获取用户信息

    setShowSearch(!showSearch)
    // 展开时清空搜索值
    if (!showSearch) {
      setSearchValue('')
    }
  }

  const handleSearch = () => {
    // 实现搜索逻辑
  }

  const handleCancelSearch = () => {
    setShowSearch(false)
    setSearchValue('')
  }

  return (
    // 解析 token 获取用户信息
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* 左侧：Logo和名称 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Title
          onClick={() => navigate('/')}
          level={4}
          style={{ margin: 0, color: '#1890ff', cursor: 'pointer' }}
        >
          主页
        </Title>
      </div>

      {/* 右侧：功能区 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* 环境切换 */}
        <Select defaultValue="production" style={{ width: 120 }}>
          <Select.Option value="development">开发环境</Select.Option>
          <Select.Option value="production">生产环境</Select.Option>
        </Select>

        {/* 时间选择器 */}
        <RangePicker style={{ width: 240 }} />

        {/* 搜索框（点击展开的形式） */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {showSearch ? (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}
            >
              <Input
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="输入搜索内容"
                onPressEnter={handleSearch}
                style={{ width: 200 }}
                allowClear
              />
              <Button icon={<CloseOutlined />} type="text" onClick={handleCancelSearch} />
            </div>
          ) : (
            <Button type="text" icon={<SearchOutlined />} onClick={handleSearchToggle} />
          )}
        </div>

        {/* 通知中心 */}
        <Badge count={3} showZero>
          <Button type="text" icon={<BellOutlined />} />
        </Badge>

        {/* 用户信息 */}
        <Dropdown
          menu={{
            items: [
              { key: '1', label: <span>个人中心</span>, icon: <UserOutlined /> },
              { key: '2', label: <span>账户设置</span>, icon: <SettingOutlined /> },
              {
                key: '3',
                label: <span style={{ color: '#ff4d4f' }}>退出登录</span>,
                onClick: handleLogout,
              },
            ],
          }}
          placement="bottomRight"
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span>{username}</span>
          </Space>
        </Dropdown>
      </div>
    </Header>
  )
}

export default HeaderComponent
