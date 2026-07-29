import type { Meta, StoryObj } from '@storybook/nextjs'

import CloseIconButtonComponent from './CloseIconButton.component'

const noop = () => undefined

const meta = {
  title: 'Components/CloseIconButton',
  component: CloseIconButtonComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '닫기 아이콘 버튼 (DS 원자). 모달/다이얼로그를 닫는 X 아이콘 버튼.',
          '',
          '아이콘만 있으므로 `aria-label`이 필수. color로 배경에 맞는 아이콘 색을 고른다 — dark(밝은 배경용, 기본) / light(진한 배경용).',
          '',
          '터치 영역은 모바일 44px / 데스크톱 36px(시각은 아이콘 24px 중심). 색은 등록된 토큰만 사용.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  args: { onClick: noop, 'aria-label': '팝업 닫기' },
} satisfies Meta<typeof CloseIconButtonComponent>

export default meta
type Story = StoryObj<typeof meta>

/** dark — 진한 아이콘 (밝은 배경 모달용) */
export const Dark: Story = {
  args: { color: 'dark' },
  decorators: [
    (Story) => (
      <div className="bg-primary-4 p-6 rounded-md">
        <Story />
      </div>
    ),
  ],
}

/** light — 밝은 아이콘 (진한 배경 모달용) */
export const Light: Story = {
  args: { color: 'light' },
  decorators: [
    (Story) => (
      <div className="bg-primary-1 p-6 rounded-md">
        <Story />
      </div>
    ),
  ],
}
