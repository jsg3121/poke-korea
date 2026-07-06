import type { Meta, StoryObj } from '@storybook/nextjs'

import SectionHeadingComponent from './SectionHeading.component'

const meta = {
  title: 'Components/SectionHeading',
  component: SectionHeadingComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '섹션 제목 타이포그래피 (반응형 단일, 모바일 퍼스트). text-2xl desktop:text-4xl — 모바일 좁은 폭(340px대)에서 30px는 과대해 24px로 규격. 여백·sticky 등 레이아웃은 부모가 책임진다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text', description: '제목 텍스트' },
    id: { control: 'text', description: 'aria-labelledby 연결용 id' },
  },
} satisfies Meta<typeof SectionHeadingComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '오늘의 포켓몬',
  },
}

export const LongText: Story = {
  args: {
    children: '인기 챔피언스 포켓몬',
  },
}
