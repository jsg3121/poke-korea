import styled from 'styled-components'

interface InfoCardTitleComponentProps {
  title: string
}

const InfoCardTitleComponent = ({ title }: InfoCardTitleComponentProps) => {
  return <H2>{title}</H2>
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
