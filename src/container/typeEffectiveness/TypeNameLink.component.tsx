import Link from 'next/link'
import { PokemonType } from '~/graphql/typeGenerated'
import { buildTypeDetailPath } from '~/module/typeParams.module'
import { PokemonTypes } from '~/types/pokemonTypes.types'

/**
 * "타입별 추가 효과" 본문 안의 타입명 링크.
 *
 * 이 섹션은 정보형 콘텐츠라 타입 상세로의 **문맥 링크가 가장 자연스러운
 * 자리**다(§15). 앵커 텍스트가 "○○ 타입"이라 문장 안에 그대로 놓이고,
 * §15가 피하라고 한 앵커("자세히", "여기", "클릭")를 자연히 회피한다.
 *
 * 기존 `<b className="type-color-*">` 표기를 유지한 채 링크만 씌운다 —
 * 타입 색 강조는 이 섹션의 기존 시각 규칙이라 바꾸지 않는다. 링크임은
 * hover 밑줄로 드러낸다.
 */

interface TypeNameLinkProps {
  type: PokemonType
  /** 표기 문구. 생략하면 `○○ 타입` */
  label?: string
}

/** 타입별 색 유틸 클래스(globals.css). 정적 매핑이라 purge에 안전하다. */
const TYPE_COLOR_CLASS: Record<PokemonType, string> = {
  NORMAL: 'type-color-normal',
  FIRE: 'type-color-fire',
  WATER: 'type-color-water',
  ELECTRIC: 'type-color-electric',
  GRASS: 'type-color-grass',
  ICE: 'type-color-ice',
  FIGHTING: 'type-color-fighting',
  POISON: 'type-color-poison',
  GROUND: 'type-color-ground',
  FLYING: 'type-color-flying',
  PSYCHIC: 'type-color-psychic',
  BUG: 'type-color-bug',
  ROCK: 'type-color-rock',
  GHOST: 'type-color-ghost',
  DRAGON: 'type-color-dragon',
  DARK: 'type-color-dark',
  STEEL: 'type-color-steel',
  FAIRY: 'type-color-fairy',
}

const TypeNameLinkComponent = ({ type, label }: TypeNameLinkProps) => {
  const text = label ?? `${PokemonTypes[type]} 타입`

  return (
    <Link
      href={buildTypeDetailPath(type)}
      aria-label={`${PokemonTypes[type]} 타입 약점과 상성 보기`}
      className="hover:underline focus-visible:underline"
    >
      <b className={TYPE_COLOR_CLASS[type]}>{text}</b>
    </Link>
  )
}

export default TypeNameLinkComponent
