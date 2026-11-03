import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'

import PokemonCard from './PokemonCard.component'

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

const longNamePokemon = {
  ...mockPokemon,
  id: '964',
  number: 964,
  name: '돌핀맨 (나이브폼)',
  types: ['WATER'] as PokemonType[],
}

const veryLongNamePokemon = {
  ...mockPokemon,
  id: '128',
  number: 128,
  name: '켄타로스 (팔데아 블레이즈종)',
  types: ['FIGHTING', 'FIRE'] as PokemonType[],
}

const meta = {
  title: 'Components/PokemonCard',
  component: PokemonCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '포켓몬 카드 계열의 공통 셸(포켓볼+헤더+이미지+타입 태그) + variant 본문. 반응형 단일(모바일 퍼스트). 현재 pokedex variant(스탯 6종)만 구현.',
          '',
          '**모바일 퍼스트 2단계 토큰**: base=모바일 `w-36`(144px) → `desktop:w-56`(224px). 내부 이미지·폰트·포켓볼·여백도 같은 비율로 2단계(예: `w-28 desktop:w-40`, `text-xs desktop:text-base`). 모바일 2열 그리드에 들어가도록 축소하되 데스크톱 비율을 유지한다([ADR-0009](root 16px 고정) 기준).',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  args: {
    variant: 'pokedex',
    isHighPriority: true,
  },
} satisfies Meta<typeof PokemonCard>

export default meta
type Story = StoryObj<typeof meta>

export const Pokedex: Story = {
  args: { pokemonData: mockPokemon },
}

export const SingleType: Story = {
  args: { pokemonData: singleTypePokemon },
}

export const LongName: Story = {
  args: { pokemonData: longNamePokemon },
}

export const VeryLongName: Story = {
  args: { pokemonData: veryLongNamePokemon },
}

export const LongNameMobileGrid: Story = {
  globals: { viewport: { value: 'mobile' } },
  parameters: { layout: 'fullscreen' },
  args: { pokemonData: longNamePokemon },
  render: (args) => (
    <div className="grid grid-cols-2 gap-4 px-5 py-4">
      <PokemonCard {...args} pokemonData={longNamePokemon} />
      <PokemonCard {...args} pokemonData={mockPokemon} />
    </div>
  ),
}

export const MobileGrid: Story = {
  globals: { viewport: { value: 'mobile' } },
  parameters: { layout: 'fullscreen' },
  args: { pokemonData: mockPokemon },
  render: (args) => (
    <div className="grid grid-cols-2 gap-4 px-5 py-4">
      <PokemonCard {...args} pokemonData={mockPokemon} />
      <PokemonCard {...args} pokemonData={singleTypePokemon} />
    </div>
  ),
}
