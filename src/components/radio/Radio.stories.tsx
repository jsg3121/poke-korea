import type { Meta, StoryObj } from '@storybook/nextjs'

import RadioComponent from './Radio.component'

/** 라디오는 진한 네이비 배경(primary-1) 위에서 쓰이므로 그 맥락으로 렌더한다. */
const NavyBg = (Story: React.ComponentType) => (
  <div className="bg-primary-1 p-6">
    <Story />
  </div>
)

const meta = {
  title: 'Components/Radio',
  component: RadioComponent,
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
} satisfies Meta<typeof RadioComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 미선택 */
export const Unchecked: Story = {}

/** 선택됨 */
export const Checked: Story = {
  args: { defaultChecked: true, label: '선택된 옵션' },
}

/** 비활성 */
export const Disabled: Story = {
  args: { disabled: true, label: '비활성 옵션' },
}

/** 그룹 (같은 name 공유) */
export const Group: Story = {
  render: () => (
    <fieldset className="flex flex-col gap-3 border-0 p-0">
      <legend className="sr-only">포맷 선택</legend>
      <RadioComponent
        name="format"
        value="vgc"
        label="VGC 더블"
        defaultChecked
      />
      <RadioComponent name="format" value="bss" label="BSS 싱글" />
      <RadioComponent name="format" value="etc" label="기타" />
    </fieldset>
  ),
}
