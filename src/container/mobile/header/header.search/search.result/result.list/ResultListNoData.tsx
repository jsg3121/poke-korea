import styled from 'styled-components'

const ResultListNoData = () => {
  return (
    <Li>
      <p>검색 결과가 없어요!</p>
    </Li>
  )
}

export default ResultListNoData

const Li = styled.li`
  width: 100%;
  height: 2.75rem;

  & > p {
    width: 100%;
    height: 2.75rem;
    font-size: 1rem;
    line-height: 2.75rem;
    font-weight: 700;
    color: var(--color-black-2);
    text-align: center;
    display: block;
  }
`
