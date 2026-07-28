import type { Meta, StoryObj } from '@storybook/nextjs'

import ChampionsFormatTabOrganism from './ChampionsFormatTab.organism'

/**
 * TabItem(fill href)이 next/link를 쓰므로 appDirectory 목킹으로 렌더한다.
 * currentFormat을 바꿔 active 표시를 story별로 확인한다.
 */
const meta = {
  title: 'Organisms/ChampionsFormatTab',
  component: ChampionsFormatTabOrganism,
  parameters: {
    layout: 'padded',
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component: [
          '챔피언스 포맷 선택 탭 (organism). TabItem(fill) 원자를 배열로 조립.',
          '',
          '선택 항목을 배경 채움(알약)으로 표시하는 컨텐츠 전환 탭이라 TabItem fill variant가 맞는다. 기존 인라인 알약 Link(border-2·rounded-full 임의 스타일)를 DS 규격으로 재구축했다.',
          '',
          '색·모서리·터치타겟은 TabItem 규격을 따른다. viewport로 모바일↔데스크톱 패딩/폰트 차등을 확인하세요.',
        ].join('\n'),
      },
    },
  },
  args: {
    currentFormat: 'double',
    basePath: '/champions',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChampionsFormatTabOrganism>

export default meta
type Story = StoryObj<typeof meta>

/** VGC active */
export const DoubleActive: Story = { args: { currentFormat: 'double' } }

/** BSS active */
export const SingleActive: Story = { args: { currentFormat: 'single' } }

/** suffix 경로 예시 (도감 하위) */
export const WithSuffix: Story = {
  args: { currentFormat: 'double', suffix: '/list' },
}

/** 모바일 뷰 (패딩·폰트 축소) */
export const MobileView: Story = {
  parameters: { viewport: { defaultViewport: 'mobile' } },
}
