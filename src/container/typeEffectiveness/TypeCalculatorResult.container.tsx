'use client'

import Link from 'next/link'
import { useContext } from 'react'
import TagComponent from '~/components/tag/Tag.component'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { calculateRelationType } from '~/module/calculateRelationType'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import TypeEffectivenessCtaContainer from './TypeEffectivenessCta.container'

/**
 * 상성 계산 결과 (반응형 단일 — UX-009). 구버전 데/모 2벌
 * TypeEffectivenessResult(+ResultList·TypeResultChip)를 대체한다.
 *
 * TypeMatchup(상세 DS)은 컴포넌트로 재사용하지 않는다 — 방어 관점 정적 표시라
 * 계산기(공격 관점 + 도감 링크 클릭)와 극성·책임이 다르다(UX-009 §3-2, 보류
 * 트랙 "TypeMatchup 상성계산기 재사용" 판정). 대신 디자인 언어(grade-* 색
 * 토큰, dl 시맨틱, srLabel 패턴)만 승계한다. 구버전의 중요도 배경 임의 헥사
 * 5종(#feb0b0 등)은 grade-* 토큰과 1:1 대응으로 정규화된다.
 *
 * 배율 표기는 "텍스트형"(시안 (a)/(b) 비교 후 사용자 확정 2026-07-20):
 * 배율은 배지가 아니라 크고 굵은 grade 색 텍스트 + 좌측 고정 폭 컬럼 세로
 * 정렬 + 행 좌측 grade 색 보더. 타입만 배지(Tag) 형태로 남겨 "배지=타입"
 * 단일 규칙로 배율-타입 혼동을 원천 차단한다(시안 피드백).
 */

interface ResultRow {
  /** 배율 설명 문장 (예: '4배의 데미지를 줄 수 있어요') — 구버전 문구 승계 */
  description: string
  /** grade 텍스트·보더 색 (정적 매핑, purge 안전) */
  textClass: string
  borderClass: string
  types: Array<PokemonType>
}

const ResultSection = ({
  title,
  rows,
}: {
  title: string
  rows: Array<ResultRow>
}) => {
  const visibleRows = rows.filter((row) => row.types.length > 0)
  if (visibleRows.length === 0) return null

  return (
    <article className="w-full rounded-2xl bg-primary-2 p-4 desktop:p-6">
      <h3 className="mb-4 text-lg desktop:text-xl font-bold text-primary-4">
        {title}
      </h3>
      <dl className="flex flex-col gap-4">
        {visibleRows.map((row) => (
          <div
            key={row.description}
            className={`border-l-4 border-solid pl-3 ${row.borderClass}`}
          >
            {/* 배율은 설명 문장으로 표기(사용자 재결정 2026-07-20 — 압축 표기
                ×4보다 구버전 문장이 초심자에게 자명하다). 문장이 길어 좌측 고정
                폭 컬럼 대신 문장 위·칩 아래 세로 구조. grade 색은 문장 색+행
                보더로 유지해 위험도 신호를 남긴다. */}
            <dt
              className={`text-base desktop:text-lg font-bold ${row.textClass}`}
            >
              {row.description}
            </dt>
            <dd className="m-0 mt-2 flex flex-wrap items-center gap-1.5">
              {row.types.map((type) => (
                <Link
                  key={type}
                  href={`/list?type=${type}`}
                  aria-label={`${PokemonTypes[type]} 타입 포켓몬 도감 보기`}
                  className="inline-flex rounded-lg p-0.5 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
                >
                  <TagComponent type={type} />
                </Link>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

const TypeCalculatorResultContainer = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)

  const { double, half, quad, quarter, zero } =
    calculateRelationType(selectTypeList)

  const hasSelection = selectTypeList.length > 0
  const selectTypeListKo = selectTypeList
    .map((type) => PokemonTypes[type])
    .join(' + ')

  // 공격 관점 문장 — TypeMatchup의 약점/강점(방어 관점)과 극성이 반대라
  // 같은 라벨을 쓰면 오해를 유발한다(UX-009 §3-2). 문구는 구버전 승계.
  const recommendRows: Array<ResultRow> = [
    {
      description: '4배의 데미지를 줄 수 있어요',
      textClass: 'text-grade-danger',
      borderClass: 'border-grade-danger',
      types: quad,
    },
    {
      description: '2배의 데미지를 줄 수 있어요',
      textClass: 'text-grade-warning',
      borderClass: 'border-grade-warning',
      types: double,
    },
  ]
  const cautionRows: Array<ResultRow> = [
    {
      description: '0.5배의 데미지만 줄 수 있어요',
      textClass: 'text-grade-good',
      borderClass: 'border-grade-good',
      types: half,
    },
    {
      description: '0.25배의 데미지만 줄 수 있어요',
      textClass: 'text-grade-better',
      borderClass: 'border-grade-better',
      types: quarter,
    },
    {
      description: '데미지를 줄 수 없어요',
      textClass: 'text-grade-best',
      borderClass: 'border-grade-best',
      types: zero,
    },
  ]

  return (
    // 래퍼는 항상 마운트 — aria-live 리전이 조건부 마운트되면 스크린리더가
    // 변경을 안정적으로 낭독하지 못한다. 알림 범위는 요약 한 문장으로 좁혀
    // 매 선택마다 결과 전체를 다시 읽는 소음을 막는다(UX-009 §10-3).
    <div className="w-full">
      <p aria-live="polite" className="sr-only">
        {hasSelection
          ? `${selectTypeListKo} 타입 상성 결과가 표시되었습니다`
          : ''}
      </p>
      {hasSelection && (
        <section className="w-full pt-6 desktop:pt-8">
          <h2 className="text-xl desktop:text-3xl font-semibold text-primary-4 leading-tight">
            {selectTypeListKo} 타입은 이렇게 상대하세요!
          </h2>
          <p className="mt-2 text-base text-primary-4/80">
            타입을 누르면 해당 타입 포켓몬을 도감에서 볼 수 있어요.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 desktop:grid-cols-2 desktop:gap-8">
            <ResultSection
              title="이런 타입을 쓰면 좋아요!"
              rows={recommendRows}
            />
            <ResultSection
              title="이런 타입은 조심해야 해요!"
              rows={cautionRows}
            />
          </div>

          <TypeEffectivenessCtaContainer />
        </section>
      )}
    </div>
  )
}

export default TypeCalculatorResultContainer
