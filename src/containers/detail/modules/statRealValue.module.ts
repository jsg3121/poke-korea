import type { PokemonStats } from '~/graphql/typeGenerated'

type NatureModifier = 'up' | 'neutral' | 'down'

export type StatKey = Exclude<keyof PokemonStats, '__typename' | 'total'>

interface RealStatValues {
  noInvestment: number
  maxInvestment: number
  maxBoosted: number
}

export type RealStatColumn = keyof RealStatValues

type RealStatTable = Record<StatKey, RealStatValues>

interface ColumnExtremes {
  max: number
  min: number
}

const STAT_KEYS: ReadonlyArray<StatKey> = [
  'hp',
  'attack',
  'defense',
  'specialAttack',
  'specialDefense',
  'speed',
]

const HP_OFFSET = 75
const STAT_OFFSET = 20
const MAX_INVESTMENT = 32
const FIXED_HP = 1
const BAR_MAX_PADDING = 20

const NATURE_RATE: Record<NatureModifier, number> = {
  up: 11,
  neutral: 10,
  down: 9,
}

/**
 * Lv50·개체값 31 기준 HP 실수치.
 *
 * @remarks
 * - 종족값 HP가 1(껍질몬)이면 투자와 관계없이 1이다.
 *
 * @param base 종족값
 * @param investment 투자분 — 능력 포인트 수, 노력치로는 floor(floor(노력치 / 4) / 2)
 * @returns HP 실수치
 */
export const getRealHp = (base: number, investment: number): number => {
  if (base === FIXED_HP) return FIXED_HP
  return base + HP_OFFSET + investment
}

/**
 * Lv50·개체값 31 기준 HP 외 능력치의 실수치.
 *
 * @remarks
 * - 성격 보정은 정수 연산 후 한 번만 내림한다 — 1.1·0.9 소수 곱의 부동소수점 오차를 피한다.
 *
 * @param base 종족값
 * @param investment 투자분 — 능력 포인트 수, 노력치로는 floor(floor(노력치 / 4) / 2)
 * @param nature 성격 보정
 * @returns 실수치
 */
export const getRealStat = (
  base: number,
  investment: number,
  nature: NatureModifier,
): number => {
  return Math.floor(
    ((base + STAT_OFFSET + investment) * NATURE_RATE[nature]) / 10,
  )
}

const getStatValues = (base: number): RealStatValues => ({
  noInvestment: getRealStat(base, 0, 'neutral'),
  maxInvestment: getRealStat(base, MAX_INVESTMENT, 'neutral'),
  maxBoosted: getRealStat(base, MAX_INVESTMENT, 'up'),
})

/**
 * 상세 능력치 탭의 실수치 표 — 무투자 / 최대 투자 / 최대 투자 + 상승 성격.
 *
 * @remarks
 * - HP는 성격 보정이 없어 `maxBoosted`가 `maxInvestment`와 같다.
 *
 * @param stats 종족값
 * @returns 능력치별 실수치 3종
 */
export const getRealStatTable = (stats: PokemonStats): RealStatTable => {
  const maxHp = getRealHp(stats.hp, MAX_INVESTMENT)

  return {
    hp: {
      noInvestment: getRealHp(stats.hp, 0),
      maxInvestment: maxHp,
      maxBoosted: maxHp,
    },
    attack: getStatValues(stats.attack),
    defense: getStatValues(stats.defense),
    specialAttack: getStatValues(stats.specialAttack),
    specialDefense: getStatValues(stats.specialDefense),
    speed: getStatValues(stats.speed),
  }
}

/**
 * 실수치 표의 열 하나에서 최댓값과 최솟값.
 *
 * @param table 실수치 표
 * @param column 열
 * @returns 그 열의 최댓값·최솟값
 */
export const getRealStatColumnExtremes = (
  table: RealStatTable,
  column: RealStatColumn,
): ColumnExtremes => {
  const values = STAT_KEYS.map((key) => table[key][column])
  return { max: Math.max(...values), min: Math.min(...values) }
}

/**
 * 실수치 막대 길이의 기준값 — 표 전체 최댓값 + 20.
 *
 * @param table 실수치 표
 * @returns 막대 100%에 해당하는 값
 */
export const getRealStatBarMax = (table: RealStatTable): number => {
  const values = STAT_KEYS.map((key) => table[key].maxBoosted)
  return Math.max(...values) + BAR_MAX_PADDING
}
