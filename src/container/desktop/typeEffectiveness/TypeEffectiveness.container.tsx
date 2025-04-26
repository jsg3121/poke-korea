import styled from 'styled-components'
import TypeEffectivenessTableComponent from './typeEffectivenessTable/TypeEffectivenessTable.component'

const TypeEffectivenessContainer = () => {
  return (
    <Div>
      <TypeEffectivenessTableComponent />
    </Div>
  )
}

export default TypeEffectivenessContainer

const Div = styled.div`
  width: 100%;
  height: 100%;
`
