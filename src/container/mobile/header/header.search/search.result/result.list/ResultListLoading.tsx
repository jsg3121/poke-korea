import styled from 'styled-components'

const ResultListLoading = () => {
  return (
    <Li>
      <p>포켓몬을 찾고 있어요...</p>
    </Li>
  )
}

export default ResultListLoading

const Li = styled.li`
  width: 100%;
  height: 2.75rem;

  & > p {
    width: 100%;
    height: 100%;
    font-size: 1rem;
    line-height: 2.75rem;
    color: var(--color-black-2);
  }
`
