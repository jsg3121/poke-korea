import type { Meta, StoryObj } from '@storybook/nextjs'

import AbilityCardSkeletonComponent from './AbilityCardSkeleton.component'

/**
 * 특성 카드 스켈레톤. 무한스크롤 추가 로드 중 그리드 끝에 표시해 카드 자리를 예약한다.
 * AbilityCard와 크기·셸을 맞춰 로드 완료 시 CLS를 방지한다.
 */
const meta = {
  title: 'Components/AbilityCardSkeleton',
  component: AbilityCardSkeletonComponent,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: [
          '특성 카드 로딩 스켈레톤 (DS). 무한스크롤 추가 로드 중 그리드 끝에 표시.',
          '',
          'AbilityCard와 크기·셸(bg-primary-4 / border-2 primary-1 / rounded-xl / min-h-40)을 맞춰 CLS를 방지한다. 포켓몬 카드 스켈레톤과 셸이 달라(이미지·타입 없음) 별도로 둔다. 장식이라 aria-hidden.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AbilityCardSkeletonComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 */
export const Default: Story = {}

/** 그리드 로딩 — 실제 무한스크롤에서 여러 개가 동시에 나타나는 모습 */
export const LoadingGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 desktop:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] desktop:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <AbilityCardSkeletonComponent key={i} />
      ))}
    </div>
  ),
}
