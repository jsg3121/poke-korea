interface CaptureRateGaugeProps {
  percent: number
  progress?: number
}

const CaptureRateGauge = ({ percent, progress = 1 }: CaptureRateGaugeProps) => {
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

export default CaptureRateGauge
