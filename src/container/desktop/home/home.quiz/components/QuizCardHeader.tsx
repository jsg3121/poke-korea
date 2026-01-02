import { Fragment, ReactNode } from 'react'

interface QuizCardHeaderProps {
  quizName: ReactNode
  quizDescription: string
}

const QuizCardHeader = ({ quizDescription, quizName }: QuizCardHeaderProps) => {
  return (
    <Fragment>
      <h3
        id="silhouette-quiz-title"
        className="text-[1.5rem] font-bold text-primary-1 mb-4 flex-items-gap-2"
      >
        {quizName}
      </h3>
      <p className="text-primary-1 mb-4 text-base font-medium">
        {quizDescription}
      </p>
    </Fragment>
  )
}

export default QuizCardHeader
