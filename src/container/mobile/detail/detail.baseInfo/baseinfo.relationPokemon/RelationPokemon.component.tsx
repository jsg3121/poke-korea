import Link from 'next/link'
import { imageMode } from '~/module/buildMode'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'
import ImageComponent from '~/components/Image.component'

interface RelationPokemonComponentProps {
  evolutionId: Array<number>
  name: string
}

const RelationPokemonComponent = ({
  name,
  evolutionId,
}: RelationPokemonComponentProps) => {
  return (
    <section
      className="w-full h-80 bg-primary-4 border-[3px] border-solid border-primary-1 rounded-2xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4 mx-auto"
      aria-labelledby="pokemon-evelotion-chain"
    >
      <InfoCardTitleComponent title="진화 체인" id="pokemon-evelotion-chain" />
      <ul
        className="w-fit max-w-full h-[calc(100%-4.25rem)] flex items-center gap-4 p-0 overflow-x-auto mx-auto [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl"
        aria-label="진화 체인 포켓몬 리스트"
      >
        {evolutionId.map((id) => {
          return (
            <li key={`relation-pokemon-id-${id}`}>
              <Link
                href={`/detail/${id}`}
                aria-label={`${name}와(과) 연관된 포켓몬`}
              >
                <ImageComponent
                  src={`${imageMode}/${id}.webp`}
                  width="11.5rem"
                  height="11.5rem"
                  alt={`포켓몬 ${name} 연관 포켓몬 ${id}`}
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default RelationPokemonComponent
