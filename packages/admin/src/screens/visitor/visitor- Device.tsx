import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Table, Input, Spin, ConfigProvider, Tag, Empty } from 'antd'
import {
  SearchOutlined,
  MobileOutlined,
  TabletOutlined,
  LaptopOutlined,
  TagOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'

const { Search } = Input

// 定义设备类型数据类型
interface DeviceType {
  id: string
  name: string
  count: number
  icon: React.ReactNode
}

// 定义设备型号数据类型
interface DeviceModel {
  id: string
  name: string
  count: number
  brand?: string
}

// 模拟设备类型数据生成函数
const generateDeviceTypeData = (): DeviceType[] => {
  return [
    { id: '1', name: '桌面', count: 5408, icon: <LaptopOutlined /> },
    { id: '2', name: '智能手机', count: 3494, icon: <MobileOutlined /> },
    { id: '3', name: '平板电脑', count: 631, icon: <TabletOutlined /> },
    { id: '4', name: '平板手机', count: 145, icon: <MobileOutlined /> },
    { id: '5', name: '未知', count: 5, icon: <UnorderedListOutlined /> },
    { id: '6', name: '功能手机', count: 1, icon: <MobileOutlined /> },
    { id: '7', name: 'TV', count: 0, icon: <TagOutlined /> },
    { id: '8', name: '便携媒体播放器', count: 0, icon: <UnorderedListOutlined /> },
    { id: '9', name: '外围设备', count: 0, icon: <UnorderedListOutlined /> },
    { id: '10', name: '控制台', count: 0, icon: <UnorderedListOutlined /> },
  ]
}

// 模拟设备型号数据生成函数
const generateDeviceModelData = (): DeviceModel[] => {
  return [
    { id: '1', name: 'iPhone', count: 2040, brand: 'Apple' },
    { id: '2', name: '通用型号', count: 1703, brand: 'Apple' },
    { id: '3', name: 'iPad', count: 507, brand: 'Apple' },
    { id: '4', name: 'Galaxy S8', count: 130, brand: 'Samsung' },
    { id: '5', name: 'Galaxy S7', count: 128, brand: 'Samsung' },
    { id: '6', name: '通用智能手机', count: 93, brand: 'Unknown' },
    { id: '7', name: 'Galaxy S7 Edge', count: 90, brand: 'Samsung' },
    { id: '8', name: 'Galaxy S9', count: 54, brand: 'Samsung' },
    { id: '9', name: 'Galaxy Note 8', count: 47, brand: 'Samsung' },
    { id: '10', name: 'Galaxy S6', count: 42, brand: 'Samsung' },
    { id: '11', name: 'Galaxy S6 Edge', count: 38, brand: 'Samsung' },
    { id: '12', name: 'Galaxy Note 5', count: 35, brand: 'Samsung' },
    { id: '13', name: 'Galaxy A5', count: 30, brand: 'Samsung' },
    { id: '14', name: 'Galaxy A7', count: 28, brand: 'Samsung' },
    { id: '15', name: 'Galaxy J7', count: 25, brand: 'Samsung' },
  ]
}

const VisitorDevice: React.FC = () => {
  const [deviceTypeData, setDeviceTypeData] = useState<DeviceType[]>([])
  const [deviceModelData, setDeviceModelData] = useState<DeviceModel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [deviceTypeSearch, setDeviceTypeSearch] = useState<string>('')
  const [deviceModelSearch, setDeviceModelSearch] = useState<string>('')
  const [deviceTypePage, setDeviceTypePage] = useState<number>(1)
  const [deviceModelPage, setDeviceModelPage] = useState<number>(1)
  const pageSize = 10

  // 加载数据
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true)
      try {
        // 模拟API请求延迟
        await new Promise<void>((resolve) => setTimeout(resolve, 500))

        // 生成模拟数据
        const typeData = generateDeviceTypeData()
        const modelData = generateDeviceModelData()

        setDeviceTypeData(typeData)
        setDeviceModelData(modelData)
      } catch (error: any) {
        console.error('获取设备数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 过滤设备类型数据
  const filteredDeviceTypeData = deviceTypeData.filter((type) =>
    type.name.toLowerCase().includes(deviceTypeSearch.toLowerCase())
  )

  // 过滤设备型号数据
  const filteredDeviceModelData = deviceModelData.filter(
    (model) =>
      model.name.toLowerCase().includes(deviceModelSearch.toLowerCase()) ||
      (model.brand && model.brand.toLowerCase().includes(deviceModelSearch.toLowerCase()))
  )

  // 设备类型表格列定义
  const deviceTypeColumns = [
    {
      title: '类型',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: DeviceType) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {record.icon}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: DeviceType, b: DeviceType) => a.count - b.count,
      render: (text: number) => <Tag color="blue">{text}</Tag>,
    },
  ]

  // 设备型号表格列定义
  const deviceModelColumns = [
    {
      title: '型号',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: DeviceModel) => (
        <div>
          {record.brand && record.brand !== 'Unknown' && (
            <Tag color="green" style={{ marginBottom: 4 }}>
              {record.brand}
            </Tag>
          )}
          <div>{text}</div>
        </div>
      ),
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: DeviceModel, b: DeviceModel) => a.count - b.count,
      render: (text: number) => <Tag color="orange">{text}</Tag>,
    },
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <div className="visitor-device">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2>设备统计</h2>
        </div>

        <Row gutter={[16, 16]}>
          {/* 设备类型表格 */}
          <Col xs={24} lg={12}>
            <Card title="设备类型">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Search
                  placeholder="搜索设备类型"
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="small"
                  value={deviceTypeSearch}
                  onChange={(e) => setDeviceTypeSearch(e.target.value)}
                  style={{ width: 200 }}
                />
              </div>

              <Spin spinning={loading}>
                {filteredDeviceTypeData.length > 0 ? (
                  <Table
                    columns={deviceTypeColumns}
                    dataSource={filteredDeviceTypeData}
                    rowKey="id"
                    pagination={{
                      current: deviceTypePage,
                      onChange: setDeviceTypePage,
                      pageSize,
                      showSizeChanger: false,
                      showTotal: (total, range) => `1-${range[1]}/${total}`,
                    }}
                    scroll={{ y: 400 }}
                  />
                ) : (
                  <Empty description="暂无设备类型数据" />
                )}
              </Spin>
            </Card>
          </Col>

          {/* 设备型号表格 */}
          <Col xs={24} lg={12}>
            <Card title="设备型号">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Search
                  placeholder="搜索设备型号"
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="small"
                  value={deviceModelSearch}
                  onChange={(e) => setDeviceModelSearch(e.target.value)}
                  style={{ width: 200 }}
                />
              </div>

              <Spin spinning={loading}>
                {filteredDeviceModelData.length > 0 ? (
                  <Table
                    columns={deviceModelColumns}
                    dataSource={filteredDeviceModelData}
                    rowKey="id"
                    pagination={{
                      current: deviceModelPage,
                      onChange: setDeviceModelPage,
                      pageSize,
                      showSizeChanger: false,
                      showTotal: (total, range) => `1-${range[1]}/${total}`,
                    }}
                    scroll={{ y: 400 }}
                  />
                ) : (
                  <Empty description="暂无设备型号数据" />
                )}
              </Spin>
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  )
}

export default VisitorDevice
