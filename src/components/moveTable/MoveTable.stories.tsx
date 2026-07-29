import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'
import MoveTableComponent from './MoveTable.component'

/** 리자몽 레벨업 기술 (LEGENDS Z-A 발췌) — 변화 기술의 위력 없음(-) 케이스 포함 */
const LEVEL_UP_MOVES = [
  {
    condition: '진화',
    name: '불대문자',
    type: PokemonType.FIRE,
    damageClass: 'special' as const,
    power: 110,
    accuracy: 85,
    pp: 5,
  },
  {
    condition: '최초',
    name: '몸통박치기',
    type: PokemonType.NORMAL,
    damageClass: 'physical' as const,
    power: 40,
    accuracy: 100,
    pp: 35,
  },
  {
    condition: '최초',
    name: '울음소리',
    type: PokemonType.NORMAL,
    damageClass: 'status' as const,
    power: null,
    accuracy: 100,
    pp: 40,
  },
  {
    condition: 'Lv.12',
    name: '용의숨결',
    type: PokemonType.DRAGON,
    damageClass: 'special' as const,
    power: 60,
    accuracy: 100,
    pp: 20,
  },
  {
    condition: 'Lv.30',
    name: '화염방사',
    type: PokemonType.FIRE,
    damageClass: 'special' as const,
    power: 90,
    accuracy: 100,
    pp: 15,
  },
]

const meta = {
  title: 'Components/MoveTable',
  component: MoveTableComponent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          '습득 기술 목록 (DS). 반응형 단일 마크업 — 모바일은 컴팩트 2줄 행(가로 스크롤 없음), 데스크톱은 같은 마크업이 display:contents로 정렬된 표 형태가 된다.',
          '',
          '값마다 인라인 라벨(위력/명중/PP)이 있어 스크린리더는 폭과 무관하게 "위력 110"처럼 읽는다(데스크톱 열 헤더는 장식). 타입은 Tag, 분류는 Chip(damage) 조립.',
        ].join('\n'),
      },
    },
  },
  args: {
    moves: LEVEL_UP_MOVES,
    ariaLabel: '레벨업 습득 기술 목록',
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-primary-4 p-2 desktop:p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof MoveTableComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 레벨업 습득 기술 — 뷰포트 폭을 줄이면 2줄 행, 늘리면 정렬 표 */
export const Default: Story = {}

/**
 * 행 클릭 가능 — `href`를 넘기면 행 전체가 그 URL로 가는 stretched-link가
 * 된다(상세 습득 기술 페이지 용). 경로 규칙은 호출부 책임. 미지정 행은 순수 표시(하위 호환).
 */
export const Linkable: Story = {
  args: {
    moves: LEVEL_UP_MOVES.map((move, index) => ({
      ...move,
      href: `/moves/${index + 1}`,
    })),
    ariaLabel: '레벨업 습득 기술 목록 (행 클릭 시 상세 이동)',
  },
}

/** 머신 습득 기술 — 조건 라벨이 '머신'으로 고정되는 케이스 */
export const Machine: Story = {
  args: {
    moves: [
      {
        condition: '머신',
        name: '불꽃펀치',
        type: PokemonType.FIRE,
        damageClass: 'physical',
        power: 75,
        accuracy: 100,
        pp: 15,
      },
      {
        condition: '머신',
        name: '번개펀치',
        type: PokemonType.ELECTRIC,
        damageClass: 'physical',
        power: 75,
        accuracy: 100,
        pp: 15,
      },
      {
        condition: '머신',
        name: '칼춤',
        type: PokemonType.NORMAL,
        damageClass: 'status',
        power: null,
        accuracy: null,
        pp: 20,
      },
    ],
    ariaLabel: '머신 습득 기술 목록',
  },
}
