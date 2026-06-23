import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'

/**
 * 디자인 시스템 타입 태그 (신규). 기존 Tag.component / globals.css의 .type-tag를
 * 추출하지 않고, 토큰 기반으로 규격화해 새로 만든다.
 *
 * 크기는 모바일 퍼스트 2단계 토큰: 모바일 w-12/h-5/text-2xs(11px) →
 * desktop:w-14/h-6/text-xs(12px). 카드가 모바일에서 축소되므로 태그도 함께 줄인다.
 * 폰트 하한은 접근성상 text-2xs(11px)로 유지한다.
 *
 * 정렬은 flex가 아니라 block+text-center+line-height로 한다. Gmarket Sans는
 * 글자가 line-box 위로 치우치는 폰트라, flex items-center(박스 중앙)보다
 * line-height를 height+2px로 주는 게 시각적으로 정확히 중앙에 온다.
 * line-height는 height 토큰과 같은 수치에 +2px(calc)로 묶어 종속시킨다
 * (h-5=1.25rem → leading calc(1.25rem+2px), h-6=1.5rem → calc(1.5rem+2px)).
 *
 * 색상은 동적 클래스(`bg-type-${...}`)가 Tailwind 빌드에서 누락되지 않도록
 * 정적 매핑 문자열로 둔다(safelist 불필요).
 */

/**
 * 타입별 색상 클래스 (배경 + 글자색, 정적 — Tailwind purge 안전).
 * 글자색은 WCAG AA 대비를 충족하도록 배경별로 검정/흰색을 선택한다.
 * 어두운 배경 6종(격투·독·고스트·드래곤·악·바위)은 흰색 글자.
 */
const TYPE_COLOR: Record<PokemonType, string> = {
  NORMAL: 'bg-type-normal text-black-2',
  FIRE: 'bg-type-fire text-black-2',
  WATER: 'bg-type-water text-black-2',
  ELECTRIC: 'bg-type-electric text-black-2',
  GRASS: 'bg-type-grass text-black-2',
  ICE: 'bg-type-ice text-black-2',
  FIGHTING: 'bg-type-fighting text-white-1',
  POISON: 'bg-type-poison text-white-1',
  GROUND: 'bg-type-ground text-black-2',
  FLYING: 'bg-type-flying text-black-2',
  PSYCHIC: 'bg-type-psychic text-black-2',
  BUG: 'bg-type-bug text-black-2',
  ROCK: 'bg-type-rock text-white-1',
  GHOST: 'bg-type-ghost text-white-1',
  DRAGON: 'bg-type-dragon text-white-1',
  DARK: 'bg-type-dark text-white-1',
  STEEL: 'bg-type-steel text-black-2',
  FAIRY: 'bg-type-fairy text-black-2',
}

interface TagComponentProps {
  type: PokemonType
}

const TagComponent = ({ type }: TagComponentProps) => {
  return (
    <span
      className={`block text-center w-12 desktop:w-14 h-5 desktop:h-6 leading-[calc(1.25rem+2px)] desktop:leading-[calc(1.5rem+2px)] px-1.5 desktop:px-2 rounded-lg text-2xs desktop:text-xs font-semibold ${TYPE_COLOR[type]}`}
    >
      {PokemonTypes[type]}
    </span>
  )
}

export default TagComponent
