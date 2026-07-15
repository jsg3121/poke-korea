import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonSkill, PokemonType } from '~/graphql/typeGenerated'
import MoveListCardComponent from './MoveListCard.component'

/**
 * 기술 목록 카드. 기술 도감(/moves) 목록의 기술 항목 하나를 표시하는
 * "이미지 없는 텍스트 카드"(AbilityCard·HubLinkCard와 같은 밝은 카드 문법).
 */
const 몸통박치기: PokemonSkill = {
  __typename: 'PokemonSkill',
  id: '33',
  identifier: 'tackle',
  nameKo: '몸통박치기',
  type: PokemonType.NORMAL,
  power: 40,
  accuracy: 100,
  pp: 35,
  damageType: 'physical',
  firstGenerationId: 1,
  signatureMoves: false,
  zMoves: false,
}

const meta = {
  title: 'Components/MoveListCard',
  component: MoveListCardComponent,
  parameters: {
    layout: 'padded',
    nextjs: { appDirectory: true },
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: [
          '기술 목록 카드 (DS). 기술 도감(/moves) 목록의 기술 항목 하나를 표시한다 (UX-008).',
          '',
          '기술은 이미지가 없는 텍스트 도메인이라 AbilityCard와 같은 밝은 배경(primary-4) + 진한 텍스트 카드 문법을 공유한다. 타입은 Tag, 데미지 분류는 Chip(color) 원자 — MoveTable과 동일한 색 매핑으로 도감 전체에서 분류 색 표현을 통일.',
          '',
          '위력/명중/PP는 dl 3분할(넉넉한 밀도) — 모바일 1열 그리드 확정(UX-008 §10-1)이라 카드 폭이 충분하다.',
        ].join('\n'),
      },
    },
  },
  args: {
    moveData: 몸통박치기,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MoveListCardComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 (물리 기술) */
export const Default: Story = {}

/** 특수 기술 (100만볼트) */
export const Special: Story = {
  args: {
    moveData: {
      ...몸통박치기,
      id: '85',
      identifier: 'thunderbolt',
      nameKo: '100만볼트',
      type: PokemonType.ELECTRIC,
      power: 90,
      accuracy: 100,
      pp: 15,
      damageType: 'special',
    },
  },
}

/** 변화 기술 — 위력 없음(-) */
export const Status: Story = {
  args: {
    moveData: {
      ...몸통박치기,
      id: '112',
      identifier: 'barrier',
      nameKo: '배리어',
      type: PokemonType.PSYCHIC,
      power: null,
      accuracy: null,
      pp: 20,
      damageType: 'status',
    },
  },
}

/** Z기술 배지 */
export const ZMove: Story = {
  args: {
    moveData: {
      ...몸통박치기,
      id: '622',
      identifier: 'breakneck-blitz',
      nameKo: '울트라대시어택',
      type: PokemonType.NORMAL,
      power: 100,
      accuracy: null,
      pp: 1,
      damageType: 'physical',
      zMoves: true,
    },
  },
}

/** 긴 이름 — 제목이 줄바꿈돼도 배지는 유지, 하단 링크와 겹치지 않는다 */
export const LongName: Story = {
  args: {
    moveData: {
      ...몸통박치기,
      id: '719',
      identifier: 'thousand-waves',
      nameKo: '그라운드포스땅고르기파동',
      type: PokemonType.GROUND,
      power: 90,
      accuracy: 100,
      pp: 10,
      damageType: 'physical',
    },
  },
}

/** 목록 그리드 — 모바일 1열 → 데스크톱 auto-fill 다열 (부모 그리드 책임) */
export const ListGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 desktop:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] desktop:gap-6">
      {[
        몸통박치기,
        {
          ...몸통박치기,
          id: '53',
          nameKo: '화염방사',
          type: PokemonType.FIRE,
          power: 90,
          pp: 15,
          damageType: 'special',
        },
        {
          ...몸통박치기,
          id: '89',
          nameKo: '지진',
          type: PokemonType.GROUND,
          power: 100,
          pp: 10,
        },
        {
          ...몸통박치기,
          id: '270',
          nameKo: '도우미',
          type: PokemonType.NORMAL,
          power: null,
          accuracy: null,
          pp: 20,
          damageType: 'status',
        },
      ].map((move) => (
        <MoveListCardComponent key={move.id} moveData={move} />
      ))}
    </div>
  ),
}
