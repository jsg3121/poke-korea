interface GuideHeaderProps {
  title: string
  description: string
}

const GuideHeader = ({ description, title }: GuideHeaderProps) => {
  return (
    <header className="w-full h-[8rem] pb-[1rem] pt-[1rem] border-b border-solid border-primary-4 mb-[2rem]">
      <h1 className="w-full h-[4rem] text-[2.5rem] leading-[4rem] font-bold text-center text-primary-4">
        {title}
      </h1>
      <p className="w-full h-[2rem] text-[1rem] leading-[2rem] text-center text-primary-3">
        {description}
      </p>
    </header>
  )
}

export default GuideHeader
