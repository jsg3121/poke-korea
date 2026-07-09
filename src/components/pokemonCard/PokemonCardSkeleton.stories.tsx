import type { Meta, StoryObj } from '@storybook/nextjs'

import PokemonCardSkeletonComponent from './PokemonCardSkeleton.component'

const meta = {
  title: 'Components/PokemonCardSkeleton',
  component: PokemonCardSkeletonComponent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          '포켓몬 카드 로딩 스켈레톤. 리스트 추가 로드(더보기/자동 로드) 중 그리드 끝에 표시.',
          '',
          'PokemonCardShell과 크기 SSOT(POKEMON_CARD_SIZE)를 공유 — 로딩 자리와 실카드 크기가 어긋나면 CLS가 발생하므로 규격을 한 곳에서만 가져온다(모바일 w-36/데스크톱 w-56).',
          '',
          '장식 요소라 aria-hidden — "불러오는 중" 알림(role="status")은 리스트 컨테이너 책임.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PokemonCardSkeletonComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 단일 */
export const Default: Story = {}

/** 리스트 로딩 상황 — 그리드 끝에 스켈레톤 이어붙기 (모바일 2열 → 데스크톱 5열) */
export const InGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center desktop:grid-cols-5">
      <PokemonCardSkeletonComponent />
      <PokemonCardSkeletonComponent />
      <PokemonCardSkeletonComponent />
      <PokemonCardSkeletonComponent />
    </div>
  ),
}

/** 모바일 뷰 (2열, 340px대에서도 max-w-full로 클립 방지) */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
  render: () => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center">
      <PokemonCardSkeletonComponent />
      <PokemonCardSkeletonComponent />
    </div>
  ),
}
