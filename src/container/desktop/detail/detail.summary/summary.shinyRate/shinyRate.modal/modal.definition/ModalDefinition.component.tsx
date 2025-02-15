import styled from 'styled-components'

const ModalDefinitionComponent = () => {
  return (
    <Section aria-label="이로치 확률표 용어 설명">
      <dl>
        <dt>국제 교배</dt>
        <dd>
          서로 다른 국가 언어로 된 포켓몬 끼리 교배하는 것으로, 알에서 이로치가
          나올 확률이 상승합니다.
        </dd>
        <dd>4세대(DP/PT)부터 추가되었으며, 세대별로 배율이 조금씩 다릅니다.</dd>
        <dt>빛나는 부적</dt>
        <dd>5세대(B2W2) 이후 추가된 도구 입니다.</dd>
        <dd>빛나는 부적을 획득하면 이로치 출현 확률을 더 높여줍니다.</dd>
      </dl>
    </Section>
  )
}

export default ModalDefinitionComponent

const Section = styled.section`
  width: 100%;

  & > dl {
    width: 100%;
    display: flex;
    flex-direction: column;

    & > dt {
      width: 100%;
      height: 1.25rem;
      font-size: 1rem;
      line-height: 1.25rem;
      text-align: left;
      color: var(--color-primary-1);
      margin: 0.5rem 0 0.25rem;
    }

    & > dd {
      width: 100%;
      height: 1rem;
      font-size: 0.75rem;
      line-height: 1rem;
      text-align: left;
      color: var(--color-primary-2);
    }
  }
`
