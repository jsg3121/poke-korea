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
]

const meta = {
  title: 'Containers/HomeChampions',
  component: HomeChampionsContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '홈 "이번 주 챔피언스 TOP 3" 섹션 (폴드 위, 반응형 단일 — UX-003 개정).',
          'SectionHeading(+포맷 부제) + HorizontalScrollList + ChampionsTopCard×3 + LinkButton(primary) CTA 카드 직하.',
          '',
          '모바일은 가로 스크롤(peek), 데스크톱은 3장이 폭에 들어가 max-w-fit 래퍼로 중앙 정렬. 빈 배열이면 섹션 미렌더(폴드가 광고로 시작하지 않게 광고는 허브 뒤).',
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
