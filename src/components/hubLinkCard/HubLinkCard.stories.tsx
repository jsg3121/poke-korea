import type { Meta, StoryObj } from '@storybook/nextjs'

import AbilityIcon from '~/assets/icons/ability.svg'
import ChampionsIcon from '~/assets/icons/champions.svg'
import MovesListIcon from '~/assets/icons/movesList.svg'
import PokeballIcon from '~/assets/icons/pokeball.svg'
import QuizIcon from '~/assets/icons/quiz.svg'
import TypeEffectivenessIcon from '~/assets/icons/typeEffectiveness.svg'
import HubLinkCardComponent from './HubLinkCard.component'

/**
 * 허브 링크 카드. 홈의 내부 링크 허브 블록(콘텐츠 축 6개 진입 타일)을 구성한다.
 * 아이콘은 MobileTabBar와 같은 SVGR 자산을 슬롯으로 주입한다.
 */
const meta = {
  title: 'Components/HubLinkCard',
  component: HubLinkCardComponent,
  parameters: {
    layout: 'padded',
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component: [
          '허브 링크 카드 (DS). 아이콘 + 제목 + 한 줄 설명을 담은 카테고리 진입 타일 링크.',
          '',
          'LinkButton(텍스트 CTA)과 역할이 다르다 — 서술형 앵커(제목+설명)로 홈의 내부 링크 허브 블록을 구성한다(RES-001 시사점 2, Bulbapedia 타일 패턴). 그리드 배치는 부모 책임.',
          '',
          '표면은 밝은 배경(primary-4) + 진한 텍스트 — 다크 네이비 페이지 셸 위에서 QuizCard·포켓몬 카드와 같은 "밝은 카드" 문법으로 통일. 제목·설명 모두 primary-1(대비 9.7:1, AA) — 위계는 굵기·크기로 구분. 타일 전체가 클릭 영역(터치 타겟 충족).',
        ].join('\n'),
      },
    },
  },
  args: {
    href: '/list',
    title: '포켓몬 도감',
    description: '1025마리 포켓몬 정보 보기',
    icon: <PokeballIcon />,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HubLinkCardComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 (도감 타일) */
export const Default: Story = {}

/** 홈 허브 블록 — 6개 타일, 모바일 2열 → 데스크톱 3열 (부모 그리드 책임) */
export const HomeHubGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 desktop:grid-cols-3">
      <HubLinkCardComponent
        href="/list"
        title="포켓몬 도감"
        description="1025마리 포켓몬 정보 보기"
        icon={<PokeballIcon />}
      />
      <HubLinkCardComponent
        href="/type-effectiveness"
        title="타입 상성"
        description="타입 상성표·배틀 계산기"
        icon={<TypeEffectivenessIcon />}
      />
      <HubLinkCardComponent
        href="/moves"
        title="기술 도감"
        description="기술 위력·명중률 찾아보기"
        icon={<MovesListIcon />}
      />
      <HubLinkCardComponent
        href="/ability"
        title="특성 도감"
        description="특성 효과 한눈에 보기"
        icon={<AbilityIcon />}
      />
      <HubLinkCardComponent
        href="/champions/vgc"
        title="챔피언스"
        description="대회 메타·티어 리스트"
        icon={<ChampionsIcon />}
      />
      <HubLinkCardComponent
        href="/quiz"
        title="포켓몬 퀴즈"
        description="매일 새로운 퀴즈 풀기"
        icon={<QuizIcon />}
      />
    </div>
  ),
}

/** 모바일 뷰 (2열 그리드) */
export const MobileView: Story = {
  globals: { viewport: { value: 'mobile' } },
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <HubLinkCardComponent
        href="/list"
        title="포켓몬 도감"
        description="1025마리 포켓몬 정보 보기"
        icon={<PokeballIcon />}
      />
      <HubLinkCardComponent
        href="/quiz"
        title="포켓몬 퀴즈"
        description="매일 새로운 퀴즈 풀기"
        icon={<QuizIcon />}
      />
    </div>
  ),
}
