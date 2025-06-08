import { useRouter } from 'next/router'
import { useContext } from 'react'
import DesktopDetailSidebarBanner from '~/components/adSlot/DesktopDetailSidebarBanner'
import ShinyRateComponent from '~/components/detail.summary/summary.shinyRate/ShinyRate.component'
import ShinyTooltipComponent from '~/components/detail.summary/summary.shinyTooltip/ShinyTooltip.component'
import { DetailContext } from '~/context/Detail.context'
import { changeColor } from '~/module/changeColor'
import InfoTitle from './components/InfoTitle.component'
import MegaSwitch from './components/MegaSwitch.component'
import RegionSwitch from './components/RegionSwitch.component'
import ShinySwitch from './components/ShinySwitch.component'
import PokemonImageCompoment from './summary.pokemonImage/PokemonImage.compoment'
import StatsComponent from './summary.stats/Stats.component'

const DetailSummaryContainer = () => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    normalForm,
    activeType,
  } = useContext(DetailContext)
  const router = useRouter()

  const newColor = changeColor(pokemonBaseInfo?.types ?? [])
  const indexQuery = parseInt(router.query.activeIndex as string, 10)
  const activeIndex = router.query.activeIndex ? indexQuery : 0
  const isShiny = router.query.shinyMode === 'shiny'

  const getPokemonInfo = () => {
    switch (activeType) {
      case 'mega':
        return {
          name: megaEvolutions?.[activeIndex].name,
          stats: megaEvolutions?.[activeIndex].megaEvolutionStats,
        }
      case 'region':
        return {
          name: `${pokemonBaseInfo?.name} ${regionFormInfo?.[activeIndex].region}의 모습 ${regionFormInfo?.[activeIndex].name && `(${regionFormInfo?.[activeIndex].name})`}`,
          stats:
            regionFormInfo?.[activeIndex].regionFormStats ??
            pokemonBaseInfo?.pokemonStats,
        }
      default:
        return {
          name:
            normalForm?.[activeIndex]?.name.replace('_', ' ') ??
            pokemonBaseInfo?.name,
          stats:
            normalForm?.[activeIndex]?.normalFormStats ??
            pokemonBaseInfo?.pokemonStats,
        }
    }
  }

  const pokemonInfo = getPokemonInfo()

  const getGradientStyle = () => {
    if (newColor.length === 1) {
      return {
        background: `${newColor[0]}66`,
      }
    } else {
      return {
        background: `linear-gradient(135deg, ${newColor[0]}88 35%, ${newColor[1]}88 65%)`,
      }
    }
  }

  return (
    <section
      className="w-full h-full max-h-[40rem] mx-auto relative before:content-[''] before:w-full before:h-80 before:bg-white before:block"
      aria-label="포켓몬 이미지 및 능력치 정보"
    >
      <div
        className="absolute top-0 w-full h-80 block"
        style={getGradientStyle()}
      />
      <div className="w-full h-[32.375rem] max-w-[1280px] flex items-center justify-between relative -top-[17rem] left-0 z-[1] mx-auto px-5">
        {isShiny && (
          <div className="flex items-center gap-2 absolute top-0 left-5 z-[100]">
            <ShinyTooltipComponent />
            <ShinyRateComponent />
          </div>
        )}
        <section className="relative -z-[1]" aria-label="포켓몬 이미지">
          <PokemonImageCompoment />
          <InfoTitle name={pokemonInfo.name ?? ''} />
        </section>
        <section className="h-[32.375rem] flex items-start relative z-10">
          <ul
            className="flex flex-col gap-2 absolute top-4 -z-[1]"
            aria-label="포켓몬 상대 변환 스위치 리스트"
          >
            <ShinySwitch />
            {pokemonBaseInfo?.isMegaEvolution && <MegaSwitch />}
            {pokemonBaseInfo?.isRegionForm && <RegionSwitch />}
          </ul>
          {pokemonBaseInfo && pokemonInfo.stats && (
            <StatsComponent {...pokemonInfo.stats} />
          )}
          <DesktopDetailSidebarBanner />
        </section>
      </div>
    </section>
  )
}

export default DetailSummaryContainer
