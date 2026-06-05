import Link from 'next/link'
import ChampionsDetailMetaSummaryBar from '~/components/champions/ChampionsDetailMetaSummaryBar.component'
import ChampionsFormTab from '~/components/champions/ChampionsFormTab.component'
import ChampionsMetaSection from '~/components/champions/ChampionsMetaSection.component'
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
 * 챔피언스 컨텍스트가 아닌 일반 도감 영역으로 진입한다.
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

      <div className="rounded-xl p-6 mb-6" style={gradientStyle}>
        <nav className="mb-3 flex items-center justify-between">
          <ol className="flex items-center gap-2 text-sm text-black-2/70">
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
                포켓몬 도감
              </Link>
            </li>
            <li className="text-black-2/50">/</li>
            <li className="text-black-2 font-bold">{displayName}</li>
          </ol>
          <Link
            href={generalDetailUrl}
            className="text-sm text-black-2/80 hover:text-black-2 underline underline-offset-2"
          >
            ↗ 도감 보기
          </Link>
        </nav>

        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-black-2">
            No.{pokemonNumber}
          </span>
          <h1 className="text-xl font-bold text-black-2">{displayName}</h1>
        </div>

        <div className="flex justify-center">
          {pokemon.imagePath && (
            <ImageComponent
              src={`${imageMode}/${pokemon.imagePath}`}
              alt={displayName}
              width="18rem"
              height="18rem"
              className="w-72 h-72 object-contain"
              imageSize={{ height: 288, width: 288 }}
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

      <div className="flex gap-8">
        <aside className="w-[420px] flex-shrink-0">
          <div className="bg-primary-4 rounded-xl p-4">
            <header className="mb-2">
              <h2 className="text-sm font-bold text-primary-1">능력치</h2>
              <span className="text-xs text-primary-2">
                총 합: {pokemon.stats?.total ?? '-'}
              </span>
            </header>
            <div className="w-full aspect-square">
              {pokemon.stats && (
                <StatChartComponent stats={pokemon.stats} size="sm" />
              )}
            </div>
          </div>
        </aside>

        <section className="flex-1">
          <ChampionsMetaSection meta={meta} formatSlug={formatSlug} />
        </section>
      </div>
    </>
  )
}

export default ChampionsDetailContainer
