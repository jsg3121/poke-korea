import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'
import ChampionsCardComponent from './ChampionsCard.component'

const makeChampion = (
  pokemonId: number,
  name: string,
  types: PokemonType[],
  tier: string,
  usageRate: number,
  winRate: number | null,
) => ({
  __typename: 'ChampionsMetaStats' as const,
  pokemonId,
  formType: null,
  formCode: null,
  name,
  formName: null,
  region: null,
  imagePath: String(pokemonId),
  types,
  typePrimary: types[0],
  typeSecondary: types[1] ?? null,
  usageRate,
  usageRank: 1,
  winRate,
  tier,
  isStale: false,
  updatedAt: '2026-06-24',
})

const meta = {
  title: 'Components/ChampionsCard',
  component: ChampionsCardComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '챔피언스 메타 포켓몬 카드. PokemonCard와 같은 셸(PokemonCardShell)을 공유하되, 챔피언스 포인트를 얹는다.',
          '',
          '- 티어별 아웃라인(S=금/A=은/B=동/C=에메랄드/D=회색), 포켓볼 위 티어 랭크 뱃지.',
          '- 본문은 스탯 대신 사용률·승률. 승률은 null 가능 → "-".',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  args: { formatSlug: 'vgc' as const, isHighPriority: true },
} satisfies Meta<typeof ChampionsCardComponent>

export default meta
type Story = StoryObj<typeof meta>

/** S 티어 (금색 아웃라인) */
export const TierS: Story = {
  args: {
    pokemonData: makeChampion(
      149,
      '망나뇽',
      ['DRAGON', 'FLYING'] as PokemonType[],
      'S',
      51.05,
      54.12,
    ),
  },
}

/** A 티어 (은색 아웃라인) */
export const TierA: Story = {
  args: {
    pokemonData: makeChampion(
      445,
      '한카리아스',
      ['DRAGON', 'GROUND'] as PokemonType[],
      'A',
      32.8,
      48.5,
    ),
  },
}

/** B 티어 (동색 아웃라인) */
export const TierB: Story = {
  args: {
    pokemonData: makeChampion(
      462,
      '자포코일',
      ['ELECTRIC', 'STEEL'] as PokemonType[],
      'B',
      12.4,
      null,
    ),
  },
}

/** 승률 null — "-" 표시 확인 */
export const NoWinRate: Story = {
  args: {
    pokemonData: makeChampion(
      887,
      '드래펄트',
      ['DRAGON', 'GHOST'] as PokemonType[],
      'S',
      48.2,
      null,
    ),
  },
}
