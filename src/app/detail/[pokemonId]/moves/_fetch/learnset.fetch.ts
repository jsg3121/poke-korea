import {
  GetDetailMovesPokemonInfoDocument,
  GetLearnMethodsDocument,
  GetPokemonLearnsetDocument,
  GetPokemonNormalFormDocument,
  GetPokemonNormalFormImageListDocument,
  GetPokemonRegionFormDocument,
  GetVersionGroupsByPokemonDocument,
} from '~/graphql/gqlGenerated'
import {
  PokemonFormType,
  type GetDetailMovesPokemonInfoQuery,
  type GetDetailMovesPokemonInfoQueryVariables,
  type GetLearnMethodsQuery,
  type GetLearnMethodsQueryVariables,
  type GetPokemonLearnsetQuery,
  type GetPokemonLearnsetQueryVariables,
  type GetPokemonNormalFormImageListQuery,
  type GetPokemonNormalFormImageListQueryVariables,
  type GetPokemonNormalFormQuery,
  type GetPokemonNormalFormQueryVariables,
  type GetPokemonRegionFormQuery,
  type GetPokemonRegionFormQueryVariables,
  type GetVersionGroupsByPokemonQuery,
  type GetVersionGroupsByPokemonQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/modules/apolloClient.module'

interface FetchLearnsetParams {
  pokemonId: string
  formType?: PokemonFormType
  formIndex?: number
  versionGroupId?: number
}

export async function fetchLearnsetQueries({
  pokemonId,
  formType,
  formIndex,
  versionGroupId,
}: FetchLearnsetParams) {
  const apolloClient = initializeApollo()
  const numericPokemonId = parseInt(pokemonId, 10)

  const [
    { data: pokemonInfoData },
    learnsetResult,
    versionGroupResult,
    { data: formImageList },
    formDetail,
    { data: learnMethodData },
  ] = await Promise.all([
    apolloClient.query<
      GetDetailMovesPokemonInfoQuery,
      GetDetailMovesPokemonInfoQueryVariables
    >({
      query: GetDetailMovesPokemonInfoDocument,
      variables: { pokemonId },
      fetchPolicy: 'cache-first',
    }),
    // 존재하지 않는 폼이면 서버가 에러를 던진다. notFound()로 처리하도록 null로 바꾼다.
    apolloClient
      .query<GetPokemonLearnsetQuery, GetPokemonLearnsetQueryVariables>({
        query: GetPokemonLearnsetDocument,
        variables: {
          pokemonId: numericPokemonId,
          ...(formType && { formType }),
          ...(formIndex !== undefined && { formIndex }),
          ...(versionGroupId && { versionGroupId }),
        },
        fetchPolicy: 'cache-first',
      })
      .catch(() => null),
    // 여기서 막지 않으면 Promise.all이 통째로 실패해 500이 난다.
    apolloClient
      .query<
        GetVersionGroupsByPokemonQuery,
        GetVersionGroupsByPokemonQueryVariables
      >({
        query: GetVersionGroupsByPokemonDocument,
        variables: {
          pokemonId: numericPokemonId,
          ...(formType && { formType }),
          ...(formIndex !== undefined && { formIndex }),
        },
        fetchPolicy: 'cache-first',
      })
      .catch(() => null),
    apolloClient.query<
      GetPokemonNormalFormImageListQuery,
      GetPokemonNormalFormImageListQueryVariables
    >({
      query: GetPokemonNormalFormImageListDocument,
      variables: { pokemonId: numericPokemonId },
      fetchPolicy: 'cache-first',
    }),
    formType === PokemonFormType.REGION_FORM
      ? apolloClient.query<
          GetPokemonRegionFormQuery,
          GetPokemonRegionFormQueryVariables
        >({
          query: GetPokemonRegionFormDocument,
          variables: { pokemonId: numericPokemonId },
          fetchPolicy: 'cache-first',
        })
      : formIndex !== undefined && formIndex > 0
        ? apolloClient.query<
            GetPokemonNormalFormQuery,
            GetPokemonNormalFormQueryVariables
          >({
            query: GetPokemonNormalFormDocument,
            variables: {
              pokemonId: numericPokemonId,
              activeIndex: formIndex,
            },
            fetchPolicy: 'cache-first',
          })
        : Promise.resolve(null),
    // 서버에서 미리 받는다 — 클라이언트 훅으로만 받으면 SSR HTML에 enum 원문이
    // 들어가 쿼리가 도착할 때까지 영문이 보인다.
    apolloClient.query<GetLearnMethodsQuery, GetLearnMethodsQueryVariables>({
      query: GetLearnMethodsDocument,
      fetchPolicy: 'cache-first',
    }),
  ])

  const formData = formDetail?.data
  const regionForms =
    formData && 'getPokemonRegionForm' in formData
      ? formData.getPokemonRegionForm
      : null
  const normalForms =
    formData && 'getPokemonNormalForm' in formData
      ? formData.getPokemonNormalForm
      : null

  return {
    pokemonInfoData,
    learnset: learnsetResult?.data.getPokemonLearnset ?? null,
    versionGroups: versionGroupResult?.data.getVersionGroupsByPokemon ?? null,
    formImageList,
    formInfo: normalForms?.[0] ?? null,
    regionForms,
    learnMethodLabels: learnMethodData.getLearnMethods,
  }
}
