import Button from '~/components/button/Button.component'

import {
  PokemonNameOption,
  PokemonNameSuggestionStatus,
} from './pokemonNameSearch.types'
import PokemonNameSuggestionOption from './PokemonNameSuggestionOption.component'
import { getOptionKey } from './utils/pokemonNameOption.util'

interface PokemonNameSuggestionListProps {
  status: PokemonNameSuggestionStatus
  options: Array<PokemonNameOption>
  query: string
  onSelectPokemon: (option: PokemonNameOption, isKeyboard: boolean) => void
  onClickRetry: () => void
}

const PANEL_CLASS =
  'w-full bg-primary-4 text-primary-1 rounded-lg border-2 border-solid border-primary-2 overflow-hidden'

const PokemonNameSuggestionList = ({
  status,
  options,
  query,
  onSelectPokemon,
  onClickRetry,
}: PokemonNameSuggestionListProps) => {
  const handleClickRetry = () => {
    onClickRetry()
  }

  if (status === 'loading') {
    return (
      <div className={PANEL_CLASS}>
        <p className="min-h-touch flex items-center px-4 text-sm">
          찾는 중이에요…
        </p>
      </div>
    )
  }

  if (status === 'empty') {
    return (
      <div className={PANEL_CLASS}>
        <div className="px-4 py-3 text-sm break-keep">
          <p className="font-medium">
            &lsquo;{query}&rsquo;와 맞는 포켓몬이 없어요
          </p>
          <p className="mt-1 text-primary-1">
            이름을 다시 확인하거나 타입을 직접 선택해 주세요.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={PANEL_CLASS}>
        <div className="flex flex-col items-start gap-2 px-4 py-3 text-sm break-keep">
          <p>
            포켓몬을 불러오지 못했어요. 아래에서 타입을 직접 선택할 수 있어요.
          </p>
          <Button variant="ghost" size="sm" onClick={handleClickRetry}>
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={PANEL_CLASS}>
      <ul
        aria-label="포켓몬 검색 결과"
        className="max-h-72 overflow-y-auto overscroll-contain desktop:max-h-80"
      >
        {options.map((option) => (
          <PokemonNameSuggestionOption
            key={getOptionKey(option)}
            option={option}
            onSelectPokemon={onSelectPokemon}
          />
        ))}
      </ul>
    </div>
  )
}

export default PokemonNameSuggestionList
