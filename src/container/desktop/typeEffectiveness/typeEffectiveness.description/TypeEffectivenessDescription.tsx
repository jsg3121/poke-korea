import styled from 'styled-components'

const TypeEffectivenessDescription = () => {
  return (
    <Section>
      <h3>타입별 추가 효과</h3>
      <ul>
        <li>
          <p>
            포켓몬의 타입과 기술의 타입이 일치하면 기술의 위력이 1.5배가 돼요.
          </p>
        </li>
        <li>
          <p>불꽃 타입의 포켓몬은 화상 상태가 되지 않아요.</p>
        </li>
        <li>
          <p>
            풀 타입의 포켓몬은 씨뿌리기, 독가루, 저리가루, 수면가루,버섯포자
            기술의 효과를 받지 않아요.
          </p>
        </li>
        <li>
          <p>전기 타입의 포켓몬은 마비 상태가 되지 않아요.</p>
        </li>
        <li>
          <p>
            얼음 타입의 포켓몬은 싸라기눈 기술의 데미지를 받지 않고, 얼음 상태가
            되지 않아요.
          </p>
        </li>
        <li>
          <p>독 타입의 포켓몬은 독, 맹독 상태가 되지 않아요.</p>
        </li>
        <li>
          <p>
            비행 타입을 가지지 않았거나, 부유 특성이 없는 독 타입 포켓몬은
            교체했을 때 주위에 뿌려진 독압정을 제거 해줘요.
          </p>
        </li>
        <li>
          <p>
            땅 타입의 포켓몬은 전기자석파의 효과를 받지 않고, 모래바람의
            데미지를 받지 않아요.
          </p>
        </li>
        <li>
          <p>
            비행 타입의 포켓몬은 압정뿌리기의 데미지를 받지 않고, 독압정을 통한
            독, 맹독 상태가 되지 않아요.
          </p>
        </li>
        <li>
          <p>
            바위 타입의 포켓몬은 모래바람이 불 때, 특수방어가 상승하고, 지속
            데미지를 받지 않아요.
          </p>
        </li>
        <li>
          <p>
            고스트 타입의 포켓몬은 상대를 도망치게 할 수 없는 기술의 효과를 받지
            않아요.
          </p>
        </li>
        <li>
          <p>
            강철 타입의 포켓몬은 모래바람의 데미지, 독, 맹독 상태 면역을 가지고
            있어요.
          </p>
        </li>
      </ul>
    </Section>
  )
}

export default TypeEffectivenessDescription

const Section = styled.section`
  width: 100%;
  height: fit-content;
  padding-top: 2rem;

  & > h3 {
    width: 100%;
    height: 2.75rem;
    font-size: 1.75rem;
    font-weight: 500;
    text-align: left;
    line-height: calc(1.5rem + 2px);
    color: var(--color-primary-4);
    border-bottom: 1px solid var(--color-primary-4);
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }

  & > ul {
    width: 100%;
    padding-left: 20px;
    list-style: disc;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    & > li {
      width: 100%;
      height: 1.25rem;
      font-size: 1.25rem;
      text-align: left;
      line-height: calc(1.25rem + 2px);
      color: var(--color-primary-4);
    }
  }
`
