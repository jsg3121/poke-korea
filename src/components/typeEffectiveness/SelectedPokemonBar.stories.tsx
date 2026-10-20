import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'

import SelectedPokemonBar from './SelectedPokemonBar.component'

const NavyBg = (Story: React.ComponentType) => (
  <div className="bg-primary-1 p-6 w-[22rem] desktop:w-[28rem]">
    <Story />
  </div>
)

const meta = {
  title: 'Components/TypeEffectiveness/SelectedPokemonBar',
  component: SelectedPokemonBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '상성 계산기에서 이름으로 고른 포켓몬 표시. 썸네일·폼 이름·타입 태그.',
          '',
          '모바일은 이름과 태그를 2줄로, 데스크톱은 1줄로 둔다. 해제 버튼은 없다 — 해제는 계산기의 "선택 초기화"가 맡는다.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  decorators: [NavyBg],
  args: {
    pokemon: {
      name: '리자몽',
      number: 6,
      index: 0,
      formType: 'BASE',
      imagePath: '6',
      types: [PokemonType.FIRE, PokemonType.FLYING],
    },
  },
} satisfies Meta<typeof SelectedPokemonBar>

export default meta
type Story = StoryObj<typeof meta>

export const DualType: Story = {}

export const SingleType: Story = {
  args: {
    pokemon: {
      name: '피카츄',
      number: 25,
      index: 0,
      formType: 'BASE',
      imagePath: '25',
      types: [PokemonType.ELECTRIC],
    },
  },
}

export const RegionForm: Story = {
  args: {
    pokemon: {
      name: '라이츄 알로라의 모습',
      number: 26,
      index: 0,
      formType: 'REGION_FORM',
      imagePath: '202600',
      types: [PokemonType.ELECTRIC, PokemonType.PSYCHIC],
    },
  },
}
