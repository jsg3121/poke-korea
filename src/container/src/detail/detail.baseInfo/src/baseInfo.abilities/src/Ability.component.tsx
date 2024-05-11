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
  width: 25rem;
  height: 25rem;

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
        max: maxPoint + 10,
        backgroundColor: '#DDE6ED',
        pointLabels: {
          color: (ctx) => {
            switch (ctx.label[0]) {
              case '체력':
                return '#FF5959'
              case '공격':
                return '#F5AC78'
              case '특수공격':
                return '#FAE078'
              case '방어':
                return '#9DB7F5'
              case '특수방어':
                return '#A7DB8D'
              case '스피드':
                return '#FA92B2'
            }
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
