import { ChampionsPokemonCardFragment } from '~/graphql/typeGenerated'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
  getChampionsFormBadge,
} from '~/utils/championsFormat.util'
import { imageMode } from '~/modules/buildMode.module'
import {
  getBackgroundColor,
  getNameHeaderClass,
  pokemonNumberFormat,
} from '~/modules/pokemonCard.module'
import PokemonCardShell from '~/components/pokemonCard/PokemonCardShell.component'

interface ChampionsPokemonCardProps {
  pokemonData: ChampionsPokemonCardFragment
  isHighPriority?: boolean
  formatSlug: ChampionsFormatSlug
}

const TOP_ROWS: ReadonlyArray<{
  label: string
  getValue: (p: ChampionsPokemonCardFragment) => string
}> = [
  { label: '인기 기술', getValue: (p) => p.topMove ?? '-' },
  { label: '인기 특성', getValue: (p) => p.topAbility ?? '-' },
  { label: '인기 도구', getValue: (p) => p.topItem ?? '-' },
]

const ChampionsPokemonCard = ({
  pokemonData,
  isHighPriority = false,
  formatSlug,
}: ChampionsPokemonCardProps) => {
  const pokemonNumber = pokemonNumberFormat(pokemonData.pokemonNumber)
  const nameHeaderClass = getNameHeaderClass(pokemonData.name)
  const backgroundColor = getBackgroundColor(pokemonData.types)
  const formBadge = getChampionsFormBadge(
    pokemonData.formType,
    pokemonData.region,
  )

  const detailHref = buildChampionsDetailHref({
    formatSlug,
    pokemonId: pokemonData.externalDexId,
    formType: pokemonData.formType,
    formCode: pokemonData.formCode,
  })

  return (
    <PokemonCardShell
      href={detailHref}
      backgroundColor={backgroundColor}
      types={pokemonData.types}
      imageSrc={`${imageMode}/${pokemonData.imagePath}`}
      imageAlt={`${pokemonData.name} 포켓몬 이미지`}
      imageSize={{ width: 160, height: 160 }}
      isHighPriority={isHighPriority}
      ariaLabel={`포켓몬 ${pokemonData.name} 카드`}
      ballBadge={
        formBadge && (
          <span
            className={`absolute -top-1 -left-1 z-10 ${formBadge.className} text-[10px] font-bold rounded px-1 py-0.5 leading-none whitespace-nowrap`}
            aria-label={`${formBadge.label} 폼`}
          >
            {formBadge.label}
          </span>
        )
      }
      header={
        <div className="w-full flex items-start content-start flex-wrap justify-between border-b border-solid border-card-accent pb-1 gap-x-2 gap-y-0.5">
          <p className="flex-shrink-0 text-xs desktop:text-sm leading-tight font-medium text-black-2">
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
      <dl
        className="w-full flex flex-col gap-0.5 mt-1.5 desktop:mt-2 mx-auto px-2"
        aria-label="포켓몬 메타 정보"
      >
        <div className="flex items-center justify-between gap-2 pb-0.5 border-b border-solid border-black-2/25 text-2xs desktop:text-sm font-semibold text-black">
          <span className="flex items-center gap-1">
            <dt className="font-medium text-black-2">종족값</dt>
            <dd>{pokemonData.stats?.total ?? '-'}</dd>
          </span>
          <span className="flex items-center gap-1">
            <dt className="font-medium text-black-2">순위</dt>
            <dd>
              {pokemonData.usageRank != null
                ? `#${pokemonData.usageRank}`
                : '-'}
            </dd>
          </span>
        </div>

        {TOP_ROWS.map(({ label, getValue }) => (
          <div key={label} className="flex items-start gap-1.5 min-w-0">
            <dt className="flex-shrink-0 self-start text-[0.625rem] desktop:text-xs font-bold text-primary-1 bg-primary-3 rounded px-1 leading-4 desktop:leading-5">
              {label}
            </dt>
            <dd className="min-w-0 flex-1 text-2xs desktop:text-sm leading-4 desktop:leading-5 font-semibold text-black break-keep">
              {getValue(pokemonData)}
            </dd>
          </div>
        ))}
      </dl>
    </PokemonCardShell>
  )
}

export default ChampionsPokemonCard
