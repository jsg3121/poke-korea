'use client'

import { useParams } from 'next/navigation'
import { Fragment } from 'react'
import MoveDetailComponent from '~/components/moves/MoveDetail.component'
import PokemonBySkillCard from '~/components/moves/PokemonBySkillCard.component'
import {
  PokemonLearnInfo,
  PokemonSkillDetail,
  VersionGroup,
} from '~/graphql/typeGenerated'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import { usePokemonsBySkill } from '~/hook/usePokemonsBySkill'
import FooterContainer from '../../footer/Footer.container'
import Link from 'next/link'
import MobileMovesDetailTopBanner from '~/components/adSlot/MobileMovesDetailTopBanner'
import MobileMovesDetailBottomBanner from '~/components/adSlot/MobileMovesDetailBottomBanner'

export interface MoveDetailContainerProps {
  skillId: number
  initialSkill: PokemonSkillDetail
  initialPokemonList: Array<PokemonLearnInfo>
  totalCount: number
  selectedVersionGroupId?: number
  versionGroups?: Array<VersionGroup> | null
}

type ParamsType = {
  id: string
  versionGroupId: string
}

const MoveDetailContainer = ({
  skillId,
  initialSkill,
  initialPokemonList,
  totalCount,
  selectedVersionGroupId,
  versionGroups,
}: MoveDetailContainerProps) => {
  const { versionGroupId: versionGroupIdParam } = useParams<ParamsType>()
  const currentVersionGroupId = selectedVersionGroupId
    ? selectedVersionGroupId
    : versionGroupIdParam
      ? parseInt(versionGroupIdParam, 10)
      : undefined

  const {
    pokemonList,
    loadMore,
    hasNextPage,
    loading,
    totalCount: filteredTotalCount,
  } = usePokemonsBySkill({
    skillId,
    versionGroupId: currentVersionGroupId,
    initialPokemonList,
  })

  const listRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 100px 0px',
    dependencies: [pokemonList],
  })

  // 선택된 버전의 정보 가져오기
  const selectedVersionData = currentVersionGroupId
    ? initialSkill.generations.find(
        (gen) => gen.versionGroupId === currentVersionGroupId,
      )
    : undefined

  return (
    <section className="w-full max-w-[1280px] h-full mx-auto pt-4 pb-8">
      <MoveDetailComponent
        skillData={initialSkill}
        selectedVersionData={selectedVersionData}
        versionGroups={versionGroups}
      />
      <MobileMovesDetailTopBanner />
      <h2
        id="version-info"
        className="h-12 text-[1.375rem] text-primary-4 border-t border-solid border-primary-4 pt-4 px-4"
      >
        버전별 정보
      </h2>
      <nav
        className="w-full min-h-18 flex flex-wrap items-center gap-3 px-4 mt-4"
        aria-labelledby="version-info"
      >
        <Link
          href={`/moves/${skillId}`}
          className={`h-8 px-4 block rounded-md text-lg text-aligned-base text-center ${!currentVersionGroupId ? 'bg-primary-2 text-primary-4' : 'bg-primary-4 text-primary-1'}`}
        >
          최신
        </Link>
        {versionGroups &&
          versionGroups.map((vg) => (
            <Link
              key={`version-group-${vg.versionGroupId}`}
              href={`/moves/${skillId}/version/${vg.versionGroupId}`}
              className={`h-8 px-4 block rounded-md text-lg text-aligned-base text-center ${currentVersionGroupId === vg.versionGroupId ? 'bg-primary-2 text-primary-4' : 'bg-primary-4 text-primary-1'}`}
            >
              {vg.nameKo}
            </Link>
          ))}
      </nav>
      <div className="mt-8">
        {pokemonList.length === 0 && !loading && (
          <div className="w-full h-[20rem] flex items-center px-4">
            <p className="w-full text-2xl text-primary-4 font-bold text-center">
              이 기술을 배울 수 있는 포켓몬이 없어요.
            </p>
          </div>
        )}
        {pokemonList.length > 0 && (
          <Fragment>
            <h2 className="text-base text-primary-3 mb-4 px-4">
              <span className="text-xl font-bold">
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
                    isHighPriority={index < 8}
                  />
                )
              })}
            </div>
          </Fragment>
        )}
      </div>
      <MobileMovesDetailBottomBanner />
      <div ref={listRef}>
        <FooterContainer />
      </div>
    </section>
  )
}

export default MoveDetailContainer
