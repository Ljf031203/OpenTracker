import React, { useState } from 'react'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import {
  UserOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  LineChartOutlined,
  TabletOutlined,
  ContactsOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import HeaderComponent from '@/components/header'

const { Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

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
  const navigate = useNavigate()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const onMenuClick: MenuProps['onClick'] = (e) => {
    setCurrentKey(e.key)
  }
  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderComponent />
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
