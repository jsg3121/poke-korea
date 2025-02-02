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

const DetailSummaryContainer: FC = () => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    normalForm,
    activeType,
  } = useContext(DetailContext)
  const router = useRouter()

  const newColor = changeColor(pokemonBaseInfo?.type ?? [])
  const indexQuery = parseInt(router.query.activeIndex as string, 10)
  const activeIndex = router.query.activeIndex ? indexQuery : 0

  const pokemonInfo = (() => {
    switch (activeType) {
      case 'mega':
        return {
          name: megaEvolutions?.[activeIndex].name,
          stats: megaEvolutions?.[activeIndex].megaStats,
        }
      case 'region':
        return {
          name: `${pokemonBaseInfo?.name} ${regionFormInfo?.[activeIndex].region}의 모습 ${regionFormInfo?.[activeIndex].name && `(${regionFormInfo?.[activeIndex].name})`}`,
          stats:
            regionFormInfo?.[activeIndex].regionStats ?? pokemonBaseInfo?.stats,
        }
      default:
        return {
          name:
            normalForm?.[activeIndex]?.name.replace('_', ' ') ??
            pokemonBaseInfo?.name,
          stats: normalForm?.[activeIndex]?.formStats ?? pokemonBaseInfo?.stats,
        }
    }
  })()

  return (
    <Div gradient={newColor}>
      <div className="image-wrapper">
        <PokemonImage />
      </div>
      <InfoTitle name={pokemonInfo.name ?? ''} />
      <ul className="switch-list">
        <ShinySwitch />
        {pokemonBaseInfo?.isMega && <MegaSwitch />}
        {pokemonBaseInfo?.isRegion && <RegionSwitch />}
      </ul>
      {pokemonBaseInfo && pokemonInfo.stats && <Stats {...pokemonInfo.stats} />}
    </Div>
  )
}

export default DetailSummaryContainer
