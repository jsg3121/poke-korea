import styled from 'styled-components'

interface InfoTitleComponentProps {
  name: string
}

const H2 = styled.h2`
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

const InfoTitleComponent = ({ name }: InfoTitleComponentProps) => {
  const fontSize =
    name.length > 14 ? 'small' : name.length > 6 ? 'medium' : 'large'

  return <H2 data-name-size={fontSize}>{name}</H2>
}

export default InfoTitleComponent
