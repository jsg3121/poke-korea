import { FC } from 'react'
import styled from 'styled-components'

interface IFProps {
  name: string
}

const InfoTitleComponent: FC<IFProps> = (props) => {
  const { name } = props
  return <StyledWrapper>{name}</StyledWrapper>
}

export default InfoTitleComponent

const StyledWrapper = styled.h1`
  width: 30rem;
  height: 7rem;
  font-size: 5rem;
  line-height: 7rem;
  font-weight: 500;
  color: var(--color-white-1);
  text-align: center;
`
