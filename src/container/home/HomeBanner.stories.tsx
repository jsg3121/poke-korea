import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'
import HomeBannerContainer from './HomeBanner.container'

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
  title: 'Containers/HomeBanner',
  component: HomeBannerContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '홈 "오늘의 포켓몬" 배너 섹션 (반응형 단일, DS 컴포넌트 조립).',
          'SectionHeading + HorizontalScrollList + PokemonCard로 구성. 기존 desktop/mobile 2벌 컨테이너를 대체한다.',
          '',
          '모바일 좌우 여백은 표준 gutter `px-5`(20px), 데스크톱은 `max-w-1280` 안에서 정렬.',
        ].join('\n'),
      },
    },
  },
  args: { dailyPokemon },
} satisfies Meta<typeof HomeBannerContainer>

export default meta
type Story = StoryObj<typeof meta>

/** 데스크톱 — max-w-1280 안에서 가로 스크롤 */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
}

/** 모바일 — gutter px-5, 카드 축소(w-40)로 peek 노출 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
}
