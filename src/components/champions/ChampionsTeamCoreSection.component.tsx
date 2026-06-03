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
          title="인기 포켓몬 조합"
          description="대회에서 자주 쓰이는 포켓몬 조합"
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
