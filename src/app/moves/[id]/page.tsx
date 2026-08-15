import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getMoveDetailJsonLd } from '~/constants/movesJsonLd'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { getDamageTypeKorean } from '~/utils/skill.util'
import { PokemonLearnInfoEdge } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/module/device.module'
import MoveDetailPageShell from './_components/MoveDetailPageShell'
import { fetchMoveDetailQueries } from './_fetch/moveDetail.fetch'
import { fetchMoveDetailMetadata } from './_fetch/moveDetailMetadata.fetch'
import { generateMoveDetailMetadata } from './_metadata/generateMoveDetailMetadata'

// 이 페이지는 동적 렌더다: headers() UA 감지(크롬 선택)가 매 요청 평가된다.
// 기존 revalidate=1년 선언은 headers() 때문에 실효가 없던 거짓 신호라 제거(UX-008).

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const skillId = parseInt(id, 10)

  if (isNaN(skillId)) {
    return {
      title: '기술을 찾을 수 없습니다',
    }
  }

  const { skill } = await fetchMoveDetailMetadata({
    skillId,
  })

  if (!skill) {
    return {
      title: '기술을 찾을 수 없습니다',
    }
  }

  return generateMoveDetailMetadata({
    skillId,
    nameKo: skill.nameKo,
    description: skill.description,
    type: skill.type,
    power: skill.power,
    accuracy: skill.accuracy,
    damageType: skill.damageType,
  })
}

const MoveDetailPage = async ({ params }: PageProps) => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const { id } = await params
  const skillId = parseInt(id, 10)

  if (isNaN(skillId)) {
    notFound()
  }

  const { skill, pokemonData, versionGroups, initialApolloState } =
    await fetchMoveDetailQueries({
      skillId,
    })

  if (!skill) {
    notFound()
  }

  const pokemonList =
    pokemonData?.getPokemonsBySkillV2?.edges.map(
      (edge: PokemonLearnInfoEdge) => edge.node,
    ) || []
  const totalCount = pokemonData?.getPokemonsBySkillV2?.totalCount ?? 0

  const damageTypeKorean = getDamageTypeKorean(skill.damageType)
  const jsonLd = getMoveDetailJsonLd(skillId, skill.nameKo, {
    typeLabel: skill.type ? PokemonTypes[skill.type] : null,
    // getDamageTypeKorean은 미보유 시 '-'를 반환 — JSON-LD에선 제외
    damageTypeLabel: damageTypeKorean === '-' ? null : damageTypeKorean,
    power: skill.power,
    accuracy: skill.accuracy,
    description: skill.description,
  })

  return (
    <MoveDetailPageShell
      isMobile={isMobile}
      initialApolloState={initialApolloState}
      skillId={skillId}
      skill={skill}
      pokemonList={pokemonList}
      totalCount={totalCount}
      versionGroups={versionGroups}
      jsonLd={jsonLd}
      jsonLdId="move-detail-webpage-jsonLd"
    />
  )
}

export default MoveDetailPage
