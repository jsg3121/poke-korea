import CloseIcon from '~/assets/close.svg'
import styled from 'styled-components'

interface ModalTitleComponentProps {
  onClickClose: () => void
}

const ModalTitleComponent = ({ onClickClose }: ModalTitleComponentProps) => {
  const handleClickClose = () => {
    onClickClose()
  }

  return (
    <Header>
      <h2>
        이로치<b>(색이 다른 포켓몬)</b>이란?
      </h2>
      <button aria-label="이초리 설명 팝업 닫기" onClick={handleClickClose}>
        <CloseIcon
          width="1.5rem"
          height="1.5rem"
          fill="var(--color-primary-1)"
        />
      </button>
    </Header>
  )
}

export default ModalTitleComponent

const Header = styled.header`
  width: 100%;
  height: 3rem;
  border-bottom: 1px solid var(--color-primary-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
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

  & > button {
    width: 2rem;
    height: 2rem;
    padding: 0.25rem;
  }
`
