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

/** 챔피언스 등에서 나타나는 긴 이름 (리전폼/메가 표기 포함) */
const longNamePokemon = {
  ...mockPokemon,
  id: '964',
  number: 964,
  name: '돌핀맨 (나이브폼)',
  types: ['WATER'] as PokemonType[],
}

/** 가장 긴 이름 케이스 — 폰트 단계 축소 검증용 */
const veryLongNamePokemon = {
  ...mockPokemon,
  id: '128',
  number: 128,
  name: '켄타로스 (팔데아 블레이즈종)',
  types: ['FIGHTING', 'FIRE'] as PokemonType[],
}

const meta = {
  title: 'Components/PokemonCard',
  component: PokemonCardComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '포켓몬 카드 계열의 공통 셸(포켓볼+헤더+이미지+타입 태그) + variant 본문. 반응형 단일(모바일 퍼스트). 현재 pokedex variant(스탯 6종)만 구현.',
          '',
          '**모바일 퍼스트 2단계 토큰**: base=모바일 `w-40`(160px, ~0.71배) → `desktop:w-56`(224px). 내부 이미지·폰트·포켓볼·여백도 같은 비율로 2단계(예: `w-28 desktop:w-40`, `text-xs desktop:text-base`). 모바일 2열 그리드에 들어가도록 축소하되 데스크톱 비율을 유지한다([ADR-0009](root 16px 고정) 기준).',
        ].join('\n'),
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

/** 듀얼 타입 (풀+독) — 그라데이션 배경. 데스크톱 폭(w-56=224px). */
export const Pokedex: Story = {
  args: { pokemonData: mockPokemon },
}

/** 싱글 타입 (불꽃) — 단색 배경. */
export const SingleType: Story = {
  args: { pokemonData: singleTypePokemon },
}

/**
 * 긴 이름 (챔피언스 등) — No.xxx 아랫줄에 한 줄로 통째 노출. whitespace-nowrap으로
 * 쪼개지지 않고, 길이에 따라 폰트가 단계 축소(getNameFontClass)돼 잘리지 않는지 확인.
 */
export const LongName: Story = {
  args: { pokemonData: longNamePokemon },
}

/** 가장 긴 이름 — 폰트가 한 단계 더 작아져 카드 폭 안에 들어가는지 확인 */
export const VeryLongName: Story = {
  args: { pokemonData: veryLongNamePokemon },
}

/** 긴 이름 — 모바일 2열에서 헤더 줄바꿈 확인 */
export const LongNameMobileGrid: Story = {
  globals: { viewport: { value: 'mobile' } },
  parameters: { layout: 'fullscreen' },
  args: { pokemonData: longNamePokemon },
  render: (args) => (
    <div className="grid grid-cols-2 gap-4 px-5 py-4">
      <PokemonCardComponent {...args} pokemonData={longNamePokemon} />
      <PokemonCardComponent {...args} pokemonData={mockPokemon} />
    </div>
  ),
}

/**
 * 모바일 2열 그리드 — 390px 화면(gutter px-5 + gap-4) 기준. 카드가 base 폭(w-40)으로
 * 축소돼 2열에 들어가고, 데스크톱 비율을 유지하는지 확인용.
 */
export const MobileGrid: Story = {
  globals: { viewport: { value: 'mobile' } },
  parameters: { layout: 'fullscreen' },
  args: { pokemonData: mockPokemon },
  render: (args) => (
    <div className="grid grid-cols-2 gap-4 px-5 py-4">
      <PokemonCardComponent {...args} pokemonData={mockPokemon} />
      <PokemonCardComponent {...args} pokemonData={singleTypePokemon} />
    </div>
  ),
}
