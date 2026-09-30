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

import { fetchLearnsetQueries } from '../_fetch/learnset.fetch'
import { generateMovesMetadata } from '../_metadata/generateMovesMetadata'

export const revalidate = 31536000

interface MethodMovesPageProps {
  params: Promise<{ pokemonId: string; method: string }>
}

const resolveVisibleMethod = (slug: string): LearnMethod | undefined => {
  const method = parseLearnMethodSlug(slug)

  if (!method || method === DEFAULT_LEARN_METHOD) return undefined

  return VISIBLE_LEARN_METHODS.includes(method) ? method : undefined
}

export const generateMetadata = async ({
  params,
}: MethodMovesPageProps): Promise<Metadata> => {
  const { pokemonId, method: slug } = await params
  const learnMethod = resolveVisibleMethod(slug)

  if (!learnMethod) return {}

  return generateMovesMetadata({
    pokemonId,
    learnMethod,
    canonicalPath: `/detail/${pokemonId}/moves/${slug}`,
  })
}

const MethodMovesPage = async ({ params }: MethodMovesPageProps) => {
  const { pokemonId, method: slug } = await params
  const learnMethod = resolveVisibleMethod(slug)

  if (!learnMethod) {
    notFound()
  }

  const {
    pokemonInfoData,
    learnset,
    versionGroups,
    formImageList,
    learnMethodLabels,
  } = await fetchLearnsetQueries({ pokemonId })

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
    currentVersionGroupId: undefined,
    currentLearnMethod: learnMethod,
    learnMethodLabels,
  }

  return (
    <DetailMovesProvider {...initialValue}>
      <DetailMoves pokemonName={pokemonDetail.name} />
    </DetailMovesProvider>
  )
}

export default MethodMovesPage
