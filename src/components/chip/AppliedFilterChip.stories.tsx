import type { Meta, StoryObj } from '@storybook/nextjs'

import AppliedFilterChip from './AppliedFilterChip.component'

const noop = () => undefined

const meta = {
  title: 'Components/AppliedFilterChip',
  component: AppliedFilterChip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '적용 필터 칩 (DS). 현재 적용된 필터를 목록 상단에 상시 노출하고 개별 해제(X)를 제공한다.',
          '',
          '적용 필터가 보이지 않으면 사용자가 결과를 오해한다(Baymard, RES-002). 시각 규격은 Chip 기본 칩과 일치(h-7·rounded-lg·bg-primary-3), 제거 버튼은 실제 button + 24px(WCAG AA 하한).',
        ].join('\n'),
      },
    },
  },
  args: { label: '불꽃', onRemove: noop },
  tags: ['autodocs'],
} satisfies Meta<typeof AppliedFilterChip>

export default meta
type Story = StoryObj<typeof meta>

/** 단일 */
export const Default: Story = {}

/** 적용 필터 로우 — 타입+모달 필터 혼합 (flex-wrap, 상위가 간격 확보) */
export const FilterRow: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <AppliedFilterChip label="불꽃" onRemove={noop} />
      <AppliedFilterChip label="비행" onRemove={noop} />
      <AppliedFilterChip label="3세대" onRemove={noop} />
      <AppliedFilterChip label="메가진화 포함" onRemove={noop} />
    </div>
  ),
}
