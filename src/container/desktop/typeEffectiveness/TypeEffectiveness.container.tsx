import styled from 'styled-components'
import TypeEffectivenessTableComponent from './typeEffectiveness.table/TypeEffectivenessTable.component'
import TypeEffectivenessCaculatorComponent from './typeEffectiveness.calculator/TypeEffectivenessCaculator.component'

const TypeEffectivenessContainer = () => {
  return (
    <Div>
      <TypeEffectivenessCaculatorComponent />
      <TypeEffectivenessTableComponent />
    </Div>
  )
}

export default TypeEffectivenessContainer

const Div = styled.div`
  width: 100%;
  height: 100%;
`
