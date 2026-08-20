'use client'

import Link from 'next/link'
import { useState } from 'react'
import ImageComponent from '~/components/Image.component'
import { imageMode } from '~/module/buildMode'
import { pokemonNumberFormat } from '~/module/pokemonCard.module'
import { EvolutionNode, hasVersionVariants } from '~/utils/evolution.util'

/**
 * 진화 루트 1개 카드(대상 + 폼 조합). 이미지·이름은 edge의 result*에서 온 값이라
 * 리전폼(나인테일 알로라의 모습)·폼체인지(황혼 루가루암)도 정확히 나온다. 여기에
 * 이 진화의 조건 문장(description)을 덧붙인다.
 *
 * 버전 그룹이 여럿인 진화(리피아·글레이시아 등, §5)는 버전 탭 버튼으로 전환한다.
 * 초기 노출은 대표(versions[0] — 공통/최신이 앞으로 정렬됨)라, SSR 색인 대상은
 * 대표 1개로 유지되고 나머지 버전은 클라이언트 상태 전환으로만 노출된다(중복
 * 콘텐츠 색인 회피 — 상세 확장 기획서 ② 정책과 동일 방향). vg가 전부 null인데
 * 조건이 여럿이면 버전 차이가 아니므로 조건을 여러 줄로 나열한다.
 */

interface EvolutionConditionCardProps {
  node: EvolutionNode
  /** 접근성 라벨용 현재 포켓몬 이름 */
  baseName: string
}

const EvolutionConditionCardComponent = ({
  node,
  baseName,
}: EvolutionConditionCardProps) => {
  const [activeVersionIndex, setActiveVersionIndex] = useState(0)

  // 버전 탭은 versionGroupId가 실제로 있을 때만(리피아 등). vg가 전부 null인데
  // 조건이 여럿이면 버전 차이가 아니므로 탭이 아니라 조건을 여러 줄로 나열한다.
  const showVersionTabs = hasVersionVariants(node.versions)
  const activeVersion = node.versions[activeVersionIndex] ?? node.versions[0]
  const triggerLabel = node.triggerLabel

  const getVersionName = (
    version: EvolutionNode['versions'][number],
  ): string => {
    // 전 버전 공통(vg=null)은 특정 버전이 아니라 현행/기본 진화법이라 "기본"으로
    // 표기한다. 그 외는 백엔드 versionLabel(baseVersionGroupName)을 쓴다 —
    // DLC 버전(예: 갑옷섬)도 base 버전명("소드·실드")으로 온다.
    if (version.versionGroupId === null) return '기본'
    return version.versionLabel || `버전 ${version.versionGroupId}`
  }

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-solid border-primary-3 p-3 desktop:p-4">
      {/* 링크 영역이 이미지에서 헤더 전체로 넓어졌으므로 어포던스도 함께 넓힌다 —
          hover 효과가 이미지에만 걸려 있으면 이름 쪽은 눌러도 반응이 없어 보여
          클릭 가능하다는 인지가 안 된다. 평상시엔 화살표로 링크임을 알리고,
          hover 시 배경·이름 색·화살표가 함께 반응한다(ChampionsQuickLinks·
          MoveTable에서 쓰는 group-hover 패턴). */}
      <Link
        href={node.targetHref}
        aria-label={`${baseName}의 진화 관련 포켓몬 ${node.displayName} 상세 보기`}
        className="group -m-1 flex items-center gap-3 rounded-2xl p-1 transition-colors hover:bg-primary-1/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
      >
        <div className="block shrink-0 rounded-2xl transition-transform group-hover:scale-105">
          <ImageComponent
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
        {/* 링크임을 평상시에도 알리는 신호 — 텍스트 콘텐츠가 아니라 장식이라
            aria-hidden(링크 목적은 Link의 aria-label이 이미 전달한다) */}
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
        // 버전 구분이 없는 조건은 모두 나열한다(단일 조건이면 1줄).
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

export default EvolutionConditionCardComponent
