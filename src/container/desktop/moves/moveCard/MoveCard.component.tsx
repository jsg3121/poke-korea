import { PokemonSkill } from '~/graphql/typeGenerated'

interface MoveCardProps {
  moveData: PokemonSkill
}

const MoveCard = ({ moveData }: MoveCardProps) => {
  return (
    <div>
      <h3>
        {moveData.id} - {moveData.name}
      </h3>
      <p>타입: {moveData.type}</p>
      <p>위력: {moveData.power || '-'}</p>
      <p>명중률: {moveData.accuracy || '-'}</p>
      <p>PP: {moveData.pp}</p>
      <p>{moveData.description}</p>
      {moveData.signatureMoves && <span>전용기</span>}
      {moveData.zMoves && <span>Z기술</span>}
    </div>
  )
}

export default MoveCard
