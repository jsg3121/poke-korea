'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Fragment, useContext, useEffect, useRef } from 'react'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import { imageMode } from '~/module/buildMode'
import { buildMovesPath } from '~/module/movesParams.module'

interface MovesHeaderContainerProps {
  pokemonName: string
}

const MovesHeaderContainer = ({ pokemonName }: MovesHeaderContainerProps) => {
  const { pokemonId } = useParams<{
    pokemonId: string
  }>()
  const {
    pokemonInfo,
    formDataLength,
    normalFormInfo,
    versionGroup,
    currentActiveIndex,
    currentVersionGroupId,
    currentMovesType,
  } = useContext(DetailMovesContext)
  const versionListRef = useRef<HTMLElement>(null)

  const lastVersionInfo = versionGroup?.[0]
  const firstVersionInfo = versionGroup?.[versionGroup.length - 1]
  const activeType = pokemonInfo?.activeType
  const activeIndex = currentActiveIndex

  const activeGroupId = () => {
    if (currentVersionGroupId) {
      return currentVersionGroupId
    } else {
      return versionGroup?.[0]?.versionGroupId
    }
  }

  const imagePath = () => {
    switch (activeType) {
      case 'region': {
        return `2${pokemonId.toString().padStart(3, '0')}${activeIndex
          .toString()
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
        href={
          activeType === 'region'
            ? activeIndex > 0
              ? `/detail/${pokemonId}/region/${activeIndex}`
              : `/detail/${pokemonId}/region`
            : activeIndex > 0
              ? `/detail/${pokemonId}/form/${activeIndex}`
              : `/detail/${pokemonId}`
        }
        className="w-fit h-[3rem] block bg-primary-2 rounded-[0.75rem] px-4 mb-4 text-primary-4 text-aligned-xl"
      >
        {pokemonName.replace('_', ' ')}의 상세 정보 보러가기
      </Link>
      <article className="w-full h-[17rem] bg-primary-4 rounded-[0.75rem] p-4">
        <header className="w-full h-[11.5rem] flex items-start flex-row flex-wrap">
          <ImageComponent
            width="5.5rem"
            height="5.5rem"
            src={`${imageMode}/${imagePath()}.webp`}
            alt={pokemonName}
            imageSize={{ width: 66, height: 66 }}
            densities={[1, 1.5]}
            sizes="5.5rem"
            loading="lazy"
            className="[filter:drop-shadow(0px_2px_2px_#000000)]"
          />
          <div className="w-[calc(100%-6.5rem)] h-[5rem] ml-4 flex flex-col">
            <div className="w-full h-8 flex items-baseline gap-2">
              <p className="w-full h-[1.25rem] text-base text-left leading-[1.25rem+2px]">
                No.{pokemonId}&nbsp;
              </p>

              <div className="shrink-0 flex align-center gap-2">
                {activeType === 'region' && (
                  <Link
                    href={`/detail/${pokemonId}/moves`}
                    className="w-[6.5rem] h-6 bg-primary-3 text-center text-aligned-sm rounded-[0.5rem]"
                    replace
                  >
                    <b className="font-bold ">일반폼</b> 보기
                  </Link>
                )}
                {pokemonInfo?.isRegionForm && activeType !== 'region' && (
                  <Link
                    href={`/detail/${pokemonId}/moves/region`}
                    className="w-[6.5rem] h-6 bg-primary-3 text-center text-aligned-sm rounded-[0.5rem]"
                    replace
                  >
                    <b className="font-bold ">리전폼</b> 보기
                  </Link>
                )}
              </div>
            </div>
            <h2 className="h-8 text-2xl leading-[2rem+2px] justify-self-start mt-2">
              <b className="font-bold">{pokemonName.replace('_', ' ')}</b>
            </h2>
            <div className="h-8 flex-items-gap-2">
              {((formDataLength > 1 && activeType === 'region') ||
                pokemonInfo?.isFormChange) && (
                <>
                  <Link
                    href={
                      activeType === 'region'
                        ? Math.max(activeIndex - 1, 0) > 0
                          ? `/detail/${pokemonId}/moves/region/${Math.max(activeIndex - 1, 0)}`
                          : `/detail/${pokemonId}/moves/region`
                        : Math.max(activeIndex - 1, 0) > 0
                          ? `/detail/${pokemonId}/moves/form/${Math.max(activeIndex - 1, 0)}`
                          : `/detail/${pokemonId}/moves`
                    }
                    className={`w-[4rem] h-8 shrink-0 text-center text-sm text-aligned-base rounded-[0.5rem] px-2 ${
                      activeIndex === 0
                        ? 'bg-primary-3 text-primary-2 select-none cursor-default pointer-events-none'
                        : ' bg-primary-1 text-primary-4'
                    }`}
                  >
                    이전 폼
                  </Link>
                  <Link
                    href={
                      activeType === 'region'
                        ? `/detail/${pokemonId}/moves/region/${Math.min(activeIndex + 1, formDataLength - 1)}`
                        : `/detail/${pokemonId}/moves/form/${Math.min(activeIndex + 1, formDataLength - 1)}`
                    }
                    className={`w-[4rem] h-8 shrink-0 text-center text-sm text-aligned-base rounded-[0.5rem] px-2 ${
                      activeIndex === formDataLength - 1
                        ? 'bg-primary-3 text-primary-2 select-none cursor-default pointer-events-none'
                        : 'bg-primary-1 text-primary-4'
                    }`}
                  >
                    다음 폼
                  </Link>
                </>
              )}
            </div>
          </div>
          <p className="w-full h-[1.5rem] flex items-center gap-1 my-2">
            타입 :{' '}
            {pokemonInfo?.types?.map((type) => {
              return (
                <TagComponent key={`${pokemonId}-type-${type}`} type={type} />
              )
            })}
          </p>
          <p className="w-full h-[1.5rem] mb-1">
            최초 등장 버전 : {firstVersionInfo?.baseVersionGroupName}
          </p>
          <p className="w-full h-[1.5rem]">
            최신 등장 버전 : {lastVersionInfo?.baseVersionGroupName}
          </p>
        </header>
        <nav
          ref={versionListRef}
          className="w-full h-[3rem] flex-items-gap-2 overflow-x-auto mt-2 [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl"
        >
          {versionGroup?.map((item) => {
            const getVersionHref = () => {
              return buildMovesPath({
                pokemonId,
                activeType:
                  activeType === 'region'
                    ? 'region'
                    : activeIndex > 0
                      ? 'normalForm'
                      : undefined,
                activeIndex,
                versionGroupId: item?.versionGroupId,
                movesType: currentMovesType,
              })
            }
            return (
              <Link
                data-item={item?.versionGroupId}
                key={item?.name}
                href={getVersionHref()}
                className={`
                  w-fit h-8 shrink-0 px-4 rounded-[0.5rem] text-base text-aligned-base
                  ${item?.versionGroupId === activeGroupId() ? 'bg-primary-1 text-primary-4' : 'bg-primary-3 text-primary-1'}
                `}
              >
                {item?.baseVersionGroupName}
              </Link>
            )
          })}
        </nav>
      </article>
    </Fragment>
  )
}

export default MovesHeaderContainer
