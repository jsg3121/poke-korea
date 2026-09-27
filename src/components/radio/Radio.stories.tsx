import type { Meta, StoryObj } from '@storybook/nextjs'

import Radio from './Radio.component'

const NavyBg = (Story: React.ComponentType) => (
  <div className="bg-primary-1 p-6">
    <Story />
  </div>
)

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '라디오 (DS 원자). 커스텀 포켓볼 그래픽으로 선택 상태를 표시한다.',
          '',
          '선택 시 빈 원이 사라지고 포켓볼(Ball)이 나타난다. label 전체가 클릭 영역이라 텍스트를 눌러도 선택된다.',
          '',
          '그룹은 같은 `name`을 공유한다. id는 useId로 자동 생성. 색은 등록된 토큰만 사용.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  decorators: [NavyBg],
  args: { name: 'demo', label: '옵션', value: 'a' },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Unchecked: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true, label: '선택된 옵션' },
}

export const Disabled: Story = {
  args: { disabled: true, label: '비활성 옵션' },
}

export const Group: Story = {
  render: () => (
    <fieldset className="flex flex-col gap-3 border-0 p-0">
      <legend className="sr-only">포맷 선택</legend>
      <Radio name="format" value="double" label="더블 배틀" defaultChecked />
      <Radio name="format" value="single" label="싱글 배틀" />
      <Radio name="format" value="etc" label="기타" />
    </fieldset>
  ),
}
