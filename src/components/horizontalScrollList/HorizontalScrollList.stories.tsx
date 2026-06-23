import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'
import PokemonCardComponent from '../pokemonCard/PokemonCard.component'
import HorizontalScrollListComponent from './HorizontalScrollList.component'

const samplePokemons = [
  {
    __typename: 'PokemonList' as const,
    id: '1',
    number: 1,
    name: '이상해씨',
    types: ['GRASS', 'POISON'] as PokemonType[],
    isRegionForm: false,
    isMegaEvolution: false,
    isGigantamax: false,
    pokemonStats: {
      __typename: 'PokemonStats' as const,
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
      total: 318,
    },
  },
  {
    __typename: 'PokemonList' as const,
    id: '4',
    number: 4,
    name: '파이리',
    types: ['FIRE'] as PokemonType[],
    isRegionForm: false,
    isMegaEvolution: false,
    isGigantamax: false,
    pokemonStats: {
      __typename: 'PokemonStats' as const,
      hp: 39,
      attack: 52,
      defense: 43,
      specialAttack: 60,
      specialDefense: 50,
      speed: 65,
      total: 309,
    },
  },
  {
    __typename: 'PokemonList' as const,
    id: '7',
    number: 7,
    name: '꼬부기',
    types: ['WATER'] as PokemonType[],
    isRegionForm: false,
    isMegaEvolution: false,
    isGigantamax: false,
    pokemonStats: {
      __typename: 'PokemonStats' as const,
      hp: 44,
      attack: 48,
      defense: 65,
      specialAttack: 50,
      specialDefense: 64,
      speed: 43,
      total: 314,
    },
  },
  {
    __typename: 'PokemonList' as const,
    id: '25',
    number: 25,
    name: '피카츄',
    types: ['ELECTRIC'] as PokemonType[],
    isRegionForm: false,
    isMegaEvolution: false,
    isGigantamax: false,
    pokemonStats: {
      __typename: 'PokemonStats' as const,
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90,
      total: 320,
    },
  },
]

const cards = samplePokemons.map((p) => (
  <PokemonCardComponent
    key={p.id}
    variant="pokedex"
    pokemonData={p}
    isHighPriority
  />
))

const meta = {
  title: 'Components/HorizontalScrollList',
  component: HorizontalScrollListComponent,
  parameters: {
    docs: {
      description: {
        component: [
          'PokemonCard 등 자식을 가로 스크롤로 배치하는 DS 래퍼 (신규).',
          '자식은 `li`로 자동 래핑되며 `flex-shrink-0`으로 고정 폭(w-56)을 유지한다.',
          '카드가 고정 폭이라 컨테이너가 좁으면 다음 카드가 자연히 peek 노출(M1 해결).',
          '',
          '자식 간격은 1rem(gap-4) 고정. `showScrollbar`로 스크롤바 표시/숨김 제어. 스크롤바 색상은 기존 무드(primary-2/3) 유지, 두께는 토큰 `h-1`(4px).',
          '호버로 카드가 커질 때(scale-105) Y축 스크롤이 생기거나 양 끝 카드가 잘리지 않도록 사방 패딩(p-4)과 overflow-y-hidden을 적용한다.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  args: {
    'aria-label': '포켓몬 목록',
    children: cards,
  },
  argTypes: {
    showScrollbar: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HorizontalScrollListComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 기본(스크롤바 표시) — 좁은 폭에서 다음 카드 peek 노출, 호버해도 Y축 스크롤 없음 */
export const Default: Story = {
  args: { showScrollbar: true },
}

/** 스크롤바 숨김 — 스크롤은 가능하나 바 비표시 */
export const NoScrollbar: Story = {
  args: { showScrollbar: false },
}
