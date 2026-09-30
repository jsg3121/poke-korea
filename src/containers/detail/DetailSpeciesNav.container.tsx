import Link from 'next/link'

import { pokemonNumberFormat } from '~/modules/pokemonCard.module'

export interface AdjacentPokemon {
  number: number
  name: string
}

interface DetailSpeciesNavProps {
  prev: AdjacentPokemon | null
  next: AdjacentPokemon | null
}

const navLinkClass =
  'flex min-h-8 items-center whitespace-nowrap rounded-2xl bg-primary-3 px-3 text-2xs font-semibold text-primary-1 transition-colors hover:bg-primary-2 hover:text-primary-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1 desktop:min-h-touch desktop:px-4 desktop:text-sm'

const DetailSpeciesNav = ({ prev, next }: DetailSpeciesNavProps) => {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="도감 순서 이동"
      className="flex w-full items-center justify-between gap-2 px-4 py-3"
    >
      {prev ? (
        <Link
          href={`/detail/${prev.number}`}
          className={navLinkClass}
          aria-label={`이전 포켓몬: No.${pokemonNumberFormat(prev.number)} ${prev.name}`}
        >
          ← No.{pokemonNumberFormat(prev.number)} {prev.name}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <Link
          href={`/detail/${next.number}`}
          className={navLinkClass}
          aria-label={`다음 포켓몬: No.${pokemonNumberFormat(next.number)} ${next.name}`}
        >
          No.{pokemonNumberFormat(next.number)} {next.name} →
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  )
}

export default DetailSpeciesNav
