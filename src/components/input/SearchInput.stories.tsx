import type { Meta, StoryObj } from '@storybook/nextjs'

import SearchInput from './SearchInput.component'

const NavyBg = (Story: React.ComponentType) => (
  <div className="bg-primary-1 p-6 w-80">
    <Story />
  </div>
)

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '검색 입력 (DS 원자). `<input>` 래퍼, 기본 `type="search"`.',
          '',
          'SelectInput과 같은 밝은 컨트롤 톤(진한 배경 위에서 떠 보임). 색은 등록된 토큰만 사용 — 기존 인라인 검색의 gray/blue 비토큰 색을 정규화.',
          '',
          '글자는 `text-md`(16px 고정) — iOS Safari가 16px 미만 입력에 포커스하면 화면을 확대하기 때문. 포커스 링은 진한 배경에서 보이도록 `primary-4`.',
          '',
          '검색 로직(디바운스·쿼리 바인딩)은 사용처 책임. label은 필수(접근성), 기본 sr-only. 나머지 input 속성(`role`·`aria-*`·`onKeyDown` 등)과 ref를 그대로 전달하므로 콤보박스 입력으로도 쓴다. 콤보박스 입력에는 `type="text"`를 쓴다.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  decorators: [NavyBg],
  args: {
    label: '기술 검색',
    placeholder: '기술 이름으로 검색하세요',
  },
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const VisibleLabel: Story = {
  args: { visuallyHiddenLabel: false },
}

export const Filled: Story = {
  args: { defaultValue: '하이드로펌프' },
}

export const Disabled: Story = {
  args: { defaultValue: '검색 불가', disabled: true },
}

export const TextTypeWithVisibleLabel: Story = {
  args: {
    label: '포켓몬 이름으로 찾기',
    visuallyHiddenLabel: false,
    type: 'text',
    placeholder: '예: 리자몽',
    autoComplete: 'off',
  },
}
