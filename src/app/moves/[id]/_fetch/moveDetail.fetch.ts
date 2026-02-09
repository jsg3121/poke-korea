import {
  GetPokemonSkillDetailDocument,
  GetPokemonsBySkillDocument,
} from '~/graphql/gqlGenerated'
import {
  type GetPokemonSkillDetailQuery,
  type GetPokemonSkillDetailQueryVariables,
  type GetPokemonsBySkillQuery,
  type GetPokemonsBySkillQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

interface FetchMoveDetailParams {
  skillId: number
  generationId: number
}

/**
 * 기술 상세 페이지 공통 쿼리 실행
 */
export async function fetchMoveDetailQueries({
  skillId,
  generationId,
}: FetchMoveDetailParams) {
  const apolloClient = initializeApollo()

  const { data: skillData } = await apolloClient.query<
    GetPokemonSkillDetailQuery,
    GetPokemonSkillDetailQueryVariables
  >({
    query: GetPokemonSkillDetailDocument,
    variables: {
      filter: {
        skillId,
        generationId,
      },
    },
    fetchPolicy: 'network-only',
  })

  const skill = skillData?.getPokemonSkillDetail

  if (!skill) {
    return { skill: null, pokemonData: null }
  }

  const { data: pokemonData } = await apolloClient.query<
    GetPokemonsBySkillQuery,
    GetPokemonsBySkillQueryVariables
  >({
    query: GetPokemonsBySkillDocument,
    variables: {
      input: {
        filter: {
          skillId,
          generationId,
        },
        pagination: {
          first: 30,
        },
      },
    },
    fetchPolicy: 'network-only',
  })

  return {
    skill,
    pokemonData,
  }
}
