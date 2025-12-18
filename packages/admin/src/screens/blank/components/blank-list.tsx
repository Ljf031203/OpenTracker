import React from 'react'
import { Table } from 'antd'
import type { TableColumnsType, TableProps } from 'antd'

interface DataType {
  key: React.Key
  page: string
  blankCounts: number
  users: number
  time: string //后续将修改为真实Date
  state: string
}

const list: TableColumnsType<DataType> = [
  {
    title: '页面',
    dataIndex: 'page',
  },
  {
    title: '白屏数',
    dataIndex: 'blankCounts',
    sorter: {
      compare: (a, b) => a.blankCounts - b.blankCounts,
      multiple: 3,
    },
  },
  {
    title: '影响用户数',
    dataIndex: 'users',
    sorter: {
      compare: (a, b) => a.users - b.users,
      multiple: 2,
    },
  },
  {
    title: '最近发生的时间',
    dataIndex: 'time',
    sorter: {},
  },
  {
    title: '问题状态',
    dataIndex: 'state',
  },
]

const data: DataType[] = [
  {
    key: '1',
    page: '/product/detail/1024',
    blankCounts: 16,
    users: 1,
    time: '2025-12-15 10:20:57',
    state: 'NEW',
  },
  {
    key: '2',
    page: '/product/detail/1025',
    blankCounts: 16,
    users: 1,
    time: '2025-12-16 11:26:30',
    state: 'OPEN',
  },
  {
    key: '3',
    page: '/product/detail/1026',
    blankCounts: 5,
    users: 2,
    time: '2025-12-17 12:28:17',
    state: 'FIXED',
  },
  {
    key: '4',
    page: '/product/detail/1028',
    blankCounts: 10,
    users: 3,
    time: '2025-12-20 08:20:47',
    state: 'CLOSE',
  },
]

const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra)
}

const BlankList: React.FC = () => (
  <Table<DataType> columns={list} dataSource={data} onChange={onChange} />
)

export default BlankList
