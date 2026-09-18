import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LearnMethod } from '~/graphql/typeGenerated'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import DetailMoves from '~/views/detail/DetailMoves.view'

import { fetchLearnsetQueries } from '../../_fetch/learnset.fetch'
import { generateMovesMetadata } from '../../_metadata/generateMovesMetadata'

export const revalidate = 31536000

interface VersionMovesPageProps {
  params: Promise<{ pokemonId: string; versionGroupId: string }>
}

export const generateMetadata = async ({
  params,
}: VersionMovesPageProps): Promise<Metadata> => {
  const { pokemonId, versionGroupId } = await params

  const parsedVersionId = parseInt(versionGroupId, 10)
  if (isNaN(parsedVersionId) || parsedVersionId <= 0) {
    return {}
  }

  return generateMovesMetadata({
    pokemonId,
    learnMethod: LearnMethod.LEVEL_UP,
    versionGroupId: parsedVersionId,
    canonicalPath: `/detail/${pokemonId}/moves/version/${versionGroupId}`,
  })
}

const VersionMovesPage = async ({ params }: VersionMovesPageProps) => {
  const { pokemonId, versionGroupId } = await params

  const parsedVersionId = parseInt(versionGroupId, 10)
  if (isNaN(parsedVersionId) || parsedVersionId <= 0) {
    notFound()
  }

  const {
    pokemonInfoData,
    learnset,
    versionGroups,
    formImageList,
    learnMethodLabels,
  } = await fetchLearnsetQueries({
    pokemonId,
    versionGroupId: parsedVersionId,
  })

  if (!pokemonInfoData.getPokemonDetail) return

  const pokemonDetail = pokemonInfoData.getPokemonDetail
  const isFormChange = !!pokemonDetail.isFormChange

  // 폼체인지 포켓몬은 폼 전환 UI가 폼 개수를 알아야 한다
  const formDataLength = isFormChange
    ? (formImageList.getPokemonNormalFormImageList?.length ?? 0)
    : 0

  const initialValue = {
    pokemonInfo: {
      name: pokemonDetail.name,
      types: pokemonDetail.types,
      isFormChange: pokemonDetail.isFormChange,
      isRegionForm: pokemonDetail.isRegionForm,
      activeType: undefined,
    },
    versionGroup: versionGroups,
    skillsByMethod: learnset?.skillsByMethod ?? [],
    formDataLength,
    normalFormInfo: {
      name: pokemonDetail.name,
    },
    currentActiveIndex: 0,
    currentVersionGroupId: parsedVersionId,
    currentLearnMethod: LearnMethod.LEVEL_UP,
    learnMethodLabels,
  }

  return (
    <DetailMovesProvider {...initialValue}>
      {/* 콘텐츠는 반응형 단일(DetailMoves, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(홈·리스트·상세 개편과 동일 패턴). */}
      <DetailMoves pokemonName={pokemonDetail.name} />
    </DetailMovesProvider>
  )
}

export default VersionMovesPage
