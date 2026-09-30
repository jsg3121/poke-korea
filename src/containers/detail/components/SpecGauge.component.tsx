interface CaptureRateGaugeProps {
  percent: number
  progress?: number
}

export const CaptureRateGauge = ({
  percent,
  progress = 1,
}: CaptureRateGaugeProps) => {
  return (
    <span
      aria-hidden="true"
      className="block h-2.5 w-full overflow-hidden rounded-full bg-primary-1/10"
    >
      <span
        className="block h-full rounded-full bg-primary-2"
        style={{ width: `${percent * progress}%` }}
      />
    </span>
  )
}

interface GenderBarProps {
  male: number
  progress?: number
}

export const GenderBar = ({ male, progress = 1 }: GenderBarProps) => {
  const hasBoundary = male > 0 && male < 100

  return (
    <span
      aria-hidden="true"
      className="block h-2.5 w-full overflow-hidden rounded-full bg-primary-3"
    >
      <span
        className={`block h-full bg-primary-2 ${
          hasBoundary ? 'border-r-2 border-primary-4' : ''
        }`}
        style={{ width: `${male * progress}%` }}
      />
    </span>
  )
}
