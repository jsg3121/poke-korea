import ChampionsTierBadge, {
  getTierColors,
} from '~/components/champions/ChampionsTierBadge.component'
import PokemonCardShellComponent from '~/components/pokemonCard/PokemonCardShell.component'
import {
  ChampionsMetaSummaryFragment,
  PokemonType,
} from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { getBackgroundColor } from '~/module/pokemonCard.module'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
} from '~/utils/championsFormat.util'

/**
 * 챔피언스 홈/티어 슬라이드용 포켓몬 카드 (반응형 단일 DS 컴포넌트, UX-E1).
 *
 * 레이아웃 셸(포켓볼+헤더+이미지+타입+그라데이션+크기 규격)은 PokemonCardShell에
 * 위임하고, 이 컴포넌트는 헤더(티어 배지+이름)와 본문(사용률·승률)만 책임진다.
 * 도감 카드 ChampionsPokemonCard와 "같은 카드 디자인/규격"을 셸로 공유한다 —
 * Hero/A티어 슬라이드도 도감 그리드와 동일한 POKEMON_CARD_SIZE를 쓴다(사용자 결정
 * 2026-07-22, DS 통일이 목적이므로 슬라이드 전용 폭 override는 두지 않는다).
 *
 * 본문은 사용률을 항상, 승률(winRate)이 있으면 승률도 노출한다. 티어 리본 배지는
 * 셸의 ballBadge slot에, 티어색 외곽선은 outlineColor prop에 전달한다.
 */
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

  // 본문 행: 사용률은 항상, 승률은 값이 있을 때만 노출
  const statRows: Array<{ label: string; value: string }> = [
    {
      label: '사용률',
      value: pokemonData.usageRate != null ? `${pokemonData.usageRate}%` : '-',
    },
  ]
  if (pokemonData.winRate != null) {
    statRows.push({ label: '승률', value: `${pokemonData.winRate}%` })
  }

  return (
    <PokemonCardShellComponent
      href={detailHref}
      backgroundColor={backgroundColor}
      outlineColor={tierColors.outlineColor}
      types={types}
      imageSrc={`${imageMode}/${pokemonData.imagePath}`}
      imageAlt={`${displayName} 포켓몬 이미지`}
      imageSize={{ width: 160, height: 160 }}
      isHighPriority={isHighPriority}
      ariaLabel={`챔피언스 ${pokemonData.tier}티어 ${displayName} 카드`}
      ballBadge={
        <ChampionsTierBadge tier={pokemonData.tier} variant="ribbon" />
      }
      header={
        <div className="w-full flex items-start justify-end border-b border-solid border-card-accent pb-1">
          <h3 className="leading-tight font-semibold text-black break-keep text-right truncate">
            {displayName}
          </h3>
        </div>
      }
    >
      <dl
        className="w-full mt-2 desktop:mt-4 mx-auto px-2"
        aria-label="포켓몬 메타 정보"
      >
        {statRows.map(({ label, value }) => (
          <div
            key={label}
            className="h-4 desktop:h-6 flex items-center justify-between"
          >
            <dt className="text-2xs desktop:text-sm leading-4 desktop:leading-6">
              {label}
            </dt>
            <dd className="text-2xs desktop:text-sm leading-4 desktop:leading-6 font-semibold text-black">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </PokemonCardShellComponent>
  )
}

export default ChampionsTopCard
