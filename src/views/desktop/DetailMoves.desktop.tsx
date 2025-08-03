import { useContext } from 'react'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import MovesHeaderContainer from '~/container/desktop/detail/moves/MovesHeader.container'

const DetailMovesDesktop = () => {
  const {
    pokemonDetail,
    pokemonType,
    activeIndex,
    normalFormData,
    regionFormData,
  } = useContext(DetailMovesContext)
  return (
    <div className="w-full min-h-screen bg-primary-4">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <MovesHeaderContainer />

        {/* 임시 데이터 확인용 */}
        <div className="mt-8 p-4 bg-white rounded-lg">
          <h2 className="text-xl font-bold mb-4">데이터 확인</h2>
          <div className="space-y-2">
            <p>
              <strong>포켓몬 타입:</strong> {pokemonType}
            </p>
            <p>
              <strong>액티브 인덱스:</strong> {activeIndex}
            </p>
            <p>
              <strong>노말폼 데이터 개수:</strong> {normalFormData.length}
            </p>
            <p>
              <strong>리전폼 데이터 개수:</strong> {regionFormData.length}
            </p>
            <p>
              <strong>기본 포켓몬 습득 기술 개수:</strong>{' '}
              {pokemonDetail.learnableSkills?.length || 0}
            </p>

            {pokemonType === 'normalForm' && normalFormData[activeIndex] && (
              <div>
                <p>
                  <strong>현재 노말폼:</strong>{' '}
                  {normalFormData[activeIndex].name}
                </p>
                <p>
                  <strong>노말폼 습득 기술 개수:</strong>{' '}
                  {normalFormData[activeIndex].learnableSkills?.length || 0}
                </p>
              </div>
            )}

            {pokemonType === 'region' && regionFormData[activeIndex] && (
              <div>
                <p>
                  <strong>현재 리전폼:</strong>{' '}
                  {regionFormData[activeIndex].name} (
                  {regionFormData[activeIndex].region})
                </p>
                <p>
                  <strong>리전폼 습득 기술 개수:</strong>{' '}
                  {regionFormData[activeIndex].learnableSkills?.length || 0}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailMovesDesktop
