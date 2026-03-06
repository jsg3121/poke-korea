import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import ShinyRateComponent from '~/components/detail.summary/summary.shinyRate/ShinyRate.component'
import ShinyTooltipComponent from '~/components/detail.summary/summary.shinyTooltip/ShinyTooltip.component'
import { DetailContext } from '~/context/Detail.context'
import { changeColor } from '~/module/changeColor'
import GigantamaxSwitchComponent from './components/GigantamaxSwitch.component'
import InfoTitleComponent from './components/InfoTitle.component'
import MegaSwitchComponent from './components/MegaSwitch.component'
import RegionSwitchComponent from './components/RegionSwitch.component'
import ShinySwitchComponent from './components/ShinySwitch.component'
import PokemonImageCompoment from './summary.pokemonImage/PokemonImage.compoment'
import StatsComponent from './summary.stats/Stats.component'

const DetailSummaryContainer = () => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    normalForm,
    activeType,
    activeIndex,
  } = useContext(DetailContext)
  const routerQuery = useSearchParams()

  const newColor = changeColor(pokemonBaseInfo?.types ?? [])
  const isShiny = routerQuery.get('shinyMode') === 'shiny'

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
      case 'gigantamax':
        return {
          name: gigantamaxInfo?.[activeIndex]?.name,
          stats: pokemonBaseInfo?.pokemonStats,
        }
      default:
        return {
          name:
            normalForm?.[0]?.name.replace('_', ' ') ?? pokemonBaseInfo?.name,
          stats:
            normalForm?.[0]?.normalFormStats ?? pokemonBaseInfo?.pokemonStats,
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
    <section className="w-full" aria-label="포켓몬 이미지 및 능력치 정보">
      <section className="w-full mx-auto relative before:content-[''] before:w-full before:h-80 before:bg-white before:block">
        <div
          className="absolute top-0 w-full h-80 block"
          style={getGradientStyle()}
        />
        <PokemonImageCompoment />
      </section>
      <InfoTitleComponent name={pokemonInfo.name ?? ''} />
      {isShiny && (
        <>
          <p className="w-full px-4 text-xs text-primary-3 mb-2">
            ※ 일부 포켓몬은 이로치 이미지가 아직 적용되지 않았으며,
            <br /> 확인되는 대로 업데이트될 예정입니다.
          </p>
          <div className="flex-items-gap-2 ml-4">
            <ShinyTooltipComponent />
            <ShinyRateComponent />
          </div>
        </>
      )}
      <ul
        className="w-full h-12 flex-items-gap-4 mb-4 px-4"
        aria-label="포켓몬 상대 변환 스위치 리스트"
      >
        <ShinySwitchComponent
          searchParams={Object.fromEntries(routerQuery.entries())}
        />
        {pokemonBaseInfo?.isMegaEvolution && <MegaSwitchComponent />}
        {pokemonBaseInfo?.isRegionForm && <RegionSwitchComponent />}
        {pokemonBaseInfo?.isGigantamax && <GigantamaxSwitchComponent />}
      </ul>
      {pokemonBaseInfo && pokemonInfo.stats && (
        <StatsComponent {...pokemonInfo.stats} />
      )}
    </section>
  )
}

export default DetailSummaryContainer
