import { PokemonSkillDetail } from '~/graphql/typeGenerated'
import { getTypeKorean } from '~/utils/pokemon.util'
import { getDamageTypeKorean } from '~/utils/skill.util'

interface MoveDetailComponentProps {
  skillData: PokemonSkillDetail
}

const MoveDetailComponent = ({ skillData }: MoveDetailComponentProps) => {
  return (
    <section className="w-[calc(100%-2.5rem)] mx-auto min-h-32 pb-4 relative">
      <h1 className="text-[2.5rem] text-primary-4 font-bold mb-4">
        {skillData.nameKo}
      </h1>

      {/* 기본 정보 */}
      <div className="flex flex-wrap gap-4 text-lg mb-4">
        {skillData.type && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary-3">타입:</span>
            <span className="px-3 py-1 rounded-full bg-primary-1 text-white">
              {getTypeKorean(skillData.type)}
            </span>
          </div>
        )}

        {skillData.damageType && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary-3">분류:</span>
            <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700">
              {getDamageTypeKorean(skillData.damageType)}
            </span>
          </div>
        )}

        {skillData.power && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary-3">위력:</span>
            <span className="text-primary-4 font-bold">{skillData.power}</span>
          </div>
        )}

        {skillData.accuracy && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary-3">명중률:</span>
            <span className="text-primary-4 font-bold">
              {skillData.accuracy}
            </span>
          </div>
        )}

        {skillData.pp && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary-3">PP:</span>
            <span className="text-primary-4 font-bold">{skillData.pp}</span>
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
      {skillData.description && (
        <p className="text-[1.25rem] text-primary-4 leading-relaxed">
          {skillData.description}
        </p>
      )}
    </section>
  )
}

export default MoveDetailComponent
