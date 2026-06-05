import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { ChampionsTeamCoreFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
} from '~/utils/championsFormat.util'

interface ChampionsTeamCoreCardProps {
  core: ChampionsTeamCoreFragment
  /**
   * 현재 포맷 슬러그. Phase 4에서 폼별 라우트(/champions/[format]/list/[pokemonId])
   * 가 확정되면 멤버 포켓몬 링크 생성에 사용된다. Phase 1 시점엔 미사용.
   */
  formatSlug: ChampionsFormatSlug
}

/**
 * 조합 크기(2/3/4)에 따라 이미지 크기를 자동 조정.
 * 카드 너비 제약 안에서 모든 포켓몬이 적정 크기로 노출되도록 함.
 */
const IMAGE_SIZE_BY_COUNT: Record<
  number,
  {
    className: string
    rem: string
    px: number
  }
> = {
  2: { className: 'w-16 h-16', rem: '4rem', px: 64 },
  3: { className: 'w-14 h-14', rem: '3.5rem', px: 56 },
  4: { className: 'w-12 h-12', rem: '3rem', px: 48 },
}

const ChampionsTeamCoreCard = ({
  core,
  formatSlug,
}: ChampionsTeamCoreCardProps) => {
  const usageRate = core.usageRate
  const teamsCountLabel = core.teamsCount.toLocaleString()

  // 멤버 이름 폴백: displayName ?? rawName
  const members = core.pokemons.map((m) => ({
    pokemonId: m.pokemonId,
    formType: m.formType,
    formCode: m.formCode,
    name: m.displayName || m.rawName,
    imagePath: m.imagePath,
  }))

  const imageDim = IMAGE_SIZE_BY_COUNT[members.length] ?? IMAGE_SIZE_BY_COUNT[2]

  const buildPokemonHref = (
    pokemonId: number | null | undefined,
    formType: string | null | undefined,
    formCode: string | null | undefined,
  ) => {
    if (pokemonId == null) return null
    return buildChampionsDetailHref({
      formatSlug,
      pokemonId,
      formType,
      formCode,
    })
  }

  const renderImage = (member: (typeof members)[number], keySuffix: string) => (
    <div
      key={`${member.pokemonId ?? member.name}-img-${keySuffix}`}
      className={imageDim.className}
    >
      {member.imagePath ? (
        <ImageComponent
          width={imageDim.rem}
          height={imageDim.rem}
          imageSize={{ width: imageDim.px, height: imageDim.px }}
          densities={[1, 1.5]}
          alt={member.name}
          src={`${imageMode}/${member.imagePath}`}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-primary-3 border-2 border-primary-1" />
      )}
    </div>
  )

  const renderMemberName = (
    member: (typeof members)[number],
    index: number,
  ) => {
    const href = buildPokemonHref(
      member.pokemonId,
      member.formType,
      member.formCode,
    )
    return (
      <span
        key={`${member.pokemonId ?? member.name}-name-${index}`}
        className="flex items-center gap-1"
      >
        {href ? (
          <Link
            href={href}
            className="hover:text-primary-2 underline-offset-2 hover:underline"
          >
            {member.name}
          </Link>
        ) : (
          <span>{member.name}</span>
        )}
        {index < members.length - 1 && (
          <span className="text-primary-3" aria-hidden="true">
            +
          </span>
        )}
      </span>
    )
  }

  return (
    <article
      className="w-full bg-primary-4 border-[2px] border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4 relative desktop:h-32 desktop:flex desktop:items-center desktop:gap-4"
      aria-label={`팀 코어 ${core.rank}위: ${members.map((m) => m.name).join(' + ')}`}
    >
      {/* === 모바일 레이아웃: 세로 스택 === */}
      <div className="desktop:hidden">
        {/* 순위 뱃지 — 카드 좌상단 absolute (콘텐츠 흐름에서 분리) */}
        <p className="absolute left-4 top-4 w-12 h-24 flex items-center justify-center bg-primary-1 text-white rounded-md text-base font-bold">
          #{core.rank}
        </p>

        {/* 상단: 이미지 (뱃지 폭만큼 들여쓰기로 좌측 정렬 통일) */}
        <div
          className="flex items-center gap-2 mb-3 pl-[3.75rem]"
          aria-hidden="true"
        >
          {members.map((member) => renderImage(member, 'mobile'))}
        </div>

        {/* 조합명 — 동일한 들여쓰기로 이미지와 정렬 */}
        <h3 className="flex items-center gap-1 flex-wrap text-base font-bold text-primary-1 mb-3 pl-[3.75rem]">
          {members.map((member, index) => renderMemberName(member, index))}
        </h3>

        {/* 하단: 통계 (가로 분할) */}
        <dl className="grid grid-cols-2 border-t-2 border-primary-3 pt-3">
          <div className="flex flex-col items-center text-center relative after:absolute after:right-0 after:top-0 after:h-full after:w-[2px] after:bg-primary-3">
            <dt className="text-xs text-gray-600 mb-1">사용률</dt>
            <dd className="text-lg font-bold text-primary-1">{usageRate}%</dd>
          </div>
          <div className="flex flex-col items-center text-center">
            <dt className="text-xs text-gray-600 mb-1">채용팀</dt>
            <dd className="text-lg font-bold text-primary-1">
              {teamsCountLabel}
            </dd>
          </div>
        </dl>
      </div>

      {/* === 데스크탑 레이아웃: 가로 한 줄 === */}
      <p className="hidden desktop:flex w-16 h-24 shrink-0 items-center justify-center bg-primary-1 text-white rounded-md text-base font-bold">
        #{core.rank}
      </p>

      <div
        className="hidden desktop:flex items-center gap-2 shrink-0"
        aria-hidden="true"
      >
        {members.map((member) => renderImage(member, 'desktop'))}
      </div>

      <h3 className="hidden desktop:flex flex-1 items-center gap-1 flex-wrap text-base font-bold text-primary-1">
        {members.map((member, index) => renderMemberName(member, index))}
      </h3>

      <dl className="hidden desktop:grid w-48 h-24 shrink-0 grid-cols-2">
        <div className="w-full h-full flex flex-col justify-center text-center relative after:absolute after:-right-0 after:bg-primary-3 after:top-0 after:h-full after:w-[2px]">
          <dt className="text-sm text-gray-600 mb-1">사용률</dt>
          <dd className="text-[1.375rem] font-bold text-primary-1">
            {usageRate}%
          </dd>
        </div>
        <div className="w-full h-full flex flex-col justify-center text-center">
          <dt className="text-sm text-gray-600 mb-1">채용팀</dt>
          <dd className="text-[1.375rem] font-bold text-primary-1">
            {teamsCountLabel}
          </dd>
        </div>
      </dl>
    </article>
  )
}

export default ChampionsTeamCoreCard
