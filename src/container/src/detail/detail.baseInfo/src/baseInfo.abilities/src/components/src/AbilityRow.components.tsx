import { FC } from 'react'
import styled from 'styled-components'

interface IFProps {
  label: string
  status: number
}

const AbilityRowComponents: FC<IFProps> = (props) => {
  const { label, status } = props
  return (
    <StyledWrapper>
      <th>{label}</th>
      <td>{status}</td>
    </StyledWrapper>
  )
}

export default AbilityRowComponents

const StyledWrapper = styled.tr`
  height: 3rem;

  &:last-child {
    th {
      color: var(--color-primary-1);
    }

    td {
      color: #df3838;
    }
  }

  th,
  td {
    height: 3rem;
    text-align: left;
    font-size: 1.125rem;
    line-height: 3rem;
    color: var(--color-primary-2);
  }
`
