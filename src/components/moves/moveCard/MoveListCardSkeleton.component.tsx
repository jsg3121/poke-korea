const MoveListCardSkeleton = () => {
  return (
    <div
      className="w-full min-h-32 bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0_3px_var(--color-primary-4)] p-2.5 animate-pulse desktop:min-h-36 desktop:p-3"
      aria-hidden="true"
    >
      <div className="mb-2 flex items-start justify-between gap-2 border-b border-solid border-primary-1 pb-1.5 desktop:mb-3 desktop:pb-2">
        <span className="block h-5 w-1/2 rounded bg-primary-3/50 desktop:h-6" />
        <span className="block h-5 w-1/4 rounded bg-primary-3/40 desktop:h-6" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <span className="block h-10 rounded bg-primary-3/40 desktop:h-12" />
        <span className="block h-10 rounded bg-primary-3/40 desktop:h-12" />
        <span className="block h-10 rounded bg-primary-3/40 desktop:h-12" />
      </div>
    </div>
  )
}

export default MoveListCardSkeleton
