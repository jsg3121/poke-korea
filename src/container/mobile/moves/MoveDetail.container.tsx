'use client'

import { Fragment, useState } from 'react'
import MoveDetailComponent from '~/components/moves/MoveDetail.component'
import MoveGenerationInfo from '~/components/moves/MoveGenerationInfo.component'
import PokemonBySkillCard from '~/components/moves/PokemonBySkillCard.component'
import {
  LearnMethod,
  PokemonLearnInfo,
  PokemonSkillDetail,
} from '~/graphql/typeGenerated'
import { usePokemonsBySkill } from '~/hook/usePokemonsBySkill'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import FooterContainer from '../footer/Footer.container'
import { AVAILABLE_LEARN_METHODS } from '~/utils/skill.util'

interface MoveDetailContainerProps {
  skillId: number
  initialSkill: PokemonSkillDetail
  initialPokemonList: Array<PokemonLearnInfo>
  totalCount: number
}

const MoveDetailContainer = ({
  skillId,
  initialSkill,
  initialPokemonList,
  totalCount,
}: MoveDetailContainerProps) => {
  const [selectedGeneration, setSelectedGeneration] = useState<number>(
    initialSkill.generations[initialSkill.generations.length - 1]
      ?.generationId || 9,
  )

  const [selectedMethod, setSelectedMethod] = useState<string>('ALL')

  // 필터에 따라 method 설정
  const methodFilter: LearnMethod | undefined =
    selectedMethod === 'ALL' ? undefined : (selectedMethod as LearnMethod)

  const {
    pokemonList,
    loadMore,
    hasNextPage,
    loading,
    totalCount: filteredTotalCount,
  } = usePokemonsBySkill({
    skillId,
    method: methodFilter,
    initialPokemonList: selectedMethod === 'ALL' ? initialPokemonList : [],
  })

  const listRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 380px 0px',
    dependencies: [pokemonList, hasNextPage, loading],
  })

  // 선택된 세대의 정보 가져오기
  const selectedGenerationData = initialSkill.generations.find(
    (gen) => gen.generationId === selectedGeneration,
  )

  return (
    <section className="w-full h-full mx-auto py-8">
      {/* 기술 기본 정보 */}
      <MoveDetailComponent skillData={initialSkill} />

      {/* 세대별 정보 섹션 */}
      <div className="w-[calc(100%-2.5rem)] mx-auto mt-8 mb-12">
        <h2 className="text-xl font-bold text-primary-1 mb-4">
          📊 세대별 변화
        </h2>

        {/* 세대 선택 버튼 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {initialSkill.generations.map((gen) => (
            <button
              key={`gen-${gen.generationId}`}
              onClick={() => setSelectedGeneration(gen.generationId)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedGeneration === gen.generationId
                  ? 'bg-primary-1 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {gen.generationId}세대
            </button>
          ))}
        </div>

        {/* 선택된 세대 정보 */}
        {selectedGenerationData && (
          <MoveGenerationInfo generationData={selectedGenerationData} />
        )}
      </div>

      {/* 이 기술을 배울 수 있는 포켓몬 */}
      <div className="w-[calc(100%-2.5rem)] mx-auto mt-12">
        <h2 className="text-xl font-bold text-primary-1 mb-4">
          🎯 이 기술을 배울 수 있는 포켓몬
        </h2>

        {/* 습득 방법 필터 */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {AVAILABLE_LEARN_METHODS.map((method) => (
            <button
              key={method.value}
              onClick={() => setSelectedMethod(method.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMethod === method.value
                  ? 'bg-primary-1 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>

        {pokemonList.length === 0 && !loading && (
          <div className="w-full h-20">
            <p className="w-full text-lg text-gray-700 font-medium text-center">
              이 기술을 배울 수 있는 포켓몬이 없습니다.
            </p>
          </div>
        )}

        {pokemonList.length > 0 && (
          <Fragment>
            <p className="text-[1rem] text-primary-3 mb-8">
              <span className="text-[1.25rem] font-bold">
                {filteredTotalCount || totalCount}마리
              </span>
              의 포켓몬이 이 기술을 배울 수 있어요
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center justify-between">
              {pokemonList.map((pokemon) => {
                return (
                  <PokemonBySkillCard
                    key={`pokemon-skill-${pokemon.pokemonId}-${pokemon.method}-${pokemon.formType || 'base'}`}
                    pokemonData={pokemon}
                  />
                )
              })}
            </div>
          </Fragment>
        )}
      </div>

      <div ref={listRef}>
        <FooterContainer />
      </div>
    </section>
  )
}

export default MoveDetailContainer
