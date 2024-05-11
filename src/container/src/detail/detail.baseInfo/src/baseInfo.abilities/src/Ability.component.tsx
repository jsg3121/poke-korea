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

  const ablityData: ChartData<'radar', number[], string> = {
    labels: ['체력', '공격', '특수공격', '방어', '특수방어', '스피드'],
    datasets: [
      {
        data: [hp, attack, specialAttack, defense, specialDefense, speed],
        backgroundColor: 'rgba(225, 133, 153, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<'radar'> = {
    scales: {
      r: {
        min: 0,
        max: maxPoint,
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
