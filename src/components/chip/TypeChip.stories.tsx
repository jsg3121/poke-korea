import type { Meta, StoryObj } from '@storybook/nextjs'

import TypeChipComponent from './TypeChip.component'

const noop = () => undefined

/**
 * 타입 필터 칩 (아이콘 토글). 텍스트 Chip과 별개 — 타입 아이콘을 grayscale↔컬러로 토글하는
 * 선택 컨트롤이다. 라벨은 모바일 항상 표시, 데스크톱 hover/focus 시에만(viewport로 확인).
 */
const meta = {
  title: 'Components/TypeChip',
  component: TypeChipComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '타입 필터 칩 (DS 원자). 포켓몬 18종 타입 중 하나의 **선택 가능한 아이콘 토글**(checkbox 시맨틱, 다중 선택).',
          '',
          '색 라벨 표시용 Chip/Tag와 역할이 다르다 — 타입 아이콘 SVG를 grayscale↔컬러로 토글하는 필터 컨트롤이다.',
          '',
          '라벨은 CSS 반응형 단일: 모바일 항상 표시, 데스크톱 hover/focus-visible 시에만 노출(DOM엔 항상 유지 → SR이 항상 읽음). viewport를 Mobile/Desktop으로 바꿔 확인하세요.',
        ].join('\n'),
      },
    },
  },
  args: { value: 'FIRE', label: '불꽃', active: false, onChange: noop },
  argTypes: {
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TypeChipComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 미선택 (흐린 흑백) */
export const Inactive: Story = { args: { active: false } }

/** 선택됨 (컬러 + 볼드 라벨) */
export const Active: Story = { args: { active: true } }

/** 잠금 (최대 선택 도달 시 미선택 항목) */
export const Disabled: Story = { args: { active: false, disabled: true } }

/** 그룹 배치 (필터 바 예시) — 일부 선택 */
export const Group: Story = {
  render: () => (
    <div className="flex items-start gap-2">
      <TypeChipComponent value="FIRE" label="불꽃" active onChange={noop} />
      <TypeChipComponent value="WATER" label="물" active onChange={noop} />
      <TypeChipComponent
        value="GRASS"
        label="풀"
        active={false}
        disabled
        onChange={noop}
      />
      <TypeChipComponent
        value="ELECTRIC"
        label="전기"
        active={false}
        disabled
        onChange={noop}
      />
    </div>
  ),
}

/** 모바일 뷰 (라벨 항상 표시) */
export const MobileView: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
  args: { active: true },
}
