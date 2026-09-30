interface InfoCardTitleProps {
  title: string
  id?: string
  badge?: string
}

const InfoCardTitle = ({ id, title, badge }: InfoCardTitleProps) => {
  return (
    <h2
      id={id}
      className="flex w-full h-8 leading-8 mb-4 text-lg desktop:h-11 desktop:leading-[2.75rem] desktop:mb-6 desktop:text-[1.75rem] font-bold text-left border-b border-solid border-primary-1 items-center gap-2"
    >
      {title}
      {badge && (
        <span className="h-5 rounded-md bg-primary-1 px-2 text-2xs font-semibold leading-5 text-primary-4 desktop:h-6 desktop:text-xs desktop:leading-[calc(1.5rem+2px)]">
          {badge}
        </span>
      )}
    </h2>
  )
}

export default InfoCardTitle
