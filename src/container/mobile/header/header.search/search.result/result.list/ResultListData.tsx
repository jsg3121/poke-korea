import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { useLazyImage } from '~/hook/useLazyImage'
import { imageMode } from '~/module/buildMode'

interface ResultListDataProps {
  name: string
  number: number
}

const ResultListData = ({ name, number }: ResultListDataProps) => {
  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({
      rootMargin: '50px',
      threshold: 0.1,
    })

  return (
    <li className="w-full h-11">
      <Link
        href={`/detail/${number}`}
        className="w-full h-full flex items-center justify-between text-black-2 visited:text-black-2 active:text-black-2"
      >
        <p className="h-11 text-base leading-[2.75rem] text-black-2">{name}</p>
        <div ref={imgRef}>
          {isVisible && (
            <ImageComponent
              height="2rem"
              width="2rem"
              alt={`pokemon_id_${number} ${name}`}
              src={`${imageMode}/${number}.webp?w=40&h=40`}
              fetchPriority="high"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
            />
          )}
        </div>
      </Link>
    </li>
  )
}

export default ResultListData
