'use client'

import { useContext } from 'react'
import Link from 'next/link'

import { buildEvolutionGroups } from '~/utils/evolution.util'
import { imageMode } from '~/modules/buildMode.module'
import { pokemonNumberFormat } from '~/modules/pokemonCard.module'
import { DetailContext } from '~/context/Detail.context'
import HorizontalScrollList from '~/components/horizontalScrollList/HorizontalScrollList.component'
import Image from '~/components/Image.component'

import EvolutionConditionCard from './components/EvolutionConditionCard.component'
import InfoCardTitle from './components/InfoCardTitle.component'
import { AdjacentPokemon } from './DetailSpeciesNav.container'

interface DetailEvolutionProps {
  evolutionPokemons: Array<AdjacentPokemon>
}

const DetailEvolution = ({ evolutionPokemons }: DetailEvolutionProps) => {
  const { pokemonBaseInfo } = useContext(DetailContext)

  const name = pokemonBaseInfo?.name ?? ''

  const groups = pokemonBaseInfo?.evolutionChain?.groups ?? []
  const sections = buildEvolutionGroups(groups)

  const showGroupLabels = sections.length > 1

  if (sections.length > 0) {
    return (
      <section
        className="card-detail w-full"
        aria-labelledby="pokemon-evolution-chain"
      >
        <InfoCardTitle title="진화 정보" id="pokemon-evolution-chain" />
        <div className="flex w-full flex-col gap-5 desktop:gap-6">
          {sections.map((groupSection) => (
            <div key={groupSection.groupKey} className="flex flex-col gap-2">
              {showGroupLabels && (
                <h3 className="text-sm font-semibold text-primary-2 desktop:text-base">
                  {groupSection.label}
                </h3>
              )}
              <div className="grid grid-cols-1 gap-3 desktop:grid-cols-3">
                {groupSection.nodes.map((node) => (
                  <EvolutionConditionCard
                    key={`evolution-node-${groupSection.groupKey}-${node.targetHref}`}
                    node={node}
                    baseName={name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const chain: Array<AdjacentPokemon> =
    evolutionPokemons.length > 0
      ? evolutionPokemons
      : (pokemonBaseInfo?.evolutionId ?? []).map((id) => ({
          number: id,
          name: '',
        }))
  if (chain.length === 0) return null

  return (
    <section
      className="card-detail w-full"
      aria-labelledby="pokemon-evolution-chain"
    >
      <InfoCardTitle title="진화 체인" id="pokemon-evolution-chain" />
      <HorizontalScrollList aria-label="진화 체인 포켓몬 목록">
        {chain.map((pokemon) => (
          <Link
            key={`relation-pokemon-id-${pokemon.number}`}
            href={`/detail/${pokemon.number}`}
            aria-label={`${name}와(과) 연관된 포켓몬 ${pokemon.name || `No.${pokemon.number}`} 상세 보기`}
            className="block rounded-2xl transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
          >
            <Image
              src={`${imageMode}/${pokemon.number}`}
              width="9rem"
              height="9rem"
              alt={`포켓몬 ${name} 연관 포켓몬 ${pokemon.name || pokemon.number}`}
              imageSize={{ width: 138, height: 138 }}
              densities={[1, 1.5]}
              sizes="9rem"
              loading="lazy"
            />
            <p className="mt-1 text-center text-2xs text-primary-2 desktop:text-xs">
              No.{pokemonNumberFormat(pokemon.number)}
            </p>
            {pokemon.name && (
              <p className="text-center text-xs font-semibold text-primary-1 desktop:text-sm">
                {pokemon.name}
              </p>
            )}
          </Link>
        ))}
      </HorizontalScrollList>
    </section>
  )
}

export default DetailEvolution
