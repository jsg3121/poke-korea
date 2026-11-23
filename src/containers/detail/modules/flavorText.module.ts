import { TActiveType } from '~/types/detailContext.types'
import { PokemonDetailQuery, PokemonFormType } from '~/graphql/typeGenerated'

type FlavorTexts = NonNullable<
  PokemonDetailQuery['getPokemonDetail']
>['flavorTexts']
type FlavorTextRow = FlavorTexts[number]

export interface FlavorTextEntry {
  versionNames: Array<string>
  flavorText: string
}

export interface FlavorTextGroup {
  versionGroupId: number
  displayName: string
  isLatest: boolean
  entries: Array<FlavorTextEntry>
}

export interface FlavorTextGeneration {
  generationId: number
  groups: Array<FlavorTextGroup>
}

export interface FlavorTextSection {
  isFallback: boolean
  generations: Array<FlavorTextGeneration>
}

const ACTIVE_FORM_TYPE: Record<TActiveType, PokemonFormType> = {
  normal: PokemonFormType.NORMAL_FORM,
  region: PokemonFormType.REGION_FORM,
  mega: PokemonFormType.MEGA,
  gigantamax: PokemonFormType.GIGANTAMAX,
}

/**
 * 기본 페이지는 BASE와 NORMAL_FORM 0번을 함께 본다 — 러브로스 화신폼처럼
 * 노말폼 0번이 기본 모습인 종은 BASE 행이 없다.
 */
const isBaseRow = (row: FlavorTextRow): boolean =>
  row.forms.some(
    ({ formType, formIndex }) =>
      formIndex === 0 &&
      (formType === PokemonFormType.BASE ||
        formType === PokemonFormType.NORMAL_FORM),
  )

const isActiveFormRow = (
  row: FlavorTextRow,
  activeType: TActiveType,
  activeIndex: number,
): boolean => {
  if (activeType === 'normal' && activeIndex === 0) return isBaseRow(row)
  return row.forms.some(
    ({ formType, formIndex }) =>
      formType === ACTIVE_FORM_TYPE[activeType] && formIndex === activeIndex,
  )
}

const toGenerations = (
  rows: Array<FlavorTextRow>,
): Array<FlavorTextGeneration> => {
  const generations: Array<FlavorTextGeneration> = []

  rows.forEach(({ versionName, flavorText, versionGroup }) => {
    const text = flavorText.trim()
    if (text === '') return

    let generation = generations.find(
      (item) => item.generationId === versionGroup.generationId,
    )
    if (!generation) {
      generation = { generationId: versionGroup.generationId, groups: [] }
      generations.push(generation)
    }

    let group = generation.groups.find(
      (item) => item.versionGroupId === versionGroup.versionGroupId,
    )
    if (!group) {
      group = {
        versionGroupId: versionGroup.versionGroupId,
        displayName: versionGroup.displayName ?? versionGroup.nameKo,
        isLatest: versionGroup.isLatest ?? false,
        entries: [],
      }
      generation.groups.push(group)
    }

    const entry = group.entries.find((item) => item.flavorText === text)
    if (!entry) {
      group.entries.push({ versionNames: [versionName], flavorText: text })
      return
    }
    if (!entry.versionNames.includes(versionName)) {
      entry.versionNames.push(versionName)
    }
  })

  return generations
}

/**
 * 활성 폼에 해당하는 도감 설명을 세대 → 버전 그룹 → 문장 단위로 묶는다.
 *
 * @remarks
 * - 활성 폼 전용 설명이 없으면 기본 모습 설명으로 대체하고 `isFallback`을 켠다.
 * - 순서는 서버 응답(최신 버전 그룹 순)을 그대로 따른다.
 * - 같은 버전 그룹 안에서 문장이 같은 버전은 한 항목으로 합친다.
 */
export const getFlavorTextSection = ({
  flavorTexts,
  activeType,
  activeIndex,
}: {
  flavorTexts: FlavorTexts
  activeType: TActiveType
  activeIndex: number
}): FlavorTextSection => {
  const activeRows = flavorTexts.filter((row) =>
    isActiveFormRow(row, activeType, activeIndex),
  )

  if (activeRows.length > 0) {
    return { isFallback: false, generations: toGenerations(activeRows) }
  }

  return {
    isFallback: true,
    generations: toGenerations(flavorTexts.filter(isBaseRow)),
  }
}
