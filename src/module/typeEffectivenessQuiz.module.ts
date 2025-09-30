import { TypeEffectivenessQuizQuestion } from '~/types/quiz.type'
import { PokemonType } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { relationList } from '~/module/calculateRelationType'

// 타입을 한글명으로 변환
export const getKoreanTypeName = (type: PokemonType): string => {
  return PokemonTypes[type] || type
}

// 모든 포켓몬 타입 목록
export const getAllPokemonTypes = (): PokemonType[] => {
  return Object.values(PokemonType)
}

// 공격 타입 기준으로 방어 타입에 대한 효과 계산
export const calculateAttackEffectiveness = (
  attackingType: PokemonType,
  defendingTypes: PokemonType[],
): number => {
  // 공격 타입별 상성 테이블을 기존 relationList에서 생성
  const getAttackMultiplier = (
    attackType: PokemonType,
    defenseType: PokemonType,
  ): number => {
    // relationList에서 방어 타입의 정보를 찾음
    const defenseData = relationList.find((item) => item.type === defenseType)
    if (!defenseData) return 1

    // 공격 타입이 방어 타입에게 주는 효과 확인
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

// 효과 배수를 문자열로 변환
export const getEffectivenessText = (effectiveness: number): string => {
  if (effectiveness === 0) return '0x (효과 없음)'
  if (effectiveness === 0.25) return '0.25x (매우 약함)'
  if (effectiveness === 0.5) return '0.5x (약함)'
  if (effectiveness === 1) return '1x (보통)'
  if (effectiveness === 2) return '2x (강함)'
  if (effectiveness === 4) return '4x (매우 강함)'
  return `${effectiveness}x`
}

// 타입 상성 퀴즈 문제 생성 함수
export const generateTypeEffectivenessQuestions = (
  count: number = 20,
): TypeEffectivenessQuizQuestion[] => {
  const questions: TypeEffectivenessQuizQuestion[] = []
  const allTypes = getAllPokemonTypes()

  for (let i = 0; i < count; i++) {
    // 랜덤하게 공격 타입 선택
    const attackingType = allTypes[Math.floor(Math.random() * allTypes.length)]

    // 랜덤하게 방어 타입 1~2개 선택
    const defendingTypeCount = Math.random() < 0.6 ? 1 : 2 // 60% 확률로 단일 타입
    const defendingTypes: PokemonType[] = []

    for (let j = 0; j < defendingTypeCount; j++) {
      let defendingType: PokemonType
      do {
        defendingType = allTypes[Math.floor(Math.random() * allTypes.length)]
      } while (defendingTypes.includes(defendingType))

      defendingTypes.push(defendingType)
    }

    // 정답 계산
    const correctEffectiveness = calculateAttackEffectiveness(
      attackingType,
      defendingTypes,
    )

    // 옵션 생성 (정답 + 오답 3개)
    const possibleEffectiveness = [0, 0.25, 0.5, 1, 2, 4]
    const options: string[] = []

    // 정답 추가
    options.push(getEffectivenessText(correctEffectiveness))

    // 오답 3개 추가
    while (options.length < 4) {
      const randomEffectiveness =
        possibleEffectiveness[
          Math.floor(Math.random() * possibleEffectiveness.length)
        ]
      const optionText = getEffectivenessText(randomEffectiveness)

      if (!options.includes(optionText)) {
        options.push(optionText)
      }
    }

    // 옵션 섞기
    for (let k = options.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1))
      ;[options[k], options[j]] = [options[j], options[k]]
    }

    const correctAnswerIndex = options.indexOf(
      getEffectivenessText(correctEffectiveness),
    )

    // 문제 텍스트 생성
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
