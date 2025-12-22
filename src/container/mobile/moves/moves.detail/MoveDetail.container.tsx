'use client'

import { useParams } from 'next/navigation'
import { Fragment } from 'react'
import MoveDetailComponent from '~/components/moves/MoveDetail.component'
import PokemonBySkillCard from '~/components/moves/PokemonBySkillCard.component'
import { PokemonLearnInfo, PokemonSkillDetail } from '~/graphql/typeGenerated'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import { usePokemonsBySkill } from '~/hook/usePokemonsBySkill'
import FooterContainer from '../../footer/Footer.container'
import Link from 'next/link'

interface MoveDetailContainerProps {
  skillId: number
  initialSkill: PokemonSkillDetail
  initialPokemonList: Array<PokemonLearnInfo>
  totalCount: number
}

type ParamsType = {
  id: string
  generationId: string
}

const MoveDetailContainer = ({
  skillId,
  initialSkill,
  initialPokemonList,
  totalCount,
}: MoveDetailContainerProps) => {
  const { generationId } = useParams<ParamsType>()
  const selectedGeneration = parseInt(generationId ?? 9, 10)

  const {
    pokemonList,
    loadMore,
    hasNextPage,
    loading,
    totalCount: filteredTotalCount,
  } = usePokemonsBySkill({
    skillId,
    generationId: selectedGeneration,
    initialPokemonList,
  })

  const listRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 100px 0px',
    dependencies: [pokemonList],
  })

  // 선택된 세대의 정보 가져오기
  const selectedGenerationData = initialSkill.generations.find(
    (gen) => gen.generationId === selectedGeneration,
  )

  return (
    <section className="w-full max-w-[1280px] h-full mx-auto pt-4 pb-8">
      <MoveDetailComponent
        skillData={initialSkill}
        selectedGenerationData={selectedGenerationData}
      />
      <h2
        id="previous-generation"
        className="h-12 text-[1.375rem] text-primary-4 border-t border-solid border-primary-4 pt-4 px-4"
      >
        세대 정보
      </h2>
      <nav
        className="w-full min-h-18 flex flex-wrap items-center gap-3 px-4 mt-4"
        aria-labelledby="previous-generation"
      >
        <Link
          href={`/moves/${skillId}`}
          className={`h-8 w-[4.5rem] block rounded-md text-[1.125rem] leading-[calc(2rem+2px)] text-center ${generationId ? 'bg-primary-4 text-primary-1' : 'bg-primary-2 text-primary-4'}`}
        >
          최신
        </Link>
        {new Array(9 - initialSkill.firstGenerationId)
          .fill('')
          .map((_, index) => {
            return (
              <Link
                key={`generation-index-${9 - index}`}
                href={`/moves/${skillId}/generation/${8 - index}`}
                className={`h-8 w-[4.5rem] block rounded-md text-[1.125rem] leading-[calc(2rem+2px)] text-center ${parseInt(generationId, 10) === 8 - index ? 'bg-primary-2 text-primary-4' : 'bg-primary-4 text-primary-1'}`}
              >
                {8 - index}세대
              </Link>
            )
          })}
      </nav>
      <div className="mt-8">
        {pokemonList.length === 0 && !loading && (
          <div className="w-full h-[20rem] flex items-center">
            <p className="w-full text-2xl text-primary-4 font-bold text-center">
              이 기술을 배울 수 있는 포켓몬이 없습니다.
            </p>
          </div>
        )}
        {pokemonList.length > 0 && (
          <Fragment>
            <h2 className="text-[1rem] text-primary-3 mb-4 px-4">
              <span className="text-[1.25rem] font-bold">
                {filteredTotalCount || totalCount}마리
              </span>
              의 포켓몬이 이 기술을 배울 수 있어요
            </h2>
            <div className="w-[calc(100%-2.5rem)] mx-auto grid grid-cols-2 gap-x-4 gap-y-6 justify-items-center justify-between">
              {pokemonList.map((pokemon, index) => {
                return (
                  <PokemonBySkillCard
                    key={`pokemon-skill-${index + 1}-${pokemon.pokemonId}`}
                    pokemonData={pokemon}
                    isHighPriority={index < 15}
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
