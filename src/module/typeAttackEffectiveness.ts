import { TYPE_EFFECTIVENESS_CHART } from '~/constants/typeEffectivenessChart'
import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'

/**
 * 공격 상성 — "이 타입으로 공격할 때" 배율별 상대 타입 목록.
 *
 * ## 왜 새로 만들었나
 *
 * 방어 상성은 `calculateRelationType`(`~/module/calculateRelationType`)이 이미
 * 있고 `TypeMatchupProps`와 1:1로 맞지만, **공격 방향으로 배율별 타입 배열을
 * 산출하는 함수는 없었다.** 기존 `calculateAttackEffectiveness`
 * (`~/module/typeEffectivenessQuiz.module`)는 퀴즈 전용으로 배수 하나만 반환한다.
 *
 * ## 데이터 원천 주의 — 상성 SSOT가 둘이다
 *
 * - `calculateRelationType`의 `relationList` — **방어 관점**(받는 데미지)
 * - `TYPE_EFFECTIVENESS_CHART` — `[공격타입][방어타입]` **공격 방향 인덱싱**
 *
 * 공격 상성은 chart를 쓰는 게 자연스럽다(한 줄 순회로 끝난다). 단 **chart의 키는
 * `PokemonTypes`(한글 값 enum)이고 GraphQL·컴포넌트는 `PokemonType`(영문 enum)**
 * 이라 경계에서 변환이 필요하다. 이 함수가 그 변환을 흡수해, 호출부는 영문 enum만
 * 다루면 된다.
 */

/** 공격 배율별 상대 타입. 1배는 담지 않는다(표에서도 빈 칸이라 정보가 없다). */
export interface AttackEffectiveness {
  /** ×2 — 효과가 굉장하다 */
  double: Array<PokemonType>
  /** ×0.5 — 효과가 별로다 */
  half: Array<PokemonType>
  /** ×0 — 효과가 없다 */
  zero: Array<PokemonType>
}

/** 영문 enum → 한글 enum(chart 키). */
const toChartKey = (type: PokemonType): PokemonTypes => PokemonTypes[type]

/** 한글 enum(chart 키) → 영문 enum. chart 순회 결과를 되돌린다. */
const fromChartKey = (label: PokemonTypes): PokemonType =>
  Object.values(PokemonType).find(
    (type) => PokemonTypes[type] === label,
  ) as PokemonType

/**
 * 해당 타입이 **공격할 때** 2배·0.5배·0배가 되는 상대 타입을 배율별로 모은다.
 *
 * 단일 타입 대 단일 타입 기준이다(상성표와 같은 기준). 복합 타입 상대의 곱연산은
 * 계산기(`/type-effectiveness`)가 담당하므로 여기서 다루지 않는다.
 */
export const calculateAttackEffectiveness = (
  attackType: PokemonType,
): AttackEffectiveness => {
  const row = TYPE_EFFECTIVENESS_CHART[toChartKey(attackType)]

  const result: AttackEffectiveness = { double: [], half: [], zero: [] }

  ;(Object.keys(row) as Array<PokemonTypes>).forEach((defenseLabel) => {
    const value = row[defenseLabel]

    if (value === 2) {
      result.double.push(fromChartKey(defenseLabel))
    } else if (value === 0.5) {
      result.half.push(fromChartKey(defenseLabel))
    } else if (value === 0) {
      result.zero.push(fromChartKey(defenseLabel))
    }
  })

  return result
}
