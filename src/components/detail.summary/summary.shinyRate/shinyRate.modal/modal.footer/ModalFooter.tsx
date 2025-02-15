import styled from 'styled-components'

const ModalFooter = () => {
  return (
    <Footer>
      <p>
        이로치 포획 확률에 대해&nbsp;
        <a
          href="https://namu.wiki/w/%EC%83%89%EC%9D%B4%20%EB%8B%A4%EB%A5%B8%20%ED%8F%AC%EC%BC%93%EB%AA%AC"
          target="_blank"
          rel="noopener noreferrer"
        >
          여기서
        </a>
        &nbsp;더 많은 정보를 확인하실 수 있습니다.
      </p>
    </Footer>
  )
}

export default ModalFooter

const Footer = styled.footer`
  & > p {
    width: 100%;
    min-height: 1.25rem;
    font-size: 1rem;
    line-height: 1.25rem;
    text-align: left;
    color: var(--color-primary-2);
    margin-top: 1rem;

    & > a {
      color: var(--color-primary-2);
      text-decoration: underline;
      font-style: italic;
    }
  }
`
