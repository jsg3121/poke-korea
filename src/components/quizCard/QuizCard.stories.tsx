import type { Meta, StoryObj } from '@storybook/nextjs'

import { PokemonType } from '~/graphql/typeGenerated'
import TagComponent from '../tag/Tag.component'
import QuizCardComponent from './QuizCard.component'

/** 스토리용 답안 버튼 (실제 사용처는 QuizAnswerButton을 슬롯에 주입) */
const AnswerButtons = ({ options }: { options: string[] }) => (
  <>
    {options.map((label) => (
      <button
        key={label}
        type="button"
        className="w-full h-12 px-4 rounded-lg text-left font-medium text-primary-1 bg-primary-3 hover:bg-primary-1 hover:text-primary-4 transition-colors duration-200"
      >
        {label}
      </button>
    ))}
  </>
)

const meta = {
  title: 'Components/QuizCard',
  component: QuizCardComponent,
  parameters: {
    docs: {
      description: {
        component: [
          '홈 "오늘의 퀴즈" 카드의 공통 셸 DS 컴포넌트 (신규).',
          '본문(`body`)·답안(`answers`)은 3종 데이터 구조가 달라 슬롯으로 주입하고, 셸(article+헤더+본문 박스+답안 그룹)만 규격화한다.',
          '',
          '**`headingId`로 카드별 고유 id를 주입해 C3(id 중복) 버그를 해결한다.** 기존엔 3개 카드 모두 `id="silhouette-quiz-title"`로 하드코딩돼 WCAG 4.1.1 위반이었다.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QuizCardComponent>

export default meta
type Story = StoryObj<typeof meta>

/** 데스크톱 3열 그리드 한 칸 폭(max-w-1280px / 3열 ≈ 400px) */
const singleCellDecorator: Story['decorators'] = [
  (Story) => (
    <div className="w-[400px]">
      <Story />
    </div>
  ),
]

/** 실루엣 퀴즈 — 본문은 흑백(brightness-0) 포켓몬 이미지 */
export const Silhouette: Story = {
  decorators: singleCellDecorator,
  args: {
    icon: '🔍',
    title: '실루엣 퀴즈',
    description: '이 실루엣은 어떤 포켓몬일까요?',
    headingId: 'silhouette-quiz-title',
    answersLabel: '실루엣 퀴즈 답안 선택',
    body: (
      <div
        className="w-32 h-32 bg-primary-1 [clip-path:circle(45%)]"
        aria-hidden
      />
    ),
    answers: (
      <AnswerButtons options={['이상해씨', '꼬부기', '파이리', '피카츄']} />
    ),
  },
}

/** 특성 퀴즈 — 본문은 특성 설명 텍스트 */
export const Ability: Story = {
  decorators: singleCellDecorator,
  args: {
    icon: '✨',
    title: '특성 퀴즈',
    description: '이 특성을 가진 포켓몬은?',
    headingId: 'ability-quiz-title',
    answersLabel: '특성 퀴즈 답안 선택',
    body: (
      <p className="text-base leading-relaxed text-primary-1">
        비가 내리는 동안 물 타입 기술의 위력이 강해진다.
      </p>
    ),
    answers: (
      <AnswerButtons options={['잔비', '가뭄', '모래날림', '눈퍼뜨리기']} />
    ),
  },
}

/** 타입 퀴즈 — 본문은 타입 태그 + 안내 문구 */
export const PokemonTypeQuiz: Story = {
  decorators: singleCellDecorator,
  args: {
    icon: '🎨',
    title: '타입 퀴즈',
    description: '주어진 타입의 포켓몬을 골라주세요!',
    headingId: 'type-quiz-title',
    answersLabel: '타입 퀴즈 답안 선택',
    body: (
      <div className="flex flex-col flex-wrap items-center justify-center gap-2">
        <TagComponent type={'WATER' as PokemonType} />
        <p className="text-primary-1">타입을 가진 포켓몬은 누굴까요?</p>
      </div>
    ),
    answers: (
      <AnswerButtons options={['이상해씨', '꼬부기', '파이리', '피카츄']} />
    ),
  },
}

/**
 * 데스크톱 실제 배치 — 3열 그리드(max-w-1280px). 카드는 가변 폭(w-full)으로
 * 칸을 채우고, 본문 박스는 고정 높이라 3종 셸이 동일 정렬을 유지한다.
 */
export const DesktopGrid: Story = {
  // render 전용 스토리 — args는 사용되지 않으나 타입 충족을 위해 최소값 제공
  args: {
    icon: '',
    title: '',
    description: '',
    headingId: 'grid-placeholder',
    answersLabel: '',
    body: null,
    answers: null,
  },
  decorators: [
    (Story) => (
      <div className="w-[1280px]">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="grid grid-cols-3 gap-6">
      <QuizCardComponent
        icon="🔍"
        title="실루엣 퀴즈"
        description="이 실루엣은 어떤 포켓몬일까요?"
        headingId="silhouette-quiz-title"
        answersLabel="실루엣 퀴즈 답안 선택"
        body={
          <div
            className="w-32 h-32 bg-primary-1 [clip-path:circle(45%)]"
            aria-hidden
          />
        }
        answers={
          <AnswerButtons options={['이상해씨', '꼬부기', '파이리', '피카츄']} />
        }
      />
      <QuizCardComponent
        icon="✨"
        title="특성 퀴즈"
        description="이 특성을 가진 포켓몬은?"
        headingId="ability-quiz-title"
        answersLabel="특성 퀴즈 답안 선택"
        body={
          <p className="text-base leading-relaxed text-primary-1">
            비가 내리는 동안 물 타입 기술의 위력이 강해진다.
          </p>
        }
        answers={
          <AnswerButtons options={['잔비', '가뭄', '모래날림', '눈퍼뜨리기']} />
        }
      />
      <QuizCardComponent
        icon="🎨"
        title="타입 퀴즈"
        description="주어진 타입의 포켓몬을 골라주세요!"
        headingId="type-quiz-title"
        answersLabel="타입 퀴즈 답안 선택"
        body={
          <div className="flex flex-col flex-wrap items-center justify-center gap-2">
            <TagComponent type={'WATER' as PokemonType} />
            <p className="text-primary-1">타입을 가진 포켓몬은 누굴까요?</p>
          </div>
        }
        answers={
          <AnswerButtons options={['이상해씨', '꼬부기', '파이리', '피카츄']} />
        }
      />
    </div>
  ),
}

/**
 * 모바일 실제 배치 — 1열 세로 스택(전체폭, gutter px-5). 모바일 퍼스트 토큰으로
 * 패딩·폰트·본문 높이가 데스크톱보다 작게 적용되는지 확인.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile' } },
  parameters: { layout: 'fullscreen' },
  args: {
    icon: '',
    title: '',
    description: '',
    headingId: 'mobile-placeholder',
    answersLabel: '',
    body: null,
    answers: null,
  },
  render: () => (
    <div className="grid gap-6 px-5 py-4">
      <QuizCardComponent
        icon="🔍"
        title="실루엣 퀴즈"
        description="이 실루엣은 어떤 포켓몬일까요?"
        headingId="silhouette-quiz-title"
        answersLabel="실루엣 퀴즈 답안 선택"
        body={
          <div
            className="w-32 h-32 bg-primary-1 [clip-path:circle(45%)]"
            aria-hidden
          />
        }
        answers={
          <AnswerButtons options={['이상해씨', '꼬부기', '파이리', '피카츄']} />
        }
      />
      <QuizCardComponent
        icon="✨"
        title="특성 퀴즈"
        description="이 특성을 가진 포켓몬은?"
        headingId="ability-quiz-title"
        answersLabel="특성 퀴즈 답안 선택"
        body={
          <p className="text-sm leading-relaxed text-primary-1">
            비가 내리는 동안 물 타입 기술의 위력이 강해진다.
          </p>
        }
        answers={
          <AnswerButtons options={['잔비', '가뭄', '모래날림', '눈퍼뜨리기']} />
        }
      />
    </div>
  ),
}
