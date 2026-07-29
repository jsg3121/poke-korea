import type { Meta, StoryObj } from '@storybook/nextjs'

import PageHeaderComponent from './PageHeader.component'

/** 페이지 헤더는 진한 네이비 배경(primary-1) 위, 페이지 상단에 놓인다. */
const PageBg = (Story: React.ComponentType) => (
  <div className="bg-primary-1 px-5 pt-4 w-[420px] desktop:w-[800px]">
    <Story />
  </div>
)

const meta = {
  title: 'Components/PageHeader',
  component: PageHeaderComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '페이지 헤더 (DS 원자). 페이지 상단의 제목 + 설명 영역.',
          '',
          '데/모 2벌을 CSS 반응형 단일로 통합(모바일 퍼스트: 제목 text-3xl→4xl, 설명 text-sm→xl). 색·폰트는 토큰만 사용.',
          '',
          '좌우 gutter는 부모(페이지)가 준다(`w-full`). 데스크톱 폭에서 더 크게 표시된다.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  decorators: [PageBg],
  args: {
    title: '포켓몬 도감',
    description: '모든 포켓몬의 정보를 한눈에 확인하세요',
  },
} satisfies Meta<typeof PageHeaderComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 */
export const Default: Story = {}

/** 긴 설명 (줄바꿈) */
export const LongDescription: Story = {
  args: {
    title: '타입 상성',
    description:
      '공격 타입과 방어 타입의 상성을 표로 정리했습니다. 2배·0.5배·0배 효과를 한눈에 확인하세요.',
  },
}
