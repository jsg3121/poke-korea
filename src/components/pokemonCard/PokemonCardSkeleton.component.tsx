import { POKEMON_CARD_SIZE } from './PokemonCardShell.component'

const PokemonCardSkeleton = () => {
  return (
    <div className={POKEMON_CARD_SIZE.width} aria-hidden="true">
      <div
        className={`w-full ${POKEMON_CARD_SIZE.height} flex flex-col gap-3 rounded-[10px] border border-solid border-primary-2 bg-primary-2/30 p-2 desktop:p-3 shadow-[inset_10px_0_0_0_rgb(51_65_80)] animate-pulse`}
      >
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 shrink-0 rounded-full bg-primary-3/40 desktop:h-8 desktop:w-8" />
          <span className="h-4 w-2/3 rounded bg-primary-3/40" />
        </div>
        <div className="min-h-0 flex-1 rounded-lg bg-primary-3/30" />
        <div className="flex gap-2">
          <span className="h-5 w-12 rounded-lg bg-primary-3/40" />
          <span className="h-5 w-12 rounded-lg bg-primary-3/40" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="h-3 w-full rounded bg-primary-3/30" />
          <span className="h-3 w-full rounded bg-primary-3/30" />
          <span className="h-3 w-5/6 rounded bg-primary-3/30" />
        </div>
      </div>
    </div>
  )
}

export default PokemonCardSkeleton
