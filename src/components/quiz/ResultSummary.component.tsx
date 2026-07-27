import { formatTime } from '~/utils/quiz.util'

/**
 * 퀴즈 결과 요약 (RESULT 단계). 4지표(맞은 문제/정답률/소요 시간/평균 시간).
 * 기존 desktop=flex 한 줄 / mobile=grid 2×4로 레이아웃 엔진이 이원화돼 있던 것을,
 * 단일 grid로 통일한다 — 모바일 2열(2×2), desktop 4열(1×4). 열 수만 반응형 분기.
 */
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

const ResultSummaryComponent = ({
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

export default ResultSummaryComponent
