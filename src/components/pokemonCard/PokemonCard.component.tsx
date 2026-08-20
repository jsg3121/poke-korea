import { Fragment } from 'react'
import { PokemonCardFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import {
  getBackgroundColor,
  getNameHeaderClass,
  pokemonNumberFormat,
} from '~/module/pokemonCard.module'
import PokemonCardShellComponent from './PokemonCardShell.component'

/**
 * 포켓도감 포켓몬 카드 (반응형 단일 DS 컴포넌트).
 * 레이아웃 셸(포켓볼+헤더+이미지+타입+그라데이션)은 PokemonCardShell에 위임하고,
 * 이 컴포넌트는 헤더(No.+이름)와 본문(스탯)만 책임진다.
 *
 * 챔피언스 카드는 데이터 도메인이 달라(ChampionsMetaStats) 별도 ChampionsCard로
 * 분리한다(셸은 공유). skill/ability 등 같은 PokemonList 데이터의 다른 본문은
 * 추후 variant로 확장한다([[home-phase-b-decisions]]).
 */

/** 셸 공통 데이터 (모든 variant 공유) */
interface PokemonCardBaseProps {
  pokemonData: PokemonCardFragment
  isHighPriority?: boolean
}

/** variant별 본문 데이터 (판별 유니온) */
type PokemonCardVariant = {
  variant: 'pokedex'
}
// 확장 예정 (같은 PokemonList 데이터, 다른 본문):
// | { variant: 'skill'; learnInfo: PokemonLearnInfo }
// | { variant: 'ability'; abilityInfo: ... }

type PokemonCardComponentProps = PokemonCardBaseProps & PokemonCardVariant

/** 스탯 중 숫자 능력치 키 (__typename·total 제외) */
type PokemonStatKey =
  | 'hp'
  | 'attack'
  | 'specialAttack'
  | 'defense'
  | 'specialDefense'
  | 'speed'

/** pokedex 본문에 표시할 스탯 항목 (데이터 주도) */
const POKEDEX_STAT_ROWS: ReadonlyArray<{ label: string; key: PokemonStatKey }> =
  [
    { label: '체력', key: 'hp' },
    { label: '공격', key: 'attack' },
    { label: '특수공격', key: 'specialAttack' },
    { label: '방어', key: 'defense' },
    { label: '특수방어', key: 'specialDefense' },
    { label: '스피드', key: 'speed' },
  ]

const PokemonCardComponent = ({
  pokemonData,
  isHighPriority = false,
  variant,
}: PokemonCardComponentProps) => {
  const pokemonNumber = pokemonNumberFormat(pokemonData.number)
  const nameHeaderClass = getNameHeaderClass(pokemonData.name)
  const backgroundColor = getBackgroundColor(pokemonData.types)

  return (
    <PokemonCardShellComponent
      href={`/detail/${pokemonData.number}`}
      backgroundColor={backgroundColor}
      types={pokemonData.types}
      imageSrc={`${imageMode}/${pokemonData.number}`}
      imageAlt={`pokemon_id_${pokemonData.number} ${pokemonData.name}`}
      imageSize={{ width: 160, height: 160 }}
      isHighPriority={isHighPriority}
      ariaLabel={`포켓몬 ${pokemonData.name} 카드`}
      header={
        /* border-b가 내용 바로 아래에 오도록 고정 높이를 두지 않는다(카드 전체
           높이는 셸 article이 고정). 긴 이름은 flex-wrap으로 아랫줄로 내려간다. */
        <div className="w-full flex items-start content-start flex-wrap justify-between border-b border-solid border-card-accent pb-1 gap-x-2 gap-y-0.5">
          <p className="flex-shrink-0 text-xs desktop:text-base leading-tight font-medium text-black-2">
            No.{pokemonNumber}
          </p>
          {/* 이름은 어절(띄어쓰기) 단위로만 줄바꿈(break-keep) — 글자 중간에서 쪼개지지
              않는다. 짧으면 No.와 같은 줄(우측 정렬), 길면 어절 단위로 아랫줄까지(좌측
              정렬). 폰트·정렬은 길이에 따라 getNameHeaderClass가 결정. */}
          <h3
            className={`leading-tight font-semibold text-black break-keep ${nameHeaderClass}`}
          >
            {pokemonData.name}
          </h3>
        </div>
      }
    >
      {variant === 'pokedex' && (
        <dl
          className="w-full grid grid-rows-[repeat(3,_1fr)] grid-cols-[35%_15%_35%_15%] mt-2 desktop:mt-4 mx-auto pl-2"
          aria-label="능력치"
        >
          {POKEDEX_STAT_ROWS.map(({ label, key }, index) => (
            <Fragment key={key}>
              {/* 짝수 인덱스=왼쪽 열(mr-1), 홀수=오른쪽 열(ml-2) — 그리드 칸 정렬 */}
              <dt
                className={`h-4 desktop:h-6 text-2xs desktop:text-sm leading-4 desktop:leading-6 whitespace-nowrap ${
                  index % 2 === 0 ? 'mr-1' : 'ml-2'
                }`}
              >
                {label}
              </dt>
              <dd className="h-4 desktop:h-6 text-2xs desktop:text-sm leading-4 desktop:leading-6 text-right font-bold text-black">
                {pokemonData.pokemonStats[key]}
              </dd>
            </Fragment>
          ))}
        </dl>
      )}
    </PokemonCardShellComponent>
  )
}

export default PokemonCardComponent
