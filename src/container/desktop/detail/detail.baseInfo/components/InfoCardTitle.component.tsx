import styled from 'styled-components'

interface InfoCardTitleComponentProps {
  id?: string
  title: string
}

const InfoCardTitleComponent = ({ id, title }: InfoCardTitleComponentProps) => {
  return <H2 id={id}>{title}</H2>
}

export default InfoCardTitleComponent

const H2 = styled.h2`
  width: 100%;
  height: 2.75rem;
  font-size: 1.75rem;
  line-height: 2.75rem;
  font-weight: bold;
  text-align: left;
  border-bottom: 1px solid var(--color-primary-1);
  margin-bottom: 1.5rem;
`
