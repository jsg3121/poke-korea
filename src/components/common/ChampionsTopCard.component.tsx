import {
  ChampionsMetaSummaryFragment,
  PokemonType,
} from '~/graphql/typeGenerated'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
} from '~/utils/championsFormat.util'
import { imageMode } from '~/modules/buildMode.module'
import {
  getBackgroundColor,
  getNameHeaderClass,
} from '~/modules/pokemonCard.module'
import ChampionsTierBadge, {
  getTierColors,
} from '~/components/common/ChampionsTierBadge.component'
import PokemonCardShell from '~/components/pokemonCard/PokemonCardShell.component'

interface ChampionsTopCardProps {
  pokemonData: ChampionsMetaSummaryFragment
  isHighPriority?: boolean
  formatSlug: ChampionsFormatSlug
}

const ChampionsTopCard = ({
  pokemonData,
  isHighPriority = false,
  formatSlug,
}: ChampionsTopCardProps) => {
  const displayName = pokemonData.name ?? ''
  const types = (pokemonData.types ?? []) as PokemonType[]
  const backgroundColor = getBackgroundColor(types)
  const tierColors = getTierColors(pokemonData.tier)

  const detailHref = buildChampionsDetailHref({
    formatSlug,
    pokemonId: pokemonData.pokemonId,
    formType: pokemonData.formType,
    formCode: pokemonData.formCode,
  })

  const rankLabel =
    pokemonData.usageRank != null ? `#${pokemonData.usageRank}` : '-'

  return (
    <PokemonCardShell
      href={detailHref}
      backgroundColor={backgroundColor}
      outlineColor={tierColors.outlineColor}
      types={types}
      imageSrc={`${imageMode}/${pokemonData.imagePath ?? pokemonData.pokemonId}`}
      imageAlt={`${displayName} 포켓몬 이미지`}
      imageSize={{ width: 160, height: 160 }}
      isHighPriority={isHighPriority}
      ariaLabel={`챔피언스 ${pokemonData.tier ?? ''}티어 ${displayName} 카드`}
      ballBadge={
        <ChampionsTierBadge tier={pokemonData.tier} variant="ribbon" />
      }
      header={
        <div className="w-full flex items-start content-start flex-wrap border-b border-solid border-card-accent pb-1">
          <h3
            className={`w-full leading-tight font-semibold text-black break-keep ${getNameHeaderClass(displayName)}`}
          >
            {displayName}
          </h3>
        </div>
      }
    >
      <dl
        className="w-full mt-2 desktop:mt-4 mx-auto px-2 flex flex-col gap-1"
        aria-label="포켓몬 메타 정보"
      >
        <div className="flex items-center justify-between gap-2">
          <dt className="text-2xs desktop:text-sm leading-4 desktop:leading-6">
            순위
          </dt>
          <dd className="text-2xs desktop:text-sm leading-4 desktop:leading-6 font-semibold text-black">
            {rankLabel}
          </dd>
        </div>
        <div className="text-center">
          <dt className="text-2xs desktop:text-sm leading-4 desktop:leading-6">
            인기 기술
          </dt>
          <dd className="text-2xs desktop:text-sm leading-tight desktop:leading-tight font-semibold text-black break-keep">
            {pokemonData.topMove ?? '-'}
          </dd>
        </div>
      </dl>
    </PokemonCardShell>
  )
}

export default ChampionsTopCard
