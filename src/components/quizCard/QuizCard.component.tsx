import { ReactNode } from 'react'

interface QuizCardProps {
  icon: ReactNode
  title: string
  description: string
  headingId: string
  body: ReactNode
  answers: ReactNode
  answersLabel: string
}

const QuizCard = ({
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

      <div className="w-full h-32 desktop:h-40 mb-3 desktop:mb-4 p-4 rounded-xl bg-white flex-center">
        {body}
      </div>

      <div className="space-y-2" role="group" aria-label={answersLabel}>
        {answers}
      </div>
    </article>
  )
}

export default QuizCard
