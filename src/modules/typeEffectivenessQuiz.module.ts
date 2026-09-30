import { PokemonTypes } from '~/types/pokemonTypes.types'
import { TypeEffectivenessQuizQuestion } from '~/types/quiz.type'
import { PokemonType } from '~/graphql/typeGenerated'
import { relationList } from '~/modules/calculateRelationType.module'

const pickRandom = <T>(list: ReadonlyArray<T>, fallback: T): T =>
  list[Math.floor(Math.random() * list.length)] ?? fallback

export const getKoreanTypeName = (type: PokemonType): string => {
  return PokemonTypes[type] || type
}

export const getAllPokemonTypes = (): PokemonType[] => {
  return Object.values(PokemonType)
}

export const calculateAttackEffectiveness = (
  attackingType: PokemonType,
  defendingTypes: PokemonType[],
): number => {
  const getAttackMultiplier = (
    attackType: PokemonType,
    defenseType: PokemonType,
  ): number => {
    const defenseData = relationList.find((item) => item.type === defenseType)
    if (!defenseData) return 1

    if (defenseData.invalidity.includes(attackType)) return 0
    if (defenseData.double.includes(attackType)) return 2
    if (defenseData.half.includes(attackType)) return 0.5
    return 1
  }

  let totalEffectiveness = 1
  defendingTypes.forEach((defenseType) => {
    totalEffectiveness *= getAttackMultiplier(attackingType, defenseType)
  })

  return totalEffectiveness
}

export const getEffectivenessText = (effectiveness: number): string => {
  if (effectiveness === 0) return '0x (효과 없음)'
  if (effectiveness === 0.25) return '0.25x (매우 약함)'
  if (effectiveness === 0.5) return '0.5x (약함)'
  if (effectiveness === 1) return '1x (보통)'
  if (effectiveness === 2) return '2x (강함)'
  if (effectiveness === 4) return '4x (매우 강함)'
  return `${effectiveness}x`
}

export const generateTypeEffectivenessQuestions = (
  count: number = 20,
): TypeEffectivenessQuizQuestion[] => {
  const questions: TypeEffectivenessQuizQuestion[] = []
  const allTypes = getAllPokemonTypes()

  for (let i = 0; i < count; i++) {
    const attackingType = pickRandom(allTypes, PokemonType.NORMAL)

    const defendingTypeCount = Math.random() < 0.6 ? 1 : 2 // 60% 확률로 단일 타입
    const defendingTypes: PokemonType[] = []

    for (let j = 0; j < defendingTypeCount; j++) {
      let defendingType: PokemonType
      do {
        defendingType = pickRandom(allTypes, PokemonType.NORMAL)
      } while (defendingTypes.includes(defendingType))

      defendingTypes.push(defendingType)
    }

    const correctEffectiveness = calculateAttackEffectiveness(
      attackingType,
      defendingTypes,
    )

    const possibleEffectiveness = [0, 0.25, 0.5, 1, 2, 4]
    const options: string[] = []

    options.push(getEffectivenessText(correctEffectiveness))

    while (options.length < 4) {
      const randomEffectiveness = pickRandom(possibleEffectiveness, 1)
      const optionText = getEffectivenessText(randomEffectiveness)

      if (!options.includes(optionText)) {
        options.push(optionText)
      }
    }

    for (let k = options.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1))
      const swap = options[k]
      const target = options[j]
      if (swap !== undefined && target !== undefined) {
        options[k] = target
        options[j] = swap
      }
    }

    const correctAnswerIndex = options.indexOf(
      getEffectivenessText(correctEffectiveness),
    )

    const defendingTypeNames = defendingTypes.map((type) =>
      getKoreanTypeName(type),
    )
    const questionText =
      defendingTypes.length === 1
        ? `${getKoreanTypeName(attackingType)} 타입 공격이 ${defendingTypeNames[0]} 타입에게 주는 데미지 배수는?`
        : `${getKoreanTypeName(attackingType)} 타입 공격이 ${defendingTypeNames.join('/')} 복합 타입에게 주는 데미지 배수는?`

    questions.push({
      id: `type-effectiveness-${i + 1}`,
      question: questionText,
      options,
      correctAnswerIndex,
      attackingType,
      defendingTypes,
      effectiveness: correctEffectiveness,
    })
  }

  return questions
}
