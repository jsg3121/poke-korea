import { PokemonSkillGeneration } from '~/graphql/typeGenerated'
import { getTypeKorean } from '~/utils/pokemon.util'
import { getDamageTypeKorean } from '~/utils/skill.util'

interface MoveGenerationInfoProps {
  generationData: PokemonSkillGeneration
}

const MoveGenerationInfo = ({ generationData }: MoveGenerationInfoProps) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold text-primary-1 mb-4">
        {generationData.generationId}세대
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {generationData.type && (
          <div>
            <span className="text-sm text-gray-600">타입</span>
            <p className="text-base font-semibold text-primary-4">
              {getTypeKorean(generationData.type)}
            </p>
          </div>
        )}

        {generationData.damageType && (
          <div>
            <span className="text-sm text-gray-600">분류</span>
            <p className="text-base font-semibold text-primary-4">
              {getDamageTypeKorean(generationData.damageType)}
            </p>
          </div>
        )}

        {generationData.power !== null &&
          generationData.power !== undefined && (
            <div>
              <span className="text-sm text-gray-600">위력</span>
              <p className="text-base font-semibold text-primary-4">
                {generationData.power || '-'}
              </p>
            </div>
          )}

        {generationData.accuracy !== null &&
          generationData.accuracy !== undefined && (
            <div>
              <span className="text-sm text-gray-600">명중률</span>
              <p className="text-base font-semibold text-primary-4">
                {generationData.accuracy || '-'}
              </p>
            </div>
          )}

        {generationData.pp !== null && generationData.pp !== undefined && (
          <div>
            <span className="text-sm text-gray-600">PP</span>
            <p className="text-base font-semibold text-primary-4">
              {generationData.pp}
            </p>
          </div>
        )}
      </div>

      {generationData.description && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600 block mb-2">설명</span>
          <p className="text-base text-gray-800 leading-relaxed">
            {generationData.description}
          </p>
        </div>
      )}
    </div>
  )
}

export default MoveGenerationInfo
