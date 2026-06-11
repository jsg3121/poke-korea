'use client'

import dynamic from 'next/dynamic'
import { PokemonStats } from '~/graphql/typeGenerated'

const RadarChartComponent = dynamic(() => import('./RadarChart.component'), {
  ssr: false,
  loading: () => <div className="w-full h-full" aria-hidden />,
})

interface StatChartComponentProps {
  stats: Omit<PokemonStats, 'total'>
  size?: 'sm' | 'md' | 'lg'
}

const StatChartComponent = (props: StatChartComponentProps) => (
  <RadarChartComponent {...props} />
)

export default StatChartComponent
