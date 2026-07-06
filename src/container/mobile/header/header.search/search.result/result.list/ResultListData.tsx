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
        return formIndex > 0
          ? `/detail/${number}/form/${formIndex}`
          : `/detail/${number}`
      }
      case 'MEGA': {
        return formIndex > 0
          ? `/detail/${number}/mega/${formIndex}`
          : `/detail/${number}/mega`
      }
      case 'REGION_FORM': {
        return formIndex > 0
          ? `/detail/${number}/region/${formIndex}`
          : `/detail/${number}/region`
      }
      default: {
        return `/detail/${number}`
      }
    }
  }

  return (
    // 높이 고정(h-11)+leading 44px는 긴 이름(팔데아 폼 등)이 2줄로 감기면 항목끼리
    // 겹친다 → 최소 높이(min-h-11, 터치 타겟 유지)+자동 확장으로 변경. 말줄임은
    // 폼 이름 구분이 불가능해져(전부 "…팔데아의 모습…"으로 잘림) 쓰지 않는다.
    <li className="w-full">
      <Link
        href={getPokemonHref()}
        className="w-full min-h-11 py-1 gap-2 flex-between text-black-2 visited:text-black-2 active:text-black-2"
      >
        <p className="text-sm leading-5 break-keep text-black-2">{name}</p>
        <div ref={imgRef} className="shrink-0">
          {isVisible && (
            <ImageComponent
              height="2rem"
              width="2rem"
              alt={`pokemon_id_${number} ${name}`}
              src={`${imageMode}/${imagePath}`}
              imageSize={{ width: 24, height: 24 }}
              densities={[1, 1.5]}
              sizes="2rem"
              loading="lazy"
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
