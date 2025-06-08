import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { imageMode } from '~/module/buildMode'

interface ResultListDataProps {
  name: string
  number: number
}

const ResultListData = ({ name, number }: ResultListDataProps) => {
  return (
    <li className="w-full h-11">
      <Link
        href={`/detail/${number}`}
        className="w-full h-full flex items-center justify-between text-black-2 visited:text-black-2 active:text-black-2"
      >
        <p className="h-11 text-base leading-[2.75rem] text-black-2">{name}</p>
        <ImageComponent
          height="2rem"
          width="2rem"
          alt={`pokemon_id_${number} ${name}`}
          src={`${imageMode}/${number}.webp`}
          unoptimized
        />
      </Link>
    </li>
  )
}

export default ResultListData
