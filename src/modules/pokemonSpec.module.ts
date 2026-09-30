export const UNKNOWN_LABEL = '불명'

export const CAPTURE_RATE_MAX = 255

type SpecValue = number | null | undefined

export const formatHeight = (height: SpecValue): string => {
  if (height === null || height === undefined) return UNKNOWN_LABEL
  return `${(height / 10).toFixed(1)}m`
}

export const formatWeight = (weight: SpecValue): string => {
  if (weight === null || weight === undefined) return UNKNOWN_LABEL
  return `${(weight / 10).toFixed(1)}kg`
}

export const formatNumber = (value: SpecValue): string => {
  if (value === null || value === undefined) return UNKNOWN_LABEL
  return value.toLocaleString('ko-KR')
}

export type GenderRatio =
  | { isGenderless: true }
  | { isGenderless: false; male: number; female: number }

export const parseGenderRate = (genderRate: SpecValue): GenderRatio | null => {
  if (genderRate === null || genderRate === undefined) return null
  if (genderRate === -1) return { isGenderless: true }

  const female = (genderRate / 8) * 100
  return { isGenderless: false, male: 100 - female, female }
}

export const formatGenderPercent = (percent: number): string => {
  return `${Number.isInteger(percent) ? percent : percent.toFixed(1)}%`
}

export const getCaptureRatePercent = (captureRate: SpecValue): number => {
  if (captureRate === null || captureRate === undefined) return 0
  return (captureRate / CAPTURE_RATE_MAX) * 100
}
