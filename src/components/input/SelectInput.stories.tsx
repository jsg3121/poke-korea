import type { Meta, StoryObj } from '@storybook/nextjs'

import SelectInputComponent from './SelectInput.component'

const NavyBg = (Story: React.ComponentType) => (
  <div className="bg-primary-1 p-6">
    <Story />
  </div>
)

const SORT_OPTIONS = [
  { value: 'usage', label: '사용률순' },
  { value: 'dex', label: '도감번호순' },
] as const

const SelectInput = SelectInputComponent<'usage' | 'dex'>

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

export const Default: Story = {}

export const HiddenLabel: Story = {
  args: { label: '정렬 기준 선택', visuallyHiddenLabel: true, value: 'dex' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
