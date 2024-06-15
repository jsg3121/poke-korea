import { FC } from 'react'
import styled from 'styled-components'

interface IFProps {
  name: string
}

const InfoTitleComponent: FC<IFProps> = (props) => {
  const { name } = props

  const fontSize =
    name.length > 14 ? 'small' : name.length > 6 ? 'medium' : 'large'

  return <StyledWrapper data-name-size={fontSize}>{name}</StyledWrapper>
}

export default InfoTitleComponent

const StyledWrapper = styled.h1`
  width: 30rem;
  height: 7rem;
  line-height: 7rem;
  font-weight: 500;
  color: var(--color-white-1);
  text-align: center;

  &[data-name-size='large'] {
    font-size: 3rem;
  }

  &[data-name-size='medium'] {
    font-size: 2.5rem;
  }

  &[data-name-size='small'] {
    font-size: 1.8rem;
  }
`
