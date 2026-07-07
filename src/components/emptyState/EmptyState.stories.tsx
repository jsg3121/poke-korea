import type { Meta, StoryObj } from '@storybook/nextjs'

import PokeballIcon from '~/assets/icons/pokeball.svg'
import ButtonComponent from '~/components/button/Button.component'
import EmptyStateComponent from './EmptyState.component'

const noop = () => undefined

const meta = {
  title: 'Components/EmptyState',
  component: EmptyStateComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '빈 상태 (DS). 검색/필터 결과 0건 등을 안내하고 회복 동선(CTA)을 제시한다.',
          '',
          '텍스트만 띄우면 사용자가 이탈한다(NN/g) — action 슬롯에 "필터 초기화" 같은 CTA를 함께 두는 것을 권장. 도감 외 기술/특성 리스트에서도 재사용(아이콘·문구 슬롯).',
        ].join('\n'),
      },
    },
  },
  args: {
    title: '검색 결과에 맞는 포켓몬이 없어요',
    description: '필터 조건을 바꾸거나 초기화해 보세요',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyStateComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 도감 리스트 빈 결과 — 아이콘 + CTA (권장 구성) */
export const Default: Story = {
  args: {
    icon: <PokeballIcon />,
    action: (
      <ButtonComponent variant="secondary" onClick={noop}>
        필터 초기화
      </ButtonComponent>
    ),
  },
}

/** 텍스트만 (아이콘·CTA 없음) */
export const TextOnly: Story = {}
