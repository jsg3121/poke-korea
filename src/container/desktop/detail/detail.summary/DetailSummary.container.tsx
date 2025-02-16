import { useRouter } from 'next/router'
import { useContext } from 'react'
import styled from 'styled-components'
import { DetailContext } from '~/context/Detail.context'
import { changeColor } from '~/module/changeColor'
import { TypesColor } from '~/types/pokemonTypes.types'
import InfoTitle from './components/InfoTitle.component'
import MegaSwitch from './components/MegaSwitch.component'
import RegionSwitch from './components/RegionSwitch.component'
import ShinySwitch from './components/ShinySwitch.component'
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

  const pokemonInfo = (() => {
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
  })()

  return (
    <Div gradient={newColor}>
      <div className="detail-profile">
        {isShiny && (
          <div className="shiny-buttons">
            <ShinyTooltipComponent />
            <ShinyRateComponent />
          </div>
        )}
        <section className="profile-image" aria-label="포켓몬 이미지">
          <PokemonImageCompoment />
          <InfoTitle name={pokemonInfo.name ?? ''} />
        </section>
        <section className="profile-description">
          <ul
            className="switch-list"
            aria-label="포켓몬 상대 변환 스위치 리스트"
          >
            <ShinySwitch />
            {pokemonBaseInfo?.isMegaEvolution && <MegaSwitch />}
            {pokemonBaseInfo?.isRegionForm && <RegionSwitch />}
          </ul>
          {pokemonBaseInfo && pokemonInfo.stats && (
            <StatsComponent {...pokemonInfo.stats} />
          )}
        </section>
      </div>
    </Div>
  )
}

export default DetailSummaryContainer

const Div = styled.div<TStyledProps>`
  width: 100%;
  height: 40rem;
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

  & > .detail-profile {
    width: 100%;
    max-width: 1280px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    top: -17rem;
    left: 0;
    z-index: 1;
    margin: 0 auto;
    padding: 0 20px;

    & > .profile-image {
      position: relative;
      z-index: -1;
    }

    & > .shiny-buttons {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      position: absolute;
      top: 0;
      left: 20px;
      z-index: 100;
    }

    & > .profile-description {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      position: relative;
      z-index: 10;

      & > .switch-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        position: absolute;
        top: 1rem;
        z-index: -1;
      }
    }
  }
`
