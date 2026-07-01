import type { Meta, StoryObj } from '@storybook/nextjs'

import ChampionsSubNavOrganism from './ChampionsSubNav.organism'

/**
 * usePathname을 nextjs navigation 목킹으로 주입해 active 상태를 story별로 렌더한다
 * (Storybook 10 + @storybook/nextjs App Router 지원).
 */
const meta = {
  title: 'Organisms/ChampionsSubNav',
  component: ChampionsSubNavOrganism,
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
} satisfies Meta<typeof ChampionsSubNavOrganism>

export default meta
type Story = StoryObj<typeof meta>

/** 홈 active (/champions/vgc) */
export const HomeActive: Story = {
  parameters: { nextjs: { navigation: { pathname: '/champions/vgc' } } },
}

/** 도감 active (/champions/vgc/list) */
export const ListActive: Story = {
  parameters: { nextjs: { navigation: { pathname: '/champions/vgc/list' } } },
}

/** 티어 active (/champions/vgc/tier) */
export const TierActive: Story = {
  parameters: { nextjs: { navigation: { pathname: '/champions/vgc/tier' } } },
}

/** 대회 active (/champions/tournaments) */
export const TournamentsActive: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/champions/tournaments' } },
  },
}

/** 모바일 뷰 (flex-1 균등 배분, 12px — 스크롤 없이 꽉) */
export const MobileView: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/champions/vgc/list' } },
    viewport: { defaultViewport: 'mobile' },
  },
}
