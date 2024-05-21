import { useRouter } from 'next/router'
import React, { FC } from 'react'
import styled from 'styled-components'
import { imageMode } from '~/common'
import { Image } from '~/components'
import { DetailContext } from '~/context/src/Detail.context'

interface IFProps {}

const PokemonImageCompoment: FC<IFProps> = () => {
  const { pokemonBaseInfo } = React.useContext(DetailContext)
  const { query } = useRouter()

  const imageSrc =
    query.shinyMode === 'shiny'
      ? `${imageMode}/shiny/${pokemonBaseInfo?.number}.webp`
      : `${imageMode}/${pokemonBaseInfo?.number}.webp`

  return (
    <Div>
      <Image
        src={imageSrc}
        width="25rem"
        height="25rem"
        alt={`포켓몬 ${pokemonBaseInfo?.name}의 모습`}
        className="pokemon-main"
        unoptimized
      />
    </Div>
  )
}

export default PokemonImageCompoment

const Div = styled.div`
  width: 100%;
  max-width: 1320px;
  height: 25rem;
  margin: 0 auto;
  filter: drop-shadow(0px -3px 3px #000000);
`
