/**
 * 퀴즈 건너뛰기 버튼 (QUIZ 단계). 현재 문제를 스킵(답 99 제출)한다.
 * 기존 mobile은 gray 임의색·hover 없음이었으나 desktop 규격(primary 토큰 + hover)으로
 * 통일한다. 텍스트 링크형이라 min-h-touch로 터치 타겟(44px)을 보장한다.
 */
interface QuizSkipButtonProps {
  onClickSkipButton: () => void
}

const QuizSkipButtonComponent = ({
  onClickSkipButton,
}: QuizSkipButtonProps) => {
  return (
    <button
      type="button"
      className="mt-6 mobile:mt-0 mx-auto flex items-center justify-center min-h-touch px-4 text-base text-primary-2 rounded-[1rem] hover:bg-primary-3 hover:text-primary-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-2 transition-colors"
      onClick={onClickSkipButton}
    >
      건너뛰기
    </button>
  )
}

export default QuizSkipButtonComponent
