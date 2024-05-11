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
  width: 100%;
  height: 11rem;
  font-size: 3rem;
  line-height: 3rem;
  font-weight: 500;
  color: var(--color-primary-4);
  text-align: center;
  background-color: var(--color-primary-1);
  padding-top: 7rem;
  padding-bottom: 1rem;
`
