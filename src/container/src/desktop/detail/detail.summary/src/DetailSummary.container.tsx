import { useRouter } from 'next/router'
import { FC, useContext } from 'react'
import styled from 'styled-components'
import { DetailContext } from '~/context/src/Detail.context'
import { changeColor } from '~/module/changeColor'
import { TypesColor } from '~/types'
import { InfoTitle, MegaSwitch, RegionSwitch, ShinySwitch } from './components'
import { PokemonImage } from './summary.pokemonImage'
import { Stats } from './summary.stats'

type TStyledProps = { gradient: Array<TypesColor> }

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

    & > .profile-description {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      position: relative;

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

const DetailSummaryContainer: FC = () => {
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
        <div className="profile-image">
          <PokemonImage />
          <InfoTitle name={pokemonInfo.name ?? ''} />
        </div>
        <div className="profile-description">
          <ul className="switch-list">
            <ShinySwitch />
            {pokemonBaseInfo?.isMegaEvolution && <MegaSwitch />}
            {pokemonBaseInfo?.isRegionForm && <RegionSwitch />}
          </ul>
          {pokemonBaseInfo && pokemonInfo.stats && (
            <Stats {...pokemonInfo.stats} />
          )}
        </div>
      </div>
    </Div>
  )
}

export default DetailSummaryContainer
