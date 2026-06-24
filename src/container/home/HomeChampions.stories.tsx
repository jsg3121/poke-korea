import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'
import HomeChampionsContainer from './HomeChampions.container'

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

const topPokemons = [
  makeChampion(
    149,
    '망나뇽',
    ['DRAGON', 'FLYING'] as PokemonType[],
    'S',
    51.05,
    54.12,
  ),
  makeChampion(
    445,
    '한카리아스',
    ['DRAGON', 'GROUND'] as PokemonType[],
    'A',
    32.8,
    48.5,
  ),
  makeChampion(
    462,
    '자포코일',
    ['ELECTRIC', 'STEEL'] as PokemonType[],
    'B',
    12.4,
    null,
  ),
  makeChampion(
    887,
    '드래펄트',
    ['DRAGON', 'GHOST'] as PokemonType[],
    'S',
    48.2,
    52.1,
  ),
]

const meta = {
  title: 'Containers/HomeChampions',
  component: HomeChampionsContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '홈 "인기 챔피언스 포켓몬" 섹션 (반응형 단일, DS 컴포넌트 조립).',
          'SectionHeading + HorizontalScrollList + ChampionsCard + CTA. 기존 desktop/mobile 2벌을 대체한다.',
          '',
          '모바일 좌우 여백은 표준 gutter px-5(20px). CTA는 터치 타겟(min-h-touch) 보장.',
        ].join('\n'),
      },
    },
  },
  args: { topPokemons },
} satisfies Meta<typeof HomeChampionsContainer>

export default meta
type Story = StoryObj<typeof meta>

/** 데스크톱 — max-w-1280 안에서 가로 스크롤 + CTA */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
}

/** 모바일 — gutter px-5, 카드 축소로 peek */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
}
