import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import { LearnMethod } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/module/device.module'
import DetailMovesDesktop from '~/views/desktop/detail/detail.moves/DetailMoves.desktop'
import DetailMovesMobile from '~/views/mobile/detail/detail.moves/DetailMoves.mobile'
import { fetchDefaultMovesQueries } from './_fetch/defaultMoves.fetch'
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

  // 쿼리 파라미터가 있으면 메타데이터 생성 스킵 (리다이렉트됨)
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
    movesType: 'LEVELUP',
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

  // region 쿼리 파라미터가 있으면 Path 기반 URL로 리다이렉트
  if (activeType === 'region') {
    const basePath =
      activeIndex !== '0'
        ? `/detail/${pokemonId}/moves/region/${activeIndex}`
        : `/detail/${pokemonId}/moves/region`
    const versionPath = selectVersion ? `/version/${selectVersion}` : ''
    const machinePath = movesType === 'MACHINE' ? '/machine' : ''
    redirect(`${basePath}${versionPath}${machinePath}`)
  }

  // activeIndex 쿼리 파라미터가 있으면 Path 기반 URL로 리다이렉트
  if (activeIndex !== '0') {
    const basePath = `/detail/${pokemonId}/moves/form/${activeIndex}`
    const versionPath = selectVersion ? `/version/${selectVersion}` : ''
    const machinePath = movesType === 'MACHINE' ? '/machine' : ''
    redirect(`${basePath}${versionPath}${machinePath}`)
  }

  // selectVersion 또는 movesType 쿼리파라미터가 있으면 Path 기반으로 리다이렉트
  if (selectVersion || movesType !== 'LEVELUP') {
    const basePath = `/detail/${pokemonId}/moves`
    const versionPath = selectVersion ? `/version/${selectVersion}` : ''
    const machinePath = movesType === 'MACHINE' ? '/machine' : ''
    redirect(`${basePath}${versionPath}${machinePath}`)
  }

  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const {
    pokemonInfoData,
    isNormalForm,
    data,
    normalFormLearnableSkill,
    versionGroup,
    normalFormImageList,
  } = await fetchDefaultMovesQueries({
    pokemonId,
    learnMethod: LearnMethod['LEVEL_UP'],
  })

  if (!pokemonInfoData.getPokemonDetail) return

  const getPokemonLearnableData = () => {
    if (isNormalForm) {
      return {
        levelUpSkills:
          normalFormLearnableSkill?.getPokemonNormalFormLearnableSkills
            ?.levelUpSkills || [],
        machineSkills:
          normalFormLearnableSkill?.getPokemonNormalFormLearnableSkills
            ?.machineSkills || [],
      }
    } else {
      return {
        levelUpSkills: data?.getPokemonLearnableSkills?.levelUpSkills || [],
        machineSkills: data?.getPokemonLearnableSkills?.machineSkills || [],
      }
    }
  }

  const pokemonLearnableData = getPokemonLearnableData()

  const normalFormName =
    normalFormLearnableSkill?.getPokemonNormalForm?.[0].name ??
    pokemonInfoData.getPokemonDetail.name
  const pokemonName = isNormalForm
    ? normalFormName
    : pokemonInfoData.getPokemonDetail.name

  const pokemonInfoTypes = isNormalForm
    ? (normalFormLearnableSkill?.getPokemonNormalForm?.[0].types ??
      pokemonInfoData.getPokemonDetail.types)
    : pokemonInfoData.getPokemonDetail.types

  const formDataLength = isNormalForm
    ? (normalFormImageList.getPokemonNormalFormImageList?.length ?? 0)
    : 0

  const initialValue = {
    pokemonInfo: {
      name: pokemonName,
      types: pokemonInfoTypes,
      isFormChange: pokemonInfoData.getPokemonDetail.isFormChange,
      isRegionForm: pokemonInfoData.getPokemonDetail.isRegionForm,
      activeType: undefined,
    },
    versionGroup: versionGroup.getVersionGroups,
    pokemonLearnableData,
    formDataLength,
    normalFormInfo: {
      name: normalFormName,
      imagePath: normalFormLearnableSkill?.getPokemonNormalForm?.[0].imagePath,
    },
    currentActiveIndex: 0,
    currentVersionGroupId: undefined,
    currentMovesType: 'LEVELUP' as const,
  }

  return (
    <DetailMovesProvider {...initialValue}>
      {isMobile ? (
        <DetailMovesMobile pokemonName={pokemonName} />
      ) : (
        <DetailMovesDesktop pokemonName={pokemonName} />
      )}
    </DetailMovesProvider>
  )
}

export default DetailMovesPage
