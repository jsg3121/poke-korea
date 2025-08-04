'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Fragment, useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import { imageMode } from '~/module/buildMode'
import { PokemonTypes } from '~/types/pokemonTypes.types'

interface MovesHeaderContainerProps {
  pokemonName: string
}

const MovesHeaderContainer = ({ pokemonName }: MovesHeaderContainerProps) => {
  const { pokemonId } = useParams()
  const searchParams = useSearchParams()
  const { pokemonInfo, pokemonLearnableData } = useContext(DetailMovesContext)

  const versionGroupList = pokemonLearnableData
    .map((learnableData) => {
      return learnableData.versionGroup
    })
    .sort((a, b) => {
      if (a && b) {
        return b.versionGroupId - a.versionGroupId
      } else {
        return 1
      }
    })

  const lastVersionInfo = versionGroupList[0]
  const firstVersionInfo = versionGroupList[versionGroupList.length - 1]
  const selectVersion = searchParams.get('selectVersion')
  const pokemonType = searchParams.get('pokemonType')

  const activeGroupId = () => {
    if (selectVersion) {
      const versionGroupId = versionGroupList.find((version) => {
        return version?.versionGroupId.toString() === selectVersion
      })

      return versionGroupId?.versionGroupId
    } else {
      return versionGroupList[0]?.versionGroupId
    }
  }

  return (
    <Fragment>
      <Link
        href={`/detail/${pokemonId}`}
        className="w-fit h-[3rem] block bg-primary-2 rounded-[0.75rem] px-4 mb-4 text-primary-4 leading-[calc(3rem+2px)]"
      >
        상세 페이지로 돌아가기
      </Link>
      <article className="w-full h-[15rem] bg-primary-4 rounded-[0.75rem] p-4">
        <header className="w-full h-[9rem] flex items-start flex-row">
          <ImageComponent
            width="9rem"
            height="9rem"
            src={`${imageMode}/${pokemonId}.webp`}
            alt={pokemonName}
            className="[filter:drop-shadow(0px_2px_2px_#000000)]"
          />
          <div className="h-[9rem] ml-4 flex flex-col">
            <h2 className="text-[1.5rem] mb-4 justify-self-start">
              <span>No.{pokemonId}&nbsp;</span>
              <b className="font-bold">{pokemonName}</b>
            </h2>
            <p className="w-full h-[1.5rem] flex items-center gap-1 mb-1">
              타입 :{' '}
              {pokemonInfo?.types?.map((type) => {
                return (
                  <span
                    key={`${pokemonId}-type-${type}`}
                    className={`w-12 h-[1.5rem] text-center leading-[calc(1.5rem+2px)] rounded-[0.5rem] block chip-type-${type.toLowerCase()}`}
                  >
                    {PokemonTypes[type]}
                  </span>
                )
              })}
            </p>
            <p className="w-full h-[1.5rem] mb-1">
              최초 등장 버전 : {firstVersionInfo?.nameKo}
            </p>
            <p className="w-full h-[1.5rem]">
              최신 등장 버전 : {lastVersionInfo?.nameKo}
            </p>
          </div>
          <div className="shrink-0 flex align-center gap-2 ml-auto ">
            {pokemonInfo?.isRegionForm && (
              <Link
                href={`/detail/${pokemonId}/moves?pokemonType=region`}
                className="w-[13rem] h-6 bg-primary-3 text-center leading-[calc(1.5rem+2px)] rounded-[0.5rem]"
                replace
              >
                리전폼 기술 정보 보러가기
              </Link>
            )}
          </div>
        </header>
        <nav className="w-full h-[4rem] flex items-center gap-4 overflow-x-auto  [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl">
          {versionGroupList.map((item) => {
            return (
              <Link
                key={item?.name}
                href={`/detail/${pokemonId}/moves?pokemonType=${pokemonType}&selectVersion=${item?.versionGroupId}`}
                className={`
                  w-fit h-8 shrink-0 px-4 rounded-[0.5rem] text-[1rem] leading-[calc(2rem+2px)]
                  ${item?.versionGroupId === activeGroupId() ? 'bg-primary-1 text-primary-4' : 'bg-primary-3 text-primary-1'}
                `}
              >
                {item?.nameKo}
              </Link>
            )
          })}
        </nav>
      </article>
    </Fragment>
  )
}

export default MovesHeaderContainer
