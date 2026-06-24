import { ReactNode } from 'react'

/**
 * 홈 "오늘의 퀴즈" 카드의 공통 셸을 가진 DS 컴포넌트 (신규).
 * 기존 Silhouette/Ability/PokemonType 퀴즈 카드 컨테이너의 중복 셸을 추출하지
 * 않고, 토큰 기반으로 규격화해 새로 만든다.
 *
 * - 본문(이미지/텍스트/태그)은 3종 데이터 구조가 완전히 달라 `body` 슬롯으로,
 *   답안 버튼 목록은 `answers` 슬롯으로 주입한다(셸만 규격화).
 * - C3(id 중복) 해결: 기존엔 헤더 id가 "silhouette-quiz-title"로 하드코딩돼
 *   3개 카드가 중복됐다. `headingId`로 카드별 고유 id를 주입해 aria-labelledby와
 *   연결한다(WCAG 4.1.1).
 * - 크기는 모바일 퍼스트 2단계 토큰(ADR-0009 root 16px 고정 기준): 패딩·폰트·본문
 *   높이를 모바일 작게 → desktop: 확장(p-4→p-6, text-xl→2xl, h-32→h-40 등).
 *   모바일은 1열 전체폭이라 폭은 w-full로 부모(그리드 칸)를 따른다.
 */

interface QuizCardProps {
  /** 헤더 아이콘 (이모지 등, 장식이라 aria-hidden 처리) */
  icon: ReactNode
  /** 퀴즈 제목 (예: "실루엣 퀴즈") */
  title: string
  /** 퀴즈 설명 (예: "이 실루엣은 어떤 포켓몬일까요?") */
  description: string
  /** 헤더 제목의 고유 id — article aria-labelledby와 연결 (C3 해결) */
  headingId: string
  /** variant별 본문 (실루엣 이미지 / 특성 설명 / 타입 태그 등) */
  body: ReactNode
  /** 답안 버튼 목록 */
  answers: ReactNode
  /** 답안 그룹 접근명 (예: "실루엣 퀴즈 답안 선택") */
  answersLabel: string
}

const QuizCardComponent = ({
  icon,
  title,
  description,
  headingId,
  body,
  answers,
  answersLabel,
}: QuizCardProps) => {
  return (
    <article
      className="w-full bg-primary-4 rounded-2xl p-4 desktop:p-6 shadow-lg"
      aria-labelledby={headingId}
    >
      <h3
        id={headingId}
        className="flex items-center gap-2 mb-3 desktop:mb-4 text-xl desktop:text-2xl font-bold text-primary-1"
      >
        <span className="text-xl desktop:text-2xl" aria-hidden="true">
          {icon}
        </span>
        {title}
      </h3>
      <p className="mb-3 desktop:mb-4 text-sm desktop:text-base font-medium text-primary-1">
        {description}
      </p>

      {/* 본문 슬롯 — 공통 박스(고정 높이 + 흰 배경)만 셸이 제공, 내용은 주입 */}
      <div className="w-full h-32 desktop:h-40 mb-3 desktop:mb-4 p-4 rounded-xl bg-white flex-center">
        {body}
      </div>

      <div className="space-y-2" role="group" aria-label={answersLabel}>
        {answers}
      </div>
    </article>
  )
}

export default QuizCardComponent
