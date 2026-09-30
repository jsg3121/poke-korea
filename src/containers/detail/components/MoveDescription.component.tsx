export const MoveEffectDescription = ({
  name,
  text,
}: {
  name?: string
  text: string
}) => (
  <div className="mt-3 rounded-lg border-l-4 border-primary-2 bg-primary-1/10 px-3 py-2.5">
    {name && (
      <p className="mb-0.5 text-xs font-bold text-primary-1 desktop:text-sm">
        {name}
      </p>
    )}
    <p className="text-xs leading-relaxed text-primary-1 desktop:text-sm">
      {text}
    </p>
  </div>
)

export const MoveConceptNote = ({
  title,
  text,
}: {
  title: string
  text: string
}) => (
  <div className="mt-4 rounded-lg border border-primary-3/40 bg-primary-1/5 p-3">
    <h3 className="mb-1 text-xs font-bold text-primary-1 desktop:text-sm">
      {title}
    </h3>
    <p className="text-2xs leading-relaxed text-primary-2 desktop:text-sm">
      {text}
    </p>
  </div>
)
