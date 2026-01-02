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
    <dl className="w-full h-[6.5rem] bg-primary-4 rounded-[2rem] p-[2rem] flex items-center justify-around mb-[2rem]">
      <dt className="text-xl font-[500] h-[2.5rem] text-aligned-lg text-primary-1">
        맞은 문제
      </dt>
      <dd className="text-[2.25rem] h-[2.5rem] text-aligned-lg font-bold text-primary-1">
        {correctAnswers} 개
      </dd>
      <dt className="text-xl font-[500] h-[2.5rem] text-aligned-lg text-primary-1">
        정답률
      </dt>
      <dd className="text-[2.25rem] h-[2.5rem] text-aligned-lg font-bold text-primary-1">
        {percentage} %
      </dd>
      <dt className="text-xl font-[500] h-[2.5rem] text-aligned-lg text-primary-1">
        소요 시간
      </dt>
      <dd className="text-[2.25rem] h-[2.5rem] text-aligned-lg font-bold text-primary-1">
        {formatTime(totalTime)}
      </dd>
      <dt className="text-xl font-[500] h-[2.5rem] text-aligned-lg text-primary-1">
        평균 시간
      </dt>
      <dd className="text-[2.25rem] h-[2.5rem] text-aligned-lg font-bold text-primary-1">
        {formatTime(averageTime)}
      </dd>
    </dl>
  )
}

export default ResultSummary
