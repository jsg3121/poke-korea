interface ResultHeaderProps {
  medal: string
  headline: string
  subcopy: string
}

const ResultHeader = ({ headline, medal, subcopy }: ResultHeaderProps) => {
  return (
    <header className="w-full h-[22rem]">
      <span className="w-fit h-[14rem] text-[10rem] block mx-auto">
        {medal}
      </span>
      <h1 className="w-full text-[2rem] font-bold text-center leading-[calc(2rem+2px)] text-primary-4">
        {headline}
      </h1>
      <p className="w-full h-[1.25rem] text-[1.25rem] text-center text-primary-3 leading-[calc(1.25rem+2px)] mt-[1.5rem]">
        {subcopy}
      </p>
    </header>
  )
}

export default ResultHeader
