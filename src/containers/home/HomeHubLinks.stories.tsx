import type { Meta, StoryObj } from '@storybook/nextjs'

import HomeHubLinksContainer from './HomeHubLinks.container'

const meta = {
  title: 'Containers/HomeHubLinks',
  component: HomeHubLinksContainer,
  parameters: {
    layout: 'fullscreen',
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component: [
          '홈 허브 링크 섹션 — 콘텐츠 축 6개(도감·타입상성·기술·특성·챔피언스·퀴즈) 진입 타일 (UX-003 섹션 2 신설).',
          '',
          'SectionHeading + HubLinkCard×6. 모바일 2열 → 데스크톱 3열. 정적 콘텐츠라 항상 렌더 — 동적 첫 섹션(챔피언스)이 비어도 폴드 콘텐츠를 보장한다.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HomeHubLinksContainer>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 (데스크톱 3열) */
export const Default: Story = {}

/** 모바일 (2열 그리드) */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
}
