import React from 'react'
import styled from 'styled-components'

interface NavSettingProps {}

const Div = styled.div`
  height: 60px;
  background-color: var(--color-primary-3);
  border-radius: 30px;

  > ul {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 18px;
    padding: 0 20px;

    > li {
      text-align: center;
    }
  }
`

const NavSetting: React.FC<NavSettingProps> = (props) => {
  const {} = props

  return (
    <Div>
      <ul>
        <li>설정</li>
        <li>테마 변경</li>
      </ul>
    </Div>
  )
}

export default NavSetting
