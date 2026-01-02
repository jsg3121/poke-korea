'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Fragment, useContext, useEffect, useRef } from 'react'
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
  const { pokemonInfo, formDataLength, normalFormInfo, versionGroup } =
    useContext(DetailMovesContext)
  const versionListRef = useRef<HTMLElement>(null)

  const lastVersionInfo = versionGroup?.[0]
  const firstVersionInfo = versionGroup?.[versionGroup.length - 1]
  const selectVersion = searchParams.get('selectVersion')
  const activeType = searchParams.get('activeType')
  const activeIndex = searchParams.get('activeIndex') ?? '0'

  const activeGroupId = () => {
    if (selectVersion) {
      const versionGroupId = versionGroup?.find((version) => {
        return version?.versionGroupId.toString() === selectVersion
      })

      return versionGroupId?.versionGroupId
    } else {
      return versionGroup?.[0]?.versionGroupId
    }
  }

  const imagePath = () => {
    switch (activeType) {
      case 'region': {
        return `2${pokemonId.toString().padStart(3, '0')}${parseInt(
          activeIndex ?? '0',
          10,
        )
          ?.toString()
          .padStart(2, '0')}`
      }

      default: {
        return normalFormInfo?.imagePath ?? pokemonId
      }
    }
  }

  useEffect(() => {
    if (versionListRef.current) {
      const activeLink = versionListRef.current.querySelector(
        `a[data-item='${activeGroupId()}']`,
      )
      activeLink?.scrollIntoView({
        inline: 'start',
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [])

  return (
    <Fragment>
      <Link
        href={{
          pathname: `/detail/${pokemonId}`,
          query: {
            ...(activeType && {
              activeType,
            }),
            ...(activeIndex &&
              activeIndex !== '0' && {
                activeIndex: parseInt(activeIndex, 10),
              }),
          },
        }}
        className="w-fit h-[3rem] block bg-primary-2 rounded-[0.75rem] px-4 mb-4 text-primary-4 text-aligned-xl"
      >
        {pokemonName.replace('_', ' ')}의 상세 정보 보러가기
      </Link>
      <article className="w-full h-[15rem] bg-primary-4 rounded-[0.75rem] p-4">
        <header className="w-full h-[9rem] flex items-start flex-row">
          <ImageComponent
            width="9rem"
            height="9rem"
            src={`${imageMode}/${imagePath()}.webp`}
            alt={pokemonName}
            imageSize={{ width: 144, height: 144 }}
            densities={[1, 2]}
            sizes="9rem"
            loading="lazy"
            className="[filter:drop-shadow(0px_2px_2px_#000000)]"
          />
          <div className="h-[9rem] ml-4 flex flex-col">
            <h2 className="h-8 text-2xl leading-[2rem+2px] justify-self-start">
              <span>No.{pokemonId}&nbsp;</span>
              <b className="font-bold">{pokemonName.replace('_', ' ')}</b>
            </h2>
            <div className="w-full h-[2.5rem] flex-items-gap-2">
              {((formDataLength > 1 && activeType === 'region') ||
                pokemonInfo?.isFormChange) && (
                <>
                  <Link
                    href={{
                      query: {
                        ...(activeType && {
                          activeType,
                        }),
                        activeIndex: Math.max(
                          parseInt(activeIndex ?? '1', 10) - 1,
                          0,
                        ),
                      },
                    }}
                    className={`w-[6rem] h-8 text-center text-sm text-aligned-base rounded-[0.5rem] px-2 ${
                      activeIndex === '0'
                        ? 'bg-primary-3 text-primary-2 select-none cursor-default pointer-events-none'
                        : ' bg-primary-1 text-primary-4 hover:bg-primary-2 hover:text-primary-4 '
                    }`}
                  >
                    이전 폼으로
                  </Link>
                  <Link
                    href={{
                      query: {
                        ...(activeType && {
                          activeType,
                        }),
                        activeIndex: Math.min(
                          parseInt(activeIndex ?? '0', 10) + 1,
                          formDataLength - 1,
                        ),
                      },
                    }}
                    className={`w-[6rem] h-8 text-center text-sm text-aligned-base rounded-[0.5rem] px-2 ${
                      activeIndex === `${formDataLength - 1}`
                        ? 'bg-primary-3 text-primary-2 select-none cursor-default pointer-events-none'
                        : 'bg-primary-1 text-primary-4 hover:bg-primary-2 hover:text-primary-4 '
                    }`}
                  >
                    다음 폼으로
                  </Link>
                </>
              )}
            </div>
            <p className="w-full h-[1.5rem] flex items-center gap-1 mb-1">
              타입 :{' '}
              {pokemonInfo?.types?.map((type) => {
                return (
                  <span
                    key={`${pokemonId}-type-${type}`}
                    className={`w-12 h-[1.25rem] text-center text-[0.8rem] text-aligned-xs rounded-[0.5rem] block chip-type-${type.toLowerCase()}`}
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
            {activeType === 'region' && (
              <Link
                href={`/detail/${pokemonId}/moves`}
                className="w-[13rem] h-6 bg-primary-3 text-center text-aligned-sm rounded-[0.5rem] hover:bg-primary-2 hover:text-primary-4"
                replace
              >
                <b className="font-bold ">일반폼</b> 기술 보러가기
              </Link>
            )}
            {pokemonInfo?.isRegionForm && activeType !== 'region' && (
              <Link
                href={`/detail/${pokemonId}/moves?activeType=region`}
                className="w-[13rem] h-6 bg-primary-3 text-center text-aligned-sm rounded-[0.5rem] hover:bg-primary-2 hover:text-primary-4"
                replace
              >
                <b className="font-bold ">리전폼</b> 기술 보러가기
              </Link>
            )}
          </div>
        </header>
        <nav
          ref={versionListRef}
          className="w-full h-[4rem] flex-items-gap-4 overflow-x-auto  [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl"
        >
          {versionGroup?.map((item) => {
            return (
              <Link
                data-item={item?.versionGroupId}
                key={item?.name}
                href={{
                  pathname: `/detail/${pokemonId}/moves`,
                  query: {
                    selectVersion: item?.versionGroupId,
                    ...(activeType && {
                      activeType,
                    }),
                    ...(activeIndex &&
                      activeIndex !== '0' && {
                        activeIndex: parseInt(activeIndex, 10),
                      }),
                  },
                }}
                className={`
                  w-fit h-8 shrink-0 px-4 rounded-[0.5rem] text-base text-aligned-base hover:bg-primary-2 hover:text-primary-4
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
