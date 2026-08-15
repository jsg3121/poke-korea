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
  type GetPokemonNormalFormQuery,
  type GetPokemonNormalFormQueryVariables,
  type GetPokemonNormalFormImageListQuery,
  type GetPokemonNormalFormImageListQueryVariables,
  type GetPokemonRegionFormQuery,
  type GetPokemonRegionFormQueryVariables,
  type GetVersionGroupsByPokemonQuery,
  type GetVersionGroupsByPokemonQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

interface FetchLearnsetParams {
  pokemonId: string
  /** 생략 시 BASE. 폼 종류를 몰라도 되므로 선행 조회가 불필요하다 */
  formType?: PokemonFormType
  formIndex?: number
  versionGroupId?: number
}

/**
 * 습득 기술 페이지 공통 데이터 조회 — moves 하위 전 라우트가 공유한다.
 *
 * 기존엔 폼 종류별로 fetch가 3벌(default/form/region)이었고, 각각 다음 구조였다.
 *
 *   1왕복: getPokemonDetail으로 isFormChange 판별
 *   2왕복: 그 결과에 따라 러닝셋 쿼리 3종 중 하나 + 버전 목록 + 폼 이미지
 *
 * 즉 "어떤 쿼리를 쏠지" 정하려고 왕복을 통째로 하나 썼다. 통합 쿼리
 * (getPokemonLearnset)는 formType을 생략하면 서버가 BASE로 처리하고 버전 그룹도
 * 함께 내려주므로, 판별용 선행 조회와 별도 버전 쿼리가 모두 사라진다.
 *
 * 남은 세 쿼리는 러닝셋과 무관한 데이터라 병렬로 함께 받는다.
 * - 포켓몬 기본 정보: 이름·타입·isRegionForm 등 히어로 표시용
 * - 버전 목록: 러닝셋은 선택된 버전 하나만 주므로, 버전 선택 nav가 쓸 전체 목록은
 *   별도로 받아야 한다
 * - 폼 이미지 목록: 폼 전환 UI가 폼 개수를 알아야 한다
 */
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
    { data: versionGroupData },
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
    // 존재하지 않는 폼은 서버가 에러를 던진다(잘못된 URL). 페이지가
    // notFound()로 처리할 수 있도록 null로 바꿔 전달한다.
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
    apolloClient.query<
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
    }),
    apolloClient.query<
      GetPokemonNormalFormImageListQuery,
      GetPokemonNormalFormImageListQueryVariables
    >({
      query: GetPokemonNormalFormImageListDocument,
      variables: { pokemonId: numericPokemonId },
      fetchPolicy: 'cache-first',
    }),
    // 폼별 표시 이름·타입은 러닝셋에 없다(formCode만 온다). 히트로토무처럼
    // 폼마다 이름과 타입이 다른 경우가 있어 폼 조회 시에만 추가로 받는다.
    // 리전폼과 노말폼은 이름 출처 쿼리가 서로 다르다.
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
    // 습득법 한글 라벨. 클라이언트 훅으로만 받으면 SSR HTML에 enum 원문
    // (LEVEL_UP 등)이 들어가고 쿼리가 도착해야 한글로 바뀐다 — 네트워크가 느린
    // 환경에서 영문이 그대로 보이는 구간이 길어진다. 서버에서 미리 받아 첫
    // 렌더부터 한글이 나오게 한다.
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
    versionGroups: versionGroupData.getVersionGroupsByPokemon,
    formImageList,
    /** 노말폼 표시 정보 (formIndex > 0일 때만) */
    formInfo: normalForms?.[0] ?? null,
    /** 리전폼 목록 — 페이지가 activeIndex로 선택한다 */
    regionForms,
    /** 습득법 한글 라벨 — 탭·목록 제목이 SSR 시점부터 한글로 나오게 한다 */
    learnMethodLabels: learnMethodData.getLearnMethods,
  }
}
