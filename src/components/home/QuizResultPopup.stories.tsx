import type { Meta, StoryObj } from '@storybook/nextjs'

import QuizResultPopup from './QuizResultPopup.component'

const noop = () => undefined

/**
 * QuizResultPopup은 Portal(containerId=id)로 body 밖에 렌더되고 next/link를 쓴다.
 * appDirectory 목킹으로 링크를 렌더하고, story마다 고유 id를 넘겨 Portal 컨테이너를 분리한다.
 * 딤 오버레이(fixed inset-0)라 layout: 'fullscreen'으로 전체 화면에 표시한다.
 */
const meta = {
  title: 'Components/QuizResultPopup',
  component: QuizResultPopup,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component: [
          '퀴즈 결과 팝업. 정답/오답 결과와 정답 표시, 다음 퀴즈로 이동 링크를 담은 다이얼로그.',
          '',
          'Portal로 body 밖(containerId=id)에 렌더되고 딤 오버레이 클릭 또는 닫기 버튼으로 닫힌다. 오답일 때만 정답을 노출한다.',
          '',
          'quizType(ability/silhouette/pokemon-type)에 따라 이동 링크와 라벨이 바뀐다.',
        ].join('\n'),
      },
    },
  },
  args: {
    onClose: noop,
    quizType: 'silhouette',
    answer: '피카츄',
  },
  argTypes: {
    quizType: {
      control: 'select',
      options: ['ability', 'silhouette', 'pokemon-type'],
    },
    isCorrect: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QuizResultPopup>

export default meta
type Story = StoryObj<typeof meta>

/** 정답 — 초록 체크, 정답 노출 없음 */
export const Correct: Story = {
  args: { id: 'quiz-result-correct', isCorrect: true },
}

/** 오답 — 빨강 X, 정답 노출 */
export const Incorrect: Story = {
  args: { id: 'quiz-result-incorrect', isCorrect: false },
}

/** 특성 퀴즈 오답 (이동 링크 라벨 변화) */
export const AbilityIncorrect: Story = {
  args: {
    id: 'quiz-result-ability',
    quizType: 'ability',
    isCorrect: false,
    answer: '가속',
  },
}

/** 타입 퀴즈 정답 */
export const PokemonTypeCorrect: Story = {
  args: {
    id: 'quiz-result-type',
    quizType: 'pokemon-type',
    isCorrect: true,
  },
}
