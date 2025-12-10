import { PokemonTypes } from '~/types/pokemonTypes.types'

interface OptionsMobileProps {
  selectTypeFilter: string
  selectDamageTypes: string
  selectGenerationId: string
  onClickSelectTypeFilter: (types: string) => void
  onClickSelectDamageTypeFilter: (damageTypes: string) => void
  onClickSelectgenerationId: (id: string) => void
}

const OptionsMobile = ({
  selectTypeFilter,
  selectDamageTypes,
  selectGenerationId,
  onClickSelectDamageTypeFilter,
  onClickSelectTypeFilter,
  onClickSelectgenerationId,
}: OptionsMobileProps) => {
  const handleClickSelectTypeFilter = (types: string) => () => {
    onClickSelectTypeFilter(types)
  }
  const handleClickSelectDamageTypeFilter = (damageTypes: string) => () => {
    onClickSelectDamageTypeFilter(damageTypes)
  }
  const handleClickSelectgenerationId = (id: string) => () => {
    onClickSelectgenerationId(id)
  }

  return (
    <ul className="w-full h-30 flex gap-3 flex-col justify-evenly transition-all duration-300 overflow-hidden">
      <li className="flex flex-row items-center gap-3">
        <p className="shrink-0 text-primary-4 font-semibold text-[0.875rem] min-w-[4rem] pt-1">
          기술 타입
        </p>
        <div className="w-full min-h-8 flex items-center flex-wrap gap-2 flex-1">
          {Object.entries(PokemonTypes).map(([types, typeName]) => {
            return (
              <button
                key={types}
                className={`min-w-[3rem] h-7 px-3 text-[0.875rem] leading-[calc(1.75rem+2px)] rounded-full chip-type-${types.toLowerCase()} will-change-[filter] transition-all ${selectTypeFilter === types ? 'opacity-100 scale-105 ' : 'opacity-60 grayscale hover:opacity-80 hover:grayscale-0'}`}
                onClick={handleClickSelectTypeFilter(types)}
              >
                {typeName}
              </button>
            )
          })}
        </div>
      </li>
      <li className="flex flex-row items-center gap-3">
        <p className="shrink-0 text-primary-4 font-semibold text-[0.875rem] min-w-[4rem] pt-1">
          기술 유형
        </p>
        <div className="flex flex-row items-center gap-3">
          <button
            className={`w-14 h-7 text-[0.875rem] leading-[calc(1.75rem+2px)] rounded-lg bg-[#fd8181] text-white transition-all ${selectDamageTypes === '물리' ? 'opacity-100 scale-105' : 'opacity-60 grayscale hover:opacity-80 hover:grayscale-0'}`}
            onClick={handleClickSelectDamageTypeFilter('물리')}
          >
            물리
          </button>
          <button
            className={`w-14 h-7 text-[0.875rem] leading-[calc(1.75rem+2px)] rounded-lg bg-[#9b9bfa] text-white transition-all ${selectDamageTypes === '특수' ? 'opacity-100 scale-105' : 'opacity-60 grayscale hover:opacity-80 hover:grayscale-0'}`}
            onClick={handleClickSelectDamageTypeFilter('특수')}
          >
            특수
          </button>
          <button
            className={`w-14 h-7 text-[0.875rem] leading-[calc(1.75rem+2px)] rounded-lg bg-[#72d372] text-white transition-all ${selectDamageTypes === '변화' ? 'opacity-100 scale-105' : 'opacity-60 grayscale hover:opacity-80 hover:grayscale-0'}`}
            onClick={handleClickSelectDamageTypeFilter('변화')}
          >
            변화
          </button>
        </div>
      </li>
      <li className="flex flex-row items-center gap-3">
        <p className="shrink-0 text-primary-4 font-semibold text-[0.875rem] min-w-[4rem] pt-1">
          첫 등장 세대
        </p>
        <div className="flex flex-row items-center gap-3">
          {new Array(9).fill('').map((_, index) => {
            const generationId = (index + 1).toString()
            return (
              <button
                key={`generation-filter-key-${index + 1}`}
                className={`w-14 h-7 text-[0.875rem] leading-[calc(1.75rem+2px)] rounded-lg transition-all ${selectGenerationId === generationId ? 'opacity-100 scale-105 bg-primary-4 text-primary-1' : 'opacity-60 grayscale bg-primary-3 text-white hover:opacity-80 hover:grayscale-0'}`}
                onClick={handleClickSelectgenerationId(generationId)}
              >
                {index + 1}
              </button>
            )
          })}
          <span className="text-primary-3 text-[0.875rem] self-end">
            선택하지 않으면 최신 세대 기준 스펙으로 나와요!
          </span>
        </div>
      </li>
    </ul>
  )
}

export default OptionsMobile
