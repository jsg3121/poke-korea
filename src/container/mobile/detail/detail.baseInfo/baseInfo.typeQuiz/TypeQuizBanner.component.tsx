import Link from 'next/link'

const TypeQuizBannerComponent = () => {
  return (
    <Link
      href="/quiz/type-effectiveness"
      aria-label="타입 상성 퀴즈 풀러가기"
      className="group flex items-center -my-6 justify-between rounded-2xl bg-primary-3 px-5 py-4 text-primary-1 shadow-[1px_2px_6px_0_var(--color-primary-1)] transition-colors active:bg-primary-2 focus-visible:bg-primary-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
    >
      <div>
        <p className="group-active:text-primary-4 text-base font-bold mb-1">
          타입 상성 퀴즈에 도전해보세요!
        </p>
        <p className="group-active:text-primary-4 text-xs">
          약점과 저항을 얼마나 알고 있나요?
        </p>
      </div>
      <span aria-hidden="true" className="text-xl ml-4">
        →
      </span>
    </Link>
  )
}

export default TypeQuizBannerComponent
