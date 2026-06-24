import SectionHeadingComponent from '~/components/SectionHeading.component'
import HorizontalScrollListComponent from '~/components/horizontalScrollList/HorizontalScrollList.component'
import PokemonCardComponent from '~/components/pokemonCard/PokemonCard.component'
import { PokemonCardFragment } from '~/graphql/typeGenerated'

/**
 * 홈 "오늘의 포켓몬" 배너 섹션 (반응형 단일, DS 컴포넌트 조립).
 * 기존 desktop/mobile 2벌 컨테이너를 대체한다.
 *
 * - SectionHeading(제목) + HorizontalScrollList(가로 스크롤) + PokemonCard.
 * - 가로 스크롤바·간격·peek는 HorizontalScrollList가 담당(중복 마크업 제거).
 * - 모바일 좌우 여백(gutter)은 표준 px-5(20px). 데스크톱은 max-w-1280 안에서 정렬.
 */

interface HomeBannerContainerProps {
  dailyPokemon: Array<PokemonCardFragment>
}

const HomeBannerContainer = ({ dailyPokemon }: HomeBannerContainerProps) => {
  return (
    <section
      className="w-full max-w-[1280px] mx-auto px-5"
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
            isHighPriority
          />
        ))}
      </HorizontalScrollListComponent>
    </section>
  )
}

export default HomeBannerContainer
