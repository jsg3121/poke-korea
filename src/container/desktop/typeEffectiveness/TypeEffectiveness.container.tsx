import styled from 'styled-components'
import { TypeEffectivenessProvider } from '~/context/TypeEffectiveness.context'
import TypeEffectivenessCaculatorComponent from './typeEffectiveness.calculator/TypeEffectivenessCaculator.component'
import TypeEffectivenessResultComponent from './typeEffectiveness.result/TypeEffectivenessResult.component'
import TypeEffectivenessTableComponent from './typeEffectiveness.table/TypeEffectivenessTable.component'
import TypeEffectivenessDescription from './typeEffectiveness.description/TypeEffectivenessDescription'

const TypeEffectivenessContainer = () => {
  return (
    <Div>
      <TypeEffectivenessProvider>
        <div className="type-calculator">
          <TypeEffectivenessCaculatorComponent />
          <TypeEffectivenessResultComponent />
        </div>
      </TypeEffectivenessProvider>
      <TypeEffectivenessTableComponent />
      <TypeEffectivenessDescription />
    </Div>
  )
}

export default TypeEffectivenessContainer

const Div = styled.div`
  width: 100%;
  height: 100%;

  & > .type-calculator {
    width: 100%;
    margin-bottom: 3rem;
  }
`
