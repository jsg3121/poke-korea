import Link from 'next/link'

import { PokemonType } from '~/graphql/typeGenerated'
import { buildChampionsDetailHref } from '~/utils/championsFormat.util'
import { imageMode } from '~/modules/buildMode.module'
import { getTypeLabel } from '~/modules/typeParams.module'
import ChampionsTierBadge from '~/components/common/ChampionsTierBadge.component'
import Tag from '~/components/tag/Tag.component'
import { ChampionsTypeEntry } from '~/app/type-effectiveness/[type]/_fetch/typeDetail.fetch'

interface TypeDetailChampionsProps {
  pokemonType: PokemonType
  entries: Array<ChampionsTypeEntry>
}

const TypeDetailChampions = ({
  pokemonType,
  entries,
}: TypeDetailChampionsProps) => {
  if (entries.length === 0) return null

  const label = getTypeLabel(pokemonType)

  return (
    <section
      aria-labelledby="type-detail-champions"
      className="w-full pt-10 desktop:pt-14"
    >
      <h2
        id="type-detail-champions"
        className="mb-2 text-xl font-semibold leading-tight text-primary-4 desktop:text-3xl"
      >
        대전에서 쓰이는 {label} 타입
      </h2>
      <p className="mb-4 text-sm text-primary-3">
        챔피언스 메타 기준 상위 티어예요. 사용률은 제공되지 않아 채택 순위만
        표시해요.
      </p>
      <ul className="grid grid-cols-1 gap-3 desktop:grid-cols-2 desktop:gap-4">
        {entries.map(({ formatLabel, formatSlug, pokemon }) => (
          <li key={`${formatSlug}-${pokemon.pokemonId}`}>
            <Link
              href={buildChampionsDetailHref({
                formatSlug,
                pokemonId: pokemon.pokemonId,
                formType: pokemon.formType,
                formCode: pokemon.formCode,
              })}
              aria-label={`${formatLabel} ${pokemon.name} 챔피언스 상세 보기`}
              className="flex items-center gap-4 rounded-2xl bg-primary-4 p-4 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4 desktop:p-5"
            >
              {pokemon.imagePath && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${imageMode}/${pokemon.imagePath}`}
                  alt=""
                  width={72}
                  height={72}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 object-contain desktop:h-20 desktop:w-20"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-primary-2 desktop:text-sm">
                  {formatLabel}
                </p>
                <p className="mt-0.5 truncate text-base font-bold text-primary-1 desktop:text-lg">
                  {pokemon.name}
                </p>
                {pokemon.types && pokemon.types.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {pokemon.types.map((type) => (
                      <Tag key={type} type={type} />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-center gap-1">
                <ChampionsTierBadge tier={pokemon.tier} />
                {pokemon.usageRank && (
                  <span className="rounded bg-primary-1 px-1.5 py-0.5 text-2xs font-bold text-white-1">
                    #{pokemon.usageRank}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TypeDetailChampions
