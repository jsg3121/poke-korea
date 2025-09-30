interface GuideHeaderProps {
  title: string
  description: string
}

const GuideHeader = ({ description, title }: GuideHeaderProps) => {
  return (
    <header className="w-full py-[1rem] border-b border-solid border-primary-4 mb-[2rem]">
      <h1 className="w-full text-[2rem] font-bold text-center text-primary-4 mb-[0.5rem]">
        {title}
      </h1>
      <p className="w-full h-[2rem] text-[1rem] leading-[2rem] text-center text-primary-3">
        {description}
      </p>
    </header>
  )
}

export default GuideHeader
