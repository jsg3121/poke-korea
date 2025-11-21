interface PageHeaderProps {
  title: string
  description: string
}

const PageHeader = ({ description, title }: PageHeaderProps) => {
  return (
    <header className="w-[calc(100%-2.5rem)] h-32 text-center border-b border-solid border-primary-4 pt-4 mb-6 pb-2 mx-auto">
      <h1 className="h-16 text-[2rem] text-center leading-[4rem] text-primary-4 font-bold">
        {title}
      </h1>
      <p className="text-[0.875rem] text-primary-3 max-w-2xl mx-auto wrap whitespace-break-spaces ">
        {description}
      </p>
    </header>
  )
}

export default PageHeader
