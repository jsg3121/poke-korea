import React from 'react'
import styled from 'styled-components'
import { NormalStats } from '~/graphql/typeGenerated'

import type { ChartOptions, ChartData } from 'chart.js'
import {
  Chart as ChartJS,
  Filler,
  LineElement,
  PointElement,
  RadialLinearScale,
  RadarController,
  Tooltip,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  RadarController,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
)

const Article = styled.article`
  width: 28rem;
  height: 28rem;

  & > table {
    width: 100%;
    table-layout: fixed;
  }
`

const AbilityComponent: React.FC<NormalStats> = (props) => {
  const { attack, defense, hp, specialAttack, speed, specialDefense, total } =
    props

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
        backgroundColor: 'rgba(39, 55, 77, 0.6)',
        borderColor: 'rgba(39, 55, 77, 1)',
        borderWidth: 2,
        animation: {
          delay: 300,
          easing: 'easeOutQuart',
          duration: 1000,
        },
      },
    ],
  }

  const options: ChartOptions<'radar'> = {
    scales: {
      r: {
        min: 0,
        max: maxPoint,
        backgroundColor: '#DDE6ED',
        pointLabels: {
          color: (ctx) => {
            if (parseInt(ctx.label[1], 10) === maxPoint) return 'blue'
            return 'red'
          },
          font: {
            size: 15,
            weight: 500,
          },
        },
        angleLines: {
          color: '#9DB2BF',
          lineWidth: 1,
        },
        ticks: {
          display: false,
        },
      },
    },
  }

  return (
    <Article>
      <Radar data={ablityData} options={options} />
      <h2>{total}</h2>
    </Article>
  )
}

export default AbilityComponent
