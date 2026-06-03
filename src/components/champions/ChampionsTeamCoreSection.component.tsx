import { ChampionsTeamCoreFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'
import ChampionsHomeSectionHeader from './ChampionsHomeSectionHeader.component'
import ChampionsTeamCoreCard from './ChampionsTeamCoreCard.component'

interface ChampionsTeamCoreSectionProps {
  teamCores: ChampionsTeamCoreFragment[]
  formatSlug: ChampionsFormatSlug
}

const ChampionsTeamCoreSection = ({
  teamCores,
  formatSlug,
}: ChampionsTeamCoreSectionProps) => {
  if (teamCores.length === 0) {
    return null
  }

  return (
    <section
      aria-labelledby="teamcore-heading"
      className="w-full mb-8 desktop:mb-12"
    >
      <div id="teamcore-heading">
        <ChampionsHomeSectionHeader
          title="자주 함께 쓰이는 조합"
          description="실제 대회에서 가장 많이 채용된 페어"
        />
      </div>

      <ul className="flex flex-col gap-4" role="list">
        {teamCores.map((core) => (
          <li key={core.id}>
            <ChampionsTeamCoreCard core={core} formatSlug={formatSlug} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ChampionsTeamCoreSection
