import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getMoveDetailVersionJsonLd } from '~/constants/movesJsonLd'
import { PokemonLearnInfoEdge } from '~/graphql/typeGenerated'

import MoveDetailPageShell from '../../_components/MoveDetailPageShell'
import { fetchMoveDetailQueries } from '../../_fetch/moveDetail.fetch'
import { fetchMoveDetailMetadata } from '../../_fetch/moveDetailMetadata.fetch'
import { generateMoveDetailVersionMetadata } from '../../_metadata/generateMoveDetailMetadata'

type PageProps = {
  params: Promise<{
    id: string
    versionGroupId: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, versionGroupId: versionGroupIdParam } = await params
  const skillId = parseInt(id, 10)
  const versionGroupId = parseInt(versionGroupIdParam, 10)

  if (isNaN(skillId) || isNaN(versionGroupId) || versionGroupId < 1) {
    return {
      title: '기술을 찾을 수 없습니다',
    }
  }

  const { skill, versionGroups } = await fetchMoveDetailMetadata({
    skillId,
    versionGroupId,
  })

  if (!skill) {
    return {
      title: '기술을 찾을 수 없습니다',
    }
  }

  const versionData = skill.generations.find(
    (gen) => gen.versionGroupId === versionGroupId,
  )

  if (!versionData) {
    return {
      title: '기술을 찾을 수 없습니다',
    }
  }

  const versionGroupName =
    versionGroups?.find((vg) => vg.versionGroupId === versionGroupId)?.nameKo ??
    undefined

  return generateMoveDetailVersionMetadata({
    skillId,
    nameKo: skill.nameKo,
    versionGroupId,
    versionGroupName,
    description: versionData.description,
    type: versionData.type,
    power: versionData.power,
    accuracy: versionData.accuracy,
    damageType: versionData.damageType,
  })
}

const MoveDetailVersionPage = async ({ params }: PageProps) => {
  const { id, versionGroupId: versionGroupIdParam } = await params
  const skillId = parseInt(id, 10)
  const versionGroupId = parseInt(versionGroupIdParam, 10)

  if (isNaN(skillId) || isNaN(versionGroupId) || versionGroupId < 1) {
    notFound()
  }

  const { skill, pokemonData, versionGroups, initialApolloState } =
    await fetchMoveDetailQueries({
      skillId,
      versionGroupId,
    })

  if (!skill) {
    notFound()
  }

  const versionData = skill.generations.find(
    (gen) => gen.versionGroupId === versionGroupId,
  )

  if (!versionData) {
    notFound()
  }

  const pokemonList =
    pokemonData?.getPokemonsBySkillV2?.edges.map(
      (edge: PokemonLearnInfoEdge) => edge.node,
    ) || []
  const totalCount = pokemonData?.getPokemonsBySkillV2?.totalCount ?? 0

  const versionGroupName =
    versionGroups?.find((vg) => vg.versionGroupId === versionGroupId)?.nameKo ??
    ''

  const jsonLd = getMoveDetailVersionJsonLd(
    skillId,
    skill.nameKo,
    versionGroupId,
    versionGroupName,
  )

  return (
    <MoveDetailPageShell
      initialApolloState={initialApolloState}
      skillId={skillId}
      skill={skill}
      pokemonList={pokemonList}
      totalCount={totalCount}
      versionGroups={versionGroups}
      selectedVersionGroupId={versionGroupId}
      jsonLd={jsonLd}
      jsonLdId="move-detail-version-webpage-jsonLd"
    />
  )
}

export default MoveDetailVersionPage
