'use client'

import type { ChartData, ChartOptions } from 'chart.js'
import {
  Chart as ChartJS,
  Filler,
  LineElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  Tooltip,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { PokemonStats } from '~/graphql/typeGenerated'

type StatChartSize = 'sm' | 'md' | 'lg'

interface StatChartComponentProps {
  stats: Omit<PokemonStats, 'total'>
  size?: StatChartSize
}

ChartJS.register(
  RadialLinearScale,
  RadarController,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
)

const STAT_COLORS = {
  point: {
    hp: '#FF0000',
    attack: '#F08030',
    specialAttack: '#F8D030',
    defense: '#6890F0',
    specialDefense: '#78C850',
    speed: '#F85888',
  },
  border: {
    hp: '#A60000',
    attack: '#9C531F',
    specialAttack: '#A1871F',
    defense: '#445E9C',
    specialDefense: '#4E8234',
    speed: '#A13959',
  },
}

const SIZE_CONFIG = {
  sm: {
    pointRadius: 5,
    pointLabelSize: 12,
    tooltipTitleSize: 12,
    tooltipBodySize: 10,
    tooltipPadding: 8,
  },
  md: {
    pointRadius: 8,
    pointLabelSize: 16,
    tooltipTitleSize: 15,
    tooltipBodySize: 12,
    tooltipPadding: 15,
  },
  lg: {
    pointRadius: 8,
    pointLabelSize: 20,
    tooltipTitleSize: 20,
    tooltipBodySize: 20,
    tooltipPadding: 12,
  },
}

const StatChartComponent = ({
  stats,
  size = 'md',
}: StatChartComponentProps) => {
  const { hp, attack, defense, specialAttack, specialDefense, speed } = stats
  const config = SIZE_CONFIG[size]

  const maxPoint = Math.max(
    hp,
    attack,
    specialAttack,
    defense,
    specialDefense,
    speed,
  )

  const statData: ChartData<'radar'> = {
    labels: [
      ['체력', hp],
      ['공격', attack],
      ['특수공격', specialAttack],
      ['방어', defense],
      ['특수방어', specialDefense],
      ['스피드', speed],
    ],
    datasets: [
      {
        data: [hp, attack, specialAttack, defense, specialDefense, speed],
        animation: {
          easing: 'easeOutQuart',
          duration: 1000,
        },
        backgroundColor: 'rgba(39, 55, 77, 0.7)',
        borderColor: '#444444',
        pointBorderColor: (ctx) => {
          const colors = Object.values(STAT_COLORS.border)
          return colors[ctx.dataIndex]
        },
        pointBackgroundColor: (ctx) => {
          const colors = Object.values(STAT_COLORS.point)
          return colors[ctx.dataIndex]
        },
        borderWidth: 2,
      },
    ],
  }

  const options: ChartOptions<'radar'> = {
    elements: {
      point: {
        radius: config.pointRadius,
      },
    },
    plugins: {
      tooltip: {
        usePointStyle: true,
        callbacks: {
          title(tooltipItems) {
            return tooltipItems[0].label[0]
          },
        },
        backgroundColor: (ctx) => {
          const titleToColor: Record<string, string> = {
            체력: STAT_COLORS.border.hp,
            공격: STAT_COLORS.border.attack,
            특수공격: STAT_COLORS.border.specialAttack,
            방어: STAT_COLORS.border.defense,
            특수방어: STAT_COLORS.border.specialDefense,
            스피드: STAT_COLORS.border.speed,
          }
          return titleToColor[ctx.tooltip.title[0]] || '#000'
        },
        titleFont: {
          size: config.tooltipTitleSize,
        },
        bodyFont: {
          size: config.tooltipBodySize,
        },
        boxPadding: config.tooltipPadding,
      },
    },
    scales: {
      r: {
        min: 0,
        max: maxPoint + 10,
        backgroundColor: '#9DB2BF',
        pointLabels: {
          color: '#27374D',
          font: {
            size: config.pointLabelSize,
            weight: 500,
          },
        },
        angleLines: {
          color: '#526D82',
          lineWidth: 2,
        },
        ticks: {
          display: false,
        },
      },
    },
  }

  return (
    <Radar
      data={statData}
      options={options}
      aria-label="포켓몬 능력치 차트 그래프"
    />
  )
}

export default StatChartComponent
