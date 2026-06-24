'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import BallComponent from '~/components/Ball.component'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/tag/Tag.component'
import { PokemonType } from '~/graphql/typeGenerated'
import { useLazyImage } from '~/hook/useLazyImage'

/**
 * 포켓몬 카드 계열의 공통 레이아웃 셸 (Link + article + 포켓볼 + 헤더 + 이미지 +
 * 타입 태그 + 본문 슬롯). PokemonCard와 ChampionsCard가 "같은 카드 디자인"을
 * 공유하도록 레이아웃 컨셉만 추출했다.
 *
 * 데이터 도메인(PokemonList / ChampionsMetaStats)이 달라 카드 자체는 분리하되,
 * 셸은 공유한다([[home-phase-b-decisions]] 결정). 차이 나는 부분은 slot/prop으로:
 * - 헤더(No.+이름 / 이름)는 `header` slot
 * - 본문(스탯 / 사용률·승률)은 `children` slot
 * - 포켓볼 위 뱃지(챔피언스 티어 랭크)는 `ballBadge` slot
 * - 흰 테두리 / 티어 아웃라인은 `outlineColor` prop (기본 흰색)
 *
 * 크기는 모바일 퍼스트 2단계(ADR-0009 16px 고정 기준). 카드 폭·높이는 데스크톱
 * 비율을 그대로 축소하지 않고, 각 화면에 맞는 독립 규격을 쓴다:
 * - 모바일: w-40(160px) × h-[15.5rem](248px) — 2열 그리드에 들어가되 스탯 3행 수용
 * - 데스크톱: w-56(224px) × h-80(320px)
 * 고정 높이라 PokemonCard(스탯 3행)·ChampionsCard(사용률·승률 2행)가 동일 높이.
 */

interface PokemonCardShellProps {
  /** 카드 클릭 시 이동할 경로 */
  href: string
  /** 그라데이션 배경 계산용 타입 (1개=단색, 2개=그라데이션) */
  backgroundColor: string[]
  /** 카드 외곽 테두리 색 (기본: 흰색. 챔피언스는 티어색) */
  outlineColor?: string
  /** 포켓볼 위에 겹쳐 표시할 뱃지 (챔피언스 티어 랭크 등) */
  ballBadge?: ReactNode
  /** 헤더 영역 (No.+이름 / 이름 등) */
  header: ReactNode
  /** 이미지 src (imageMode 등 prefix 포함된 완성 경로) */
  imageSrc: string
  /** 이미지 alt */
  imageAlt: string
  /** 이미지 원본 픽셀 크기 (srcSet 생성용) */
  imageSize: { width: number; height: number }
  /** 타입 태그용 타입 배열 */
  types: PokemonType[]
  /** 본문 슬롯 (스탯 dl / 사용률·승률 등) */
  children: ReactNode
  /** LCP 대상이면 eager 로딩(첫 화면 카드) */
  isHighPriority?: boolean
  /** article aria-label */
  ariaLabel: string
}

const WHITE_OUTLINE = '#ffffff'

const PokemonCardShellComponent = ({
  href,
  backgroundColor,
  outlineColor = WHITE_OUTLINE,
  ballBadge,
  header,
  imageSrc,
  imageAlt,
  imageSize,
  types,
  children,
  isHighPriority = false,
  ariaLabel,
}: PokemonCardShellProps) => {
  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({ rootMargin: '200px', threshold: 0.1 })

  const gradientStyle =
    backgroundColor.length === 1
      ? { backgroundColor: backgroundColor[0] }
      : {
          backgroundImage: `linear-gradient(135deg, ${backgroundColor[0]} 35%, ${backgroundColor[1]} 65%)`,
        }

  return (
    <Link href={href} className="block w-40 desktop:w-56">
      <article
        className="w-40 desktop:w-56 h-[15.5rem] desktop:h-80 flex flex-col text-black-2 border border-solid border-black-2 rounded-[10px] p-2 desktop:p-3 relative overflow-hidden shadow-[inset_10px_0_0_0_rgb(51_65_80)] outline outline-[0.25rem] cursor-pointer card-corner-fold transition-transform duration-300 ease-[cubic-bezier(0.03,0.57,0.37,1.02)] desktop:hover:scale-105 desktop:hover:z-10"
        style={{ ...gradientStyle, outlineColor }}
        aria-label={ariaLabel}
      >
        <header className="w-full min-h-8 flex items-start justify-between relative z-10">
          <i className="w-6 desktop:w-8 h-6 desktop:h-8 flex-shrink-0 mr-2 relative">
            <BallComponent />
            {ballBadge}
          </i>
          {header}
        </header>

        {/* 이미지 영역은 flex-1로 남는 공간을 흡수한다. 이름이 2~3줄로 헤더가
            커지면 이미지가 그만큼 줄어들고, 타입 태그·본문(스탯)은 항상 카드
            하단에 안전하게 위치한다(잘림 방지). min-h-0은 flex 자식 축소 허용. */}
        {isHighPriority ? (
          <div className="flex-1 min-h-0 w-full flex items-center justify-center my-1 relative">
            <div className="h-full max-h-28 desktop:max-h-40 aspect-square drop-shadow-[2px_3px_2px_#333333]">
              <ImageComponent
                height="100%"
                width="100%"
                imageSize={imageSize}
                densities={[1, 1.5]}
                alt={imageAlt}
                src={imageSrc}
                sizes="(min-width: 769px) 10rem, 7rem"
                fetchPriority="high"
              />
            </div>
          </div>
        ) : (
          <div
            ref={imgRef}
            className="flex-1 min-h-0 w-full flex items-center justify-center my-1 relative"
          >
            {isVisible ? (
              <div className="h-full max-h-28 desktop:max-h-40 aspect-square drop-shadow-[2px_3px_2px_#333333]">
                <ImageComponent
                  height="100%"
                  width="100%"
                  imageSize={imageSize}
                  densities={[1, 1.5]}
                  alt={imageAlt}
                  src={imageSrc}
                  sizes="(min-width: 769px) 10rem, 7rem"
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                />
              </div>
            ) : (
              <div className="h-full max-h-28 desktop:max-h-40 aspect-square bg-gray-300 opacity-30 animate-pulse rounded-lg" />
            )}
          </div>
        )}

        <div className="w-full flex items-center gap-2 px-2 mx-auto justify-start">
          {types.map((item, index) => (
            <TagComponent key={`${item}-id-${index}`} type={item} />
          ))}
        </div>

        {children}
      </article>
    </Link>
  )
}

export default PokemonCardShellComponent
