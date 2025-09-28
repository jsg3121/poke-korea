interface ResultHeaderProps {
  medal: string
  headline: string
  subcopy: string
}

const ResultHeader = ({ headline, medal, subcopy }: ResultHeaderProps) => {
  return (
    <header className="w-full h-[15rem]">
      <span className="w-fit h-[9rem] text-[6rem] block mx-auto">{medal}</span>
      <h1 className="w-full text-[1.5rem] font-bold text-center leading-[calc(1.5rem+2px)] text-primary-4">
        {headline}
      </h1>
      <p className="w-full h-[1.25rem] text-[1rem] text-center text-primary-3 leading-[calc(1.25rem+2px)] mt-[1.5rem]">
        {subcopy}
      </p>
    </header>
  )
}

export default ResultHeader
