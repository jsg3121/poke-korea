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
 * 이 컴포넌트는 헤더(No.+이름)와 본문(종족값·순위 + 인기 기술/특성/도구)만 책임진다.
 * 도감의 PokemonCard와 "같은 카드 디자인"을 셸로 공유하되, 데이터 도메인이 달라
 * (ChampionsPokemon) 카드는 분리한다([[home-phase-b-decisions]]).
 *
 * 데이터 원천이 실게임 데이터(championsbattledata)로 바뀌며 usageRate·winRate가 항상
 * null이 되어, 본문을 실제 채택 top1(기술/특성/도구, 한글명)로 교체했다. 인기도는
 * usageRank(순위)로 표현한다.
 *
 * 구버전은 useDevice() UA 분기로 이미지 크기(108/160px)를 나눴으나(반응형 단일
 * 원칙 위반), 셸이 CSS 반응형으로 이미지 크기를 처리하므로 UA 분기를 제거했다(UX-E1).
 */
interface ChampionsPokemonCardProps {
  pokemonData: ChampionsPokemonCardFragment
  isHighPriority?: boolean
  formatSlug: ChampionsFormatSlug
}

/** 본문 top1 행 (인기 기술/특성/도구, 한글명). 데이터 없으면 '-' */
const TOP_ROWS: ReadonlyArray<{
  label: string
  getValue: (p: ChampionsPokemonCardFragment) => string
}> = [
  { label: '인기 기술', getValue: (p) => p.topMove ?? '-' },
  { label: '인기 특성', getValue: (p) => p.topAbility ?? '-' },
  { label: '인기 도구', getValue: (p) => p.topItem ?? '-' },
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
        className="w-full flex flex-col gap-0.5 mt-1.5 desktop:mt-2 mx-auto px-2"
        aria-label="포켓몬 메타 정보"
      >
        {/* 종족값·순위 요약줄 (하단 구분선) */}
        <div className="flex items-center justify-between gap-2 pb-0.5 border-b border-solid border-black-2/25 text-2xs desktop:text-sm font-semibold text-black">
          <span className="flex items-center gap-1">
            <dt className="font-medium text-black-2">종족값</dt>
            <dd>{pokemonData.stats?.total ?? '-'}</dd>
          </span>
          <span className="flex items-center gap-1">
            <dt className="font-medium text-black-2">순위</dt>
            <dd>
              {pokemonData.usageRank != null
                ? `#${pokemonData.usageRank}`
                : '-'}
            </dd>
          </span>
        </div>

        {/* 인기 기술/특성/도구 top1 (한글명). 방안 B: 라벨 배지와 값을 한 줄에 배치해
            본문 세로 높이를 줄여 이미지 영역을 확보한다. 정보 제공 목적상 값은 말줄임
            없이 줄바꿈(break-keep)으로 전부 노출하되, 라벨 배지를 좌측에 고정하고 값은
            우측에서 남는 폭을 쓴다. */}
        {TOP_ROWS.map(({ label, getValue }) => (
          <div key={label} className="flex items-start gap-1.5 min-w-0">
            <dt className="flex-shrink-0 self-start text-[0.625rem] desktop:text-xs font-bold text-primary-1 bg-primary-3 rounded px-1 leading-4 desktop:leading-5">
              {label}
            </dt>
            <dd className="min-w-0 flex-1 text-2xs desktop:text-sm leading-4 desktop:leading-5 font-semibold text-black break-keep">
              {getValue(pokemonData)}
            </dd>
          </div>
        ))}
      </dl>
    </PokemonCardShellComponent>
  )
}

export default ChampionsPokemonCard
