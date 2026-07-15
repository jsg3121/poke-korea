import type { Meta, StoryObj } from '@storybook/nextjs'

import MoveListCardSkeletonComponent from './MoveListCardSkeleton.component'

/**
 * 기술 목록 카드 로딩 스켈레톤. 무한스크롤 추가 로드 중 그리드 끝에 표시해
 * 카드 자리를 예약한다 (MoveListCard와 크기 규격 공유 — CLS 방지).
 */
const meta = {
  title: 'Components/MoveListCardSkeleton',
  component: MoveListCardSkeletonComponent,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: [
          '기술 목록 카드 로딩 스켈레톤 (DS). MoveListCard와 셸(min-h-44 / p-3 / border-2 / shadow)을 맞춰 로드 완료 시 레이아웃 밀림(CLS)을 방지한다.',
          '',
          '장식 요소라 aria-hidden — "불러오는 중" 안내(role="status")는 리스트 컨테이너 책임.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MoveListCardSkeletonComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 */
export const Default: Story = {}

/** 그리드 끝 로딩 4개 (실사용 형태) */
export const InGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 desktop:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] desktop:gap-6">
      {Array.from({ length: 4 }, (_, i) => (
        <MoveListCardSkeletonComponent key={i} />
      ))}
    </div>
  ),
}
