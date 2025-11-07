interface PageHeaderProps {
  title: string
  description: string
}

const PageHeader = ({ description, title }: PageHeaderProps) => {
  return (
    <header className="w-full h-30 text-center border-b border-solid border-primary-4 pt-4">
      <h1 className="h-16 text-[2rem] text-center leading-[4rem] text-primary-4 font-bold">
        {title}
      </h1>
      <p className="text-[0.875rem] text-primary-3 max-w-2xl mx-auto">
        {description}
      </p>
    </header>
  )
}

export default PageHeader
