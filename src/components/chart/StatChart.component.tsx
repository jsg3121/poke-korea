'use client'

import dynamic from 'next/dynamic'
import type { StatChartComponentProps } from './RadarChart.component'

const RadarChartComponent = dynamic(() => import('./RadarChart.component'), {
  ssr: false,
  loading: () => <div className="w-full h-full" aria-hidden />,
})

const StatChartComponent = (props: StatChartComponentProps) => (
  <RadarChartComponent {...props} />
)

export default StatChartComponent
