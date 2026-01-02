import CorrectIcon from '~/assets/icons/correct-icon.svg'
import InCorrectIcon from '~/assets/icons/wrong-correct.svg'
import Portal from '../Portal.component'
import Link from 'next/link'

type QuizType = 'ability' | 'silhouette' | 'pokemon-type'

interface QuizResultPopupProps {
  id: string
  quizType: QuizType
  isCorrect: boolean
  answer: string
  onClose: () => void
}

const QUIZ_TYPE = {
  ability: '특성 퀴즈',
  silhouette: '실루엣 퀴즈',
  'pokemon-type': '타입 퀴즈',
}

const QuizResultPopup = ({
  id,
  answer,
  quizType,
  isCorrect,
  onClose,
}: QuizResultPopupProps) => {
  return (
    <Portal containerId={id}>
      <aside
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn bg-black/65"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-result-title"
        aria-describedby="quiz-result-description"
      >
        <article
          className="relative bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center mb-2" aria-hidden="true">
            {isCorrect ? (
              <CorrectIcon width={80} height={80} />
            ) : (
              <InCorrectIcon width={80} height={80} />
            )}
          </div>
          <strong
            id="quiz-result-title"
            className={`w-full text-2xl block font-bold text-center mb-4 ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isCorrect ? '정답입니다!' : '오답입니다!'}
          </strong>
          {!isCorrect && (
            <p className="h-12 text-[1rem] text-center">
              정답 : <span className="text-[1.25rem] font-bold">{answer}</span>
            </p>
          )}
          <p
            id="quiz-result-description"
            className="text-center text-primary-2 mb-6 text-[1rem]"
          >
            {isCorrect
              ? '더 많은 퀴즈를 풀러 가볼까요?'
              : '다른 문제를 풀어보러 갈까요?'}
          </p>
          <div className="w-full h-12 flex gap-4">
            <button
              onClick={onClose}
              className="w-32 h-12 shrink-0 text-primary-2 font-bold py-3 border border-solid border-primary-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              aria-label="퀴즈 결과 닫기"
            >
              닫기
            </button>
            <Link
              href={`/quiz/${quizType}`}
              className="w-full h-12 bg-primary-1 text-primary-4 text-center block text-aligned-xl font-bold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              aria-label="퀴즈 풀러 가기"
            >
              {QUIZ_TYPE[quizType]} 풀러 가기
            </Link>
          </div>
        </article>
      </aside>
    </Portal>
  )
}

export default QuizResultPopup
