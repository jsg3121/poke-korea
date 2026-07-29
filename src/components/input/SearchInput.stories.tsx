import type { Meta, StoryObj } from '@storybook/nextjs'

import SearchInputComponent from './SearchInput.component'

/** 입력 컨트롤은 진한 네이비 배경(primary-1) 위에서 쓰이므로 그 맥락으로 렌더한다. */
const NavyBg = (Story: React.ComponentType) => (
  <div className="bg-primary-1 p-6 w-80">
    <Story />
  </div>
)

const meta = {
  title: 'Components/SearchInput',
  component: SearchInputComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '검색 입력 (DS 원자). `<input type="search">` 래퍼.',
          '',
          'SelectInput과 같은 밝은 컨트롤 톤(진한 배경 위에서 떠 보임). 색은 등록된 토큰만 사용 — 기존 인라인 검색의 gray/blue 비토큰 색을 정규화.',
          '',
          '검색 로직(디바운스·쿼리 바인딩)은 사용처 책임. label은 필수(접근성), 기본 sr-only.',
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
} satisfies Meta<typeof SearchInputComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 (라벨 sr-only, placeholder만 노출) */
export const Default: Story = {}

/** 라벨 노출 */
export const VisibleLabel: Story = {
  args: { visuallyHiddenLabel: false },
}

/** 입력값 있음 */
export const Filled: Story = {
  args: { defaultValue: '하이드로펌프' },
}

/** 비활성 */
export const Disabled: Story = {
  args: { defaultValue: '검색 불가', disabled: true },
}
