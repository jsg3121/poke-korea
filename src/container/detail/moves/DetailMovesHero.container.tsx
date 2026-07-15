'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/tag/Tag.component'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import { imageMode } from '~/module/buildMode'

/**
 * 습득 기술 요약 히어로 (UX-006) — 상세로 돌아가기 링크 + 식별 정보(이미지·번호·
 * 이름·타입·등장 버전) + 폼 컨트롤(일반/리전 전환, 폼 인덱스 슬라이드).
 *
 * 구버전 MovesHeader의 이미지 경로·폼 전환 로직을 계승하되, 버전 선택 nav는
 * 히어로에서 분리해 sticky 블록(DetailMovesStickyNav)으로 옮겼다(UX-006). 반응형
 * 단일 마크업 — UA 분기·display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 */

const DetailMovesHeroContainer = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>()
  const {
    pokemonInfo,
    formDataLength,
    normalFormInfo,
    versionGroup,
    currentActiveIndex,
  } = useContext(DetailMovesContext)

  const pokemonName = pokemonInfo?.name ?? ''
  const displayName = pokemonName.replace('_', ' ')
  const activeType = pokemonInfo?.activeType
  const activeIndex = currentActiveIndex

  // 최신/최초 등장 버전 (버전 목록은 최신 → 과거 순)
  const lastVersionInfo = versionGroup?.[0]
  const firstVersionInfo = versionGroup?.[versionGroup.length - 1]

  // 리전폼은 인덱스 기반 이미지 코드, 그 외는 폼/기본 이미지 경로
  const imagePath =
    activeType === 'region'
      ? `2${pokemonId.padStart(3, '0')}${activeIndex.toString().padStart(2, '0')}`
      : (normalFormInfo?.imagePath ?? pokemonId)

  // 상세로 돌아가기 경로 (현재 폼 유지)
  const backHref =
    activeType === 'region'
      ? activeIndex > 0
        ? `/detail/${pokemonId}/region/${activeIndex}`
        : `/detail/${pokemonId}/region`
      : activeIndex > 0
        ? `/detail/${pokemonId}/form/${activeIndex}`
        : `/detail/${pokemonId}`

  // 폼 인덱스 슬라이드 노출 조건 (리전폼 다중 or 폼 체인지)
  const showFormSlide =
    (formDataLength > 1 && activeType === 'region') || pokemonInfo?.isFormChange

  const prevFormHref =
    activeType === 'region'
      ? Math.max(activeIndex - 1, 0) > 0
        ? `/detail/${pokemonId}/moves/region/${Math.max(activeIndex - 1, 0)}`
        : `/detail/${pokemonId}/moves/region`
      : Math.max(activeIndex - 1, 0) > 0
        ? `/detail/${pokemonId}/moves/form/${Math.max(activeIndex - 1, 0)}`
        : `/detail/${pokemonId}/moves`

  const nextFormHref =
    activeType === 'region'
      ? `/detail/${pokemonId}/moves/region/${Math.min(activeIndex + 1, formDataLength - 1)}`
      : `/detail/${pokemonId}/moves/form/${Math.min(activeIndex + 1, formDataLength - 1)}`

  // 경계 방어: formDataLength가 0/1이면(폼 데이터 없음) 양쪽 모두 비활성 —
  // 그대로 두면 nextFormHref가 .../form/-1 같은 잘못된 경로를 만든다(Gemini)
  const isFirstForm = activeIndex <= 0
  const isLastForm = formDataLength <= 1 || activeIndex >= formDataLength - 1

  // 이름 길이에 따라 히어로 이름 폰트 축소(모바일 강제 줄바꿈 완화). 데스크톱은
  // 폭 여유가 있어 항상 큰 폰트. 노말폼/리전폼처럼 긴 이름은 한 단계 줄인다.
  const nameSizeClass =
    displayName.length >= 9
      ? 'text-sm desktop:text-xl'
      : 'text-base desktop:text-xl'

  return (
    <section className="w-full px-4 desktop:mx-auto desktop:max-w-7xl">
      {/* 상세로 돌아가기 — 본문 CTA가 아니라 보조 내비라 DS 버튼(44px 고정) 대신
          슬림 로컬 링크로 둔다(ADR-0010, 1곳 로컬). 모바일에서 부피를 줄인다. */}
      <Link
        href={backHref}
        className="inline-flex h-8 items-center gap-1 rounded-xl bg-primary-3 px-3 text-xs font-medium text-primary-1 transition-colors hover:bg-primary-2 hover:text-primary-4 desktop:h-9 desktop:text-sm"
      >
        ← {displayName}의 상세 정보 보러가기
      </Link>

      <article className="card-detail mt-4 flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:gap-6">
        <div className="flex items-center gap-4">
          {/* ImageComponent는 figure(width/height prop)와 img(imageSize·className)가
              별개다 — wrapper div가 반응형 크기·drop-shadow를 잡고, figure는 100%,
              img는 h-full w-full object-contain으로 채운다(상세 Hero 정석 패턴). */}
          <div className="h-24 w-24 shrink-0 [filter:drop-shadow(0px_2px_2px_#000000)] desktop:h-28 desktop:w-28">
            <ImageComponent
              width="100%"
              height="100%"
              src={`${imageMode}/${imagePath}`}
              alt={displayName}
              imageSize={{ width: 112, height: 112 }}
              densities={[1, 1.5]}
              sizes="(min-width: 769px) 7rem, 6rem"
              loading="lazy"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold text-primary-2">No.{pokemonId}</p>
            <h2
              className={`break-keep font-bold text-primary-1 ${nameSizeClass}`}
            >
              {displayName}
            </h2>
            <ul className="flex gap-1.5" aria-label="타입">
              {pokemonInfo?.types?.map((type) => (
                <li key={`${pokemonId}-type-${type}`}>
                  <TagComponent type={type} />
                </li>
              ))}
            </ul>
            <dl className="mt-1 flex flex-col gap-1.5 text-xs desktop:flex-row desktop:gap-6">
              <div className="flex gap-2">
                <dt className="font-semibold text-primary-2">최초 등장</dt>
                <dd className="font-bold text-primary-1">
                  {firstVersionInfo?.baseVersionGroupName}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-primary-2">최신 등장</dt>
                <dd className="font-bold text-primary-1">
                  {lastVersionInfo?.baseVersionGroupName}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* 모바일은 폼 슬라이드 + 폼 전환 버튼을 한 줄로(flex-row), 데스크톱은
            오른쪽 정렬 세로 배치(desktop:flex-col desktop:items-end) */}
        <div className="flex flex-row flex-wrap items-center gap-2 desktop:ml-auto desktop:flex-col desktop:items-end desktop:gap-2.5">
          {showFormSlide && (
            <div className="flex items-center gap-1">
              <FormSlideLink
                href={prevFormHref}
                disabled={isFirstForm}
                label="이전 폼"
              >
                ◀
              </FormSlideLink>
              <span className="min-w-9 text-center text-xs font-bold text-primary-1 desktop:min-w-11 desktop:text-sm">
                {activeIndex + 1} / {Math.max(formDataLength, 1)}
              </span>
              <FormSlideLink
                href={nextFormHref}
                disabled={isLastForm}
                label="다음 폼"
              >
                ▶
              </FormSlideLink>
            </div>
          )}
          {activeType === 'region' && (
            <Link
              href={`/detail/${pokemonId}/moves`}
              replace
              className="flex h-7 items-center rounded-lg border border-solid border-primary-3 bg-white-1 px-3 text-xs font-medium text-primary-2 transition-colors hover:bg-primary-4 hover:text-primary-1 desktop:text-sm"
            >
              일반폼 보기
            </Link>
          )}
          {pokemonInfo?.isRegionForm && activeType !== 'region' && (
            <Link
              href={`/detail/${pokemonId}/moves/region`}
              replace
              className="flex h-7 items-center rounded-lg border border-solid border-primary-3 bg-white-1 px-3 text-xs font-medium text-primary-2 transition-colors hover:bg-primary-4 hover:text-primary-1 desktop:text-sm"
            >
              리전폼 보기
            </Link>
          )}
        </div>
      </article>
    </section>
  )
}

/** 폼 인덱스 슬라이드 버튼 — 경계(첫/끝)에서 비활성 */
const FormSlideLink = ({
  href,
  disabled,
  label,
  children,
}: {
  href: string
  disabled: boolean
  label: string
  children: React.ReactNode
}) => {
  const base =
    'inline-flex h-7 w-7 items-center justify-center rounded-lg border border-solid text-xs transition-colors desktop:h-9 desktop:w-9 desktop:text-sm'
  if (disabled) {
    return (
      <span
        aria-hidden="true"
        className={`${base} pointer-events-none select-none border-primary-3 bg-primary-3 text-primary-2`}
      >
        {children}
      </span>
    )
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className={`${base} border-primary-3 bg-white-1 text-primary-1 hover:bg-primary-4`}
    >
      {children}
    </Link>
  )
}

export default DetailMovesHeroContainer
