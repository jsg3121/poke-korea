'use client'

import Link from 'next/link'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { TYPE_ORDER } from '~/constants/typeEffectivenessChart'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { buildTypeDetailPath, buildTypeSlug } from '~/module/typeParams.module'
import { PokemonTypes } from '~/types/pokemonTypes.types'

/**
 * 타입 미선택 시 노출하는 타입 상세 바로가기.
 *
 * ## 왜 이 자리인가
 *
 * 타입을 고르기 전에는 결과 영역이 통째로 비어 있다(`TypeCalculatorResult`는
 * sr-only 알림만 남기고 아무것도 렌더하지 않는다). 계산기 → 광고 → **빈 공간**
 * → 상성표 순이라, 정보형 사용자는 폴드 근처에서 다음 행동을 찾지 못한다.
 *
 * 이 죽은 공간을 채우면 세 가지가 동시에 해결된다.
 * 1. 하위 페이지 링크가 **폴드에서 가장 가까운 위치**에 놓인다
 * 2. 계산기를 쓰지 않는 사용자에게 즉시 다음 행동을 제공한다
 * 3. 타입을 고르는 순간 사라지므로 **계산기 사용자에게 방해가 0**이다
 *
 * 기존 요소를 하나도 건드리지 않아 리스크가 가장 낮은 내부 링크 진입점이다.
 *
 * ## 18개 전체를 노출한다
 *
 * 일부만 노출하면 "왜 이 타입만?"이라는 기준을 설명해야 하고, 빠진 타입은
 * 이 진입점에서 링크를 받지 못한다. 18개 전부 두되 **칩을 작게** 만들어
 * 시각 비중을 낮췄다 — 이 블록은 계산기의 보조 수단이지 주인공이 아니다.
 * 크게 두면 페이지 1순위 자산인 타입 선택 버튼에서 시선을 뺏는다.
 */

/**
 * 18개 전체. 순서는 **상성표와 동일한 도감 순서**(TYPE_ORDER)를 따른다.
 *
 * `Object.values(PokemonType)`는 GraphQL enum이라 알파벳순(벌레·악·드래곤…)
 * 으로 나온다. 같은 페이지의 상성표는 도감 순(노말·불꽃·물…)이라 두 목록의
 * 순서가 어긋나면 사용자가 같은 타입을 두 번 찾게 된다.
 */
const QUICK_LINK_TYPES: ReadonlyArray<PokemonType> = TYPE_ORDER.map(
  (label) =>
    Object.values(PokemonType).find(
      (type) => PokemonTypes[type] === label,
    ) as PokemonType,
)

const TypeQuickLinksContainer = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)

  // 타입을 고르면 결과가 이 자리를 차지하므로 물러난다.
  if (selectTypeList.length > 0) return null

  return (
    // 이 블록은 계산기의 보조 수단이지 주인공이 아니다. 제목을 h3로 낮추고
    // (계산기·결과·상성표가 h2) 폰트·여백·칩 크기를 줄여 시각 비중을 낮춘다 —
    // 크게 두면 페이지 1순위 자산인 타입 선택 버튼에서 시선을 뺏는다.
    <section
      aria-labelledby="type-quick-links-heading"
      className="w-full pt-5 desktop:pt-6"
    >
      <h3
        id="type-quick-links-heading"
        className="text-base font-bold leading-tight text-primary-4 desktop:text-lg"
      >
        타입별 약점 바로 보기
      </h3>
      <p className="mt-1 text-sm text-primary-3">
        타입을 고르지 않아도 각 타입의 약점과 상성을 자세히 확인할 수 있어요.
      </p>
      {/* 모바일 3열 → 데스크톱 6열.
          9열은 쓰지 않는다 — 970px 이하에서 칩이 좁아져 3글자 타입
          (에스퍼·페어리·드래곤)이 칸을 넘는다. 구간을 나누려면
          `desktop-970`(max-970px)을 써야 하는데 이 브레이크포인트는 모바일까지
          포함해 grid-cols-3을 덮어쓰고, `desktop:desktop-970:` 중첩은 Tailwind가
          규칙을 생성하지 않는다. 6열이면 769px에서도 글자 여유가 74px라
          전 구간에서 안전하다. */}
      <ul className="mt-3 grid grid-cols-3 gap-1.5 desktop:grid-cols-6 desktop:gap-2">
        {QUICK_LINK_TYPES.map((type) => (
          <li key={type}>
            {/* 18개를 한 화면에 두려면 칩이 작아야 한다. 화살표(›)는 빼고
                아이콘 + 타입명만 남긴다 — 9열에서는 화살표가 들어갈 폭이
                없고, 없어도 링크임은 hover·커서로 전달된다. 터치 타겟은
                min-h-touch(44px)로 유지한다. */}
            <Link
              href={buildTypeDetailPath(type)}
              aria-label={`${PokemonTypes[type]} 타입 약점과 상성 보기`}
              // whitespace-nowrap: 열 수 분기로 대부분 해결되지만, 폰트 크기가
              // 다른 환경에서도 타입명이 두 줄로 쪼개지지 않게 못 박는다.
              // w-full + min-w-0: 이게 없으면 링크가 콘텐츠 크기로 부풀어
              // 그리드 칸을 넘어 밖으로 튀어나온다(whitespace-nowrap이 줄바꿈을
              // 막으니 대신 가로로 넘친다). 칸 안에 가두는 것이 먼저다.
              // 좁은 화면(340px)에서는 px-1.5·gap-1로 내부 고정 소모를 줄인다.
              className="flex min-h-touch w-full min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-solid border-primary-2 px-1.5 py-1.5 text-sm font-semibold text-primary-3 transition-colors hover:border-primary-4 hover:bg-primary-2 hover:text-primary-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4 desktop:gap-1.5 desktop:px-2"
            >
              <span className="block h-3.5 w-3.5 shrink-0 desktop:h-5 desktop:w-5">
                <ImageComponent
                  alt=""
                  aria-hidden="true"
                  src={`/assets/type/${buildTypeSlug(type)}.svg`}
                  width="100%"
                  height="100%"
                  imageSize={{ width: 20, height: 20 }}
                />
              </span>
              {PokemonTypes[type]}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TypeQuickLinksContainer
