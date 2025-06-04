interface InfoCardTitleComponentProps {
  id?: string
  title: string
}

const InfoCardTitleComponent = ({ id, title }: InfoCardTitleComponentProps) => {
  return (
    <h2 
      id={id}
      className="w-full h-11 text-[1.75rem] leading-[2.75rem] font-bold text-left border-b border-primary-1 mb-6"
    >
      {title}
    </h2>
  )
}

export default InfoCardTitleComponent
