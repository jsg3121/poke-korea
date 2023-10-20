import React from 'react'
import isEqual from 'fast-deep-equal'
import styled from 'styled-components'

interface SettingComponentProps {}

const Setting = styled.div`
  width: 130px;
  height: 80px;
  background-color: red;
`

const SettingComponent: React.FC<SettingComponentProps> = (props) => {
  const {} = props

  return <Setting></Setting>
}

export default React.memo(SettingComponent, isEqual)
