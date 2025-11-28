import React, { useState, useEffect } from 'react'
import {
  Card,
  List,
  Avatar,
  Tag,
  Space,
  Spin,
  DatePicker,
  Select,
  ConfigProvider,
  Empty,
} from 'antd'
import {
  ClockCircleOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select

// 定义访问日志数据类型
interface VisitorJournalEntry {
  id: string
  timestamp: string
  userType: string
  type: string
  location: string
  browser: {
    name: string
    icon: string
  }
  device: string
  behavior: string
  url: string
  metadata?: {
    [key: string]: any
  }
}

// 模拟浏览器图标映射
const browserIcons: { [key: string]: string } = {
  Google: 'chrome',
  Bing: 'edge',
  DuckDuckGo: 'search',
  Firefox: 'firefox',
  Safari: 'safari',
}

// 模拟访问日志数据生成函数
const generateJournalData = (): VisitorJournalEntry[] => {
  const browsers = ['Google', 'Bing', 'DuckDuckGo', 'Firefox', 'Safari']
  const types = ['page', 'click', 'scroll', 'diving']
  const locations = ['Red Sea', 'Bali', 'Great Barrier Reef', 'Maldives', 'Galapagos']
  const behaviors = [
    { type: 'page', text: '浏览页面', icon: <EyeOutlined /> },
    { type: 'click', text: '点击链接', icon: <EyeOutlined /> },
    { type: 'scroll', text: '页面滚动', icon: <ClockCircleOutlined /> },
    { type: 'diving', text: '查看潜水点', icon: <EyeOutlined /> },
    { type: 'shopping', text: '查看购物车', icon: <ShoppingCartOutlined /> },
  ]

  const data: VisitorJournalEntry[] = []
  const today = dayjs()

  // 生成过去7天的模拟数据
  for (let i = 0; i < 30; i++) {
    // 每天生成3-8条记录
    const recordsPerDay = Math.floor(Math.random() * 6) + 3

    for (let j = 0; j < recordsPerDay; j++) {
      const timestamp = today
        .subtract(i, 'day')
        .subtract(Math.floor(Math.random() * 24), 'hour')
        .subtract(Math.floor(Math.random() * 60), 'minute')
        .subtract(Math.floor(Math.random() * 60), 'second')

      const selectedType = types[Math.floor(Math.random() * types.length)]
      const selectedBehavior = behaviors.find((b) => b.type === selectedType) || behaviors[0]
      const browser = browsers[Math.floor(Math.random() * browsers.length)]

      let metadata: { [key: string]: any } = {}

      // 根据类型添加不同的元数据
      if (selectedType === 'diving') {
        metadata = {
          'diving-rating': (Math.random() * 3 + 2).toFixed(1),
        }
      } else if (selectedType === 'shopping') {
        metadata = {
          'product-count': Math.floor(Math.random() * 5) + 1,
          price: `$${(Math.random() * 1000).toFixed(2)}`,
        }
      }

      data.push({
        id: `${i}-${j}`,
        timestamp: timestamp.format('YYYY-MM-DD HH:mm:ss'),
        userType: Math.random() > 0.3 ? 'guest' : 'registered',
        type: selectedType,
        location:
          selectedType === 'diving'
            ? locations[Math.floor(Math.random() * locations.length)]
            : locations[0],
        browser: {
          name: browser,
          icon: browserIcons[browser] || 'chrome',
        },
        device: Math.random() > 0.5 ? 'desktop' : 'mobile',
        behavior: selectedBehavior.text,
        url:
          selectedType === 'shopping'
            ? 'dive-shop.pacific/diving-knife/'
            : `divezone.me/${selectedType}${selectedType === 'diving' ? locations[Math.floor(Math.random() * locations.length)].toLowerCase().replace(' ', '-') : ''}`,
        metadata,
      })
    }
  }

  // 按时间戳倒序排序
  return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// 访问日志项组件
const JournalItem: React.FC<{ entry: VisitorJournalEntry }> = ({ entry }) => {
  const behaviorConfig = [
    { type: 'page', text: '浏览页面', icon: <EyeOutlined /> },
    { type: 'click', text: '点击链接', icon: <EyeOutlined /> },
    { type: 'scroll', text: '页面滚动', icon: <ClockCircleOutlined /> },
    { type: 'diving', text: '查看潜水点', icon: <EyeOutlined /> },
    { type: 'shopping', text: '查看购物车', icon: <ShoppingCartOutlined /> },
  ]

  const behavior = behaviorConfig.find((b) => entry.behavior.includes(b.text)) || behaviorConfig[0]

  return (
    <List.Item
      actions={[
        <Tag color={entry.userType === 'guest' ? 'blue' : 'green'} key="type">
          {entry.userType === 'guest' ? '访客' : '注册用户'}
        </Tag>,
        <Tag color="orange" key="device">
          {entry.device === 'desktop' ? '桌面端' : '移动端'}
        </Tag>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar icon={behavior.icon} style={{ backgroundColor: '#1890ff' }} />}
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>
              <strong>{entry.browser.name}</strong> - {entry.behavior}
            </span>
            <span style={{ fontSize: '12px', color: '#8c8c8c' }}>
              {dayjs(entry.timestamp).format('YYYY年MM月DD日 HH:mm:ss')}
            </span>
          </div>
        }
        description={
          <div>
            <div style={{ marginBottom: 8 }}>
              <Space>
                <Tag color="green">{entry.type}</Tag>
                <Tag color="blue">{entry.location}</Tag>
                {entry.metadata &&
                  Object.entries(entry.metadata).map(([key, value]) => (
                    <Tag key={key} color="purple">
                      {key.replace('-', ' ')}: {value}
                    </Tag>
                  ))}
              </Space>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              <a href={`https://${entry.url}`} target="_blank" rel="noopener noreferrer">
                {entry.url}
              </a>
            </div>
          </div>
        }
      />
    </List.Item>
  )
}

const VisitorJournal: React.FC = () => {
  const [journalData, setJournalData] = useState<VisitorJournalEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ])
  const [filterType, setFilterType] = useState<string>('all')
  const [searchValue, setSearchValue] = useState<string>('')

  // 处理日期范围变化
  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]])
    }
  }

  // 加载数据
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true)
      try {
        // 模拟API请求延迟
        await new Promise<void>((resolve) => setTimeout(resolve, 500))

        // 生成模拟数据
        const data = generateJournalData()

        setJournalData(data)
      } catch (error: any) {
        console.error('获取访问日志失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 过滤数据
  const filteredData = journalData.filter((entry) => {
    // 按日期过滤
    const entryDate = dayjs(entry.timestamp)
    const isDateInRange =
      entryDate.isAfter(dateRange[0].subtract(1, 'day')) &&
      entryDate.isBefore(dateRange[1].add(1, 'day'))

    // 按类型过滤
    const isTypeMatch = filterType === 'all' || entry.type === filterType

    // 按搜索词过滤
    const isSearchMatch =
      searchValue === '' ||
      entry.behavior.toLowerCase().includes(searchValue.toLowerCase()) ||
      entry.location.toLowerCase().includes(searchValue.toLowerCase()) ||
      entry.browser.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      entry.url.toLowerCase().includes(searchValue.toLowerCase())

    return isDateInRange && isTypeMatch && isSearchMatch
  })

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <div className="visitor-journal">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2>访问日志</h2>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              style={{ width: 300 }}
            />
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: 120 }}
              placeholder="类型过滤"
            >
              <Option value="all">全部类型</Option>
              <Option value="page">页面访问</Option>
              <Option value="click">点击</Option>
              <Option value="scroll">滚动</Option>
              <Option value="diving">潜水</Option>
            </Select>
            <Select
              value={searchValue}
              onChange={setSearchValue}
              style={{ width: 200 }}
              placeholder="搜索"
              allowClear
            >
              {journalData.map((entry) => (
                <Option key={entry.id} value={entry.behavior}>
                  {entry.behavior}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <Card>
          <Spin spinning={loading}>
            {filteredData.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={filteredData}
                renderItem={(entry) => <JournalItem entry={entry} />}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `第 ${range[0]}-${range[1]} 条，共 ${total} 条访问记录`,
                }}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无访问日志数据" />
            )}
          </Spin>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default VisitorJournal
