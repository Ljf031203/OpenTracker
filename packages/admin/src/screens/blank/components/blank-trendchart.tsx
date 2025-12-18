import React from 'react'
import ReactEcharts from 'echarts-for-react'

const xData = [
  '2025/12/14',
  '2025/12/15',
  '2025/12/16',
  '2025/12/17',
  '2025/12/18',
  '2025/12/19',
  '2025/12/20',
]

// 静态数据
const whiteScreenCount = [0, 5, 12, 16, 4, 10, 18]
const affectedUserCount = [0, 1, 3, 2, 1, 2, 3]
const whiteScreenRate = [0, 0.2, 0.45, 0.67, 0.25, 0.6, 1.2]
const affectedUserRate = [0, 1.1, 0.9, 0.52, 0.3, 0.7, 1.15]

const convertDecimalToPercent = (decimal: number) => {
  if (typeof decimal !== 'number' || isNaN(decimal)) {
    return '0.00%'
  }
  return (decimal * 100).toFixed(2) + '%'
}

const getChartOption = () => {
  return {
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: number, series: any): string | number => {
        const seriesName: string = String(series?.name || '')
        if (seriesName.includes('率')) {
          return convertDecimalToPercent(value)
        }
        return typeof value === 'number' && !isNaN(value) ? value : 0
      },
    },
    legend: {
      data: ['白屏数', '影响用户数', '白屏率', '影响用户率'],
      bottom: 10,
    },
    grid: {
      left: '4%',
      right: '6%',
      bottom: 60,
      top: 40,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        position: 'left',
      },
      {
        type: 'value',
        name: '',
        position: 'right',
        axisLabel: {
          formatter: '{value} %',
        },
      },
    ],
    series: [
      {
        name: '白屏数',
        type: 'line',
        smooth: true,
        yAxisIndex: 0,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#2d8cf0',
        },
        data: whiteScreenCount,
      },
      {
        name: '影响用户数',
        type: 'line',
        smooth: true,
        yAxisIndex: 0,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#7c4dff',
        },
        data: affectedUserCount,
      },
      {
        name: '白屏率',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#00b894',
        },
        data: whiteScreenRate,
      },
      {
        name: '影响用户率',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#ff7675',
        },
        data: affectedUserRate,
      },
    ],
  }
}

const BlankTrendChart: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 420 }}>
      <ReactEcharts option={getChartOption()} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default BlankTrendChart
