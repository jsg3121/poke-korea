import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'

import { PokemonNameOption } from './pokemonNameSearch.types'
import PokemonNameSuggestionList from './PokemonNameSuggestionList.component'

const NavyBg = (Story: React.ComponentType) => (
  <div className="bg-primary-1 p-6 w-[22rem] desktop:w-[28rem]">
    <Story />
  </div>
)

const noop = () => undefined

const RAICHU_OPTIONS: Array<PokemonNameOption> = [
  {
    name: '라이츄',
    number: 26,
    index: 0,
    formType: 'BASE',
    imagePath: '26',
    types: [PokemonType.ELECTRIC],
  },
  {
    name: '메가라이츄X',
    number: 26,
    index: 0,
    formType: 'MEGA',
    imagePath: '102600',
    types: [PokemonType.ELECTRIC],
  },
  {
    name: '메가라이츄Y',
    number: 26,
    index: 1,
    formType: 'MEGA',
    imagePath: '102601',
    types: [PokemonType.ELECTRIC],
  },
  {
    name: '라이츄 알로라의 모습',
    number: 26,
    index: 0,
    formType: 'REGION_FORM',
    imagePath: '202600',
    types: [PokemonType.ELECTRIC, PokemonType.PSYCHIC],
  },
]

const MANY_OPTIONS: Array<PokemonNameOption> = [
  {
    name: '이상해씨',
    number: 1,
    index: 0,
    formType: 'BASE',
    imagePath: '1',
    types: [PokemonType.GRASS, PokemonType.POISON],
  },
  {
    name: '이상해풀',
    number: 2,
    index: 0,
    formType: 'BASE',
    imagePath: '2',
    types: [PokemonType.GRASS, PokemonType.POISON],
  },
  {
    name: '이상해꽃',
    number: 3,
    index: 0,
    formType: 'BASE',
    imagePath: '3',
    types: [PokemonType.GRASS, PokemonType.POISON],
  },
  {
    name: '메가이상해꽃',
    number: 3,
    index: 0,
    formType: 'MEGA',
    imagePath: '100300',
    types: [PokemonType.GRASS, PokemonType.POISON],
  },
  {
    name: '파이리',
    number: 4,
    index: 0,
    formType: 'BASE',
    imagePath: '4',
    types: [PokemonType.FIRE],
  },
  {
    name: '뿔충이',
    number: 13,
    index: 0,
    formType: 'BASE',
    imagePath: '13',
    types: [PokemonType.BUG, PokemonType.POISON],
  },
  {
    name: '딱충이',
    number: 14,
    index: 0,
    formType: 'BASE',
    imagePath: '14',
    types: [PokemonType.BUG, PokemonType.POISON],
  },
  ...RAICHU_OPTIONS,
  {
    name: '가디 히스이의 모습',
    number: 58,
    index: 0,
    formType: 'REGION_FORM',
    imagePath: '205800',
    types: [PokemonType.FIRE, PokemonType.ROCK],
  },
  {
    name: '발챙이',
    number: 60,
    index: 0,
    formType: 'BASE',
    imagePath: '60',
    types: [PokemonType.WATER],
  },
]

const meta = {
  title: 'Components/TypeEffectiveness/PokemonNameSuggestionList',
  component: PokemonNameSuggestionList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '상성 계산기 이름 입력의 자동완성 패널. props만 받아 그린다 — 검색·키보드 처리·계산기 연결은 컨테이너 책임.',
          '',
          '결과는 개수 제한 없이 모두 담고 패널 안에서 스크롤한다. 행은 썸네일·폼 이름·타입 태그. 각 행은 버튼이라 Tab으로 이동하고 Enter·Space로 고른다. 호버·포커스 행은 `primary-3` 배경 + 왼쪽 막대.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  decorators: [NavyBg],
  args: {
    status: 'success',
    options: RAICHU_OPTIONS,
    query: '라이츄',
    onSelect: noop,
    onRetry: noop,
  },
} satisfies Meta<typeof PokemonNameSuggestionList>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: { status: 'loading', options: [] },
}

export const Success: Story = {}

export const ManyResults: Story = {
  args: { options: MANY_OPTIONS, query: '이' },
}

export const Empty: Story = {
  args: { status: 'empty', options: [], query: '아무개몬' },
}

export const Error: Story = {
  args: { status: 'error', options: [] },
}
