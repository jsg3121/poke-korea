import { useMemo } from 'react'
import PokemonCardShellComponent from '~/components/pokemonCard/PokemonCardShell.component'
import { PokemonWithAbilityInfoFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { CardColor } from '~/types/pokemonTypes.types'

/**
 * 특성별 포켓몬 카드 (반응형 단일 DS 컴포넌트).
 * 특성 상세(/ability/[id])에서 "이 특성을 가진 포켓몬"을 표시한다.
 *
 * 레이아웃 셸(Link+article+포켓볼+이미지+타입 태그+그라데이션)은 PokemonCardShell에
 * 위임하고, 이 컴포넌트는 헤더(No.+이름)와 본문(숨겨진 특성 배지·폼 라벨)만 책임진다.
 * 도감 포켓몬 카드(PokemonCard)와 데이터 도메인(PokemonWithAbility: 폼·isHidden·
 * imagePath)이 달라 셸만 공유하고 카드는 분리한다([[home-phase-b-decisions]] 결정).
 *
 * 구버전의 useDevice(UA 분기) 이미지 크기 분기를 제거했다 — 셸이 CSS sizes 속성으로
 * 반응형을 처리하므로 JS 뷰포트 분기가 불필요하고, SSR/CSR 불일치로 인한 CLS도 없앤다.
 */

interface PokemonByAbilityCardProps {
  pokemonData: PokemonWithAbilityInfoFragment
  isHighPriority?: boolean
}

const PokemonByAbilityCardComponent = ({
  pokemonData,
  isHighPriority = false,
}: PokemonByAbilityCardProps) => {
  const pokemonNumber = String(pokemonData.number).padStart(3, '0')

  // 타입별 배경색 계산 (셸은 계산된 색 배열을 받는다)
  const backgroundColor = useMemo(
    () => pokemonData.types.map((item) => CardColor[item]),
    [pokemonData.types],
  )

  // 폼 타입에 따른 표시 텍스트
  const formLabel = useMemo(() => {
    switch (pokemonData.formType) {
      case 'MEGA':
        return '메가진화'
      case 'REGION_FORM':
        return pokemonData.region ? `${pokemonData.region} 폼` : '지역 폼'
      case 'NORMAL_FORM':
        return pokemonData.formName || '폼'
      default:
        return null
    }
  }, [pokemonData.formType, pokemonData.region, pokemonData.formName])

  // Path 기반 URL 생성 (폼 분기)
  const pokemonHref = useMemo(() => {
    const baseUrl = `/detail/${pokemonData.number}`

    if (pokemonData.formType === 'MEGA') {
      const megaIndex = pokemonData.imagePath
        ? parseInt(pokemonData.imagePath[pokemonData.imagePath.length - 1], 10)
        : 0
      return megaIndex > 0 ? `${baseUrl}/mega/${megaIndex}` : `${baseUrl}/mega`
    }

    if (pokemonData.formType === 'REGION_FORM') {
      const regionIndex = pokemonData.imagePath
        ? parseInt(pokemonData.imagePath[pokemonData.imagePath.length - 1], 10)
        : 0
      return regionIndex > 0
        ? `${baseUrl}/region/${regionIndex}`
        : `${baseUrl}/region`
    }

    if (pokemonData.formType === 'NORMAL_FORM') {
      const formIndex = pokemonData.imagePath
        ? parseInt(pokemonData.imagePath.split('_')[1], 10)
        : 0
      return formIndex > 0 ? `${baseUrl}/form/${formIndex}` : baseUrl
    }

    return baseUrl
  }, [pokemonData.formType, pokemonData.imagePath, pokemonData.number])

  const altText = `pokemon_id_${pokemonData.number} ${pokemonData.name} ${
    formLabel ?? ''
  }`

  return (
    <PokemonCardShellComponent
      href={pokemonHref}
      backgroundColor={backgroundColor}
      types={pokemonData.types}
      imageSrc={`${imageMode}/${pokemonData.imagePath ?? pokemonData.number}`}
      imageAlt={altText}
      imageSize={{ width: 160, height: 160 }}
      isHighPriority={isHighPriority}
      ariaLabel={`포켓몬 ${pokemonData.name} 카드 ${formLabel ?? ''}`}
      header={
        <div className="w-full flex items-start content-start flex-wrap justify-between border-b border-solid border-card-accent pb-1 gap-x-2 gap-y-0.5">
          <p className="flex-shrink-0 text-xs desktop:text-base leading-tight font-medium text-black-2">
            No.{pokemonNumber}
          </p>
          <h3 className="leading-tight font-semibold text-black break-keep text-right">
            {pokemonData.name}
          </h3>
        </div>
      }
    >
      {/* 배지 영역: 배지(숨겨진 특성·폼) 유무와 무관하게 min-h-6으로 높이를 고정해
          카드마다 이미지 아래 여백이 들쭉날쭉하지 않게 한다. 타입 태그(셸이 좌측
          정렬로 렌더)와 정렬을 맞추기 위해 배지도 좌측 정렬한다 — 타입 중앙 정렬은
          셸이 공유 SSOT라 특성 카드만 바꿀 수 없어 좌측으로 통일. */}
      <div className="w-full flex flex-wrap items-center justify-start gap-2 px-2 mt-2 min-h-6">
        {pokemonData.isHidden && (
          <strong className="h-6 text-aligned-sm px-2 text-xs bg-type-electric text-black-2 rounded-md font-bold">
            숨겨진 특성
          </strong>
        )}
        {formLabel && (
          <span className="h-6 text-aligned-sm px-2 text-xs bg-card-accent text-white rounded-md font-medium">
            {formLabel}
          </span>
        )}
      </div>
    </PokemonCardShellComponent>
  )
}

export default PokemonByAbilityCardComponent
