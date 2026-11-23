'use client'

import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useContext,
  useId,
  useRef,
  useState,
} from 'react'

import { DetailContext } from '~/context/Detail.context'

import DetailFlavorTextPanel from './DetailFlavorTextPanel.component'
import { getFlavorTextSection } from './modules/flavorText.module'
import InfoCardTitle from './shared/InfoCardTitle.component'

const DetailFlavorText = () => {
  const { pokemonBaseInfo, activeType, activeIndex } = useContext(DetailContext)
  const [selectedGenerationId, setSelectedGenerationId] = useState<
    number | null
  >(null)
  const tablistRef = useRef<HTMLDivElement>(null)
  const baseId = useId()

  const { isFallback, generations } = getFlavorTextSection({
    flavorTexts: pokemonBaseInfo?.flavorTexts ?? [],
    activeType,
    activeIndex,
  })
  const activeGenerationId = generations.some(
    ({ generationId }) => generationId === selectedGenerationId,
  )
    ? selectedGenerationId
    : (generations[0]?.generationId ?? null)
  const hasGenerationSelector = generations.length > 1
  const selectId = `${baseId}-select`
  const getTabId = (generationId: number) => `${baseId}-tab-${generationId}`
  const getPanelId = (generationId: number) => `${baseId}-panel-${generationId}`

  const handleClickTab = (e: MouseEvent<HTMLButtonElement>) => {
    setSelectedGenerationId(Number(e.currentTarget.value))
  }

  const handleKeyDownTab = (e: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = generations.findIndex(
      ({ generationId }) => generationId === activeGenerationId,
    )
    const lastIndex = generations.length - 1
    const nextIndexByKey: Record<string, number> = {
      ArrowRight: currentIndex === lastIndex ? 0 : currentIndex + 1,
      ArrowLeft: currentIndex === 0 ? lastIndex : currentIndex - 1,
      Home: 0,
      End: lastIndex,
    }
    const nextIndex = nextIndexByKey[e.key]
    const nextGeneration =
      nextIndex === undefined ? undefined : generations[nextIndex]
    if (nextIndex === undefined || !nextGeneration) return

    e.preventDefault()
    setSelectedGenerationId(nextGeneration.generationId)
    tablistRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [nextIndex]?.focus()
  }

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenerationId(Number(e.target.value))
  }

  if (generations.length === 0 || activeGenerationId === null) return null

  return (
    <section aria-labelledby="pokemon-flavor-text" className="card-detail">
      <InfoCardTitle title="도감 설명" id="pokemon-flavor-text" />
      {isFallback && (
        <p className="-mt-2 mb-4 text-xs text-primary-1 desktop:-mt-3 desktop:mb-6 desktop:text-sm">
          기본 모습 기준 설명이에요
        </p>
      )}

      {hasGenerationSelector && (
        <>
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="세대 선택"
            className="mb-6 hidden flex-wrap gap-2 desktop:flex"
          >
            {generations.map(({ generationId }) => {
              const isSelected = generationId === activeGenerationId

              return (
                <button
                  key={`flavor-tab-${generationId}`}
                  id={getTabId(generationId)}
                  type="button"
                  role="tab"
                  value={generationId}
                  aria-selected={isSelected}
                  aria-controls={getPanelId(generationId)}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={handleClickTab}
                  onKeyDown={handleKeyDownTab}
                  className={`min-h-touch whitespace-nowrap rounded-lg border-2 border-solid px-4 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1 ${
                    isSelected
                      ? 'border-primary-1 bg-primary-1 font-bold text-primary-4'
                      : 'border-primary-2 bg-transparent font-medium text-primary-1 hover:bg-primary-3'
                  }`}
                >
                  {generationId}세대
                </button>
              )
            })}
          </div>

          <div className="mb-4 flex items-center gap-2 desktop:hidden">
            <label
              htmlFor={selectId}
              className="shrink-0 text-sm font-bold text-primary-1"
            >
              세대 선택
            </label>
            <div className="relative min-w-0 flex-1">
              <select
                id={selectId}
                value={activeGenerationId}
                onChange={handleChangeSelect}
                className="min-h-touch w-full cursor-pointer appearance-none rounded-md border-2 border-solid border-primary-2 bg-primary-4 pl-3 pr-10 text-md font-medium text-primary-1 transition-colors hover:bg-primary-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
              >
                {generations.map(({ generationId }) => (
                  <option
                    key={`flavor-option-${generationId}`}
                    value={generationId}
                  >
                    {generationId}세대
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-1"
              >
                <path
                  d="M4 6l4 4 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </>
      )}

      {generations.map((generation) => {
        const { generationId } = generation

        return hasGenerationSelector ? (
          <div
            key={`flavor-panel-${generationId}`}
            id={getPanelId(generationId)}
            role="tabpanel"
            aria-labelledby={getTabId(generationId)}
            hidden={generationId !== activeGenerationId}
          >
            <DetailFlavorTextPanel generation={generation} />
          </div>
        ) : (
          <DetailFlavorTextPanel
            key={`flavor-panel-${generationId}`}
            generation={generation}
          />
        )
      })}
    </section>
  )
}

export default DetailFlavorText
