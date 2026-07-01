import type { Meta, StoryObj } from '@storybook/nextjs'

import FilterModalOrganism from './FilterModal.organism'

/**
 * useRouter/useSearchParams/usePathname를 nextjs navigation 목킹으로 주입한다
 * (Storybook 10 + @storybook/nextjs App Router 지원). query에 값을 넣으면 해당 필터가
 * 초기 선택된 상태로 렌더된다.
 */
const noop = () => undefined

const meta = {
  title: 'Organisms/FilterModal',
  component: FilterModalOrganism,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/pokemons/list' },
    },
    docs: {
      description: {
        component: [
          '추가 필터 검색 모달 (organism). CloseIconButton·Checkbox·RadioGroup·Button 원자를 조립하고, 필터 폼(react-hook-form)과 URL 쿼리 동기화를 담당한다.',
          '',
          '데/모 2벌(크기만 다른 사실상 복붙)을 CSS 반응형 단일로 통합. 모바일 퍼스트 — base는 풀스크린 시트, 데스크톱(desktop:)은 중앙 고정 카드(28rem)다. 딤은 Portal로 body 밖 portal-root에 렌더된다.',
          '',
          'viewport를 Mobile/Desktop으로 바꿔 시트↔카드 전환을 확인하세요.',
        ].join('\n'),
      },
    },
  },
  args: {
    open: true,
    onClose: noop,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterModalOrganism>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 — 선택 없음 (데스크톱 중앙 카드) */
export const Default: Story = {}

/** 일부 필터가 선택된 초기 상태 (query 주입) */
export const WithSelection: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/pokemons/list',
        query: { generation: ['1', '3'], isMega: 'true', isRegion: 'all' },
      },
    },
  },
}

/** 모바일 뷰 (풀스크린 시트) */
export const MobileView: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
