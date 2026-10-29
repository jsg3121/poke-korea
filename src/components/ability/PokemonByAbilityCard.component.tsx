import { useMemo } from 'react'

import { CardColor } from '~/types/pokemonTypes.types'
import { PokemonWithAbilityInfoFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/modules/buildMode.module'
import { getNameHeaderClass } from '~/modules/pokemonCard.module'
import PokemonCardShell from '~/components/pokemonCard/PokemonCardShell.component'

interface PokemonByAbilityCardProps {
  pokemonData: PokemonWithAbilityInfoFragment
  isHighPriority?: boolean
}

const PokemonByAbilityCard = ({
  pokemonData,
  isHighPriority = false,
}: PokemonByAbilityCardProps) => {
  const pokemonNumber = String(pokemonData.number).padStart(3, '0')
  const displayName = pokemonData.formName || pokemonData.name
  const nameHeaderClass = getNameHeaderClass(displayName)

  const backgroundColor = useMemo(
    () => pokemonData.types.map((item) => CardColor[item]),
    [pokemonData.types],
  )

  // 폼 인덱스는 백엔드가 상세 페이지와 같은 정렬로 계산해 내려준다.
  // imagePath에서 추측하면 안 된다 — 노말폼 imagePath는 `773-fire`처럼
  // 인덱스가 없는 이름이 섞여 있어 기본 페이지로 잘못 연결됐다.
  const pokemonHref = useMemo(() => {
    const baseUrl = `/detail/${pokemonData.number}`
    const formIndex = pokemonData.formIndex ?? 0

    if (pokemonData.formType === 'MEGA') {
      return formIndex > 0 ? `${baseUrl}/mega/${formIndex}` : `${baseUrl}/mega`
    }

    if (pokemonData.formType === 'REGION_FORM') {
      return formIndex > 0
        ? `${baseUrl}/region/${formIndex}`
        : `${baseUrl}/region`
    }

    if (pokemonData.formType === 'NORMAL_FORM') {
      return formIndex > 0 ? `${baseUrl}/form/${formIndex}` : baseUrl
    }

    return baseUrl
  }, [pokemonData.formType, pokemonData.formIndex, pokemonData.number])

  return (
    <PokemonCardShell
      href={pokemonHref}
      backgroundColor={backgroundColor}
      types={pokemonData.types}
      imageSrc={`${imageMode}/${pokemonData.imagePath ?? pokemonData.number}`}
      imageAlt={`pokemon_id_${pokemonData.number} ${displayName}`}
      imageSize={{ width: 160, height: 160 }}
      isHighPriority={isHighPriority}
      ariaLabel={`포켓몬 ${displayName} 카드`}
      header={
        <div className="w-full flex items-start content-start flex-wrap justify-between border-b border-solid border-card-accent pb-1 gap-x-2 gap-y-0.5">
          <p className="flex-shrink-0 text-xs desktop:text-base leading-tight font-medium text-black-2">
            No.{pokemonNumber}
          </p>
          <h3
            className={`leading-tight font-semibold text-black break-keep ${nameHeaderClass}`}
          >
            {displayName}
          </h3>
        </div>
      }
    >
      <div className="w-full flex flex-wrap items-center justify-start gap-2 px-2 mt-2 min-h-6">
        {pokemonData.isHidden && (
          <strong className="h-6 text-aligned-sm px-2 text-xs bg-type-electric text-black-2 rounded-md font-bold">
            숨겨진 특성
          </strong>
        )}
      </div>
    </PokemonCardShell>
  )
}

export default PokemonByAbilityCard
