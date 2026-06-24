import Link from 'next/link'
import ChampionsCardComponent from '~/components/champions/ChampionsCard.component'
import SectionHeadingComponent from '~/components/SectionHeading.component'
import HorizontalScrollListComponent from '~/components/horizontalScrollList/HorizontalScrollList.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { CHAMPIONS_DEFAULT_FORMAT_SLUG } from '~/utils/championsFormat.util'

/**
 * 홈 "인기 챔피언스 포켓몬" 섹션 (반응형 단일, DS 컴포넌트 조립).
 * 기존 desktop/mobile 2벌 컨테이너를 대체한다.
 *
 * - SectionHeading + HorizontalScrollList + ChampionsCard + CTA.
 * - 데스크톱 flex-wrap / 모바일 가로 스크롤이 혼재하던 것을 HorizontalScrollList
 *   가로 스크롤 단일로 통일.
 * - 모바일 좌우 여백(gutter)은 표준 px-5(20px).
 * - CTA 버튼은 터치 타겟 보장(min-h-touch).
 */

interface HomeChampionsContainerProps {
  topPokemons: Array<ChampionsMetaSummaryFragment>
}

const HomeChampionsContainer = ({
  topPokemons,
}: HomeChampionsContainerProps) => {
  if (topPokemons.length === 0) return null

  return (
    <section
      className="w-full max-w-[1280px] mx-auto px-5"
      aria-labelledby="home-champions-heading"
    >
      <SectionHeadingComponent id="home-champions-heading">
        인기 챔피언스 포켓몬
      </SectionHeadingComponent>

      <HorizontalScrollListComponent aria-label="인기 챔피언스 포켓몬 목록">
        {topPokemons.map((pokemon) => (
          <ChampionsCardComponent
            key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
            pokemonData={pokemon}
            formatSlug={CHAMPIONS_DEFAULT_FORMAT_SLUG}
            isHighPriority
          />
        ))}
      </HorizontalScrollListComponent>

      <div className="mt-4 flex justify-center">
        <Link
          href={`/champions/${CHAMPIONS_DEFAULT_FORMAT_SLUG}/list`}
          className="inline-flex items-center gap-2 min-h-touch rounded-2xl bg-primary-1 px-6 py-3 text-sm desktop:text-base text-primary-4 shadow-[1px_2px_6px_0_var(--color-primary-1)] transition-colors hover:bg-primary-2 focus-visible:bg-primary-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
        >
          <span>챔피언스 전체 도감 보기</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

export default HomeChampionsContainer
