import { ChampionsTypeEntry } from '~/app/type-effectiveness/[type]/_fetch/typeDetail.fetch'
import { PokemonInfoFragment, PokemonType } from '~/graphql/typeGenerated'
import TypeDetailChampionsContainer from '~/container/typeEffectivenessDetail/TypeDetailChampions.container'
import TypeDetailComboContainer from '~/container/typeEffectivenessDetail/TypeDetailCombo.container'
import TypeDetailFaqContainer from '~/container/typeEffectivenessDetail/TypeDetailFaq.container'
import TypeDetailMatchupContainer from '~/container/typeEffectivenessDetail/TypeDetailMatchup.container'
import TypeDetailNavContainer from '~/container/typeEffectivenessDetail/TypeDetailNav.container'
import TypeDetailPokemonContainer from '~/container/typeEffectivenessDetail/TypeDetailPokemon.container'
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
 * ## 데이터 출처
 *
 * 상성·문안은 정적 상수라 조회가 없고, **포켓몬 6종과 챔피언스 티어만** 서버에서
 * 받아 props로 내려온다(`_fetch/typeDetail.fetch.ts`). 조회가 실패하면 해당
 * 블록만 비고 페이지는 정상 렌더된다 — 핵심인 상성 정보는 상수에서 나온다.
 *
 * 광고는 폴드에 두지 않는다 — 검색 유입 즉답이 이 페이지의 존재 이유다. 슬롯
 * 발급 후 복합 타입 블록 뒤에 배치한다(메모리 규칙: 빈 슬롯 커밋 금지).
 */

interface TypeEffectivenessDetailViewProps {
  pokemonType: PokemonType
  pokemons: Array<PokemonInfoFragment>
  pokemonTotalCount: number
  champions: Array<ChampionsTypeEntry>
}

const TypeEffectivenessDetailView = ({
  pokemonType,
  pokemons,
  pokemonTotalCount,
  champions,
}: TypeEffectivenessDetailViewProps) => {
  return (
    // pt-6: 전역 헤더(GNB)와 본문이 붙지 않게 하는 최소 여백. PageHeader를 쓰는
    // 다른 페이지는 그 컴포넌트가 pt-4를 갖지만, 이 페이지는 폴드 확보를 위해
    // PageHeader 대신 자체 헤더를 쓰므로 여백을 여기서 준다.
    // pb-20: 모바일 하단 고정 탭바(h-16=64px) 클리어런스.
    <section className="mx-auto w-full max-w-[1280px] px-4 pb-20 pt-6 desktop:pb-10 desktop:pt-8">
      <TypeDetailSummaryContainer pokemonType={pokemonType} />
      <TypeDetailMatchupContainer pokemonType={pokemonType} />
      <TypeDetailComboContainer pokemonType={pokemonType} />
      <TypeDetailPokemonContainer
        pokemonType={pokemonType}
        pokemons={pokemons}
        totalCount={pokemonTotalCount}
      />
      <TypeDetailChampionsContainer
        pokemonType={pokemonType}
        entries={champions}
      />
      <TypeDetailFaqContainer pokemonType={pokemonType} />
      <TypeDetailNavContainer pokemonType={pokemonType} />
    </section>
  )
}

export default TypeEffectivenessDetailView
