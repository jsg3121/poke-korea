import type { Meta, StoryObj } from '@storybook/nextjs'

import ChampionsSubNav from './ChampionsSubNav.component'

const meta = {
  title: 'Organisms/ChampionsSubNav',
  component: ChampionsSubNav,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component: [
          '챔피언스 상단 서브네비 (organism). TabItem(underline) 원자를 배열로 조립.',
          '',
          '데/모 2벌을 CSS 반응형 단일로 통합(모바일 h-12·top-16 → 데스크톱 h-10·top-28). 모바일은 flex-1 균등 배분(12px)으로 스크롤 없이 화면을 꽉 채우고, 데스크톱은 좌측 정렬 자연폭이다.',
          '',
          'viewport를 Mobile/Desktop으로 바꿔 반응형을 확인하세요. pathname에 따라 active 항목이 바뀝니다.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChampionsSubNav>

export default meta
type Story = StoryObj<typeof meta>

export const HomeActive: Story = {
  parameters: { nextjs: { navigation: { pathname: '/champions/double' } } },
}

export const ListActive: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/champions/double/list' } },
  },
}

export const TierActive: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/champions/double/tier' } },
  },
}

export const TournamentsActive: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/champions/tournaments' } },
  },
}

export const Mobile: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/champions/double/list' } },
    viewport: { defaultViewport: 'mobile' },
  },
}
