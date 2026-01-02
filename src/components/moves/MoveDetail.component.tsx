import {
  PokemonSkillDetail,
  PokemonSkillGeneration,
} from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { getDamageTypeKorean } from '~/utils/skill.util'

interface MoveDetailComponentProps {
  skillData: PokemonSkillDetail
  selectedGenerationData?: PokemonSkillGeneration
  isShowTooltip?: boolean
}

const MoveDetailComponent = ({
  skillData,
  selectedGenerationData,
  isShowTooltip = false,
}: MoveDetailComponentProps) => {
  // 선택된 세대 데이터가 있으면 그것을 우선 사용, 없으면 기본 skillData 사용
  const displayData = selectedGenerationData || skillData

  return (
    <section className="w-full mx-auto min-h-32 pb-4 relative px-4 md:px-0 md:mb-4">
      <header className="flex items-end gap-4 mb-4">
        <h1 className="text-[2.5rem] text-primary-4 font-bold">
          {skillData.nameKo}
        </h1>
        {selectedGenerationData && (
          <span className="px-3 py-1 rounded-lg text-primary-3 text-lg font-medium">
            {selectedGenerationData.generationId}세대
          </span>
        )}
        {!skillData.isAvailable && (
          <span className="h-6 px-3 py-1 text-[0.875rem] leading-[calc(1rem+2px)] bg-red-300 text-primary-1 rounded-lg block mb-2">
            삭제된 기술
          </span>
        )}
      </header>
      <dl className="flex flex-wrap items-center gap-2 text-lg mb-4 mobile:hidden">
        <dt className="font-semibold text-primary-3">타입:</dt>
        <dd className="py-1 rounded-full bg-primary-1 text-white">
          {displayData.type && (
            <span
              className={`h-6 block px-3 text-[0.875rem] text-aligned-sm rounded-full chip-type-${displayData.type.toLowerCase()}`}
            >
              {PokemonTypes[displayData.type]}
            </span>
          )}
        </dd>
        <dt className="font-semibold text-primary-3">분류:</dt>
        <dd
          className={`py-1 rounded-full text-[1.25rem] ${displayData.damageType === 'physical' ? 'text-[#fd8181]' : displayData.damageType === 'special' ? 'text-[#9b9bfa]' : 'text-[#72d372]'}`}
        >
          {getDamageTypeKorean(displayData.damageType)}
        </dd>
        <dt className="font-semibold text-primary-3">위력:</dt>
        <dd className="text-primary-4 font-bold">{displayData.power}</dd>
        <dt className="font-semibold text-primary-3">명중률:</dt>
        <dd className="text-primary-4 font-bold">{displayData.accuracy}</dd>
        <dt className="font-semibold text-primary-3">PP:</dt>
        <dd className="text-primary-4 font-bold">{displayData.pp}</dd>
      </dl>
      <dl className="flex items-center flex-wrap gap-2 mb-2 desktop:hidden">
        <dt className="text-[1.25rem] font-semibold text-primary-3">타입:</dt>
        <dd className="py-1 rounded-full bg-primary-1 text-white">
          {displayData.type && (
            <span
              className={`h-6 block px-3 text-[0.875rem] text-aligned-sm rounded-full chip-type-${displayData.type.toLowerCase()}`}
            >
              {PokemonTypes[displayData.type]}
            </span>
          )}
        </dd>
        <dt className="text-[1.25rem] font-semibold text-primary-3">분류:</dt>
        <dd
          className={`py-1 rounded-full text-[1.25rem] ${displayData.damageType === 'physical' ? 'text-[#fd8181]' : displayData.damageType === 'special' ? 'text-[#9b9bfa]' : 'text-[#72d372]'}`}
        >
          {getDamageTypeKorean(displayData.damageType)}
        </dd>
      </dl>
      <dl className="flex items-center flex-wrap gap-2 mb-8 desktop:hidden">
        <dt className="text-[1.25rem] font-semibold text-primary-3">위력:</dt>
        <dd className="text-[1.25rem] text-primary-4 font-bold">
          {displayData.power}
        </dd>
        <dt className="text-[1.25rem] font-semibold text-primary-3">명중률:</dt>
        <dd className="text-[1.25rem] text-primary-4 font-bold">
          {displayData.accuracy}
        </dd>
        <dt className="text-[1.25rem] font-semibold text-primary-3">PP:</dt>
        <dd className="text-[1.25rem] text-primary-4 font-bold">
          {displayData.pp}
        </dd>
      </dl>
      {isShowTooltip && (
        <span className="text-base text-primary-3 block mt-4">
          * 공식 번역이 없어 번역중이니 조금만 기다려주세요!
        </span>
      )}
      {displayData.description && (
        <p className="min-h-8 text-[1.725rem] text-aligned-base text-primary-4">
          {displayData.description}
        </p>
      )}
    </section>
  )
}

export default MoveDetailComponent
