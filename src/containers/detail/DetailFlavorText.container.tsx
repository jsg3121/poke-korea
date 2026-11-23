'use client'

import {
  KeyboardEvent,
  MouseEvent,
  useContext,
  useId,
  useRef,
  useState,
} from 'react'

import { DetailContext } from '~/context/Detail.context'
import SelectInput from '~/components/input/SelectInput.component'

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
  const generationOptions = generations.map(({ generationId }) => ({
    value: String(generationId),
    label: `${generationId}세대`,
  }))
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

  const handleChangeGeneration = (value: string) => {
    setSelectedGenerationId(Number(value))
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

          <div className="mb-4 desktop:hidden">
            <SelectInput
              label="세대 선택"
              tone="onLight"
              fullWidth
              value={String(activeGenerationId)}
              options={generationOptions}
              onChange={handleChangeGeneration}
            />
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
