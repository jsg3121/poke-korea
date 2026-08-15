import { GetLearnsetCountsDocument } from '~/graphql/gqlGenerated'
import {
  LearnMethod,
  PokemonFormType,
  type GetLearnsetCountsQuery,
  type GetLearnsetCountsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

/** 백엔드 methodLabel을 못 받는 경우(기술 0건)의 최소 폴백 */
const FALLBACK_LABEL: Record<string, string> = {
  [LearnMethod.LEVEL_UP]: '레벨업',
  [LearnMethod.MACHINE]: '기술머신',
  [LearnMethod.EGG]: '알 기술',
  [LearnMethod.TUTOR]: '기술 가르침',
}

interface FetchLearnMethodCountsParams {
  pokemonId: string
  learnMethod: LearnMethod
  versionGroupId?: number
  formType?: PokemonFormType
  formIndex?: number
}

/**
 * 메타데이터용 습득법 정보 조회 — 라벨과 기술 수만 받는다.
 *
 * `skills` 배열을 요청하지 않아 기술 수백 건을 받지 않고도 다음 두 가지를 얻는다.
 * - `methodLabel`: description·title에 쓸 한글 라벨
 * - `skillCount`: 0이면 빈 페이지라 noindex 대상
 *
 * 조회 실패(존재하지 않는 폼 등)는 0건으로 처리한다 — 메타데이터 생성이 페이지
 * 렌더를 막아서는 안 되고, 어차피 페이지 쪽에서 notFound()로 걸러진다.
 */
export async function fetchLearnMethodCounts({
  pokemonId,
  learnMethod,
  versionGroupId,
  formType,
  formIndex,
}: FetchLearnMethodCountsParams): Promise<{
  methodLabel: string
  skillCount: number
}> {
  const apolloClient = initializeApollo()

  const result = await apolloClient
    .query<GetLearnsetCountsQuery, GetLearnsetCountsQueryVariables>({
      query: GetLearnsetCountsDocument,
      variables: {
        pokemonId: parseInt(pokemonId, 10),
        ...(formType && { formType }),
        ...(formIndex !== undefined && { formIndex }),
        ...(versionGroupId && { versionGroupId }),
      },
      fetchPolicy: 'cache-first',
    })
    .catch(() => null)

  const group = result?.data.getPokemonLearnset?.skillsByMethod.find(
    (item) => item.method === learnMethod,
  )

  return {
    methodLabel: group?.methodLabel ?? FALLBACK_LABEL[learnMethod] ?? '',
    skillCount: group?.totalCount ?? 0,
  }
}
