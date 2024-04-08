import React from 'react'
import styled from 'styled-components'
import { NormalStats } from '~/graphql/typeGenerated'
import { AilityRow } from './components'

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
          <AilityRow label="체력" status={hp} />
          <AilityRow label="공격" status={attack} />
          <AilityRow label="특수공격" status={specialAttack} />
          <AilityRow label="방어" status={defense} />
          <AilityRow label="특수방어" status={specialDefense} />
          <AilityRow label="스피드" status={speed} />
          <AilityRow label="총합" status={total} />
        </tbody>
      </table>
    </Article>
  )
}

export default AbilityComponent
