'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

import { PokemonType } from '~/graphql/typeGenerated'
import { useLazyImage } from '~/hooks/useLazyImage'
import Ball from '~/components/ball/Ball.component'
import Image from '~/components/Image.component'
import Tag from '~/components/tag/Tag.component'

// Shell과 PokemonCardSkeleton이 공유한다 — 어긋나면 CLS가 발생한다.
export const POKEMON_CARD_SIZE = {
  width: 'min-w-36 max-w-48 desktop:max-w-none desktop:w-56',
  height: 'h-[15.5rem] desktop:h-80',
} as const

interface PokemonCardShellProps {
  href: string
  backgroundColor: string[]
  outlineColor?: string
  ballBadge?: ReactNode
  header: ReactNode
  imageSrc: string
  imageAlt: string
  imageSize: { width: number; height: number }
  types: PokemonType[]
  children: ReactNode
  isHighPriority?: boolean
  ariaLabel: string
}

const WHITE_OUTLINE = '#ffffff'

const PokemonCardShell = ({
  href,
  backgroundColor,
  outlineColor = WHITE_OUTLINE,
  ballBadge,
  header,
  imageSrc,
  imageAlt,
  imageSize,
  types,
  children,
  isHighPriority = false,
  ariaLabel,
}: PokemonCardShellProps) => {
  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({ rootMargin: '200px', threshold: 0.1 })

  const gradientStyle =
    backgroundColor.length === 1
      ? { backgroundColor: backgroundColor[0] }
      : {
          backgroundImage: `linear-gradient(135deg, ${backgroundColor[0]} 35%, ${backgroundColor[1]} 65%)`,
        }

  return (
    <Link href={href} className={`block mx-auto ${POKEMON_CARD_SIZE.width}`}>
      <article
        className={`w-full ${POKEMON_CARD_SIZE.height} flex flex-col text-black-2 border border-solid border-black-2 rounded-[10px] p-2 desktop:p-3 relative overflow-hidden shadow-[inset_10px_0_0_0_rgb(51_65_80)] outline outline-[0.25rem] cursor-pointer card-corner-fold transition-transform duration-300 ease-[cubic-bezier(0.03,0.57,0.37,1.02)] desktop:hover:scale-105 desktop:hover:z-10`}
        style={{ ...gradientStyle, outlineColor }}
        aria-label={ariaLabel}
      >
        <header className="w-full min-h-8 flex items-start justify-between relative z-10">
          <i className="w-6 desktop:w-8 h-6 desktop:h-8 flex-shrink-0 mr-2 relative">
            <Ball />
            {ballBadge}
          </i>
          {header}
        </header>

        {isHighPriority ? (
          <div className="flex-1 min-h-0 w-full flex items-center justify-center my-1 relative">
            <div className="h-full max-h-28 desktop:max-h-40 aspect-square drop-shadow-[2px_3px_2px_#333333]">
              <Image
                height="100%"
                width="100%"
                imageSize={imageSize}
                densities={[1, 1.5]}
                alt={imageAlt}
                src={imageSrc}
                sizes="(min-width: 769px) 10rem, 7rem"
                fetchPriority="high"
              />
            </div>
          </div>
        ) : (
          <div
            ref={imgRef}
            className="flex-1 min-h-0 w-full flex items-center justify-center my-1 relative"
          >
            {isVisible ? (
              <div className="h-full max-h-28 desktop:max-h-40 aspect-square drop-shadow-[2px_3px_2px_#333333]">
                <Image
                  height="100%"
                  width="100%"
                  imageSize={imageSize}
                  densities={[1, 1.5]}
                  alt={imageAlt}
                  src={imageSrc}
                  sizes="(min-width: 769px) 10rem, 7rem"
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                />
              </div>
            ) : (
              <div className="h-full max-h-28 desktop:max-h-40 aspect-square bg-gray-300 opacity-30 animate-pulse rounded-lg" />
            )}
          </div>
        )}

        <div className="w-full flex items-center gap-2 px-2 mx-auto justify-start">
          {types.map((item, index) => (
            <Tag key={`${item}-id-${index}`} type={item} />
          ))}
        </div>

        {children}
      </article>
    </Link>
  )
}

export default PokemonCardShell
