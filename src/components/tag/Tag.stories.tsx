import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'
import TagComponent from './Tag.component'

const ALL_TYPES: PokemonType[] = [
  'NORMAL',
  'FIRE',
  'WATER',
  'ELECTRIC',
  'GRASS',
  'ICE',
  'FIGHTING',
  'POISON',
  'GROUND',
  'FLYING',
  'PSYCHIC',
  'BUG',
  'ROCK',
  'GHOST',
  'DRAGON',
  'DARK',
  'STEEL',
  'FAIRY',
] as PokemonType[]

const meta = {
  title: 'Components/Tag',
  component: TagComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '포켓몬 타입 태그 (DS 신규, 토큰 기반 규격). `w-14 h-6 px-2 rounded-lg text-xs`. 배경은 type 토큰(18색) 정적 매핑.',
          '',
          '**글자색은 WCAG 2.1 AA 대비를 충족하도록 배경별로 검정/흰색을 선택한다.**',
          '배경이 어두운 6종은 검정 글자의 대비가 부족(2.0~3.2)해 흰색 글자(`text-white-1`)를 쓴다:',
          '**격투·독·고스트·드래곤·악·바위**. 나머지 12종은 밝은 배경이라 검정 글자(`text-black-2`)로 충분하다.',
          '',
          '> 기존 태그(`.type-tag`)는 모든 타입이 검정 글자로 고정되어 위 6종에서 대비 미달이었다. DS 신규 태그가 이를 바로잡는다.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ALL_TYPES },
  },
} satisfies Meta<typeof TagComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { type: 'GRASS' as PokemonType },
}

/**
 * 18개 타입 전체. 흰색 글자(WCAG 대비) 6종: 격투·독·고스트·드래곤·악·바위.
 * 나머지 12종은 검정 글자.
 */
export const AllTypes: Story = {
  args: { type: 'GRASS' as PokemonType },
  render: () => (
    <div className="flex flex-wrap gap-2 max-w-md">
      {ALL_TYPES.map((type) => (
        <TagComponent key={type} type={type} />
      ))}
    </div>
  ),
}
