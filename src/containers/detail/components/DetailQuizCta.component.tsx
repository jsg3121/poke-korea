import LinkButtonComponent from '~/components/button/LinkButton.component'

/**
 * 퀴즈 유도 CTA (UX-005 §6-3 — 유입 확대 방향). 기존의 밋밋한 줄 배너 대신
 * 밝은 카드(다크 셸 위 카드 문법) + LinkButton으로 클릭 가능성을 명확히 한다.
 * 관련 콘텐츠 직후의 맥락 배치(특성 카드 뒤 특성 퀴즈, 상성 뒤 상성 퀴즈)를
 * 유지한다 — 최하단 단일 배치보다 맥락 관련성이 커 전환에 유리하다는 판단.
 */
interface DetailQuizCtaProps {
  title: string
  description: string
  href: string
  ctaLabel?: string
}

const DetailQuizCtaComponent = ({
  title,
  description,
  href,
  ctaLabel = '도전하기',
}: DetailQuizCtaProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-2 rounded-2xl bg-primary-4 p-3 shadow-lg desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-3 desktop:p-5">
      <div>
        <p className="text-sm font-bold text-primary-1 desktop:text-base">
          {title}
        </p>
        <p className="mt-1 text-2xs text-primary-2 desktop:text-sm">
          {description}
        </p>
      </div>
      <LinkButtonComponent href={href} variant="primary" size="sm" showArrow>
        {ctaLabel}
      </LinkButtonComponent>
    </div>
  )
}

export default DetailQuizCtaComponent
