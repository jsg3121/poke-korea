interface MoveConceptNoteProps {
  title: string
  text: string
}

const DetailMoveConceptNote = ({ title, text }: MoveConceptNoteProps) => (
  <div className="mt-4 rounded-lg border border-primary-3/40 bg-primary-1/5 p-3">
    <h3 className="mb-1 text-xs font-bold text-primary-1 desktop:text-sm">
      {title}
    </h3>
    <p className="text-2xs leading-relaxed text-primary-2 desktop:text-sm">
      {text}
    </p>
  </div>
)

export default DetailMoveConceptNote
