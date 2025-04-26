import { useRouter } from 'next/router'
import { useContext } from 'react'
import styled from 'styled-components'
import { DetailContext } from '~/context/Detail.context'
import { changeColor } from '~/module/changeColor'
import { TypesColor } from '~/types/pokemonTypes.types'
import InfoTitleComponent from './components/InfoTitle.component'
import MegaSwitchComponent from './components/MegaSwitch.component'
import RegionSwitchComponent from './components/RegionSwitch.component'
import ShinySwitchComponent from './components/ShinySwitch.component'
import PokemonImageCompoment from './summary.pokemonImage/PokemonImage.compoment'
import StatsComponent from './summary.stats/Stats.component'
import ShinyTooltipComponent from '~/components/detail.summary/summary.shinyTooltip/ShinyTooltip.component'
import ShinyRateComponent from '~/components/detail.summary/summary.shinyRate/ShinyRate.component'

type TStyledProps = { gradient: Array<TypesColor> }

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

  return (
    <Section gradient={newColor} aria-label="포켓몬 이미지 및 능력치 정보">
      <section className="image-wrapper">
        <PokemonImageCompoment />
      </section>
      <InfoTitleComponent name={pokemonInfo.name ?? ''} />
      {isShiny && (
        <div className="shiny-buttons">
          <ShinyTooltipComponent />
          <ShinyRateComponent />
        </div>
      )}
      <ul className="switch-list" aria-label="포켓몬 상대 변환 스위치 리스트">
        <ShinySwitchComponent />
        {pokemonBaseInfo?.isMegaEvolution && <MegaSwitchComponent />}
        {pokemonBaseInfo?.isRegionForm && <RegionSwitchComponent />}
      </ul>
      {pokemonBaseInfo && pokemonInfo.stats && (
        <StatsComponent {...pokemonInfo.stats} />
      )}
    </Section>
  )
}

export default DetailSummaryContainer

const Section = styled.section<TStyledProps>`
  width: 100%;

  & > .image-wrapper {
    width: 100%;
    margin: 0 auto;
    position: relative;

    &::before {
      content: '';
      width: 100%;
      height: 20rem;
      background-color: #ffffff;
      display: block;
    }

    &::after {
      content: '';
      width: 100%;
      height: 20rem;
      display: block;
      position: absolute;
      top: 0;
      background: ${(props) => {
        if (props.gradient.length === 1) {
          return `${props.gradient[0]}66`
        } else {
          return `linear-gradient(
              135deg,
              ${props.gradient[0]}88 35%,
              ${props.gradient[1]}88 65%
            )`
        }
      }};
    }
  }

  & > .shiny-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 20px;
  }

  & > .switch-list {
    width: 100%;
    height: 3rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 0 20px;
  }
`
