import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'

import SegmentedControl from './SegmentedControl.component'

type StatsView = 'base' | 'real'

const ITEMS = [
  { key: 'base', label: '종족값' },
  { key: 'real', label: 'Lv50 실수치' },
] as const

const noop = () => undefined

const CardBg = (Story: React.ComponentType) => (
  <div className="w-80 bg-primary-4 p-6 desktop:w-128">
    <Story />
  </div>
)

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl<StatsView>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '밝은 배경(카드 `bg-primary-4`) 위에서 쓰는 단일 선택 토글 버튼 묶음 (DS 원자).',
          '',
          '탭 패턴(`role="tab"`)이 아니라 `role="group"` + 버튼 `aria-pressed` 토글이다. 화살표 키 이동 없이 Tab·Enter·Space로 조작한다.',
          '',
          '남색 배경 위 전환은 `TabItem` fill을 쓴다. 그 활성 색(`primary-4`)은 카드 배경과 같아 카드 안에서는 보이지 않는다.',
          '',
          '모바일은 전폭, 데스크톱은 288px. 버튼 모서리는 트랙 모서리 − 안쪽 여백(4px)이다.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  decorators: [CardBg],
  args: {
    label: '능력치 보기 방식',
    items: ITEMS,
    value: 'base',
    onChange: noop,
  },
} satisfies Meta<typeof SegmentedControl<StatsView>>

export default meta
type Story = StoryObj<typeof meta>

const ToggleableControl = (
  args: React.ComponentProps<typeof SegmentedControl<StatsView>>,
) => {
  const [value, setValue] = useState<StatsView>('base')
  return <SegmentedControl {...args} value={value} onChange={setValue} />
}

export const FirstSelected: Story = {}

export const SecondSelected: Story = {
  args: { value: 'real' },
}

export const Interactive: Story = {
  render: (args) => <ToggleableControl {...args} />,
}
