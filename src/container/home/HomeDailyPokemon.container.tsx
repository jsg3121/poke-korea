import HorizontalScrollListComponent from '~/components/horizontalScrollList/HorizontalScrollList.component'
import PokemonCardComponent from '~/components/pokemonCard/PokemonCard.component'
import SectionHeadingComponent from '~/components/SectionHeading.component'
import { PokemonCardFragment } from '~/graphql/typeGenerated'

/**
 * 홈 "오늘의 포켓몬" 섹션 (반응형 단일, DS 조립 — UX-003 §3 섹션 4).
 * 기존 desktop/mobile 2벌 컨테이너(HomeBanner)를 대체한다.
 *
 * 매일 갱신되는 10마리를 가로 스크롤로 노출 — 도감 상세로의 데일리 내부 링크 역할
 * (RES-001 시사점 3, 크롤 신선도 기여). 스크롤 단서(다음 카드 peek)·간격·스크롤바는
 * HorizontalScrollList가 담당한다.
 *
 * 빈 상태(length===0)면 섹션을 렌더하지 않는다(UX-003 §4 — 기존엔 가드가 없던
 * 극단 케이스 보강).
 */

interface HomeDailyPokemonContainerProps {
  dailyPokemon: Array<PokemonCardFragment>
}

const HomeDailyPokemonContainer = ({
  dailyPokemon,
}: HomeDailyPokemonContainerProps) => {
  if (dailyPokemon.length === 0) return null

  return (
    <section
      className="w-full px-4 desktop:px-8"
      aria-labelledby="daily-pokemon-heading"
    >
      <SectionHeadingComponent id="daily-pokemon-heading">
        오늘의 포켓몬
      </SectionHeadingComponent>

      <HorizontalScrollListComponent aria-label="오늘의 포켓몬 목록">
        {dailyPokemon.map((pokemon) => (
          <PokemonCardComponent
            key={`pokemon-id-${pokemon.id}`}
            variant="pokedex"
            pokemonData={pokemon}
          />
        ))}
      </HorizontalScrollListComponent>
    </section>
  )
}

export default HomeDailyPokemonContainer
