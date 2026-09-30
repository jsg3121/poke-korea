interface ResultHeaderProps {
  medal: string
  headline: string
  subcopy: string
}

const ResultHeader = ({ medal, headline, subcopy }: ResultHeaderProps) => {
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
      <p className="my-2 text-base desktop:text-xl text-primary-3">{subcopy}</p>
    </header>
  )
}

export default ResultHeader
