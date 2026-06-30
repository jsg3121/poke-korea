import type { Meta, StoryObj } from '@storybook/nextjs'

import BallComponent from './Ball.component'

const meta = {
  title: 'Components/Ball',
  component: BallComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '포켓볼 그래픽 (DS 원자). 포켓몬 서비스의 브랜드 자산.',
          '',
          '카드 장식, 폼 컨트롤(Radio/Checkbox) 체크 표시 등에 쓰인다. 추후 UI 개선 시 로딩·빈 상태·강조 아이콘 등으로 재사용할 수 있다.',
          '',
          '`size`로 크기를 고른다(모바일 퍼스트 차등 내장: lg 24→32, md 20→24, sm 16). size 없으면 부모 크기에 맞춘다(`w-full h-full`).',
          '',
          '색은 포켓볼 그래픽 전용이라 토큰화하지 않는다(공유 안 되는 단일 그래픽 디테일).',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg', undefined] },
  },
} satisfies Meta<typeof BallComponent>

export default meta
type Story = StoryObj<typeof meta>

/** lg — 24→32px (카드 현행) */
export const Large: Story = { args: { size: 'lg' } }

/** md — 20→24px */
export const Medium: Story = { args: { size: 'md' } }

/** sm — 16px (체크박스·토글 등) */
export const Small: Story = { args: { size: 'sm' } }

/** size별 비교 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <BallComponent size="sm" />
      <BallComponent size="md" />
      <BallComponent size="lg" />
    </div>
  ),
}

/** 부모 크기에 맞춤 (size 없음) — 카드 등에서 부모가 크기를 정할 때 */
export const FitParent: Story = {
  args: {
    size: 'md',
  },

  render: () => (
    <div className="flex items-end gap-4">
      <span className="block w-10 h-10">
        <BallComponent />
      </span>
      <span className="block w-16 h-16">
        <BallComponent />
      </span>
    </div>
  ),
}
