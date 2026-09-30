import Link from 'next/link'

import { ChampionsTeamSlotFragment, PokemonType } from '~/graphql/typeGenerated'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
} from '~/utils/championsFormat.util'
import { imageMode } from '~/modules/buildMode.module'
import Image from '~/components/Image.component'
import Tag from '~/components/tag/Tag.component'

interface ChampionsTournamentSlotCardProps {
  slot: ChampionsTeamSlotFragment
  formatSlug: ChampionsFormatSlug
}

const getFormBadge = (
  formType: string,
): { label: string; className: string } | null => {
  if (formType === 'MEGA') {
    return { label: '메가', className: 'bg-amber-500 text-white' }
  }
  if (formType === 'REGION') {
    return { label: '리전', className: 'bg-teal-500 text-white' }
  }
  return null
}

const resolveTeraType = (teraType: string | null): PokemonType | null => {
  if (!teraType) return null
  const upper = teraType.toUpperCase() as PokemonType
  if (Object.values(PokemonType).includes(upper)) {
    return upper
  }
  return null
}

const ChampionsTournamentSlotCard = ({
  slot,
  formatSlug,
}: ChampionsTournamentSlotCardProps) => {
  const displayName = slot.displayName || slot.rawName
  const itemLabel = slot.itemKo || slot.item
  const abilityLabel = slot.abilityKo || slot.ability
  const formBadge = getFormBadge(slot.formType)
  const teraEnum = resolveTeraType(slot.teraType ?? null)

  const nameSizeClass = displayName.length > 7 ? 'text-2xs' : 'text-sm'

  const href =
    slot.pokemonId != null
      ? buildChampionsDetailHref({
          formatSlug,
          pokemonId: slot.pokemonId,
          formType: slot.formType,
          formCode: slot.formCode,
        })
      : null

  const inner = (
    <article
      className="relative w-full h-full bg-primary-4 border-[2px] border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-3"
      aria-label={`${displayName} 풀빌드`}
    >
      {formBadge && (
        <span
          className={`absolute right-2 top-2 z-10 ${formBadge.className} text-2xs font-bold rounded px-1.5 py-0.5`}
          aria-label={`${formBadge.label} 폼`}
        >
          {formBadge.label}
        </span>
      )}

      <div className="flex flex-col items-center mb-2">
        <div className="w-16 h-16" aria-hidden="true">
          {slot.imagePath ? (
            <Image
              src={`${imageMode}/${slot.imagePath}`}
              alt={`${displayName} 포켓몬 이미지`}
              width="4rem"
              height="4rem"
              imageSize={{ width: 64, height: 64 }}
              densities={[1, 1.5]}
              loading="lazy"
              className="w-16 h-16 object-contain"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-primary-3" />
          )}
        </div>
        <p
          className={`mt-1 w-full ${nameSizeClass} font-bold text-primary-1 text-center break-words leading-tight`}
        >
          {displayName}
        </p>
      </div>

      <dl className="text-xs space-y-1 mb-2 border-t-2 border-primary-3 pt-2">
        <div className="flex items-start gap-2">
          <dt className="shrink-0 w-8 pt-0.5 text-2xs font-semibold text-primary-2">
            도구
          </dt>
          <dd className="min-w-0 flex-1 text-primary-1 font-bold break-words text-2xs leading-snug">
            {itemLabel || '-'}
          </dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="shrink-0 w-8 pt-0.5 text-2xs font-semibold text-primary-2">
            특성
          </dt>
          <dd className="min-w-0 flex-1 text-primary-1 font-bold break-words text-2xs leading-snug">
            {abilityLabel || '-'}
          </dd>
        </div>
        {slot.teraType && (
          <div className="flex items-center gap-2">
            <dt className="shrink-0 w-8 text-2xs font-semibold text-primary-2">
              테라
            </dt>
            <dd className="flex items-center">
              {teraEnum ? (
                <Tag type={teraEnum} />
              ) : (
                <span className="text-primary-1 font-semibold">
                  {slot.teraType}
                </span>
              )}
            </dd>
          </div>
        )}
      </dl>
      <ul
        className="space-y-0.5 border-t-2 border-primary-3 pt-2"
        aria-label="기술 목록"
      >
        {slot.moves.map((move, index) => (
          <li
            key={`${move.rawName}-${index}`}
            className="text-2xs leading-snug font-semibold text-primary-1 break-words"
          >
            {move.displayName || move.rawName}
          </li>
        ))}
      </ul>
    </article>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="block w-full h-full hover:scale-105 transition-transform"
      >
        {inner}
      </Link>
    )
  }
  return inner
}

export default ChampionsTournamentSlotCard
