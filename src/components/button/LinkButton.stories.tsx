import type { Meta, StoryObj } from '@storybook/nextjs'

import LinkButtonComponent from './LinkButton.component'

const meta = {
  title: 'Components/LinkButton',
  component: LinkButtonComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '링크형 CTA (DS 원자). 이동용 `<Link>`. 클릭 액션은 Button, 페이지 이동은 LinkButton.',
          '',
          '시각 스타일(variant/size/fullWidth/showArrow)은 Button과 공유한다(buttonStyle). 예: "챔피언스 전체 도감 보기" 섹션 CTA.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  args: { href: '#', children: '링크 버튼' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    showArrow: { control: 'boolean' },
  },
} satisfies Meta<typeof LinkButtonComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 섹션 CTA (화살표 동반) — 실제 사용 예 */
export const Primary: Story = {
  args: {
    href: '/champions/double/list',
    children: '챔피언스 전체 도감 보기',
    showArrow: true,
  },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: '더 알아보기', showArrow: true },
}

/** variant 3종 비교 */
export const AllVariants: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <LinkButtonComponent {...args} variant="primary">
        Primary
      </LinkButtonComponent>
      <LinkButtonComponent {...args} variant="secondary">
        Secondary
      </LinkButtonComponent>
      <LinkButtonComponent {...args} variant="ghost">
        Ghost
      </LinkButtonComponent>
    </div>
  ),
}

/** 전체 폭 */
export const FullWidth: Story = {
  args: { children: '전체 도감 보기', fullWidth: true, showArrow: true },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
}
