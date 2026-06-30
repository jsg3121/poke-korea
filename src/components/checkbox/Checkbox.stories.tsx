import type { Meta, StoryObj } from '@storybook/nextjs'

import CheckboxComponent from './Checkbox.component'

/** 체크박스는 진한 네이비 배경(primary-1) 위에서 쓰이므로 그 맥락으로 렌더한다. */
const NavyBg = (Story: React.ComponentType) => (
  <div className="bg-primary-1 p-6">
    <Story />
  </div>
)

const meta = {
  title: 'Components/Checkbox',
  component: CheckboxComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '체크박스 (DS 원자). 커스텀 포켓볼 그래픽으로 체크 상태를 표시한다.',
          '',
          '체크 시 빈 박스 위로 포켓볼(Ball)이 나타난다(빈 박스는 고정, 포켓볼만 scale). label 전체가 클릭 영역.',
          '',
          'Radio와 같은 패턴 — 차이는 박스 모양(사각)과 크기(16px). id는 useId로 자동 생성, 색은 토큰만 사용.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  decorators: [NavyBg],
  args: { label: '옵션' },
} satisfies Meta<typeof CheckboxComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 미체크 */
export const Unchecked: Story = {}

/** 체크됨 */
export const Checked: Story = {
  args: { defaultChecked: true, label: '체크된 옵션' },
}

/** 비활성 */
export const Disabled: Story = {
  args: { disabled: true, label: '비활성 옵션' },
}

/** 그룹 (다중 선택 — 각자 독립) */
export const Group: Story = {
  render: () => (
    <fieldset className="flex flex-col gap-3 border-0 p-0">
      <legend className="sr-only">세대 선택</legend>
      <CheckboxComponent name="gen" value="1" label="1세대" defaultChecked />
      <CheckboxComponent name="gen" value="2" label="2세대" />
      <CheckboxComponent name="gen" value="3" label="3세대" defaultChecked />
    </fieldset>
  ),
}
