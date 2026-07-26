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

  // 긴 이름("대검귀 (히스이의 모습)" 등)은 좁은 슬롯 카드에서 여러 줄로 늘어나므로
  // 폰트를 하한(text-2xs, 11px)까지 줄인다(ChampionsTierPokemonItem 선례와 동일 접근).
  // 7자 초과 기준: 기본 text-sm(14px)에서 슬롯 폭(모바일 2열)에 7자면 한 줄에 들어간다.
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
        <p
          className={`mt-1 w-full ${nameSizeClass} font-bold text-primary-1 text-center break-words leading-tight`}
        >
          {displayName}
        </p>
      </div>

      {/* 도구 / 특성 / 테라.
          말줄임(line-clamp) 없이 전체 표시 — 잘리면 어떤 도구/특성인지 알 수 없어
          대회 빌드 페이지의 핵심 정보가 손실된다(사용자 요구). 값이 길면 줄바꿈으로
          전부 보여준다. min-w-0: flex 자식이 콘텐츠 최소폭 이하로 줄어들 수 있게 해
          긴 한글 값이 카드 밖으로 넘치지 않고 줄바꿈되게 한다. items-start: 값이 여러
          줄일 때 라벨을 상단 정렬. */}
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
        {/* 테라 영역 — 데이터 없는 슬롯이 다수라 빈 공간을 예약하지 않고 아예 렌더하지
            않는다(그리드가 items-start라 카드 높이 균일화가 불필요). */}
        {slot.teraType && (
          <div className="flex items-center gap-2">
            <dt className="shrink-0 w-8 text-2xs font-semibold text-primary-2">
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
          </div>
        )}
      </dl>
      {/* 기술 4개 — 긴 기술명(예: "분함의발구르기")도 넘치지 않게 break-words 로
          줄바꿈하고, 도구/특성과 동일한 11px 위계로 통일. */}
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
