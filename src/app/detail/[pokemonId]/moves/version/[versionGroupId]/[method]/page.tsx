import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LearnMethod } from '~/graphql/typeGenerated'
import {
  DEFAULT_LEARN_METHOD,
  parseLearnMethodSlug,
  VISIBLE_LEARN_METHODS,
} from '~/modules/movesParams.module'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import DetailMoves from '~/views/detail/DetailMoves.view'

import { fetchLearnsetQueries } from '../../../_fetch/learnset.fetch'
import { generateMovesMetadata } from '../../../_metadata/generateMovesMetadata'

export const revalidate = 31536000

interface VersionMethodMovesPageProps {
  params: Promise<{
    pokemonId: string
    versionGroupId: string
    method: string
  }>
}

const resolveVisibleMethod = (slug: string): LearnMethod | undefined => {
  const method = parseLearnMethodSlug(slug)

  if (!method || method === DEFAULT_LEARN_METHOD) return undefined

  return VISIBLE_LEARN_METHODS.includes(method) ? method : undefined
}

export const generateMetadata = async ({
  params,
}: VersionMethodMovesPageProps): Promise<Metadata> => {
  const { pokemonId, versionGroupId, method: slug } = await params
  const learnMethod = resolveVisibleMethod(slug)

  const parsedVersionId = parseInt(versionGroupId, 10)
  if (!learnMethod || isNaN(parsedVersionId) || parsedVersionId <= 0) {
    return {}
  }

  return generateMovesMetadata({
    pokemonId,
    learnMethod,
    versionGroupId: parsedVersionId,
    canonicalPath: `/detail/${pokemonId}/moves/version/${versionGroupId}/${slug}`,
  })
}

const VersionMethodMovesPage = async ({
  params,
}: VersionMethodMovesPageProps) => {
  const { pokemonId, versionGroupId, method: slug } = await params
  const learnMethod = resolveVisibleMethod(slug)

  const parsedVersionId = parseInt(versionGroupId, 10)
  if (!learnMethod || isNaN(parsedVersionId) || parsedVersionId <= 0) {
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

  if (!pokemonInfoData.getPokemonDetail) {
    notFound()
  }

  const pokemonDetail = pokemonInfoData.getPokemonDetail

  const formDataLength = pokemonDetail.isFormChange
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
    currentLearnMethod: learnMethod,
    learnMethodLabels,
  }

  return (
    <DetailMovesProvider {...initialValue}>
      <DetailMoves pokemonName={pokemonDetail.name} />
    </DetailMovesProvider>
  )
}

export default VersionMethodMovesPage
