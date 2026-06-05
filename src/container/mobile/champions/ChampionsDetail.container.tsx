import Link from 'next/link'
import ChampionsDetailMetaSummaryBar from '~/components/champions/ChampionsDetailMetaSummaryBar.component'
import ChampionsFormTab from '~/components/champions/ChampionsFormTab.component'
import ChampionsMetaSectionMobile from '~/components/champions/ChampionsMetaSection.mobile.component'
import StatChartComponent from '~/components/chart/StatChart.component'
import TagComponent from '~/components/Tag.component'
import { ChampionsPokemonDetailFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import {
  getBackgroundColor,
  pokemonNumberFormat,
} from '~/module/pokemonCard.module'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'
import ImageComponent from '~/components/Image.component'

interface ChampionsDetailContainerProps {
  detail: ChampionsPokemonDetailFragment
  formatSlug: ChampionsFormatSlug
}

/**
 * 일반 도감 상세 페이지 URL 빌더 ("도감 보기" 외부 링크용).
 */
const getGeneralDetailUrl = (
  pokemonNumber: number,
  formType: string | null | undefined,
  formIndex: number | null | undefined,
) => {
  const baseUrl = `/detail/${pokemonNumber}`
  const index = formIndex ?? 0

  switch (formType) {
    case 'NORMAL':
      return index > 0 ? `${baseUrl}/form/${index}` : baseUrl
    case 'MEGA':
      return index > 0 ? `${baseUrl}/mega/${index}` : baseUrl
    case 'REGION':
      return index > 0 ? `${baseUrl}/region/${index}` : `${baseUrl}/region`
    default:
      return baseUrl
  }
}

const ChampionsDetailContainer = ({
  detail,
  formatSlug,
}: ChampionsDetailContainerProps) => {
  const { pokemon, meta, formSiblings } = detail
  const pokemonNumber = pokemonNumberFormat(pokemon.pokemonNumber)
  const backgroundColor = getBackgroundColor(pokemon.types)
  // 백엔드 응답 그대로 사용 (Phase 2/3 결정 — 합성 로직 제거)
  const displayName = pokemon.name
  const generalDetailUrl = getGeneralDetailUrl(
    pokemon.pokemonNumber,
    pokemon.formType,
    pokemon.formIndex,
  )

  const gradientStyle =
    backgroundColor.length === 1
      ? { backgroundColor: backgroundColor[0] }
      : {
          backgroundImage: `linear-gradient(135deg, ${backgroundColor[0]} 35%, ${backgroundColor[1]} 65%)`,
        }

  return (
    <>
      <ChampionsFormTab
        formSiblings={formSiblings}
        formatSlug={formatSlug}
      />

      <div className="rounded-xl p-4 mb-4" style={gradientStyle}>
        <nav className="mb-4">
          <ol className="flex items-center gap-2 text-xs text-black-2/70">
            <li>
              <Link
                href={`/champions/${formatSlug}`}
                className="hover:text-black-2 transition-colors"
              >
                챔피언스
              </Link>
            </li>
            <li className="text-black-2/50">/</li>
            <li>
              <Link
                href={`/champions/${formatSlug}/list`}
                className="hover:text-black-2 transition-colors"
              >
                도감
              </Link>
            </li>
            <li className="text-black-2/50">/</li>
            <li className="text-black-2 font-bold">{displayName}</li>
          </ol>
        </nav>

        <header className="flex justify-between items-center">
          <span className="text-base font-medium text-black-2">
            No.{pokemonNumber}
          </span>
          <h1 className="text-lg font-bold text-black-2">{displayName}</h1>
        </header>
        <div className="flex justify-center">
          {pokemon.imagePath && (
            <ImageComponent
              src={`${imageMode}/${pokemon.imagePath}`}
              alt={displayName}
              width="17rem"
              height="17rem"
              className="w-50 h-50 object-contain"
              imageSize={{ height: 204, width: 204 }}
            />
          )}
        </div>

        <div className="flex gap-2 justify-center">
          {pokemon.types.map((type) => (
            <TagComponent key={type} type={type} />
          ))}
        </div>

        <ChampionsDetailMetaSummaryBar meta={meta} />
      </div>

      <div className="mt-4 bg-primary-4 rounded-xl p-4 mb-6">
        <header className="mb-2">
          <h2 className="text-[1.25rem] font-bold text-primary-1">능력치</h2>
          <span className="text-base text-primary-2">
            총 합: {pokemon.stats?.total ?? '-'}
          </span>
        </header>
        <div className="w-full aspect-square max-w-[280px] mx-auto">
          {pokemon.stats && (
            <StatChartComponent stats={pokemon.stats} size="sm" />
          )}
        </div>
      </div>
      <ChampionsMetaSectionMobile meta={meta} formatSlug={formatSlug} />
      <Link
        href={generalDetailUrl}
        className="block w-full mt-6 mb-8 py-3 text-center text-sm text-primary-3 hover:text-primary-4 underline underline-offset-2"
      >
        ↗ 일반 도감에서 자세히 보기
      </Link>
    </>
  )
}

export default ChampionsDetailContainer
