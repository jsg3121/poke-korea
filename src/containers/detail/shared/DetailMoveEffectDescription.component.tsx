interface MoveEffectDescriptionProps {
  name?: string
  text: string
}

const DetailMoveEffectDescription = ({
  name,
  text,
}: MoveEffectDescriptionProps) => (
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

export default DetailMoveEffectDescription
