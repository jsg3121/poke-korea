import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'
import HomeDailyPokemonContainer from './HomeDailyPokemon.container'

/** mock 포켓몬 카드 데이터 생성 */
const makePokemon = (
  id: number,
  name: string,
  types: PokemonType[],
  stats: [number, number, number, number, number, number],
) => ({
  __typename: 'PokemonList' as const,
  id: String(id),
  number: id,
  name,
  types,
  isRegionForm: false,
  isMegaEvolution: false,
  isGigantamax: false,
  pokemonStats: {
    __typename: 'PokemonStats' as const,
    hp: stats[0],
    attack: stats[1],
    defense: stats[2],
    specialAttack: stats[3],
    specialDefense: stats[4],
    speed: stats[5],
    total: stats.reduce((a, b) => a + b, 0),
  },
})

const dailyPokemon = [
  makePokemon(
    1,
    '이상해씨',
    ['GRASS', 'POISON'] as PokemonType[],
    [45, 49, 49, 65, 65, 45],
  ),
  makePokemon(4, '파이리', ['FIRE'] as PokemonType[], [39, 52, 43, 60, 50, 65]),
  makePokemon(
    7,
    '꼬부기',
    ['WATER'] as PokemonType[],
    [44, 48, 65, 50, 64, 43],
  ),
  makePokemon(
    25,
    '피카츄',
    ['ELECTRIC'] as PokemonType[],
    [35, 55, 40, 50, 50, 90],
  ),
  makePokemon(
    143,
    '잠만보',
    ['NORMAL'] as PokemonType[],
    [160, 110, 65, 65, 110, 30],
  ),
  makePokemon(
    149,
    '망나뇽',
    ['DRAGON', 'FLYING'] as PokemonType[],
    [91, 134, 95, 100, 100, 80],
  ),
]

const meta = {
  title: 'Containers/HomeDailyPokemon',
  component: HomeDailyPokemonContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '홈 "오늘의 포켓몬" 섹션 (반응형 단일, DS 조립 — UX-003 섹션 4).',
          'SectionHeading + HorizontalScrollList + PokemonCard. 기존 desktop/mobile 2벌 컨테이너(HomeBanner)를 대체한다.',
          '',
          '가로 스크롤 단서(다음 카드 peek)는 HorizontalScrollList가 담당. 빈 배열이면 섹션 미렌더. gutter는 px-4 → desktop:px-8.',
        ].join('\n'),
      },
    },
  },
  args: { dailyPokemon },
} satisfies Meta<typeof HomeDailyPokemonContainer>

export default meta
type Story = StoryObj<typeof meta>

/** 데스크톱 — 가로 스크롤 (w-56 카드) */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
}

/** 모바일 — gutter px-5, 카드 축소(w-36)로 peek 노출 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
}
