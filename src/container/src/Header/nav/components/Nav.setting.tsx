import React from 'react'
import styled from 'styled-components'

interface NavSettingProps {}

const Div = styled.div`
  height: 3.33333333rem;
  background-color: var(--color-primary-3);
  border-radius: 1.66666667rem;

  > ul {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    padding: 0 1.11111111rem;

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
