const AbilityCardSkeleton = () => {
  return (
    <div
      className="w-full min-h-40 bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0_3px_var(--color-primary-4)] p-3 animate-pulse"
      aria-hidden="true"
    >
      <div className="mb-3 pb-2 border-b border-solid border-primary-1">
        <span className="block h-5 w-2/3 rounded bg-primary-3/50" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="block h-3 w-full rounded bg-primary-3/40" />
        <span className="block h-3 w-11/12 rounded bg-primary-3/40" />
        <span className="block h-3 w-3/5 rounded bg-primary-3/40" />
      </div>
    </div>
  )
}

export default AbilityCardSkeleton
