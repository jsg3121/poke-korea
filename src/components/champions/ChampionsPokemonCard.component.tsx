import PokemonCardShellComponent from '~/components/pokemonCard/PokemonCardShell.component'
import { ChampionsPokemonCardFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import {
  getBackgroundColor,
  getNameHeaderClass,
  pokemonNumberFormat,
} from '~/module/pokemonCard.module'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
} from '~/utils/championsFormat.util'

/**
 * 챔피언스 도감 포켓몬 카드 (반응형 단일 DS 컴포넌트).
 *
 * 레이아웃 셸(포켓볼+헤더+이미지+타입+그라데이션)은 PokemonCardShell에 위임하고,
 * 이 컴포넌트는 헤더(No.+이름)와 본문(종족값·사용률·승률)만 책임진다. 도감의
 * PokemonCard와 "같은 카드 디자인"을 셸로 공유하되, 데이터 도메인이 달라
 * (ChampionsPokemon) 카드는 분리한다([[home-phase-b-decisions]]).
 *
 * 구버전은 useDevice() UA 분기로 이미지 크기(108/160px)를 나눴으나(반응형 단일
 * 원칙 위반), 셸이 CSS 반응형으로 이미지 크기를 처리하므로 UA 분기를 제거했다(UX-E1).
 */
interface ChampionsPokemonCardProps {
  pokemonData: ChampionsPokemonCardFragment
  isHighPriority?: boolean
  formatSlug: ChampionsFormatSlug
}

/** 본문에 표시할 메타 스탯 행 (데이터 주도) */
const STAT_ROWS: ReadonlyArray<{
  label: string
  getValue: (p: ChampionsPokemonCardFragment) => string | number
}> = [
  { label: '종족값', getValue: (p) => p.stats?.total ?? '-' },
  {
    label: '사용률',
    getValue: (p) => (p.usageRate != null ? `${p.usageRate}%` : '-'),
  },
  {
    label: '승률',
    getValue: (p) => (p.winRate != null ? `${p.winRate}%` : '-'),
  },
]

const ChampionsPokemonCard = ({
  pokemonData,
  isHighPriority = false,
  formatSlug,
}: ChampionsPokemonCardProps) => {
  const pokemonNumber = pokemonNumberFormat(pokemonData.pokemonNumber)
  const nameHeaderClass = getNameHeaderClass(pokemonData.name)
  const backgroundColor = getBackgroundColor(pokemonData.types)

  const detailHref = buildChampionsDetailHref({
    formatSlug,
    pokemonId: pokemonData.externalDexId,
    formType: pokemonData.formType,
    formCode: pokemonData.formCode,
  })

  return (
    <PokemonCardShellComponent
      href={detailHref}
      backgroundColor={backgroundColor}
      types={pokemonData.types}
      imageSrc={`${imageMode}/${pokemonData.imagePath}`}
      imageAlt={`${pokemonData.name} 포켓몬 이미지`}
      imageSize={{ width: 160, height: 160 }}
      isHighPriority={isHighPriority}
      ariaLabel={`포켓몬 ${pokemonData.name} 카드`}
      header={
        <div className="w-full flex items-start content-start flex-wrap justify-between border-b border-solid border-card-accent pb-1 gap-x-2 gap-y-0.5">
          <p className="flex-shrink-0 text-xs desktop:text-base leading-tight font-medium text-black-2">
            No.{pokemonNumber}
          </p>
          <h3
            className={`leading-tight font-semibold text-black break-keep ${nameHeaderClass}`}
          >
            {pokemonData.name}
          </h3>
        </div>
      }
    >
      <dl
        className="w-full grid grid-rows-[repeat(3,_1fr)] mt-2 desktop:mt-4 mx-auto px-2"
        aria-label="포켓몬 메타 정보"
      >
        {STAT_ROWS.map(({ label, getValue }) => (
          <div
            key={label}
            className="h-4 desktop:h-6 flex items-center justify-between"
          >
            <dt className="text-2xs desktop:text-sm leading-4 desktop:leading-6">
              {label}
            </dt>
            <dd className="text-2xs desktop:text-sm leading-4 desktop:leading-6 font-semibold text-black">
              {getValue(pokemonData)}
            </dd>
          </div>
        ))}
      </dl>
    </PokemonCardShellComponent>
  )
}

export default ChampionsPokemonCard
