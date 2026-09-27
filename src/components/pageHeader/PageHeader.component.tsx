interface PageHeaderProps {
  title: string
  description: string
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <header className="w-full text-center border-b border-solid border-primary-4 pt-4 pb-2 mb-6 desktop:mb-8">
      <h1 className="text-2xl desktop:text-4xl font-bold leading-tight text-primary-4">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl desktop:max-w-none mx-auto text-xs desktop:text-base text-primary-3 whitespace-break-spaces">
        {description}
      </p>
    </header>
  )
}

export default PageHeader
