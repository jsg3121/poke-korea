import { QuizType } from '~/types/quiz.type'
import Button from '~/components/button/Button.component'
import LinkButton from '~/components/button/LinkButton.component'

import OtherQuizLink from './OtherQuizLink.component'

interface ResultFooterProps {
  onClickRetryButton: () => void
  quizType: QuizType
  relationPageHref: string
  relationPageHrefLabel: string
}

const ResultFooter = ({
  onClickRetryButton,
  relationPageHref,
  relationPageHrefLabel,
  quizType,
}: ResultFooterProps) => {
  return (
    <div className="flex flex-col gap-4 desktop:gap-6">
      <OtherQuizLink currentQuiz={quizType} />
      <div className="flex gap-4 justify-center">
        <Button variant="secondary" size="md" onClick={onClickRetryButton}>
          다시 도전하기
        </Button>
        <LinkButton
          href={relationPageHref}
          variant="secondary"
          size="md"
          showArrow
        >
          {relationPageHrefLabel}
        </LinkButton>
      </div>
    </div>
  )
}

export default ResultFooter
