import { ReactNode } from 'react'

interface QuizOptionButtonProps {
  onClick: () => void
  variant?: 'text' | 'image'
  optionNumber?: number
  children: ReactNode
}

const QuizOptionButton = ({
  onClick,
  variant = 'text',
  optionNumber,
  children,
}: QuizOptionButtonProps) => {
  const focusRing =
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1'

  if (variant === 'image') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex flex-col items-center gap-3 p-4 rounded-[1rem] bg-primary-3 text-primary-1 hover:bg-primary-2 hover:text-primary-4 transition-colors ${focusRing}`}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center min-h-touch desktop:min-h-touch-lg py-2 px-4 rounded-full bg-primary-3 text-primary-1 hover:bg-primary-2 hover:text-primary-4 transition-colors ${focusRing}`}
    >
      {optionNumber !== undefined && (
        <span className="w-4 mr-3.5 text-sm desktop:text-base font-bold shrink-0">
          {optionNumber}
        </span>
      )}
      <span className="text-left text-xs desktop:text-base">{children}</span>
    </button>
  )
}

export default QuizOptionButton
