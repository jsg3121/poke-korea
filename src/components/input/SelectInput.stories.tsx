import type { Meta, StoryObj } from '@storybook/nextjs'

import SelectInputComponent from './SelectInput.component'

/** 입력 컨트롤은 진한 네이비 배경(primary-1) 위에서 쓰이므로 그 맥락으로 렌더한다. */
const NavyBg = (Story: React.ComponentType) => (
  <div className="bg-primary-1 p-6">
    <Story />
  </div>
)

const SORT_OPTIONS = [
  { value: 'usage', label: '사용률순' },
  { value: 'dex', label: '도감번호순' },
] as const

/** 제네릭 컴포넌트를 구체 인스턴스(value 유니온)로 고정해 Meta 타입을 잡는다. */
const SelectInput = SelectInputComponent<'usage' | 'dex'>

/** 데모용 no-op 변경 핸들러 */
const noopChange = () => undefined

const meta = {
  title: 'Components/SelectInput',
  component: SelectInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '셀렉트 입력 (DS 원자). native `<select>` 래퍼.',
          '',
          '서비스 무드의 밝은 컨트롤 톤(진한 배경 위에서 떠 보임). 색은 등록된 토큰만 사용.',
          '',
          'options/value는 제네릭 `<T extends string>`으로 타입 안전 — onChange가 정확한 값 타입을 받는다. label은 필수(접근성), `visuallyHiddenLabel`로 시각적 숨김 가능.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  decorators: [NavyBg],
  args: {
    label: '정렬 기준',
    value: 'usage',
    options: SORT_OPTIONS,
    onChange: noopChange,
  },
} satisfies Meta<typeof SelectInput>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 (라벨 노출) */
export const Default: Story = {}

/** 라벨 숨김 (sr-only) */
export const HiddenLabel: Story = {
  args: { label: '정렬 기준 선택', visuallyHiddenLabel: true, value: 'dex' },
}

/** 비활성 */
export const Disabled: Story = {
  args: { disabled: true },
}
