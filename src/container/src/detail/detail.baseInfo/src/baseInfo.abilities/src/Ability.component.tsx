import React from 'react'
import styled from 'styled-components'
import { NormalStats } from '~/graphql/typeGenerated'
import { AbilityRow } from './components'

const Article = styled.article`
  width: 20rem;
  padding: 1rem;
  background-color: var(--color-white-1);
  border-radius: 0.5rem;

  & > table {
    width: 100%;
    table-layout: fixed;
  }
`

const AbilityComponent: React.FC<NormalStats> = (props) => {
  const { attack, defense, hp, specialAttack, speed, specialDefense, total } =
    props

  return (
    <Article>
      <table>
        <colgroup>
          <col width="50%" />
          <col width="50%" />
        </colgroup>
        <tbody>
          <AbilityRow label="체력" status={hp} />
          <AbilityRow label="공격" status={attack} />
          <AbilityRow label="특수공격" status={specialAttack} />
          <AbilityRow label="방어" status={defense} />
          <AbilityRow label="특수방어" status={specialDefense} />
          <AbilityRow label="스피드" status={speed} />
          <AbilityRow label="총합" status={total} />
        </tbody>
      </table>
    </Article>
  )
}

export default AbilityComponent
