import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'

import QuizResultPopup from './QuizResultPopup.component'

const meta = {
  title: 'Components/QuizResultPopup',
  component: QuizResultPopup,
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component: [
          '퀴즈 결과 팝업. 정답/오답 결과와 정답 표시, 다음 퀴즈로 이동 링크를 담은 다이얼로그.',
          '',
          'Portal로 body 밖(containerId=id)에 렌더되고 딤 오버레이 클릭 또는 닫기 버튼으로 닫힌다. 오답일 때만 정답을 노출한다.',
          '',
          'quizType(ability/silhouette/pokemon-type)에 따라 이동 링크와 라벨이 바뀐다. 아래 각 예시는 "결과 팝업 열기" 버튼으로 열고, 닫기 버튼/딤 클릭으로 닫는다.',
        ].join('\n'),
      },
    },
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

const ToggleablePopup = (
  args: React.ComponentProps<typeof QuizResultPopup>,
) => {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex min-h-40 items-center justify-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-primary-1 px-4 py-2 text-primary-4"
      >
        결과 팝업 열기
      </button>
      {open && <QuizResultPopup {...args} onClose={() => setOpen(false)} />}
    </div>
  )
}

export const Correct: Story = {
  render: (args) => <ToggleablePopup {...args} />,
  args: {
    onClose: () => undefined,
    id: 'quiz-result-correct',
    quizType: 'silhouette',
    answer: '피카츄',
    isCorrect: true,
  },
}

export const Incorrect: Story = {
  render: (args) => <ToggleablePopup {...args} />,
  args: {
    onClose: () => undefined,
    id: 'quiz-result-incorrect',
    quizType: 'silhouette',
    answer: '피카츄',
    isCorrect: false,
  },
}

export const AbilityIncorrect: Story = {
  render: (args) => <ToggleablePopup {...args} />,
  args: {
    onClose: () => undefined,
    id: 'quiz-result-ability',
    quizType: 'ability',
    isCorrect: false,
    answer: '가속',
  },
}

export const PokemonTypeCorrect: Story = {
  render: (args) => <ToggleablePopup {...args} />,
  args: {
    onClose: () => undefined,
    id: 'quiz-result-type',
    quizType: 'pokemon-type',
    answer: '물',
    isCorrect: true,
  },
}
