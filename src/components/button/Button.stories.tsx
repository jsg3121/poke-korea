import type { Meta, StoryObj } from '@storybook/nextjs'

import ButtonComponent from './Button.component'

const meta = {
  title: 'Components/Button',
  component: ButtonComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '액션 버튼 (DS 원자). 클릭 액션용 `<button>`. 이동용 CTA는 LinkButton.',
          '',
          'variant(primary/secondary/ghost) · size(sm/md/lg) · fullWidth · showArrow. 토큰 기반, 터치 타겟 min-h-touch(44px) 보장. 시각 스타일은 LinkButton과 공유(buttonStyle).',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  args: { children: '버튼' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    showArrow: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof ButtonComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '챔피언스 전체 도감 보기',
    showArrow: true,
  },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: '다시 풀기' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: '취소' },
}

export const Disabled: Story = {
  args: { variant: 'primary', children: '비활성', disabled: true },
}

/** size 3종 비교 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <ButtonComponent {...args} size="sm">
        Small
      </ButtonComponent>
      <ButtonComponent {...args} size="md">
        Medium
      </ButtonComponent>
      <ButtonComponent {...args} size="lg">
        Large
      </ButtonComponent>
    </div>
  ),
}

/** variant 3종 비교 */
export const AllVariants: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <ButtonComponent {...args} variant="primary">
        Primary
      </ButtonComponent>
      <ButtonComponent {...args} variant="secondary">
        Secondary
      </ButtonComponent>
      <ButtonComponent {...args} variant="ghost">
        Ghost
      </ButtonComponent>
    </div>
  ),
}

/** 전체 폭 */
export const FullWidth: Story = {
  args: { variant: 'primary', children: '퀴즈 시작', fullWidth: true },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}
