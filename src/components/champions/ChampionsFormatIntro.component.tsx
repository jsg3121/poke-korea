import {
  ChampionsFormatSlug,
  getFormatIntro,
} from '~/utils/championsFormat.util'
import ChampionsFormatTab from '~/components/champions/ChampionsFormatTab.component'

interface ChampionsFormatIntroProps {
  formatSlug: ChampionsFormatSlug
  suffix?: string
  showIntro?: boolean
  className?: string
}

const ChampionsFormatIntro = ({
  formatSlug,
  suffix = '',
  showIntro = false,
  className = '',
}: ChampionsFormatIntroProps) => {
  return (
    <div className={className}>
      <ChampionsFormatTab
        currentFormat={formatSlug}
        basePath="/champions"
        suffix={suffix}
      />
      {showIntro && (
        <p className="mt-3 text-xs text-primary-3 leading-relaxed desktop:text-sm">
          {getFormatIntro(formatSlug)}
        </p>
      )}
    </div>
  )
}

export default ChampionsFormatIntro
