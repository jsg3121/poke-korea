interface InfoTitleProps {
  name: string
}

const InfoTitle = ({ name }: InfoTitleProps) => {
  const fontSize =
    name.length > 14 ? 'small' : name.length > 6 ? 'medium' : 'large'

  return (
    <h1
      data-name-size={fontSize}
      className="w-[30rem] h-28 leading-[7rem] font-medium text-white-1 text-center data-[name-size=large]:text-[3rem] data-[name-size=medium]:text-[2.5rem] data-[name-size=small]:text-[1.8rem]"
    >
      {name}
    </h1>
  )
}

export default InfoTitle
