import { useRouter } from 'next/router'
import { FC } from 'react'
import styled from 'styled-components'
import { imageMode } from '~/common'
import { Image } from '~/components'

interface IFProps {
  name: string
  pokemonNumber: number
}

const PokemonImageCompoment: FC<IFProps> = (props) => {
  const { name, pokemonNumber } = props
  const { query } = useRouter()

  const imageSrc =
    query.shinyMode === 'shiny'
      ? `${imageMode}/shiny/${pokemonNumber}.webp`
      : `${imageMode}/${pokemonNumber}.webp`

  return (
    <Div>
      <Image
        src={imageSrc}
        width="25rem"
        height="25rem"
        alt={`포켓몬 ${name}의 모습`}
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
