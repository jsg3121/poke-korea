import Link from 'next/link'

import { CHAMPIONS_SLOTS } from '~/constants/adSense'
import { ChampionsPokemonDetailFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'
import { imageMode } from '~/modules/buildMode.module'
import {
  getBackgroundColor,
  pokemonNumberFormat,
} from '~/modules/pokemonCard.module'
import ChampionsDetailStatsBanner from '~/components/adSlot/ChampionsDetailStatsBanner.component'
import ChampionsInContentBanner from '~/components/adSlot/ChampionsInContentBanner.component'
import ChampionsDetailFormatSwitch from '~/components/champions/ChampionsDetailFormatSwitch.component'
import ChampionsDetailMetaSummaryBar from '~/components/champions/ChampionsDetailMetaSummaryBar.component'
import ChampionsFormTab from '~/components/champions/ChampionsFormTab.component'
import ChampionsMetaList from '~/components/champions/ChampionsMetaList.component'
import ChampionsPartnerList from '~/components/champions/ChampionsPartnerList.component'
import Image from '~/components/Image.component'
import StatBar, { StatBarItem } from '~/components/statBar/StatBar.component'
import Tag from '~/components/tag/Tag.component'

interface ChampionsDetailContentProps {
  detail: ChampionsPokemonDetailFragment
  formatSlug: ChampionsFormatSlug
}

const getGeneralDetailUrl = (
  pokemonNumber: number,
  formType: string | null | undefined,
  formIndex: number | null | undefined,
) => {
  const baseUrl = `/detail/${pokemonNumber}`
  const index = formIndex ?? 0

  switch (formType) {
    case 'NORMAL':
      return index > 0 ? `${baseUrl}/form/${index}` : `${baseUrl}/form`
    case 'MEGA':
      return index > 0 ? `${baseUrl}/mega/${index}` : `${baseUrl}/mega`
    case 'REGION':
      return index > 0 ? `${baseUrl}/region/${index}` : `${baseUrl}/region`
    default:
      return baseUrl
  }
}

const ChampionsDetailContent = ({
  detail,
  formatSlug,
}: ChampionsDetailContentProps) => {
  const { pokemon, meta, formSiblings } = detail
  const pokemonNumber = pokemonNumberFormat(pokemon.pokemonNumber)
  const backgroundColor = getBackgroundColor(pokemon.types)
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

  const statItems: StatBarItem[] = pokemon.stats
    ? [
        { label: '체력', value: pokemon.stats.hp },
        { label: '공격', value: pokemon.stats.attack },
        { label: '특수공격', value: pokemon.stats.specialAttack },
        { label: '방어', value: pokemon.stats.defense },
        { label: '특수방어', value: pokemon.stats.specialDefense },
        { label: '스피드', value: pokemon.stats.speed },
      ]
    : []

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 py-6 desktop:px-5 desktop:py-8">
      <ChampionsDetailFormatSwitch
        currentFormat={formatSlug}
        pokemonId={pokemon.externalDexId}
        formType={pokemon.formType}
        formCode={pokemon.formCode}
        className="mb-4"
      />

      <ChampionsFormTab formSiblings={formSiblings} formatSlug={formatSlug} />

      <div
        className="rounded-xl p-4 desktop:p-6 mb-6 desktop:mb-8"
        style={gradientStyle}
      >
        <nav className="mb-2 desktop:mb-3 flex items-start justify-between gap-2">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs desktop:text-sm text-black-2/70">
            <li>
              <Link
                href={`/champions/${formatSlug}`}
                className="hover:text-black-2 transition-colors break-keep"
              >
                챔피언스
              </Link>
            </li>
            <li className="text-black-2/50">/</li>
            <li>
              <Link
                href={`/champions/${formatSlug}/list`}
                className="hover:text-black-2 transition-colors break-keep"
              >
                포켓몬 도감
              </Link>
            </li>
            <li className="text-black-2/50">/</li>
            <li className="text-black-2 font-bold break-keep">{displayName}</li>
          </ol>
          <Link
            href={generalDetailUrl}
            className="shrink-0 text-xs desktop:text-sm text-black-2/80 hover:text-black-2 underline underline-offset-2 break-keep"
          >
            ↗ 도감 보기
          </Link>
        </nav>

        <div className="flex justify-between items-center">
          <span className="text-base desktop:text-lg font-medium text-black-2">
            No.{pokemonNumber}
          </span>
          <h1 className="text-lg desktop:text-xl font-bold text-black-2 break-keep">
            {displayName}
          </h1>
        </div>

        <div className="my-2 desktop:my-3 flex justify-center mx-auto w-48 h-48 desktop:w-72 desktop:h-72">
          {pokemon.imagePath && (
            <Image
              src={`${imageMode}/${pokemon.imagePath}`}
              alt={displayName}
              height="100%"
              width="100%"
              sizes="(min-width: 769px) 10rem, 7rem"
              imageSize={{ height: 288, width: 288 }}
              fetchPriority="high"
            />
          )}
        </div>

        <div className="flex gap-2 justify-center">
          {pokemon.types.map((type) => (
            <Tag key={type} type={type} />
          ))}
        </div>

        <ChampionsDetailMetaSummaryBar meta={meta} />
      </div>

      {meta && (
        <div className="mb-6">
          <ChampionsInContentBanner
            mobileSlot={CHAMPIONS_SLOTS.detailMobile}
            desktopSlot=""
          />
        </div>
      )}

      <div className="flex flex-col desktop:flex-row gap-7 desktop:gap-8">
        <aside className="w-full desktop:w-96 desktop:shrink-0">
          <div className="bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4">
            <h2 className="mb-3 text-lg desktop:text-xl font-extrabold text-primary-1">
              능력치
            </h2>
            {statItems.length > 0 && <StatBar stats={statItems} />}
          </div>

          {meta && <ChampionsDetailStatsBanner />}
        </aside>

        <div className="flex-1 min-w-0">
          {meta ? (
            <div className="space-y-4 desktop:space-y-6">
              {meta.isStale && (
                <div className="p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                  데이터가 최신이 아닐 수 있습니다. (업데이트:{' '}
                  {new Date(meta.updatedAt).toLocaleDateString('ko-KR')})
                </div>
              )}

              <div className="bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4 space-y-3">
                <ChampionsMetaList title="인기 기술" items={meta.topMoves} />
                <ChampionsMetaList title="인기 도구" items={meta.topItems} />
                <ChampionsMetaList
                  title="인기 특성"
                  items={meta.topAbilities}
                />
                <ChampionsPartnerList
                  title="추천 파트너"
                  items={meta.topPartners}
                  formatSlug={formatSlug}
                />
              </div>

              <p className="text-xs text-primary-3 text-right">
                출처: <b className="font-bold">{meta.source}</b> <br />
                업데이트:{' '}
                <b className="font-bold">
                  {new Date(meta.updatedAt).toLocaleDateString('ko-KR')}
                </b>
              </p>
            </div>
          ) : (
            <div className="bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-6 text-center">
              <p className="text-primary-2 mb-4">
                아직 메타 데이터가 없습니다.
                <br />
                시즌이 시작되면 업데이트됩니다.
              </p>
              <Link
                href={`/champions/${formatSlug}/list`}
                className="inline-block px-4 py-2 bg-primary-1 text-primary-4 rounded-lg hover:bg-primary-2 transition-colors text-sm"
              >
                목록으로 돌아가기
              </Link>
            </div>
          )}
        </div>
      </div>

      <Link
        href={generalDetailUrl}
        className="block w-full mt-6 desktop:mt-8 py-3 text-center text-sm text-primary-3 hover:text-primary-1 underline underline-offset-2 transition-colors"
      >
        ↗ 일반 도감에서 자세히 보기
      </Link>
    </section>
  )
}

export default ChampionsDetailContent
