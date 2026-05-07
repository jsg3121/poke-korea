import Link from 'next/link'

const AbilityQuizBannerComponent = () => {
  return (
    <Link
      href="/quiz/ability"
      aria-label="특성 퀴즈 풀러가기"
      className="group col-span-full flex items-center justify-between rounded-2xl bg-primary-3 px-6 py-5 text-primary-1 shadow-[1px_2px_6px_0_var(--color-primary-1)] transition-colors hover:bg-primary-2 focus-visible:bg-primary-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
    >
      <div>
        <p className="group-hover:text-primary-4 text-xl font-bold mb-1">
          특성 퀴즈에 도전해보세요!
        </p>
        <p className="group-hover:text-primary-4 text-sm">
          다양한 포켓몬의 특성을 얼마나 알고 있나요?
        </p>
      </div>
      <span aria-hidden="true" className="text-2xl ml-4">
        →
      </span>
    </Link>
  )
}

export default AbilityQuizBannerComponent
