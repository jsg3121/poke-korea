import ChampionsTierBadge, {
  getTierColors,
} from '~/components/champions/ChampionsTierBadge.component'
import PokemonCardShellComponent from '~/components/pokemonCard/PokemonCardShell.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import {
  getBackgroundColor,
  getNameHeaderClass,
} from '~/module/pokemonCard.module'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
} from '~/utils/championsFormat.util'

/**
 * 챔피언스 메타 포켓몬 카드 (반응형 단일 DS 컴포넌트).
 * PokemonCard와 같은 레이아웃 셸(PokemonCardShell)을 공유하되, 챔피언스 고유
 * 포인트를 얹는다([[home-phase-b-decisions]]):
 * - 티어별 아웃라인 (S=금/A=은/B=동/C=에메랄드/D=회색)
 * - 포켓볼 마크 위 티어 랭크 뱃지(ribbon)
 * - 본문은 스탯 대신 사용률·승률 (승률은 null 가능 → "-")
 *
 * 데이터가 ChampionsMetaStats(포켓도감 PokemonList와 다름)라 PokemonCard와
 * 별도 컴포넌트로 둔다.
 */

interface ChampionsCardProps {
  pokemonData: ChampionsMetaSummaryFragment
  formatSlug: ChampionsFormatSlug
  isHighPriority?: boolean
}

/** 비율 값 표시 (null/undefined면 "-") */
const formatRate = (rate: number | null | undefined): string =>
  rate == null ? '-' : `${rate}%`

const ChampionsCardComponent = ({
  pokemonData,
  formatSlug,
  isHighPriority = false,
}: ChampionsCardProps) => {
  const displayName = pokemonData.name ?? ''
  const types = pokemonData.types ?? []
  const backgroundColor = getBackgroundColor(types)
  const tierColors = getTierColors(pokemonData.tier)

  return (
    <PokemonCardShellComponent
      href={buildChampionsDetailHref({
        formatSlug,
        pokemonId: pokemonData.pokemonId,
        formType: pokemonData.formType,
        formCode: pokemonData.formCode,
      })}
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
      <dl className="w-full grid grid-rows-2 grid-cols-[55%_45%] mt-2 desktop:mt-4 mx-auto px-2">
        <dt className="h-4 desktop:h-6 text-2xs desktop:text-sm leading-4 desktop:leading-6">
          사용률
        </dt>
        <dd className="h-4 desktop:h-6 text-2xs desktop:text-sm leading-4 desktop:leading-6 text-right font-bold text-black">
          {formatRate(pokemonData.usageRate)}
        </dd>
        <dt className="h-4 desktop:h-6 text-2xs desktop:text-sm leading-4 desktop:leading-6">
          승률
        </dt>
        <dd className="h-4 desktop:h-6 text-2xs desktop:text-sm leading-4 desktop:leading-6 text-right font-bold text-black">
          {formatRate(pokemonData.winRate)}
        </dd>
      </dl>
    </PokemonCardShellComponent>
  )
}

export default ChampionsCardComponent
