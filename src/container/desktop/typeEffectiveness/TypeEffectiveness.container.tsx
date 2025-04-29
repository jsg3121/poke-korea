import styled from 'styled-components'
import TypeEffectivenessTableComponent from './typeEffectiveness.table/TypeEffectivenessTable.component'
import TypeEffectivenessCaculatorComponent from './typeEffectiveness.calculator/TypeEffectivenessCaculator.component'
import { TypeEffectivenessProvider } from '~/context/TypeEffectiveness.context'

const TypeEffectivenessContainer = () => {
  return (
    <Div>
      <TypeEffectivenessProvider>
        <div className="type-calculator">
          <TypeEffectivenessCaculatorComponent />
        </div>
      </TypeEffectivenessProvider>
      <TypeEffectivenessTableComponent />
    </Div>
  )
}

export default TypeEffectivenessContainer

const Div = styled.div`
  width: 100%;
  height: 100%;

  & > .type-calculator {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }
`
