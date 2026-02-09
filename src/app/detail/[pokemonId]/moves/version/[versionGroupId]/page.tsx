import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import { LearnMethod } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/module/device.module'
import DetailMovesDesktop from '~/views/desktop/detail/detail.moves/DetailMoves.desktop'
import DetailMovesMobile from '~/views/mobile/detail/detail.moves/DetailMoves.mobile'
import { fetchDefaultMovesQueries } from '../../_fetch/defaultMoves.fetch'
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
    movesType: 'LEVELUP',
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
    versionGroupId: parsedVersionId,
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
    currentVersionGroupId: parsedVersionId,
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

export default VersionMovesPage
