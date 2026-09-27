import type { Meta, StoryObj } from '@storybook/nextjs'

import StatBar from './StatBar.component'

const CHARIZARD_STATS = [
  { label: '체력', value: 78 },
  { label: '공격', value: 84 },
  { label: '특수공격', value: 109 },
  { label: '방어', value: 78 },
  { label: '특수방어', value: 85 },
  { label: '스피드', value: 100 },
]

const meta = {
  title: 'Components/StatBar',
  component: StatBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '종족값 가로 막대 (DS). 레이더(canvas) 차트를 대체하는 DOM 기반 시각화 — 수치가 실제 텍스트라 스크린리더가 개별 값을 읽는다.',
          '',
          '막대 최댓값은 "최고 능력치 + 20"(동적). 최고/최저는 색 + 텍스트 마커 병기(색 단독 의존 금지), 동률이면 전부 마킹. 뷰포트 진입 시 카운트업 모션(1회, reduced-motion 시 자동 생략, SSR엔 최종값 렌더).',
        ].join('\n'),
      },
    },
  },
  args: {
    stats: CHARIZARD_STATS,
  },
  decorators: [
    (Story) => (
      <div className="w-80 rounded-2xl bg-primary-4 p-4 desktop:w-96">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof StatBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoMotion: Story = {
  args: { animated: false },
}

export const WithoutTotal: Story = {
  args: { animated: false, showTotal: false },
}
