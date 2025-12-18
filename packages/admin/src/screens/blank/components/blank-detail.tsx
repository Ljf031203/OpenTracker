import React from 'react'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'

const BlankDetail: React.FC = () => (
  <Row gutter={16}>
    <Col span={6}>
      <Card hoverable>
        <Statistic
          title="白屏数"
          value={10}
          valueStyle={{ color: '#13cf16' }}
          prefix={<ArrowDownOutlined />}
          suffix={<span style={{ fontSize: '12px', color: '#999', marginLeft: '4px' }}>+15%</span>}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card hoverable>
        <Statistic
          title="白屏率"
          value="0.13%"
          valueStyle={{ color: '#ff181c' }}
          prefix={<ArrowUpOutlined />}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card hoverable>
        <Statistic
          title="影响用户数"
          value={1}
          precision={2}
          suffix="%"
          valueStyle={{ color: '#13cf16' }}
          prefix={<ArrowDownOutlined />}
        />
      </Card>
    </Col>
    <Col span={6}>
      <Card hoverable>
        <Statistic
          title="影响用户率"
          value="0.08%"
          valueStyle={{ color: '#ff181c' }}
          prefix={<ArrowUpOutlined />}
        />
      </Card>
    </Col>
  </Row>
)

export default BlankDetail
