import { useRouter } from 'next/router'
import { useContext } from 'react'
import styled from 'styled-components'
import { DetailContext, TActiveType } from '~/context/Detail.context'
import { changeColor } from '~/module/changeColor'
import { TypesColor } from '~/types/pokemonTypes.types'
import InfoTitleComponent from './components/InfoTitle.component'
import MegaSwitchComponent from './components/MegaSwitch.component'
import RegionSwitchComponent from './components/RegionSwitch.component'
import ShinySwitchComponent from './components/ShinySwitch.component'
import PokemonImageCompoment from './summary.pokemonImage/PokemonImage.compoment'
import StatsComponent from './summary.stats/Stats.component'

type TStyledProps = { gradient: Array<TypesColor> }

const Div = styled.div<TStyledProps>`
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

const DetailSummaryContainer = () => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    normalForm,
    activeType,
    handleChangeActiveType,
  } = useContext(DetailContext)
  const router = useRouter()

  const handleChangeType = (type: TActiveType) => {
    if (handleChangeActiveType) {
      handleChangeActiveType(type)
    }
  }

  const newColor = changeColor(pokemonBaseInfo?.types ?? [])
  const indexQuery = parseInt(router.query.activeIndex as string, 10)
  const activeIndex = router.query.activeIndex ? indexQuery : 0

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
      <div className="image-wrapper">
        <PokemonImageCompoment />
      </div>
      <InfoTitleComponent name={pokemonInfo.name ?? ''} />
      <ul className="switch-list">
        <ShinySwitchComponent />
        {pokemonBaseInfo?.isMegaEvolution && (
          <MegaSwitchComponent onChnageType={handleChangeType} />
        )}
        {pokemonBaseInfo?.isRegionForm && (
          <RegionSwitchComponent onChnageType={handleChangeType} />
        )}
      </ul>
      {pokemonBaseInfo && pokemonInfo.stats && (
        <StatsComponent {...pokemonInfo.stats} />
      )}
    </Div>
  )
}

export default DetailSummaryContainer
