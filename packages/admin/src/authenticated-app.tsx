import React, { useState } from 'react'
import type { MenuProps } from 'antd'
import {
  Avatar,
  Badge,
  Dropdown,
  Input,
  Select,
  Space,
  Tabs,
  DatePicker,
  Breadcrumb,
  Button,
  Layout,
  Menu,
  Typography,
  theme,
} from 'antd'
import {
  BellOutlined,
  CloseOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  LineChartOutlined,
  TabletOutlined,
  ContactsOutlined,
  CalendarOutlined,
  TeamOutlined,
  AppstoreAddOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { removeToken } from '@/utils/token'

const { Header, Content, Footer, Sider } = Layout
const { Title } = Typography
const { RangePicker } = DatePicker
const { TabPane } = Tabs

type MenuItem = Required<MenuProps>['items'][number]

const navItems: MenuItem[] = [
  {
    key: 'nav1',
    icon: <CalendarOutlined />,
    label: '日期',
    children: [
      { key: 'nav11', label: 'option 1' },
      { key: 'nav12', label: 'option 2' },
    ],
  },
  {
    key: 'nav2',
    icon: <TeamOutlined />,
    label: '所有的访问',
    children: [
      { key: 'nav21', label: 'option 1' },
      { key: 'nav22', label: 'option 2' },
    ],
  },
  {
    key: 'nav3',
    icon: <AppstoreAddOutlined />,
    label: '报表面板',
    children: [
      { key: 'nav31', label: 'option 1' },
      { key: 'nav32', label: 'option 2' },
    ],
  },
]

const subItems: MenuItem[] = [
  {
    key: 'sub1',
    icon: <AppstoreOutlined />,
    label: '报表面板',
    children: [
      { key: 'sub11', label: 'option 1' },
      { key: 'sub12', label: 'option 2' },
    ],
  },
  {
    key: 'sub2',
    icon: <UserOutlined />,
    label: '访客分析',
    children: [
      { key: 'sub21', label: 'option 1' },
      { key: 'sub22', label: 'option 2' },
    ],
  },
  {
    key: 'sub3',
    icon: <SolutionOutlined />,
    label: '行为分析',
    children: [
      { key: 'sub31', label: 'option 1' },
      { key: 'sub32', label: 'option 2' },
    ],
  },
  {
    key: 'sub4',
    icon: <ContactsOutlined />,
    label: '获客分析',
    children: [
      { key: 'sub41', label: 'option 1' },
      { key: 'sub42', label: 'option 2' },
    ],
  },
  {
    key: 'sub5',
    icon: <CloseCircleOutlined />,
    label: '错误分析',
    children: [
      { key: 'sub51', label: 'option 1' },
      { key: 'sub52', label: 'option 2' },
    ],
  },
  {
    key: 'sub6',
    icon: <LineChartOutlined />,
    label: '性能分析',
    children: [
      { key: 'sub61', label: 'option 1' },
      { key: 'sub62', label: 'option 2' },
    ],
  },
  {
    key: 'sub7',
    icon: <TabletOutlined />,
    label: '白屏监控',
    children: [
      { key: 'sub71', label: 'option 1' },
      { key: 'sub72', label: 'option 2' },
    ],
  },
]

const AuthenticatedApp: React.FC = () => {
  const [currentKey, setCurrentKey] = useState('sub1')
  const [currentNav, setCurrentNav] = useState('nav3')
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [selectedMenuItem, setSelectedMenuItem] = useState('1') // 添加状态跟踪选中的菜单项
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const handleLogout = () => {
    removeToken()
    navigate('/')
  }

  const onMenuClick: MenuProps['onClick'] = (e) => {
    setCurrentKey(e.key)
  }

  const onNavClick: MenuProps['onClick'] = (e) => {
    setCurrentNav(e.key)
  }

  const handleSearchToggle = () => {
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
  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        个人中心
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        账户设置
      </Menu.Item>
      <Menu.Item key="3" danger onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  )
  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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

          {/* 主导航链接 */}
          <Space>
            <Button type="text">数据概览</Button>
            {/* 事件管理下拉菜单 */}
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1">1</Menu.Item>
                  <Menu.Item key="2">2</Menu.Item>
                  <Menu.Item key="3">3</Menu.Item>
                  <Menu.Item key="4">4</Menu.Item>
                  <Menu.Item key="5">5</Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              <Button type="text">事件管理</Button>
            </Dropdown>
            <Button type="text">报表分析</Button>
            <Button type="text">环境配置</Button>
          </Space>
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
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>管理员</span>
            </Space>
          </Dropdown>
        </div>
      </Header>
      <div style={{ flex: 1, padding: '0 48px', display: 'flex', flexDirection: 'column' }}>
        <Breadcrumb
          style={{ margin: '16px 0' }}
          items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
        />
        <Layout
          style={{
            flex: 1,
            padding: '24px 0',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            display: 'flex',
          }}
        >
          <Sider style={{ background: colorBgContainer, width: 200, flexShrink: 0 }}>
            <Menu
              mode="inline"
              onClick={onMenuClick}
              selectedKeys={[currentKey]}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              items={subItems}
            />
          </Sider>
          <Content style={{ padding: '0 24px', maxHeight: 684, overflow: 'auto' }}></Content>
        </Layout>
      </div>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  )
}

export default AuthenticatedApp
