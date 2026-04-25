import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { imageMode } from '~/module/buildMode'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'

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
      className="card-detail mx-auto col-span-2"
      aria-labelledby="pokemon-evelotion-chain"
    >
      <InfoCardTitleComponent title="진화 체인" id="pokemon-evelotion-chain" />
      <ul
        className="w-fit max-w-full h-[calc(100%-4.25rem)] flex-items-gap-4 p-0 overflow-x-auto mx-auto [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-[5px] [&::-webkit-scrollbar-thumb]:bg-primary-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-primary-3 [&::-webkit-scrollbar-track]:rounded-xl"
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
                  src={`${imageMode}/${id}`}
                  width="12rem"
                  height="12rem"
                  alt={`포켓몬 ${name} 연관 포켓몬 ${id}`}
                  imageSize={{ width: 192, height: 192 }}
                  densities={[1, 1.5]}
                  sizes="12rem"
                  loading="lazy"
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
