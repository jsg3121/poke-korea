import styled from 'styled-components'

const ModalTitleComponent = () => {
  return (
    <Header>
      <h2>
        이로치<b>(색이 다른 포켓몬)</b>이란?
      </h2>
    </Header>
  )
}

export default ModalTitleComponent

const Header = styled.header`
  width: 100%;
  height: 3rem;
  border-bottom: 1px solid var(--color-primary-4);
  padding-bottom: 0.75rem;
  margin-bottom: 1.5rem;

  & > h2 {
    height: 3rem;
    font-size: 1.75rem;
    font-weight: 500;
    line-height: 3rem;

    > b {
      font-size: 1.3rem;
      color: var(--color-primary-2);
    }
  }
`
