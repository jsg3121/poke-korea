import type { Meta, StoryObj } from '@storybook/nextjs'

import { AbilityInfoFragment } from '~/graphql/typeGenerated'
import AbilityCardComponent from './AbilityCard.component'

/**
 * 특성 카드. 특성 도감 목록의 특성 항목 하나를 표시하는 "이미지 없는 텍스트 카드".
 * 기술 카드·HubLinkCard와 같은 밝은 카드(primary-4) 문법을 공유한다.
 */
const 악취: AbilityInfoFragment = {
  __typename: 'Ability',
  id: 1,
  abilityId: 1,
  name: '악취',
  description:
    '직접 공격을 받으면 30% 확률로 상대를 풀죽게 만든다. 강렬한 냄새로 주변을 압도한다.',
  pokemonCount: 7,
}

const meta = {
  title: 'Components/AbilityCard',
  component: AbilityCardComponent,
  parameters: {
    layout: 'padded',
    nextjs: { appDirectory: true },
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: [
          '특성 카드 (DS). 특성 도감 목록의 특성 항목 하나를 표시한다.',
          '',
          '특성은 이미지가 없는 텍스트 도메인이라 포켓몬 카드 셸이 아니라 기술 카드·HubLinkCard·QuizCard와 같은 밝은 배경(primary-4) + 진한 텍스트 카드 문법을 공유한다. 위계는 색이 아니라 굵기·크기로 구분.',
          '',
          '반응형은 모바일 퍼스트 base + desktop: 2단만. 제목은 모바일 text-lg → 데스크톱 text-xl로 좁은 화면의 긴 특성명 넘침을 방지. 하단 "보러가기"는 절대배치(min-h-40으로 자리 예약).',
        ].join('\n'),
      },
    },
  },
  args: {
    abilityData: 악취,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AbilityCardComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 기본 (악취) */
export const Default: Story = {}

/** 긴 설명 (심록) — 본문이 여러 줄로 늘어나도 하단 링크가 겹치지 않는다 */
export const LongDescription: Story = {
  args: {
    abilityData: {
      __typename: 'Ability',
      id: 65,
      abilityId: 65,
      name: '심록',
      description:
        'HP가 1/3 이하가 되면 풀 타입 기술의 위력이 1.5배로 올라간다. 위기 상황에서 역전의 발판이 되는 특성으로, 풀 타입 어태커에게 자주 쓰인다.',
      pokemonCount: 42,
    },
  },
}

/** pokemonCount 없음 — 하단 "보러가기" 문구가 표시되지 않는다 */
export const WithoutCount: Story = {
  args: {
    abilityData: {
      __typename: 'Ability',
      id: 26,
      abilityId: 26,
      name: '부유',
      description:
        '공중에 떠 있어 땅 타입 기술과 함정, 모래바람의 영향을 받지 않는다.',
      pokemonCount: null,
    },
  },
}

/** 목록 그리드 — 모바일 1열 → 데스크톱 auto-fill 다열 (부모 그리드 책임) */
export const ListGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 desktop:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] desktop:gap-6">
      {[악취]
        .concat(
          [
            {
              name: '잔비',
              description:
                '등장했을 때 날씨를 비 상태로 만든다. 물 타입 기술의 위력이 올라간다.',
              abilityId: 2,
            },
            {
              name: '가속',
              description: '매 턴이 끝날 때마다 스피드가 한 단계씩 올라간다.',
              abilityId: 3,
            },
            {
              name: '옹골참',
              description:
                'HP가 가득 찬 상태라면 한 번에 쓰러지는 공격을 받아도 HP 1을 남기고 버틴다.',
              abilityId: 5,
            },
          ].map((a) => ({
            __typename: 'Ability' as const,
            id: a.abilityId,
            abilityId: a.abilityId,
            name: a.name,
            description: a.description,
            pokemonCount: 10,
          })),
        )
        .map((ability) => (
          <AbilityCardComponent key={ability.abilityId} abilityData={ability} />
        ))}
    </div>
  ),
}
