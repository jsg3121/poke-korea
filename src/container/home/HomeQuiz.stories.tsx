import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'
import HomeQuizContainer from './HomeQuiz.container'

const dailyQuiz = {
  __typename: 'DailyQuizPreview' as const,
  date: '2026-06-24',
  silhouetteQuiz: {
    __typename: 'SilhouetteQuizQuestion' as const,
    id: 'silhouette-1',
    question: '이 실루엣은 어떤 포켓몬일까요?',
    correctPokemonId: 1,
    correctAnswerIndex: 0,
    options: ['이상해씨', '꼬부기', '파이리', '피카츄'],
  },
  abilityQuiz: {
    __typename: 'AbilityQuizQuestion' as const,
    id: 'ability-1',
    question: '다음 설명에 해당하는 특성은?',
    abilityDescription: '비가 내리는 동안 물 타입 기술의 위력이 강해진다.',
    correctAnswerIndex: 0,
    options: [
      {
        __typename: 'AbilityOption' as const,
        koreanName: '잔비',
        englishName: 'Drizzle',
      },
      {
        __typename: 'AbilityOption' as const,
        koreanName: '가뭄',
        englishName: 'Drought',
      },
      {
        __typename: 'AbilityOption' as const,
        koreanName: '모래날림',
        englishName: 'Sand Stream',
      },
      {
        __typename: 'AbilityOption' as const,
        koreanName: '눈퍼뜨리기',
        englishName: 'Snow Warning',
      },
    ],
  },
  typeQuiz: {
    __typename: 'PokemonTypeQuizQuestion' as const,
    id: 'type-1',
    question: '주어진 타입의 포켓몬을 골라주세요!',
    targetType: 'WATER' as PokemonType,
    correctAnswerIndex: 1,
    options: [
      {
        __typename: 'PokemonOption' as const,
        id: 1,
        koreanName: '이상해씨',
        types: ['GRASS', 'POISON'] as PokemonType[],
      },
      {
        __typename: 'PokemonOption' as const,
        id: 7,
        koreanName: '꼬부기',
        types: ['WATER'] as PokemonType[],
      },
      {
        __typename: 'PokemonOption' as const,
        id: 4,
        koreanName: '파이리',
        types: ['FIRE'] as PokemonType[],
      },
      {
        __typename: 'PokemonOption' as const,
        id: 25,
        koreanName: '피카츄',
        types: ['ELECTRIC'] as PokemonType[],
      },
    ],
  },
}

const meta = {
  title: 'Containers/HomeQuiz',
  component: HomeQuizContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '홈 "오늘의 퀴즈" 섹션 (반응형 단일, DS 컴포넌트 조립).',
          'SectionHeading + QuizCard ×3(실루엣/특성/타입). 각 카드는 QuizCard DS 셸 + useCorrectQuizCheck 로직.',
          '',
          '데스크톱 3열 / 모바일 1열, gutter px-5. 답안 클릭 시 정답 모달이 뜬다.',
        ].join('\n'),
      },
    },
  },
  args: { dailyQuiz },
} satisfies Meta<typeof HomeQuizContainer>

export default meta
type Story = StoryObj<typeof meta>

/** 데스크톱 — 3열 그리드 */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
}

/** 모바일 — 1열 세로 스택, gutter px-5 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
}
