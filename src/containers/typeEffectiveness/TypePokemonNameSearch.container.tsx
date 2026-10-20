'use client'

import { MouseEvent, useEffect, useId, useRef, useState } from 'react'

import { trackEvent } from '~/modules/analytics.module'
import { useDebounce } from '~/hooks/useDebounce'
import { useTypeEffectiveness } from '~/context/TypeEffectiveness.context'
import SearchInput from '~/components/input/SearchInput.component'
import { PokemonNameOption } from '~/components/typeEffectiveness/pokemonNameSearch.types'
import PokemonNameSuggestionList from '~/components/typeEffectiveness/PokemonNameSuggestionList.component'
import SelectedPokemonBar from '~/components/typeEffectiveness/SelectedPokemonBar.component'

import { usePokemonNameSearch } from './hooks/usePokemonNameSearch'
import { toTypesParam } from './shared/typeCalcEvent.util'
import { toFormTypeParam } from './utils/formTypeParam.util'
import { moveToResultTitle } from './utils/resultTitle.util'

const MAX_QUERY_LENGTH = 30
const EVENT_QUERY_MAX_LENGTH = 20
const LOADING_MESSAGE = '포켓몬을 찾는 중이에요'
const ERROR_MESSAGE = '포켓몬을 불러오지 못했어요'

const TypePokemonNameSearch = () => {
  const { selectedPokemon, handleSelectPokemon } = useTypeEffectiveness()
  const helpId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const hasSearchedRef = useRef(false)
  const isKeyboardSelectRef = useRef(false)
  const [inputValue, setInputValue] = useState('')
  const [keyword, debounce] = useDebounce()
  const { options, status, retry } = usePokemonNameSearch(keyword)

  const isPanelVisible =
    status !== 'idle' &&
    inputValue.trim() !== '' &&
    inputValue !== selectedPokemon?.name

  const getStatusMessage = () => {
    if (!isPanelVisible) return ''
    if (status === 'loading') return LOADING_MESSAGE
    if (status === 'error') return ERROR_MESSAGE
    if (status === 'empty') return `'${keyword}'와 맞는 포켓몬이 없어요`
    return `포켓몬 ${options.length}개를 찾았어요. Tab으로 이동해 고를 수 있어요`
  }

  const handleChangeQuery = (value: string) => {
    setInputValue(value)
    debounce(value.trim())
  }

  const handleSelectOption = (
    option: PokemonNameOption,
    isKeyboard: boolean,
  ) => {
    trackEvent('use_name_search', {
      source: 'type_calc',
      query: inputValue.trim().slice(0, EVENT_QUERY_MAX_LENGTH),
      pokemon_number: option.number,
      form_type: toFormTypeParam(option.formType),
      is_first_search: hasSearchedRef.current ? 'false' : 'true',
    })
    trackEvent('use_type_calc', {
      input_method: 'name',
      types: toTypesParam(option.types),
    })
    hasSearchedRef.current = true

    isKeyboardSelectRef.current = isKeyboard
    if (!isKeyboard) {
      inputRef.current?.blur()
    }
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
    moveToResultTitle(isKeyboardSelectRef.current)
    // ↓ selectedPokemon이 바뀔 때만 실행하는 것이 의도. debounce는 렌더마다 새로 만들어지는 setter 래퍼다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPokemon])

  return (
    <div className="mb-4 flex flex-col gap-3 desktop:flex-row desktop:flex-wrap desktop:items-end desktop:gap-x-4">
      <div className="group relative order-1 w-full desktop:max-w-md">
        <SearchInput
          ref={inputRef}
          label="포켓몬 이름으로 찾기"
          visuallyHiddenLabel={false}
          type="text"
          placeholder="예: 리자몽"
          value={inputValue}
          onChange={handleChangeQuery}
          maxLength={MAX_QUERY_LENGTH}
          autoComplete="off"
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
              onSelectPokemon={handleSelectOption}
              onClickRetry={retry}
            />
          </div>
        )}
      </div>
      <p
        id={helpId}
        className="order-2 text-xs text-primary-3 desktop:order-3 desktop:basis-full desktop:text-sm"
      >
        특성·지닌 도구 효과는 반영하지 않고 타입만 계산해요.
      </p>
      {selectedPokemon !== null && (
        <div className="order-3 w-full desktop:order-2 desktop:w-auto desktop:flex-1">
          <SelectedPokemonBar pokemon={selectedPokemon} />
        </div>
      )}
      <p role="status" className="sr-only">
        {getStatusMessage()}
      </p>
    </div>
  )
}

export default TypePokemonNameSearch
