'use client'

import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { useLazyImage } from '~/hook/useLazyImage'
import { imageMode } from '~/module/buildMode'

interface ResultListDataProps {
  name: string
  number: number
  formType: string
  imagePath: string
  formIndex: number
}

const ResultListData = ({
  name,
  number,
  imagePath,
  formType,
  formIndex,
}: ResultListDataProps) => {
  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({
      rootMargin: '50px',
      threshold: 0.1,
    })

  const getPokemonHref = () => {
    switch (formType) {
      case 'NORMAL_FORM': {
        return `/detail/${number}?${formIndex > 0 && `activeIndex=${formIndex}`}`
      }
      case 'MEGA': {
        return `/detail/${number}?activeType=mega${formIndex > 0 ? `&activeIndex=${formIndex}` : ''}`
      }
      case 'REGION_FORM': {
        return `/detail/${number}?activeType=region${formIndex > 0 ? `&activeIndex=${formIndex}` : ''}`
      }
      default: {
        return `/detail/${number}`
      }
    }
  }

  return (
    <li className="w-full h-11">
      <Link
        href={getPokemonHref()}
        className="w-full h-full flex items-center justify-between text-black-2 visited:text-black-2 active:text-black-2"
      >
        <p className="h-11 text-base leading-[2.75rem] text-black-2">{name}</p>
        <div ref={imgRef}>
          {isVisible && (
            <ImageComponent
              height="2rem"
              width="2rem"
              alt={`pokemon_id_${number} ${name}`}
              src={`${imageMode}/${imagePath}.webp?w=40&h=40`}
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
