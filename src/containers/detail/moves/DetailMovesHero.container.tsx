'use client'

import { useContext } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { imageMode } from '~/modules/buildMode.module'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import Image from '~/components/Image.component'
import Tag from '~/components/tag/Tag.component'

const DetailMovesHero = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>()
  const {
    pokemonInfo,
    formDataLength,
    normalFormInfo,
    versionGroup,
    currentActiveIndex,
  } = useContext(DetailMovesContext)

  const displayName = pokemonInfo?.name ?? ''
  const activeType = pokemonInfo?.activeType
  const activeIndex = currentActiveIndex

  const latestVersionInfo = versionGroup?.[0]
  const firstVersionInfo = versionGroup?.[versionGroup.length - 1]

  const imagePath =
    activeType === 'region'
      ? `2${pokemonId.padStart(3, '0')}${activeIndex.toString().padStart(2, '0')}`
      : (normalFormInfo?.imagePath ?? pokemonId)

  const isRegion = activeType === 'region'

  const buildFormPath = (base: string, index: number) => {
    const safeIndex = Math.max(index, 0)
    if (isRegion) {
      return safeIndex > 0 ? `${base}/region/${safeIndex}` : `${base}/region`
    }
    return safeIndex > 0 ? `${base}/form/${safeIndex}` : base
  }

  const detailBase = `/detail/${pokemonId}`
  const movesBase = `${detailBase}/moves`

  const backHref = buildFormPath(detailBase, activeIndex)

  const showFormSlide =
    (formDataLength > 1 && activeType === 'region') || pokemonInfo?.isFormChange

  const prevFormHref = buildFormPath(movesBase, activeIndex - 1)
  const nextFormHref = buildFormPath(
    movesBase,
    Math.min(activeIndex + 1, formDataLength - 1),
  )

  const isFirstForm = activeIndex <= 0
  const isLastForm = formDataLength <= 1 || activeIndex >= formDataLength - 1

  const nameSizeClass =
    displayName.length >= 9
      ? 'text-sm desktop:text-xl'
      : 'text-base desktop:text-xl'

  return (
    <section className="w-full px-4 desktop:mx-auto desktop:max-w-7xl">
      <Link
        href={backHref}
        className="inline-flex h-8 items-center gap-1 rounded-xl bg-primary-3 px-3 text-xs font-medium text-primary-1 transition-colors hover:bg-primary-2 hover:text-primary-4 desktop:h-9 desktop:text-sm"
      >
        ← {displayName}의 상세 정보 보러가기
      </Link>

      <article className="card-detail mt-4 flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:gap-6">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 shrink-0 [filter:drop-shadow(0px_2px_2px_#000000)] desktop:h-28 desktop:w-28">
            <Image
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
                  <Tag type={type} />
                </li>
              ))}
            </ul>
            <dl className="mt-1 flex flex-col gap-1.5 text-xs desktop:flex-row desktop:gap-6">
              <div className="flex gap-2">
                <dt className="font-semibold text-primary-2">최초 등장</dt>
                <dd className="font-bold text-primary-1">
                  {firstVersionInfo?.displayName ??
                    firstVersionInfo?.baseVersionGroupName}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold text-primary-2">최신 등장</dt>
                <dd className="font-bold text-primary-1">
                  {latestVersionInfo?.displayName ??
                    latestVersionInfo?.baseVersionGroupName}
                </dd>
              </div>
            </dl>
          </div>
        </div>

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

export default DetailMovesHero
