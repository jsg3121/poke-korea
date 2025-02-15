import styled from 'styled-components'

const ModalDescriptionComponent = () => {
  return (
    <Div>
      <p>
        일반적인 포켓몬과는 다른 색으로 이루어진 경우를 이로치
        <b>(색이 다른)</b>
        포켓몬을 일컫습니다.
      </p>
      <p>
        이로치 포켓몬은 매우 드물게 나타나기 때문에 보기 힘든 포켓몬이며,&nbsp;
        <b>
          색이 다른 포켓몬은 색이 다르다는 점 외에는 일반 포켓몬과 완전히
          동일해요.
        </b>
      </p>
      <p>
        일본 공식 명칭으로는 &apos;색이 다름&apos;이라는 뜻의
        &apos;色違い(이로치가이)&apos;라고 불렀으며, 2~3세대까지는 우리나라에서
        이에 대한 정식 번역이 없었기 때문에 일본어 발음을 음차해서 이로치가이
        포켓몬, 또는 줄여서
        <b>이로치</b>&nbsp;포켓몬이라고 부르고 있어요.
      </p>
      <p>
        색이 다른 포켓몬이라고 해서 매번 다른 색으로 출현하는 것은 아니고 각각
        포켓몬마다 다른 색이 정해져 있어요.
      </p>
      <p>
        스타팅 포켓몬, 전설의 포켓몬, 환상의 포켓몬도 색이 다른 포켓몬으로
        발견될 수 있으며, 이렇게 색이 다른 포켓몬은 진화해도 다른 색을
        유지합니다.
      </p>
      <p>
        모든 포켓몬을 색이 다른 포켓몬으로 포획할 수 있는 건 아니에요! 색이 다른
        포켓몬이 나오지 않도록 게임상에서 의도적으로 조정된 포켓몬들이 있습니다.
      </p>
      <p>
        이러한 포켓몬들은 치트나 버그를 사용하지 않고는 색다른 형태를 얻을 수
        없습니다.&nbsp;
      </p>
      <span>
        사이트에서 제공하는 이로치의 이미지는 일반적으로 잡을 수 없는 경우도
        포함하고 있으니 참고만 해주세요.
      </span>
    </Div>
  )
}

export default ModalDescriptionComponent

const Div = styled.div`
  width: 100%;
  height: fit-content;

  & > p {
    width: 100%;
    font-size: 1rem;
    line-height: 1.25rem;
    margin-bottom: 1rem;
  }
`
