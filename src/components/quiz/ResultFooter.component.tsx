import ButtonComponent from '~/components/button/Button.component'
import LinkButtonComponent from '~/components/button/LinkButton.component'
import { QuizType } from '~/types/quiz.type'
import OtherQuizLinkComponent from './OtherQuizLink.component'

/**
 * 퀴즈 결과 푸터 (RESULT 단계 하단). 다른 퀴즈 링크 + "다시 도전하기"(액션) +
 * 관련 페이지 이동 링크. 기존 커스텀 버튼(bg-primary-2/-3)을 DS Button/LinkButton으로
 * 교체한다("다시 도전하기"=secondary 액션, 관련 페이지=ghost 이동 링크).
 */
interface ResultFooterProps {
  onClickRetryButton: () => void
  quizType: QuizType
  relationPageHref: string
  relationPageHrefLabel: string
}

const ResultFooterComponent = ({
  onClickRetryButton,
  relationPageHref,
  relationPageHrefLabel,
  quizType,
}: ResultFooterProps) => {
  return (
    <div className="flex flex-col gap-4 desktop:gap-6">
      <OtherQuizLinkComponent currentQuiz={quizType} />
      <div className="flex gap-4 justify-center">
        <ButtonComponent
          variant="secondary"
          size="md"
          onClick={onClickRetryButton}
        >
          다시 도전하기
        </ButtonComponent>
        <LinkButtonComponent
          href={relationPageHref}
          variant="secondary"
          size="md"
          showArrow
        >
          {relationPageHrefLabel}
        </LinkButtonComponent>
      </div>
    </div>
  )
}

export default ResultFooterComponent
