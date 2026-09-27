import { useMemo } from 'react'

import LevelUpIcon from '~/assets/icons/levelUp.svg'
import MachineMoveIcon from '~/assets/icons/machineMove.svg'
import { CardColor } from '~/types/pokemonTypes.types'
import { LearnMethod, PokemonLearnInfo } from '~/graphql/typeGenerated'
import { imageMode } from '~/modules/buildMode.module'
import PokemonCardShell from '~/components/pokemonCard/PokemonCardShell.component'

interface PokemonBySkillCardProps {
  pokemonData: PokemonLearnInfo
  isHighPriority?: boolean
  getMethodLabel?: (method: LearnMethod) => string
}

const PokemonBySkillCard = ({
  pokemonData,
  isHighPriority = false,
  getMethodLabel = (method) => method,
}: PokemonBySkillCardProps) => {
  const pokemonNumber = String(pokemonData.number).padStart(3, '0')

  const backgroundColor = useMemo(
    () => pokemonData.types.map((item) => CardColor[item]),
    [pokemonData.types],
  )

  const formLabel = useMemo(() => {
    switch (pokemonData.formType) {
      case 'REGION':
        return pokemonData.region ? `${pokemonData.region} 폼` : '지역 폼'
      case 'NORMAL':
        return pokemonData.formName || '폼'
      default:
        return null
    }
  }, [pokemonData.formType, pokemonData.region, pokemonData.formName])

  const pokemonHref = useMemo(() => {
    const baseUrl = `/detail/${pokemonData.number}`

    if (pokemonData.formType === 'REGION') {
      const regionIndex = pokemonData.imagePath
        ? parseInt(pokemonData.imagePath[pokemonData.imagePath.length - 1], 10)
        : 0
      return regionIndex > 0
        ? `${baseUrl}/region/${regionIndex}`
        : `${baseUrl}/region`
    }

    if (pokemonData.formType === 'NORMAL') {
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
    <PokemonCardShell
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
      <div className="w-full flex flex-wrap items-center justify-start gap-2 px-2 mt-2 min-h-6">
        {pokemonData.methods.map((method, index) => (
          <span
            key={`method-${method.method}-${index}`}
            className={`inline-flex items-center gap-1 rounded-md px-2 font-bold ${
              method.method === LearnMethod.LEVEL_UP
                ? 'bg-damage-status text-primary-1'
                : 'bg-card-accent text-white'
            }`}
          >
            {method.method === LearnMethod.LEVEL_UP && (
              <LevelUpIcon width={12} height={12} aria-hidden="true" />
            )}
            {method.method === LearnMethod.MACHINE && (
              <MachineMoveIcon width={16} height={16} aria-hidden="true" />
            )}
            <span className="h-6 text-aligned-sm text-xs">
              {getMethodLabel(method.method)}
            </span>
          </span>
        ))}
        {formLabel && (
          <span className="h-6 text-aligned-sm px-2 text-xs bg-card-accent text-white rounded-md font-medium">
            {formLabel}
          </span>
        )}
      </div>
    </PokemonCardShell>
  )
}

export default PokemonBySkillCard
