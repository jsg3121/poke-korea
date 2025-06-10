interface InfoTitleComponentProps {
  name: string
}

const InfoTitleComponent = ({ name }: InfoTitleComponentProps) => {
  const fontSize =
    name.length > 14 ? 'small' : name.length > 6 ? 'medium' : 'large'

  return (
    <h2
      data-name-size={fontSize}
      className="w-full h-28 leading-[7rem] font-medium text-white-1 text-center mx-auto data-[name-size=large]:text-[2.5rem] data-[name-size=medium]:text-[2rem] data-[name-size=small]:text-[1.2rem]"
    >
      {name}
    </h2>
  )
}

export default InfoTitleComponent
