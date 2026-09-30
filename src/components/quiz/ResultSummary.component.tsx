import { formatTime } from '~/utils/quiz.util'

interface ResultSummaryProps {
  correctAnswers: number
  percentage: number
  totalTime: number
  averageTime: number
}

interface SummaryItem {
  label: string
  value: string
}

const ResultSummary = ({
  averageTime,
  correctAnswers,
  percentage,
  totalTime,
}: ResultSummaryProps) => {
  const items: SummaryItem[] = [
    { label: '맞은 문제', value: `${correctAnswers} 개` },
    { label: '정답률', value: `${percentage} %` },
    { label: '소요 시간', value: formatTime(totalTime) },
    { label: '평균 시간', value: formatTime(averageTime) },
  ]

  return (
    <dl className="w-full grid grid-cols-2 desktop:grid-cols-4 gap-4 bg-primary-4 rounded-[1rem] desktop:rounded-[2rem] p-6 desktop:p-8">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1">
          <dt className="text-sm desktop:text-base font-medium text-primary-2">
            {item.label}
          </dt>
          <dd className="text-2xl desktop:text-[2.25rem] font-bold text-primary-1">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default ResultSummary
