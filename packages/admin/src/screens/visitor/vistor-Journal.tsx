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
import axios from 'axios'

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

// 浏览器图标映射
const browserIcons: { [key: string]: string } = {
  Chrome: 'chrome',
  Edge: 'edge',
  Firefox: 'firefox',
  Safari: 'safari',
  Opera: 'opera',
  Unknown: 'search',
}

// 获取行为日志数据的API调用
const fetchJournalData = async (dateRange?: [dayjs.Dayjs, dayjs.Dayjs], type?: string) => {
  try {
    // 由于后端还没有提供获取行为日志的API，我们暂时返回空数据
    // 当后端API可用时，替换为实际的API调用
    // const params = {
    //   startDate: dateRange ? dateRange[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
    //   endDate: dateRange ? dateRange[1].format('YYYY-MM-DD HH:mm:ss') : undefined,
    //   type: type === 'all' ? undefined : type
    // }
    // const response = await axios.get('/api/track/behavior-logs', { params })
    // return response.data
    
    // 临时返回空数据
    return []
  } catch (error) {
    console.error('获取访问日志失败:', error)
    return []
  }
}

// 将行为日志转换为访问日志格式
const transformBehaviorLogsToJournal = (logs: any[]): VisitorJournalEntry[] => {
  const behaviorConfig = [
    { type: 'page', text: '浏览页面', icon: <EyeOutlined /> },
    { type: 'click', text: '点击链接', icon: <EyeOutlined /> },
    { type: 'scroll', text: '页面滚动', icon: <ClockCircleOutlined /> },
    { type: 'diving', text: '查看潜水点', icon: <EyeOutlined /> },
    { type: 'shopping', text: '查看购物车', icon: <ShoppingCartOutlined /> },
  ]

  return logs.map((log, index) => {
    const behavior = behaviorConfig.find(b => b.type === log.type) || behaviorConfig[0]
    
    return {
      id: index.toString(),
      timestamp: dayjs(log.time).format('YYYY-MM-DD HH:mm:ss'),
      userType: log.userType || 'guest',
      type: log.type || 'page',
      location: log.location || 'Unknown',
      browser: {
        name: log.browser?.name || 'Unknown',
        icon: browserIcons[log.browser?.name || 'Unknown'] || 'chrome',
      },
      device: log.device?.type || 'Unknown',
      behavior: behavior.text,
      url: log.url || log.page || '',
      metadata: log.metadata || {},
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
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
        // 获取行为日志数据
        const behaviorLogs = await fetchJournalData(dateRange, filterType)
        
        // 转换为访问日志格式
        const journalEntries = transformBehaviorLogsToJournal(behaviorLogs)

        setJournalData(journalEntries)
      } catch (error: any) {
        console.error('获取访问日志失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange, filterType])

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
