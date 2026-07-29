import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'
import TypeMatchupComponent from './TypeMatchup.component'

const meta = {
  title: 'Components/TypeMatchup',
  component: TypeMatchupComponent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          '타입 상성 (DS). 방어 상성 배율별 타입 그룹을 약점/강점 두 섹션으로 동시 노출한다 — 기존 강점/약점 토글(비교 정보 반쪽 숨김, 탭 회피 원칙 모순)을 대체.',
          '',
          '약점 우선 배치, 배율은 색(grade-* 토큰)+기호 병기. 빈 배율 행은 생략. 상세 페이지와 타입 상성 계산기가 공유한다.',
        ].join('\n'),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="rounded-2xl bg-primary-4 p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof TypeMatchupComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 리자몽(불꽃/비행) — 전 배율 행이 존재하는 케이스 */
export const Default: Story = {
  args: {
    quad: [PokemonType.ROCK],
    double: [PokemonType.WATER, PokemonType.ELECTRIC],
    half: [
      PokemonType.FIGHTING,
      PokemonType.STEEL,
      PokemonType.FAIRY,
      PokemonType.FIRE,
    ],
    quarter: [PokemonType.GRASS, PokemonType.BUG],
    zero: [PokemonType.GROUND],
  },
}

/** 피카츄(전기) — ×4·×0.25·×0 없음(빈 행 생략 확인) */
export const SingleType: Story = {
  args: {
    quad: [],
    double: [PokemonType.GROUND],
    half: [PokemonType.FLYING, PokemonType.STEEL, PokemonType.ELECTRIC],
    quarter: [],
    zero: [],
  },
}
