import { Fragment } from 'react'

import { PokemonCardFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/modules/buildMode.module'
import {
  getBackgroundColor,
  getNameHeaderClass,
  pokemonNumberFormat,
} from '~/modules/pokemonCard.module'

import PokemonCardShell from './PokemonCardShell.component'

interface PokemonCardBaseProps {
  pokemonData: PokemonCardFragment
  isHighPriority?: boolean
}

type PokemonCardVariant = {
  variant: 'pokedex'
}

type PokemonCardProps = PokemonCardBaseProps & PokemonCardVariant

type PokemonStatKey =
  | 'hp'
  | 'attack'
  | 'specialAttack'
  | 'defense'
  | 'specialDefense'
  | 'speed'

const POKEDEX_STAT_ROWS: ReadonlyArray<{ label: string; key: PokemonStatKey }> =
  [
    { label: '체력', key: 'hp' },
    { label: '공격', key: 'attack' },
    { label: '특수공격', key: 'specialAttack' },
    { label: '방어', key: 'defense' },
    { label: '특수방어', key: 'specialDefense' },
    { label: '스피드', key: 'speed' },
  ]

const PokemonCard = ({
  pokemonData,
  isHighPriority = false,
  variant,
}: PokemonCardProps) => {
  const pokemonNumber = pokemonNumberFormat(pokemonData.number)
  const nameHeaderClass = getNameHeaderClass(pokemonData.name)
  const backgroundColor = getBackgroundColor(pokemonData.types)

  return (
    <PokemonCardShell
      href={`/detail/${pokemonData.number}`}
      backgroundColor={backgroundColor}
      types={pokemonData.types}
      imageSrc={`${imageMode}/${pokemonData.number}`}
      imageAlt={`pokemon_id_${pokemonData.number} ${pokemonData.name}`}
      imageSize={{ width: 160, height: 160 }}
      isHighPriority={isHighPriority}
      ariaLabel={`포켓몬 ${pokemonData.name} 카드`}
      header={
        <div className="w-full flex items-start content-start flex-wrap justify-between border-b border-solid border-card-accent pb-1 gap-x-2 gap-y-0.5">
          <p className="flex-shrink-0 text-xs desktop:text-base leading-tight font-medium text-black-2">
            No.{pokemonNumber}
          </p>
          <h3
            className={`leading-tight font-semibold text-black break-keep ${nameHeaderClass}`}
          >
            {pokemonData.name}
          </h3>
        </div>
      }
    >
      {variant === 'pokedex' && (
        <dl
          className="w-full grid grid-rows-[repeat(3,_1fr)] grid-cols-[35%_15%_35%_15%] mt-2 desktop:mt-4 mx-auto pl-2"
          aria-label="능력치"
        >
          {POKEDEX_STAT_ROWS.map(({ label, key }, index) => (
            <Fragment key={key}>
              <dt
                className={`h-4 desktop:h-6 text-2xs desktop:text-sm leading-4 desktop:leading-6 whitespace-nowrap ${
                  index % 2 === 0 ? 'mr-1' : 'ml-2'
                }`}
              >
                {label}
              </dt>
              <dd className="h-4 desktop:h-6 text-2xs desktop:text-sm leading-4 desktop:leading-6 text-right font-bold text-black">
                {pokemonData.pokemonStats[key]}
              </dd>
            </Fragment>
          ))}
        </dl>
      )}
    </PokemonCardShell>
  )
}

export default PokemonCard
