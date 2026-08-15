import { Metadata } from 'next'
import { headers } from 'next/headers'
import MobileTabBar from '~/components/MobileTabBar'
import { DetailMovesProvider } from '~/context/DetailMoves.context'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { LearnMethod } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/module/device.module'
import DetailMovesView from '~/views/detail/DetailMoves.view'
import { fetchDefaultMovesQueries } from '../_fetch/defaultMoves.fetch'
import { generateMovesMetadata } from '../_metadata/generateMovesMetadata'

export const revalidate = 31536000

interface MachineMovesPageProps {
  params: Promise<{ pokemonId: string }>
}

export const generateMetadata = async ({
  params,
}: MachineMovesPageProps): Promise<Metadata> => {
  const { pokemonId } = await params

  return generateMovesMetadata({
    pokemonId,
    movesType: 'MACHINE',
    canonicalPath: `/detail/${pokemonId}/moves/machine`,
  })
}

const MachineMovesPage = async ({ params }: MachineMovesPageProps) => {
  const { pokemonId } = await params

  const headersList = await headers()
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
    learnMethod: LearnMethod['MACHINE'],
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
    currentLearnMethod: LearnMethod.MACHINE,
  }

  return (
    <DetailMovesProvider {...initialValue}>
      {/* 콘텐츠는 반응형 단일(DetailMovesView, ADR-0007). UA 분기는 전역 크롬
          (헤더/푸터/탭바) 선택으로만 남는다(홈·리스트·상세 개편과 동일 패턴). */}
      {isMobile ? (
        <main className="min-h-screen w-full">
          <MobileHeaderContainer />
          <DetailMovesView pokemonName={pokemonName} />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // pt-30(120px) = 데스크톱 fixed 헤더 실높이(리스트 개편에서 실측 확정)
        <main className="min-h-screen w-full pt-30">
          <DesktopHeaderContainer />
          <DetailMovesView pokemonName={pokemonName} />
          <DesktopFooterContainer />
        </main>
      )}
    </DetailMovesProvider>
  )
}

export default MachineMovesPage
