import Link from 'next/link'
import ChampionsTierBadge from '~/components/champions/ChampionsTierBadge.component'
import TagComponent from '~/components/tag/Tag.component'
import { PokemonType } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { getTypeLabel } from '~/module/typeParams.module'
import { buildChampionsDetailHref } from '~/utils/championsFormat.util'
import { ChampionsTypeEntry } from '~/app/type-effectiveness/[type]/_fetch/typeDetail.fetch'

/**
 * 대전에서 쓰이는 해당 타입 포켓몬 — 포맷별 최상위 티어 1종.
 *
 * ## 여기서는 순위를 드러낸다
 *
 * 포켓몬 6종 블록과 반대다. 그쪽은 선정 기준이 편집 판단이라 "대표"를 쓰지
 * 않았지만, 티어는 **챔피언스 메타 데이터에 근거가 있는 유일한 순위**라 오히려
 * 티어와 채택 순위를 명시하는 편이 정직하다.
 *
 * ## 사용률(%)을 쓰지 않는 이유
 *
 * `usageRate`가 데이터 원천 변경으로 항상 null이다. 순위(`usageRank`)만 유효해
 * "채택 순위"로만 표기하고, 그 사실을 부제에 밝힌다.
 *
 * ## 없으면 렌더하지 않는다
 *
 * S·A·B 티어에 해당 타입이 없는 포맷은 줄 자체가 빠지고, 두 포맷 모두 없으면
 * 섹션이 통째로 사라진다. "없음"이라고 적지 않는다 — 실제로 흔한 경우이고
 * (독 타입은 BSS에 해당 티어가 없다), 빈 줄을 두면 정보가 아니라 잡음이 된다.
 * 이 조건부 렌더가 18개 페이지의 구성을 실제로 다르게 만드는 장치이기도 하다
 * (§26.9.4 방어 장치 4).
 */

interface TypeDetailChampionsContainerProps {
  pokemonType: PokemonType
  entries: Array<ChampionsTypeEntry>
}

const TypeDetailChampionsContainer = ({
  pokemonType,
  entries,
}: TypeDetailChampionsContainerProps) => {
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
                  className="h-16 w-16 shrink-0 object-contain desktop:h-18 desktop:w-18"
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
                      <TagComponent key={type} type={type} />
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

export default TypeDetailChampionsContainer
