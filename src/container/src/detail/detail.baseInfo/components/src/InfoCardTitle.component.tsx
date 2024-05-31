import { FC } from 'react'
import styled from 'styled-components'

interface IFProps {
  title: string
}

const InfoCardTitleComponent: FC<IFProps> = ({ title }) => {
  return <H2>{title}</H2>
}

export default InfoCardTitleComponent

const H2 = styled.h2`
  width: 100%;
  height: 2rem;
  font-size: 1.5rem;
  line-height: 2rem;
  border-bottom: 1px solid var(--color-primary-1);
  margin-bottom: 1rem;
`
