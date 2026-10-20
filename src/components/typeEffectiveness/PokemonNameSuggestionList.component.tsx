'use client'

import { MouseEvent, useEffect, useRef } from 'react'

import { SearchPokemonFormsWithTypesQuery } from '~/graphql/typeGenerated'
import { imageMode } from '~/modules/buildMode.module'
import { useLazyImage } from '~/hooks/useLazyImage'
import Button from '~/components/button/Button.component'
import Image from '~/components/Image.component'
import Tag from '~/components/tag/Tag.component'

export type PokemonNameOption =
  SearchPokemonFormsWithTypesQuery['searchPokemonWithAllForms'][number]

export type PokemonNameSuggestionStatus =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error'

interface PokemonNameSuggestionListProps {
  listboxId: string
  status: PokemonNameSuggestionStatus
  options: Array<PokemonNameOption>
  activeIndex: number
  query: string
  onSelect: (option: PokemonNameOption) => void
  onRetry: () => void
}

export const getOptionId = (listboxId: string, index: number) =>
  `${listboxId}-option-${index}`

const PANEL_CLASS =
  'w-full bg-primary-4 text-primary-1 rounded-lg border-2 border-solid border-primary-2 overflow-hidden'

interface OptionRowProps {
  id: string
  option: PokemonNameOption
  isActive: boolean
  onSelect: (option: PokemonNameOption) => void
}

const OptionRow = ({ id, option, isActive, onSelect }: OptionRowProps) => {
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

const PokemonNameSuggestionList = ({
  listboxId,
  status,
  options,
  activeIndex,
  query,
  onSelect,
  onRetry,
}: PokemonNameSuggestionListProps) => {
  const handleRetry = () => {
    onRetry()
  }

  if (status === 'loading') {
    return (
      <div className={PANEL_CLASS}>
        <p role="status" className="min-h-touch flex items-center px-4 text-sm">
          찾는 중이에요…
        </p>
      </div>
    )
  }

  if (status === 'empty') {
    return (
      <div className={PANEL_CLASS}>
        <div role="status" className="px-4 py-3 text-sm break-keep">
          <p className="font-medium">
            &lsquo;{query}&rsquo;와 맞는 포켓몬이 없어요
          </p>
          <p className="mt-1 text-primary-2">
            이름을 다시 확인하거나 타입을 직접 선택해 주세요.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={PANEL_CLASS}>
        <div
          role="status"
          className="flex flex-col items-start gap-2 px-4 py-3 text-sm break-keep"
        >
          <p>
            포켓몬을 불러오지 못했어요. 아래에서 타입을 직접 선택할 수 있어요.
          </p>
          <Button variant="ghost" size="sm" onClick={handleRetry}>
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={PANEL_CLASS}>
      <ul
        id={listboxId}
        role="listbox"
        aria-label="포켓몬 검색 결과"
        className="max-h-72 overflow-y-auto overscroll-contain desktop:max-h-80"
      >
        {options.map((option, index) => (
          <OptionRow
            key={`${option.number}-${option.formType}-${option.index}`}
            id={getOptionId(listboxId, index)}
            option={option}
            isActive={index === activeIndex}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </div>
  )
}

export default PokemonNameSuggestionList
