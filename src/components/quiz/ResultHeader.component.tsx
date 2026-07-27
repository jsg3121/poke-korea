/**
 * 퀴즈 결과 헤더 (RESULT 단계 상단). 점수 구간별 메달 이모지 + 헤드라인 + 서브카피.
 * medal/headline/subcopy는 상위 컨테이너가 getQuizResultCopy(score)로 계산해 주입한다.
 * desktop/mobile 2벌을 반응형 단일로 통합(크기 토큰만 desktop: 확장).
 */
interface ResultHeaderProps {
  medal: string
  headline: string
  subcopy: string
}

const ResultHeaderComponent = ({
  medal,
  headline,
  subcopy,
}: ResultHeaderProps) => {
  return (
    <header className="w-full flex flex-col items-center text-center">
      <span
        aria-hidden="true"
        className="block h-[9rem] desktop:h-[14rem] text-[6rem] desktop:text-[10rem] leading-[9rem] desktop:leading-[14rem]"
      >
        {medal}
      </span>
      <h1 className="text-2xl desktop:text-[2rem] font-bold text-primary-4">
        {headline}
      </h1>
      <p className="mt-2 text-base desktop:text-xl text-primary-3">{subcopy}</p>
    </header>
  )
}

export default ResultHeaderComponent
