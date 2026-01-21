import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { getFormUrl } from '../../module/image.module'
import { TActiveType } from '~/types/detailContext.type'

interface PrevFormButtonComponentProps {
  activeType: TActiveType
  pokemonNumber: number
  activeIndex: number
  isShiny: boolean
  imageSrc: string
  imageAlt: string
  name?: string
}

const PrevFormButtonComponent = ({
  activeType,
  pokemonNumber,
  activeIndex,
  name,
  imageAlt,
  imageSrc,
  isShiny,
}: PrevFormButtonComponentProps) => {
  return (
    <i className="absolute left-0 top-1/2 w-24 h-24 z-10">
      <Link
        href={getFormUrl({
          activeIndex: activeIndex - 1,
          pokemonNumber,
          activeType,
          isShiny,
        })}
        className="block w-full h-full opacity-60 hover:opacity-90 transition-opacity"
        aria-label={`다음 폼: ${name}`}
        prefetch={true}
      >
        <ImageComponent
          src={imageSrc}
          width="6rem"
          height="6rem"
          alt={imageAlt}
          imageSize={{ width: 96, height: 96 }}
          loading="lazy"
        />
      </Link>
    </i>
  )
}

export default PrevFormButtonComponent
