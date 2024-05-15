import { FC } from 'react'
import { NormalStats } from '~/graphql/typeGenerated'

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

type IFProps = Omit<NormalStats, 'total'>

ChartJS.register(
  RadialLinearScale,
  RadarController,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
)

const AbilityChartComponent: FC<IFProps> = (props) => {
  const { attack, defense, hp, specialAttack, speed, specialDefense } = props

  const maxPoint = Math.max(
    hp,
    attack,
    specialAttack,
    defense,
    specialDefense,
    speed,
  )

  const ablityData: ChartData<'radar'> = {
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
          delay: 300,
          easing: 'easeOutQuart',
          duration: 1000,
        },
        backgroundColor: 'rgba(39, 55, 77, 0.7)',
        borderColor: '#444444',
        pointBorderColor: (ctx) => {
          switch (ctx.dataIndex) {
            case 0:
              return '#A60000'
            case 1:
              return '#9C531F'
            case 2:
              return '#A1871F'
            case 3:
              return '#445E9C'
            case 4:
              return '#4E8234'
            case 5:
              return '#A13959'
          }
        },
        pointBackgroundColor: (ctx) => {
          switch (ctx.dataIndex) {
            case 0:
              return '#FF0000'
            case 1:
              return '#F08030'
            case 2:
              return '#F8D030'
            case 3:
              return '#6890F0'
            case 4:
              return '#78C850'
            case 5:
              return '#F85888'
          }
        },
        borderWidth: 2,
      },
    ],
  }

  const options: ChartOptions<'radar'> = {
    elements: {
      point: {
        radius: 8,
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
          switch (ctx.tooltip.title[0]) {
            case '체력':
              return '#A60000'
            case '공격':
              return '#9C531F'
            case '특수공격':
              return '#A1871F'
            case '방어':
              return '#445E9C'
            case '특수방어':
              return '#4E8234'
            case '스피드':
              return '#A13959'
          }
        },
        titleFont: {
          size: 20,
        },
        bodyFont: {
          size: 20,
        },
        boxPadding: 12,
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
            size: 20,
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

  return <Radar data={ablityData} options={options} />
}

export default AbilityChartComponent
