import { formatTime } from '~/utils/quiz.util'

interface ResultSummaryProps {
  correctAnswers: number
  percentage: number
  totalTime: number
  averageTime: number
}

const ResultSummary = ({
  averageTime,
  correctAnswers,
  percentage,
  totalTime,
}: ResultSummaryProps) => {
  return (
    <dl className="w-full bg-primary-4 rounded-[2rem] p-[1rem] mb-[2rem] grid grid-cols-[20%_30%_20%_30%]">
      <dt className="text-[1rem] font-[500] h-[2.5rem] text-aligned-lg text-primary-1">
        맞은 문제
      </dt>
      <dd className="text-[1.25rem] h-[2.5rem] text-aligned-lg font-bold text-primary-1 text-right pr-2">
        {correctAnswers} 개
      </dd>
      <dt className="text-[1rem] font-[500] h-[2.5rem] text-aligned-lg text-primary-1">
        정답률
      </dt>
      <dd className="text-[1.25rem] h-[2.5rem] text-aligned-lg font-bold text-primary-1 text-right pr-2">
        {percentage} %
      </dd>
      <dt className="text-[1rem] font-[500] h-[2.5rem] text-aligned-lg text-primary-1">
        소요 시간
      </dt>
      <dd className="text-[1.25rem] h-[2.5rem] text-aligned-lg font-bold text-primary-1 text-right pr-2">
        {formatTime(totalTime)}
      </dd>
      <dt className="text-[1rem] font-[500] h-[2.5rem] text-aligned-lg text-primary-1">
        평균 시간
      </dt>
      <dd className="text-[1.25rem] h-[2.5rem] text-aligned-lg font-bold text-primary-1 text-right pr-2">
        {formatTime(averageTime)}
      </dd>
    </dl>
  )
}

export default ResultSummary
