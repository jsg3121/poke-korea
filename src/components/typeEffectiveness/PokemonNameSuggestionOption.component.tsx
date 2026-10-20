'use client'

import { MouseEvent, useEffect, useRef } from 'react'

import { imageMode } from '~/modules/buildMode.module'
import { useLazyImage } from '~/hooks/useLazyImage'
import Image from '~/components/Image.component'
import Tag from '~/components/tag/Tag.component'

import { PokemonNameOption } from './pokemonNameSearch.types'

interface PokemonNameSuggestionOptionProps {
  id: string
  option: PokemonNameOption
  isActive: boolean
  onSelect: (option: PokemonNameOption) => void
}

const PokemonNameSuggestionOption = ({
  id,
  option,
  isActive,
  onSelect,
}: PokemonNameSuggestionOptionProps) => {
  const rowRef = useRef<HTMLLIElement>(null)
  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({
      rootMargin: '50px',
      threshold: 0.1,
    })

  useEffect(() => {
    if (isActive) {
      rowRef.current?.scrollIntoView({ block: 'nearest' })
    }
  }, [isActive])

  const handleMouseDown = (e: MouseEvent<HTMLLIElement>) => {
    e.preventDefault()
  }

  const handleClick = () => {
    onSelect(option)
  }

  return (
    <li
      ref={rowRef}
      id={id}
      role="option"
      aria-selected={isActive}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={`flex items-center gap-2 min-h-touch px-3 py-1 border-l-4 border-solid cursor-pointer hover:bg-primary-3 hover:border-primary-1 ${
        isActive ? 'bg-primary-3 border-primary-1' : 'border-transparent'
      }`}
    >
      <div ref={imgRef} className="shrink-0 w-8 h-8">
        {isVisible && (
          <Image
            height="2rem"
            width="2rem"
            alt=""
            src={`${imageMode}/${option.imagePath}`}
            imageSize={{ width: 32, height: 32 }}
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
      <span className="flex-1 min-w-0 text-sm desktop:text-base break-keep">
        {option.name}
      </span>
      <span className="sr-only">타입:</span>
      <span className="shrink-0 flex gap-1">
        {option.types.map((type) => (
          <Tag key={type} type={type} />
        ))}
      </span>
    </li>
  )
}

export default PokemonNameSuggestionOption
