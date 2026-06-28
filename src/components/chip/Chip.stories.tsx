import type { Meta, StoryObj } from '@storybook/nextjs'

import ChipComponent from './Chip.component'

const meta = {
  title: 'Components/Chip',
  component: ChipComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '칩 (DS 원자). 라벨 + 색을 가진 작은 라벨/필터 칩.',
          '',
          '`color` 있으면 데미지 유형(물리/특수/변화) 색 칩, 없으면 기본(무색) 칩(세대 칩 등).',
          '',
          '`clickable=false`(기본) → 순수 표시(`span`). `clickable=true` → 클릭 가능(`button`, active/hover 피드백).',
          '',
          '포켓몬 타입 18종 라벨은 Tag 컴포넌트가 담당한다 — Chip과 역할이 다르다. 색은 등록된 토큰만 사용.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  args: { label: '물리', color: 'physical' },
  argTypes: {
    color: {
      control: 'select',
      options: [undefined, 'physical', 'special', 'status'],
    },
    clickable: { control: 'boolean' },
    active: { control: 'boolean' },
  },
} satisfies Meta<typeof ChipComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 데미지 유형 색 칩 (표시 전용) */
export const Physical: Story = { args: { label: '물리', color: 'physical' } }
export const Special: Story = { args: { label: '특수', color: 'special' } }
export const Status: Story = { args: { label: '변화', color: 'status' } }

/** 기본(무색) 칩 — color 없음. 세대 칩 등 */
export const Default: Story = { args: { label: '1세대', color: undefined } }

/** 색 4종 한눈 비교 (표시 전용) */
export const AllColors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ChipComponent label="물리" color="physical" />
      <ChipComponent label="특수" color="special" />
      <ChipComponent label="변화" color="status" />
      <ChipComponent label="1세대" />
    </div>
  ),
}

/** 클릭형 칩 — 선택/미선택 (필터 용도). 그룹 간격 24px(gap-6) 확보 */
export const Clickable: Story = {
  args: {
    clickable: true,
    active: true,
  },

  render: () => (
    <div className="flex items-center gap-6">
      <ChipComponent label="물리" color="physical" clickable active />
      <ChipComponent label="특수" color="special" clickable />
      <ChipComponent label="변화" color="status" clickable />
    </div>
  ),
}

/** 클릭형 무색 칩 (세대 필터) */
export const ClickableDefault: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <ChipComponent label="1세대" clickable active />
      <ChipComponent label="2세대" clickable />
      <ChipComponent label="3세대" clickable />
    </div>
  ),
}
