import {
  PokemonSkillDetail,
  PokemonSkillGeneration,
} from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { getDamageTypeKorean } from '~/utils/skill.util'

interface MoveDetailComponentProps {
  skillData: PokemonSkillDetail
  selectedGenerationData?: PokemonSkillGeneration
}

const MoveDetailComponent = ({
  skillData,
  selectedGenerationData,
}: MoveDetailComponentProps) => {
  // 선택된 세대 데이터가 있으면 그것을 우선 사용, 없으면 기본 skillData 사용
  const displayData = selectedGenerationData || skillData

  return (
    <section className="w-[calc(100%-2.5rem)] mx-auto min-h-32 pb-4 relative">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-[2.5rem] text-primary-4 font-bold">
          {skillData.nameKo}
        </h1>
        {selectedGenerationData && (
          <span className="px-3 py-1 rounded-lg bg-primary-1 text-white text-lg font-medium">
            {selectedGenerationData.generationId}세대
          </span>
        )}
      </div>

      {/* 기본 정보 */}
      <div className="flex flex-wrap gap-4 text-lg mb-4">
        {displayData.type && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary-3">타입:</span>
            <span className="px-3 py-1 rounded-full bg-primary-1 text-white">
              {PokemonTypes[displayData.type]}
            </span>
          </div>
        )}

        {displayData.damageType && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary-3">분류:</span>
            <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700">
              {getDamageTypeKorean(displayData.damageType)}
            </span>
          </div>
        )}

        {displayData.power && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary-3">위력:</span>
            <span className="text-primary-4 font-bold">
              {displayData.power}
            </span>
          </div>
        )}

        {displayData.accuracy && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary-3">명중률:</span>
            <span className="text-primary-4 font-bold">
              {displayData.accuracy}
            </span>
          </div>
        )}

        {displayData.pp && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary-3">PP:</span>
            <span className="text-primary-4 font-bold">{displayData.pp}</span>
          </div>
        )}
      </div>

      {/* 추가 정보 */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
        <div>첫 등장: {skillData.firstGenerationId}세대</div>
        {skillData.signatureMoves && (
          <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
            전용기
          </div>
        )}
        {skillData.zMoves && (
          <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
            Z기술
          </div>
        )}
      </div>

      {/* 설명 */}
      {displayData.description && (
        <p className="text-[1.25rem] text-primary-4 leading-relaxed">
          {displayData.description}
        </p>
      )}
    </section>
  )
}

export default MoveDetailComponent
