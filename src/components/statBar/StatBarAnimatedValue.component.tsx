interface StatBarAnimatedValueProps {
  value: number
  progress: number
  className: string
}

const StatBarAnimatedValue = ({
  value,
  progress,
  className,
}: StatBarAnimatedValueProps) => (
  <span className={className}>
    <span aria-hidden="true">{Math.round(value * progress)}</span>
    <span className="sr-only">{value}</span>
  </span>
)

export default StatBarAnimatedValue
