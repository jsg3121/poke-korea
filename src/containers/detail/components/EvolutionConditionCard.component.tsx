'use client'

import { useState } from 'react'
import Link from 'next/link'

import { EvolutionNode, hasVersionVariants } from '~/utils/evolution.util'
import { imageMode } from '~/modules/buildMode.module'
import { pokemonNumberFormat } from '~/modules/pokemonCard.module'
import Image from '~/components/Image.component'

interface EvolutionConditionCardProps {
  node: EvolutionNode
  baseName: string
}

const EvolutionConditionCard = ({
  node,
  baseName,
}: EvolutionConditionCardProps) => {
  const [activeVersionIndex, setActiveVersionIndex] = useState(0)

  const showVersionTabs = hasVersionVariants(node.versions)
  const activeVersion = node.versions[activeVersionIndex] ?? node.versions[0]
  const triggerLabel = node.triggerLabel

  const getVersionName = (
    version: EvolutionNode['versions'][number],
  ): string => {
    if (version.versionGroupId === null) return '기본'
    return version.versionLabel || `버전 ${version.versionGroupId}`
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-solid border-primary-3 p-3 desktop:p-4">
      <Link
        href={node.targetHref}
        aria-label={`${baseName}의 진화 관련 포켓몬 ${node.displayName} 상세 보기`}
        className="group -m-1 flex items-center gap-3 rounded-2xl p-1 transition-colors hover:bg-primary-1/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
      >
        <div className="block shrink-0 rounded-2xl transition-transform group-hover:scale-105">
          <Image
            src={`${imageMode}/${node.imagePath}`}
            width="5rem"
            height="5rem"
            alt={`포켓몬 ${node.displayName}`}
            imageSize={{ width: 80, height: 80 }}
            densities={[1, 1.5]}
            sizes="5rem"
            loading="lazy"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-2xs text-primary-2 desktop:text-xs">
            No.{pokemonNumberFormat(node.targetNumber)}
          </p>
          <p className="text-sm font-semibold text-primary-1 underline decoration-transparent underline-offset-2 transition-colors group-hover:decoration-current desktop:text-base">
            {node.displayName}
          </p>
          {triggerLabel && (
            <span className="mt-1 w-fit rounded-full bg-primary-3/40 px-2 py-0.5 text-2xs text-primary-2 desktop:text-xs">
              {triggerLabel}
            </span>
          )}
        </div>
        <span
          aria-hidden="true"
          className="ml-auto shrink-0 self-center text-lg text-primary-2 transition-[transform,color] group-hover:translate-x-1 group-hover:text-primary-1"
        >
          ›
        </span>
      </Link>

      {showVersionTabs ? (
        <>
          <div
            role="tablist"
            aria-label={`${node.displayName} 진화 버전별 조건`}
            className="flex flex-wrap gap-1.5"
          >
            {node.versions.map((version, index) => (
              <button
                key={`evolution-version-${node.targetNumber}-${version.versionGroupId}`}
                type="button"
                role="tab"
                aria-selected={index === activeVersionIndex}
                onClick={() => setActiveVersionIndex(index)}
                className={`rounded-full px-2.5 py-1 text-2xs transition-colors desktop:text-xs ${
                  index === activeVersionIndex
                    ? 'bg-primary-1 text-white'
                    : 'bg-primary-3/30 text-primary-2 hover:bg-primary-3/50'
                }`}
              >
                {getVersionName(version)}
              </button>
            ))}
          </div>
          {activeVersion && (
            <p className="text-xs leading-6 text-primary-1 desktop:text-sm">
              {activeVersion.description}
            </p>
          )}
        </>
      ) : (
        node.versions.map((version, index) => (
          <p
            key={`evolution-condition-${node.targetNumber}-${index}`}
            className="text-xs leading-6 text-primary-1 desktop:text-sm"
          >
            {version.description}
          </p>
        ))
      )}
    </div>
  )
}

export default EvolutionConditionCard
