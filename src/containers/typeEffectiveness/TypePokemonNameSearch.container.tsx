'use client'

import { MouseEvent, useEffect, useId, useRef, useState } from 'react'

import { useDebounce } from '~/hooks/useDebounce'
import { useTypeEffectiveness } from '~/context/TypeEffectiveness.context'
import SearchInput from '~/components/input/SearchInput.component'
import { PokemonNameOption } from '~/components/typeEffectiveness/pokemonNameSearch.types'
import PokemonNameSuggestionList from '~/components/typeEffectiveness/PokemonNameSuggestionList.component'
import SelectedPokemonBar from '~/components/typeEffectiveness/SelectedPokemonBar.component'

import { usePokemonNameSearch } from './hooks/usePokemonNameSearch'
import { scrollToResultTitle } from './utils/resultTitle.util'

const MAX_QUERY_LENGTH = 30

const TypePokemonNameSearch = () => {
  const { selectedPokemon, handleSelectPokemon } = useTypeEffectiveness()
  const helpId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [keyword, debounce] = useDebounce()
  const { options, status, retry } = usePokemonNameSearch(keyword)

  const isPanelVisible =
    status !== 'idle' &&
    inputValue.trim() !== '' &&
    inputValue !== selectedPokemon?.name

  const handleChange = (value: string) => {
    setInputValue(value)
    debounce(value.trim())
  }

  const handleSelect = (option: PokemonNameOption) => {
    inputRef.current?.blur()
    handleSelectPokemon(option)
    setInputValue(option.name)
  }

  const handlePanelMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  useEffect(() => {
    if (selectedPokemon === null) {
      setInputValue('')
      debounce('')
      return
    }
    scrollToResultTitle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPokemon])

  return (
    <div className="mb-4 flex flex-col gap-2 desktop:flex-row desktop:items-start desktop:gap-4">
      <div className="w-full desktop:max-w-md">
        <div className="group relative">
          <SearchInput
            ref={inputRef}
            label="포켓몬 이름으로 찾기"
            visuallyHiddenLabel={false}
            type="text"
            placeholder="예: 리자몽"
            value={inputValue}
            onChange={handleChange}
            maxLength={MAX_QUERY_LENGTH}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-describedby={helpId}
          />
          {isPanelVisible && (
            <div
              onMouseDown={handlePanelMouseDown}
              className="absolute inset-x-0 top-full z-50 mt-1 hidden group-focus-within:block"
            >
              <PokemonNameSuggestionList
                status={status}
                options={options}
                query={keyword}
                onSelect={handleSelect}
                onRetry={retry}
              />
            </div>
          )}
        </div>
        <p id={helpId} className="mt-1 text-xs text-primary-3 desktop:text-sm">
          특성·지닌 도구 효과는 반영하지 않고 타입만 계산해요.
        </p>
      </div>
      {selectedPokemon !== null && (
        <div className="w-full desktop:mt-6 desktop:flex-1">
          <SelectedPokemonBar pokemon={selectedPokemon} />
        </div>
      )}
    </div>
  )
}

export default TypePokemonNameSearch
