import { GetLearnsetCountsDocument } from '~/graphql/gqlGenerated'
import {
  LearnMethod,
  PokemonFormType,
  type GetLearnsetCountsQuery,
  type GetLearnsetCountsQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/modules/apolloClient.module'

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
