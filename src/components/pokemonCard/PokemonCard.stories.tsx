import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'
import PokemonCardComponent from './PokemonCard.component'

const mockPokemon = {
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
}

const singleTypePokemon = {
  ...mockPokemon,
  id: '4',
  number: 4,
  name: '파이리',
  types: ['FIRE'] as PokemonType[],
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
}

const meta = {
  title: 'Components/PokemonCard',
  component: PokemonCardComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '포켓몬 카드 계열의 공통 셸(포켓볼+헤더+이미지+타입 태그) + variant 본문. 반응형 단일(모바일 퍼스트). 현재 pokedex variant(스탯 6종)만 구현.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    variant: 'pokedex',
    isHighPriority: true,
  },
} satisfies Meta<typeof PokemonCardComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 듀얼 타입 (풀+독) — 그라데이션 배경. 카드는 항상 w-56(224px) 고정 규격. */
export const Pokedex: Story = {
  args: { pokemonData: mockPokemon },
}

/** 싱글 타입 (불꽃) — 단색 배경. 동일한 224px 규격. */
export const SingleType: Story = {
  args: { pokemonData: singleTypePokemon },
}
