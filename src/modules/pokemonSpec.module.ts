/**
 * 포켓몬 기본 제원(1.58.0) 표시 변환 모듈.
 *
 * 백엔드는 부동소수 오차를 피하려고 원천 정수를 그대로 내려준다
 * (height=데시미터, weight=헥토그램). 표시 단위는 CLAUDE.md 응답 규칙에 따라
 * 한국 기준(m·kg)을 쓰므로 이 모듈에서 일괄 변환한다.
 *
 * 스키마상 8개 필드가 nullable이라 모든 함수가 null·undefined를 받아
 * `UNKNOWN_LABEL`로 처리한다. 값 없음을 빈 문자열로 두면 화면에서
 * "로딩 실패"와 구분되지 않아 접근성 문제가 된다.
 */

/** 값이 없을 때 표시 문구 — dd를 비우지 않고 명시한다 */
export const UNKNOWN_LABEL = '불명'

/** 포획률 최댓값. 게이지 분모이자 표기의 분모로 함께 노출한다 */
export const CAPTURE_RATE_MAX = 255

type SpecValue = number | null | undefined

/** 데시미터 → m (20 → "2.0m") */
export const formatHeight = (height: SpecValue): string => {
  if (height === null || height === undefined) return UNKNOWN_LABEL
  return `${(height / 10).toFixed(1)}m`
}

/** 헥토그램 → kg (1000 → "100.0kg") */
export const formatWeight = (weight: SpecValue): string => {
  if (weight === null || weight === undefined) return UNKNOWN_LABEL
  return `${(weight / 10).toFixed(1)}kg`
}

/** 천단위 구분 (1059860 → "1,059,860"). 육성 계산에 쓰는 값이라 축약하지 않는다 */
export const formatNumber = (value: SpecValue): string => {
  if (value === null || value === undefined) return UNKNOWN_LABEL
  return value.toLocaleString('ko-KR')
}

export type GenderRatio =
  | { isGenderless: true }
  | { isGenderless: false; male: number; female: number }

/**
 * 성비 코드 → 암수 비율.
 *
 * -1은 무성이고, 그 외는 8분의 N이 암컷 비율이다(0=수컷100%, 4=5:5, 8=암컷100%).
 * 비율 계산에 쓰이므로 문자열이 아니라 수치로 반환하고, 포맷은 뷰가 맡는다.
 */
export const parseGenderRate = (genderRate: SpecValue): GenderRatio | null => {
  if (genderRate === null || genderRate === undefined) return null
  if (genderRate === -1) return { isGenderless: true }

  const female = (genderRate / 8) * 100
  return { isGenderless: false, male: 100 - female, female }
}

/** 성비 퍼센트 표기 (87.5 → "87.5%", 100 → "100%") — 정수는 소수점을 붙이지 않는다 */
export const formatGenderPercent = (percent: number): string => {
  return `${Number.isInteger(percent) ? percent : percent.toFixed(1)}%`
}

/**
 * 포획률 게이지 채움 비율(%).
 *
 * captureRate/255는 "255 만점 중 현재값"이라는 척도상 위치이며,
 * 실제 포획 확률과는 다른 개념이다(확률은 체력·볼·상태이상에 따라 달라진다).
 * 확률을 함께 표기하면 게이지 비율과 어긋나 오해를 유발하므로 노출하지 않는다.
 */
export const getCaptureRatePercent = (captureRate: SpecValue): number => {
  if (captureRate === null || captureRate === undefined) return 0
  return (captureRate / CAPTURE_RATE_MAX) * 100
}
