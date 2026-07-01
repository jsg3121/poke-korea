import type { Meta, StoryObj } from '@storybook/nextjs'

import FilterBarOrganism from './FilterBar.organism'

/**
 * useRouter/useSearchParams/usePathname를 nextjs navigation 목킹으로 주입한다
 * (Storybook 10 + @storybook/nextjs App Router 지원). query.type에 값을 넣으면 해당
 * 타입 칩이 선택된 상태로 렌더된다.
 */
const meta = {
  title: 'Organisms/FilterBar',
  component: FilterBarOrganism,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/list' },
    },
    docs: {
      description: {
        component: [
          '도감 타입 필터 바 (organism). TypeChip(18종) 가로 스크롤 + 필터 버튼 + 초기화 버튼 + FilterModal(organism)을 조립하고, 타입 필터 URL 쿼리 동기화를 담당한다.',
          '',
          '데/모 2벌(레이아웃이 크게 다름)을 CSS 반응형 단일로 통합. 모바일 퍼스트 — base는 칩 스크롤 줄 + 하단 액션 바, 데스크톱(desktop:)은 한 줄 정렬이다. 타입은 최대 2개까지 선택(그 이상은 미선택 항목 잠금).',
          '',
          '필터 버튼을 누르면 FilterModal이 열립니다. viewport를 Mobile/Desktop으로 바꿔 반응형을 확인하세요.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterBarOrganism>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 — 선택 없음 (초기화 비활성) */
export const Default: Story = {}

/** 타입 2개 선택 (나머지 잠금, 초기화 활성) */
export const TwoTypesSelected: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/list',
        query: { type: 'FIRE,WATER' },
      },
    },
  },
}

/** 모바일 뷰 (칩 스크롤 줄 + 하단 액션 바) */
export const MobileView: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/list', query: { type: 'GRASS' } },
    },
    viewport: { defaultViewport: 'mobile' },
  },
}
