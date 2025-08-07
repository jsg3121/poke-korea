'use client'

import { useContext } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DetailMovesContext } from '~/context/DetailMoves.context'

const MovesHeaderContainer = () => {
  const {
    pokemonDetail,
    pokemonType,
    activeIndex,
    normalFormData,
    regionFormData,
    getCurrentPokemonInfo,
  } = useContext(DetailMovesContext)
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentInfo = getCurrentPokemonInfo()

  const handleTypeChange = (newType: 'default' | 'region' | 'normalForm') => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    if (newType === 'default') {
      newSearchParams.delete('pokemonType')
      newSearchParams.delete('activeIndex')
    } else {
      newSearchParams.set('pokemonType', newType)
      newSearchParams.set('activeIndex', '0')
    }

    router.push(`?${newSearchParams.toString()}`)
  }

  const handleIndexChange = (newIndex: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('activeIndex', newIndex.toString())
    router.push(`?${newSearchParams.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          {currentInfo.imagePath ? (
            <img
              src={currentInfo.imagePath}
              alt={currentInfo.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-gray-500 text-xs">이미지</span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold">
            No.{pokemonDetail.number} {currentInfo.name}
          </h1>
          <div className="flex space-x-1 mt-1">
            {currentInfo.types.map((type, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-white text-xs chip-type-${type.toLowerCase()}`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 타입 선택 버튼 */}
      <div className="grid grid-cols-1 gap-2 mb-4">
        <button
          onClick={() => handleTypeChange('default')}
          className={`px-3 py-2 rounded-lg text-sm ${
            pokemonType === 'default'
              ? 'bg-primary-1 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          기본 ({pokemonDetail.learnableSkills?.length || 0}개 버전)
        </button>

        {normalFormData.length > 0 && (
          <button
            onClick={() => handleTypeChange('normalForm')}
            className={`px-3 py-2 rounded-lg text-sm ${
              pokemonType === 'normalForm'
                ? 'bg-primary-1 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            노말폼 ({normalFormData.length}개)
          </button>
        )}

        {regionFormData.length > 0 && (
          <button
            onClick={() => handleTypeChange('region')}
            className={`px-3 py-2 rounded-lg text-sm ${
              pokemonType === 'region'
                ? 'bg-primary-1 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            리전폼 ({regionFormData.length}개)
          </button>
        )}
      </div>

      {/* 인덱스 네비게이션 */}
      {currentInfo.maxIndex > 0 && (
        <div className="flex items-center justify-center space-x-3 mb-3">
          <button
            onClick={() => handleIndexChange(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
          >
            ← 이전
          </button>

          <span className="text-sm text-gray-600">
            {activeIndex + 1} / {currentInfo.maxIndex + 1}
          </span>

          <button
            onClick={() =>
              handleIndexChange(Math.min(currentInfo.maxIndex, activeIndex + 1))
            }
            disabled={activeIndex === currentInfo.maxIndex}
            className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
          >
            다음 →
          </button>
        </div>
      )}

      {/* 현재 선택된 데이터 정보 */}
      <div className="p-3 bg-gray-50 rounded text-sm">
        <h3 className="font-semibold mb-2">현재 데이터:</h3>
        <div className="space-y-1">
          <p>
            포켓몬 타입: <span className="font-medium">{pokemonType}</span>
          </p>
          <p>
            인덱스: <span className="font-medium">{activeIndex}</span>
          </p>
          {pokemonType === 'normalForm' && normalFormData[activeIndex] && (
            <p>
              습득 기술 버전 수:{' '}
              <span className="font-medium">
                {normalFormData[activeIndex].learnableSkills?.length || 0}
              </span>
            </p>
          )}
          {pokemonType === 'region' && regionFormData[activeIndex] && (
            <p>
              습득 기술 버전 수:{' '}
              <span className="font-medium">
                {regionFormData[activeIndex].learnableSkills?.length || 0}
              </span>
            </p>
          )}
          {pokemonType === 'default' && (
            <p>
              습득 기술 버전 수:{' '}
              <span className="font-medium">
                {pokemonDetail.learnableSkills?.length || 0}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovesHeaderContainer
