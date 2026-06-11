import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import { ChampionsTeamSlotFragment, PokemonType } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
} from '~/utils/championsFormat.util'

interface ChampionsTournamentSlotCardProps {
  slot: ChampionsTeamSlotFragment
  formatSlug: ChampionsFormatSlug
}

/**
 * 폼 종류 식별 (Phase 3 의 ChampionsTierPokemonItem 과 동일 패턴).
 * 일반 폼('폼' 회색 뱃지)은 식별 가치가 낮아 미노출.
 */
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

/**
 * teraType 문자열 (예: "fairy") → PokemonType enum.
 * TagComponent 가 enum 만 받으므로 변환.
 * 매칭 실패 시 null 반환 → 텍스트 폴백.
 */
const resolveTeraType = (teraType: string | null): PokemonType | null => {
  if (!teraType) return null
  const upper = teraType.toUpperCase() as PokemonType
  // PokemonType enum 에 포함된 값만 허용
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
          className={`absolute right-2 top-2 z-10 ${formBadge.className} text-[10px] font-bold rounded px-1.5 py-0.5`}
          aria-label={`${formBadge.label} 폼`}
        >
          {formBadge.label}
        </span>
      )}

      {/* 이미지 + 이름 */}
      <div className="flex flex-col items-center mb-2">
        <div className="w-16 h-16" aria-hidden="true">
          {slot.imagePath ? (
            <ImageComponent
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
        <p className="mt-1 text-sm font-bold text-primary-1 text-center line-clamp-1">
          {displayName}
        </p>
      </div>

      {/* 도구 / 특성 / 테라 */}
      <dl className="text-xs space-y-1 mb-2 border-t-2 border-primary-3 pt-2">
        <div className="flex items-center gap-2">
          <dt className="shrink-0 w-10 text-[10px] font-bold text-primary-1">
            도구
          </dt>
          <dd className="text-primary-1 font-semibold line-clamp-2 break-keep text-[0.875rem] desktop:text-[0.75rem]">
            {itemLabel || '-'}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="shrink-0 w-10 text-[10px] font-bold text-primary-1">
            특성
          </dt>
          <dd className="text-primary-1 font-semibold line-clamp-2 break-keep text-[0.875rem] desktop:text-[0.75rem]">
            {abilityLabel || '-'}
          </dd>
        </div>
        {/* 테라 영역 — 데이터 없으면 라벨/값 모두 숨기고 빈 공간만 유지 (카드 높이 균일) */}
        <div
          className="flex items-center gap-2 min-h-[1.5rem]"
          aria-hidden={!slot.teraType}
        >
          {slot.teraType && (
            <>
              <dt className="shrink-0 w-10 text-[10px] font-bold text-primary-1">
                테라
              </dt>
              <dd className="flex items-center">
                {teraEnum ? (
                  <TagComponent type={teraEnum} />
                ) : (
                  <span className="text-primary-1 font-semibold">
                    {slot.teraType}
                  </span>
                )}
              </dd>
            </>
          )}
        </div>
      </dl>
      {/* 기술 4개 */}
      <ul
        className="text-xs space-y-0.5 border-t-2 border-primary-3 pt-2"
        aria-label="기술 목록"
      >
        {slot.moves.map((move, index) => (
          <li
            key={`${move.rawName}-${index}`}
            className="text-primary-1 line-clamp-1"
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
