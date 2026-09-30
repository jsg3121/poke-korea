import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import {
  CHAMPIONS_DEFAULT_FORMAT_SLUG,
  getFormatLabel,
} from '~/utils/championsFormat.util'
import LinkButton from '~/components/button/LinkButton.component'
import ChampionsTopCard from '~/components/common/ChampionsTopCard.component'
import HorizontalScrollList from '~/components/horizontalScrollList/HorizontalScrollList.component'
import SectionHeading from '~/components/SectionHeading.component'

interface HomeChampionsProps {
  topPokemons: Array<ChampionsMetaSummaryFragment>
}

const HomeChampions = ({ topPokemons }: HomeChampionsProps) => {
  if (topPokemons.length === 0) return null

  return (
    <section
      className="w-full px-4 desktop:px-8"
      aria-labelledby="home-champions-heading"
    >
      <SectionHeading id="home-champions-heading">
        이번 주 챔피언스 TOP 3
      </SectionHeading>
      <p className="mt-1 text-center text-sm desktop:text-base text-primary-3">
        {getFormatLabel(CHAMPIONS_DEFAULT_FORMAT_SLUG)} 채택 순위 기준
      </p>

      <div className="desktop:max-w-fit desktop:mx-auto">
        <HorizontalScrollList aria-label="이번 주 챔피언스 TOP 3 목록">
          {topPokemons.map((pokemon) => (
            <ChampionsTopCard
              key={`${pokemon.pokemonId}-${pokemon.formCode ?? 'base'}`}
              pokemonData={pokemon}
              formatSlug={CHAMPIONS_DEFAULT_FORMAT_SLUG}
              isHighPriority
            />
          ))}
        </HorizontalScrollList>
      </div>

      <div className="mt-2 flex justify-center">
        <LinkButton
          href={`/champions/${CHAMPIONS_DEFAULT_FORMAT_SLUG}/list`}
          variant="primary"
          showArrow
        >
          챔피언스 전체 도감 보기
        </LinkButton>
      </div>
    </section>
  )
}

export default HomeChampions
