import ChampionsTierBadge, {
  getTierColors,
} from '~/components/champions/ChampionsTierBadge.component'
import PokemonCardShellComponent from '~/components/pokemonCard/PokemonCardShell.component'
import {
  ChampionsMetaSummaryFragment,
  PokemonType,
} from '~/graphql/typeGenerated'
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
 * 챔피언스 홈/티어 슬라이드용 포켓몬 카드 (반응형 단일 DS 컴포넌트, UX-E1).
 *
 * 레이아웃 셸(포켓볼+헤더+이미지+타입+그라데이션+크기 규격)은 PokemonCardShell에
 * 위임하고, 이 컴포넌트는 헤더(티어 배지+이름)와 본문(사용률·승률)만 책임진다.
 * 도감 카드 ChampionsPokemonCard와 "같은 카드 디자인/규격"을 셸로 공유한다 —
 * Hero/A티어 슬라이드도 도감 그리드와 동일한 POKEMON_CARD_SIZE를 쓴다(사용자 결정
 * 2026-07-22, DS 통일이 목적이므로 슬라이드 전용 폭 override는 두지 않는다).
 *
 * 데이터 원천이 실게임 데이터로 바뀌며 usageRate·winRate가 항상 null이 되어, 본문을
 * 순위(usageRank) + 인기 기술(topMove) 2행으로 교체했다. 슬라이드는 훑어보기 용도라
 * 정보를 좁혀 스캔성을 유지한다(특성·도구는 상세로 유도). 티어 리본 배지는 셸의
 * ballBadge slot에, 티어색 외곽선은 outlineColor prop에 전달한다.
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

  const rankLabel =
    pokemonData.usageRank != null ? `#${pokemonData.usageRank}` : '-'

  return (
    <PokemonCardShellComponent
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
      {/* 순위는 짧아 좌우 배치, 인기 기술 값은 말줄임 없이 줄바꿈(break-keep)으로 전부
          노출한다. 라벨을 값 위에 두어 값이 카드 가로폭 전체를 쓰게 한다. */}
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
    </PokemonCardShellComponent>
  )
}

export default ChampionsTopCard
