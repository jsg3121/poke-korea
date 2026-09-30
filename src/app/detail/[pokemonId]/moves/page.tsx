import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { LearnMethod } from '~/graphql/typeGenerated'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import DetailMoves from '~/views/detail/DetailMoves.view'

import { fetchLearnsetQueries } from './_fetch/learnset.fetch'
import { generateMovesMetadata } from './_metadata/generateMovesMetadata'

export const revalidate = 31536000

interface DetailMovesPageProps {
  params: Promise<{ pokemonId: string }>
  searchParams: Promise<{
    activeType?: 'region' | 'normalForm'
    activeIndex?: string
    selectVersion?: string
    movesType?: 'LEVELUP' | 'MACHINE'
  }>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: DetailMovesPageProps): Promise<Metadata> => {
  const { pokemonId } = await params
  const {
    activeIndex = '0',
    activeType,
    movesType = 'LEVELUP',
    selectVersion,
  } = await searchParams

  if (
    activeType === 'region' ||
    activeIndex !== '0' ||
    selectVersion ||
    movesType !== 'LEVELUP'
  ) {
    return {}
  }

  return generateMovesMetadata({
    pokemonId,
    learnMethod: LearnMethod.LEVEL_UP,
    canonicalPath: `/detail/${pokemonId}/moves`,
  })
}

const DetailMovesPage = async ({
  params,
  searchParams,
}: DetailMovesPageProps) => {
  const { pokemonId } = await params
  const {
    activeType,
    movesType = 'LEVELUP',
    activeIndex = '0',
    selectVersion,
  } = await searchParams

  if (activeType === 'region') {
    const basePath =
      activeIndex !== '0'
        ? `/detail/${pokemonId}/moves/region/${activeIndex}`
        : `/detail/${pokemonId}/moves/region`
    const versionPath = selectVersion ? `/version/${selectVersion}` : ''
    const machinePath = movesType === 'MACHINE' ? '/machine' : ''
    redirect(`${basePath}${versionPath}${machinePath}`)
  }

  if (activeIndex !== '0') {
    const basePath = `/detail/${pokemonId}/moves/form/${activeIndex}`
    const versionPath = selectVersion ? `/version/${selectVersion}` : ''
    const machinePath = movesType === 'MACHINE' ? '/machine' : ''
    redirect(`${basePath}${versionPath}${machinePath}`)
  }

  if (selectVersion || movesType !== 'LEVELUP') {
    const basePath = `/detail/${pokemonId}/moves`
    const versionPath = selectVersion ? `/version/${selectVersion}` : ''
    const machinePath = movesType === 'MACHINE' ? '/machine' : ''
    redirect(`${basePath}${versionPath}${machinePath}`)
  }

  const {
    pokemonInfoData,
    learnset,
    versionGroups,
    formImageList,
    learnMethodLabels,
  } = await fetchLearnsetQueries({ pokemonId })

  if (!pokemonInfoData.getPokemonDetail) return

  const pokemonDetail = pokemonInfoData.getPokemonDetail
  const isFormChange = !!pokemonDetail.isFormChange

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
    currentVersionGroupId: undefined,
    currentLearnMethod: LearnMethod.LEVEL_UP,
    learnMethodLabels,
  }

  return (
    <DetailMovesProvider {...initialValue}>
      <DetailMoves pokemonName={pokemonDetail.name} />
    </DetailMovesProvider>
  )
}

export default DetailMovesPage
