import { PokemonType } from '~/graphql/typeGenerated'
import TypeDetailComboContainer from '~/container/typeEffectivenessDetail/TypeDetailCombo.container'
import TypeDetailFaqContainer from '~/container/typeEffectivenessDetail/TypeDetailFaq.container'
import TypeDetailMatchupContainer from '~/container/typeEffectivenessDetail/TypeDetailMatchup.container'
import TypeDetailNavContainer from '~/container/typeEffectivenessDetail/TypeDetailNav.container'
import TypeDetailSummaryContainer from '~/container/typeEffectivenessDetail/TypeDetailSummary.container'

/**
 * 타입별 상성 상세 뷰 — 반응형 단일(ADR-0007).
 *
 * ## 섹션 순서의 근거
 *
 * 검색 의도 충족 속도 순으로 배치했다(시안·UX 설계 결과). `독타입 약점`으로
 * 들어온 사용자가 답을 얻기까지의 거리를 최소화하는 것이 기준이다.
 *
 * 1. 폴드 — Breadcrumb·H1·리드·약점 즉답·고유 사실
 * 2. 방어/공격 상성 전체
 * 3. 복합 타입 사례 + 고유 효과
 * 4. FAQ
 * 5. 계산기 CTA + 다른 타입 링크
 *
 * **배율 체계 설명(2배가 뭔지)은 두지 않았다.** 시안 설계에서 이 블록을 하위로
 * 내린 이유가 "18개 페이지가 완전히 동일한 문단으로 시작한다"였는데, 실제로
 * 넣어보니 하위에 둬도 18개가 같은 문단을 갖는 것은 변하지 않는다. 배율 개념은
 * 메인 계산기가 이미 설명하므로 여기서는 생략하고 링크로 대신한다.
 *
 * ## 아직 없는 블록
 *
 * 포켓몬 6종·챔피언스 티어 블록은 GraphQL 조회가 필요해 후속 작업으로 둔다.
 * 정적 상수만으로 구성된 현재 블록들은 서버 컴포넌트로 즉시 렌더된다.
 *
 * 광고는 폴드에 두지 않는다 — 검색 유입 즉답이 이 페이지의 존재 이유다. 슬롯
 * 발급 후 복합 타입 블록 뒤에 배치한다(메모리 규칙: 빈 슬롯 커밋 금지).
 */

interface TypeEffectivenessDetailViewProps {
  pokemonType: PokemonType
}

const TypeEffectivenessDetailView = ({
  pokemonType,
}: TypeEffectivenessDetailViewProps) => {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 pb-8">
      <TypeDetailSummaryContainer pokemonType={pokemonType} />
      <TypeDetailMatchupContainer pokemonType={pokemonType} />
      <TypeDetailComboContainer pokemonType={pokemonType} />
      <TypeDetailFaqContainer pokemonType={pokemonType} />
      <TypeDetailNavContainer pokemonType={pokemonType} />
    </section>
  )
}

export default TypeEffectivenessDetailView
