'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import { imageMode } from '~/module/buildMode'

const MovesHeaderContainer = () => {
  const { pokemonId } = useParams()
  const { pokemonInfo, pokemonLearnableData } = useContext(DetailMovesContext)

  const versionGroupList = pokemonLearnableData
    .map((learnableData) => {
      return learnableData.versionGroup
    })
    .sort((a, b) => {
      if (a && b) {
        return a.versionGroupId - b.versionGroupId
      } else {
        return 1
      }
    })

  const lastVersionInfo = versionGroupList[versionGroupList.length - 1]
  const firstVersionInfo = versionGroupList[0]

  return (
    <article className="w-full min-h-[15rem] bg-primary-4 rounded-[1.5rem] p-4">
      <header className="w-full h-[9rem] flex items-start flex-row">
        <ImageComponent
          width="8rem"
          height="8rem"
          src={`${imageMode}/${pokemonId}.webp`}
          alt={pokemonInfo?.name}
        />
        <div className="h-[8rem]">
          <p>No.{pokemonId}&nbsp;</p>
          <h2>{pokemonInfo?.name}</h2>
          <p>최초 등장 버전 : {firstVersionInfo?.nameKo}</p>
          <p>최신 등장 버전 : {lastVersionInfo?.nameKo}</p>
        </div>
        {pokemonInfo?.isRegionForm && (
          <Link
            href={`/detail/${pokemonId}/moves?moveType=regionForm`}
            className="shrink-0 w-[13rem] ml-auto"
            replace
          >
            리전폼 기술 정보 보러가기
          </Link>
        )}
      </header>
      {versionGroupList.map((item) => {
        return (
          <p key={item?.name}>
            {item?.nameKo}_{item?.versionGroupId}
          </p>
        )
      })}
    </article>
  )
}

export default MovesHeaderContainer
