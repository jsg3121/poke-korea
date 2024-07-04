import { FC } from 'react'
import styled from 'styled-components'

interface IFProps {
  name: string
}

const H1 = styled.h1`
  width: 30rem;
  height: 7rem;
  line-height: 7rem;
  font-weight: 500;
  color: var(--color-white-1);
  text-align: center;
  margin: 0 auto;

  &[data-name-size='large'] {
    font-size: 2.5rem;
  }

  &[data-name-size='medium'] {
    font-size: 2rem;
  }

  &[data-name-size='small'] {
    font-size: 1.2rem;
  }
`

const InfoTitleComponent: FC<IFProps> = (props) => {
  const { name } = props

  const fontSize =
    name.length > 14 ? 'small' : name.length > 6 ? 'medium' : 'large'

  return <H1 data-name-size={fontSize}>{name}</H1>
}

export default InfoTitleComponent
