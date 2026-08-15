import {
  GetLearnMethodsDocument,
  GetPokemonSkillDetailDocument,
  GetPokemonsBySkillDocument,
  GetVersionGroupsBySkillDocument,
} from '~/graphql/gqlGenerated'
import {
  type GetLearnMethodsQuery,
  type GetLearnMethodsQueryVariables,
  type GetPokemonSkillDetailQuery,
  type GetPokemonSkillDetailQueryVariables,
  type GetPokemonsBySkillQuery,
  type GetPokemonsBySkillQueryVariables,
  type GetVersionGroupsBySkillQuery,
  type GetVersionGroupsBySkillQueryVariables,
} from '~/graphql/typeGenerated'
import { extractApolloState, initializeApollo } from '~/module/apolloClient'

interface FetchMoveDetailParams {
  skillId: number
  versionGroupId?: number
}

/**
 * 기술 상세 페이지 공통 쿼리 실행
 */
export async function fetchMoveDetailQueries({
  skillId,
  versionGroupId,
}: FetchMoveDetailParams) {
  const apolloClient = initializeApollo()

  const [{ data: skillData }, { data: pokemonData }] = await Promise.all([
    apolloClient.query<
      GetPokemonSkillDetailQuery,
      GetPokemonSkillDetailQueryVariables
    >({
      query: GetPokemonSkillDetailDocument,
      variables: {
        filter: {
          skillId,
          versionGroupId,
        },
      },
      fetchPolicy: 'network-only',
    }),
    apolloClient.query<
      GetPokemonsBySkillQuery,
      GetPokemonsBySkillQueryVariables
    >({
      query: GetPokemonsBySkillDocument,
      variables: {
        input: {
          filter: {
            skillId,
            versionGroupId,
          },
          pagination: {
            first: 30,
          },
        },
      },
      fetchPolicy: 'network-only',
    }),
  ])

  const skill = skillData?.getPokemonSkillDetail

  if (!skill) {
    return {
      skill: null,
      pokemonData: null,
      versionGroups: null,
      initialApolloState: null,
    }
  }

  const [{ data: versionGroupData }] = await Promise.all([
    apolloClient.query<
      GetVersionGroupsBySkillQuery,
      GetVersionGroupsBySkillQueryVariables
    >({
      query: GetVersionGroupsBySkillDocument,
      variables: { skillId },
      fetchPolicy: 'cache-first',
    }),
    // 습득법 한글 라벨을 캐시에 심는다. 포켓몬 카드의 습득법 배지가 이 라벨을
    // 쓰는데, 클라이언트 쿼리로만 받으면 SSR HTML에 enum 원문(TUTOR 등)이 그대로
    // 렌더된다. 반환값은 쓰지 않고 extractApolloState로 캐시만 전달하면 되므로
    // 클라이언트 useQuery(cache-first)가 네트워크 없이 읽는다.
    apolloClient.query<GetLearnMethodsQuery, GetLearnMethodsQueryVariables>({
      query: GetLearnMethodsDocument,
      fetchPolicy: 'cache-first',
    }),
  ])

  // 서버에서 실행한 쿼리 결과가 정규화되어 담긴 캐시 상태를 추출한다. 클라이언트가
  // 이를 restore하면 useQuery(cache-first)가 초기 네트워크 요청 없이 캐시를 읽는다.
  // 특히 버전 탭 전환 시 GetPokemonsBySkill 재요청을 없애는 것이 목적이다.
  return {
    skill,
    pokemonData,
    versionGroups: versionGroupData?.getVersionGroupsBySkill ?? null,
    initialApolloState: extractApolloState(apolloClient),
  }
}
