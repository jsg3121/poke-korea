import { PokemonSkill } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'

interface MoveCardProps {
  moveData: PokemonSkill
}

const MoveCard = ({ moveData }: MoveCardProps) => {
  return (
    <article
      className={`w-[calc(100%-1rem)] min-h-14 border-b border-solid border-primary-4 bg-primary-4 rounded-[1rem] mx-auto mb-4 p-2 relative`}
    >
      <strong className="w-full h-[2rem] text-center block text-[1.2rem] leading-[2rem] font-[600] border-b border-solid border-primary-1 mb-2">
        {moveData.name}
      </strong>
      <span
        className={`text-center w-14 h-[1.75rem] block absolute top-2 right-4 leading-8 rounded-[0.5rem]
          ${
            moveData.damageType === '물리'
              ? 'bg-[#fd8181]'
              : moveData.damageType === '특수'
                ? 'bg-[#9b9bfa]'
                : 'bg-[#72d372]'
          }`}
      >
        {moveData.damageType}
      </span>
      <dl className="w-full flex flex-wrap items-center [&>dt]:h-[2rem] [&>dt]:font-[700] [&>dt]:leading-[2rem] [&>dt]:border-b [&>dt]:border-solid [&>dt]:border-primary-3 [&>dd]:h-[2rem] [&>dd]:leading-[2rem] [&>dd]:border-b [&>dd]:border-solid [&>dd]:border-primary-3">
        <dt className="text-left w-[8%]">타입</dt>
        <dd className="text-center w-[20%] flex items-center justify-center">
          <span
            className={`w-[4rem] h-[1.5rem] block px-2 text-[0.875rem] text-center text-white leading-[calc(1.5rem+2px)] chip-type-${moveData.type.toLowerCase()} mx-auto block rounded-[1rem]`}
          >
            {PokemonTypes[moveData.type]}
          </span>
        </dd>
        <dt className="text-center w-[12%]">위력</dt>
        <dd className="text-left w-[11%]">{moveData.power || '-'}</dd>
        <dt className="text-center w-[14%]">명중률</dt>
        <dd className="text-left w-[12%]">{moveData.accuracy || '-'}</dd>
        <dt className="text-center w-[11%]">PP</dt>
        <dd className="text-left w-[12%]">{moveData.pp}</dd>
        <dt className="w-full text-center visually-hidden">설명</dt>
        <dd className="w-full !h-auto text-left !border-none mt-2">
          {moveData.description}
        </dd>
      </dl>
    </article>
  )
}

export default MoveCard
