import { FlavorTextGeneration } from './modules/flavorText.module'

interface DetailFlavorTextPanelProps {
  generation: FlavorTextGeneration
}

const textClass = 'break-keep text-base leading-[1.7] text-primary-1'

const DetailFlavorTextPanel = ({ generation }: DetailFlavorTextPanelProps) => {
  return (
    <dl className="w-full">
      {generation.groups.map((group) => {
        const [firstEntry] = group.entries
        const isSingleVersion =
          group.entries.length === 1 && firstEntry?.versionNames.length === 1

        return (
          <div
            key={`flavor-group-${group.versionGroupId}`}
            className="flex min-h-9 flex-col gap-1.5 border-b border-solid border-primary-3 py-3 first:pt-1 last:border-b-0 last:pb-0 desktop:grid desktop:min-h-12 desktop:grid-cols-[14rem_minmax(0,1fr)] desktop:items-start desktop:gap-x-6 desktop:py-4"
          >
            <dt className="flex flex-wrap items-center gap-1.5 text-sm font-bold leading-6 text-primary-1 desktop:text-base desktop:leading-7">
              {group.displayName}
              {group.isLatest && (
                <span className="h-5 rounded-md bg-primary-1 px-2 text-2xs font-semibold leading-5 text-primary-4 desktop:h-6 desktop:text-xs desktop:leading-6">
                  최신
                </span>
              )}
            </dt>
            <dd className="flex flex-col gap-2.5">
              {isSingleVersion && firstEntry ? (
                <p
                  className={`border-l-2 border-solid border-primary-3 pl-3 ${textClass}`}
                >
                  {firstEntry.flavorText}
                </p>
              ) : (
                group.entries.map((entry) => (
                  <dl
                    key={`flavor-entry-${group.versionGroupId}-${entry.versionNames.join('-')}`}
                    className="border-l-2 border-solid border-primary-3 pl-3"
                  >
                    {entry.versionNames.map((versionName) => (
                      <dt
                        key={`flavor-version-${versionName}`}
                        className="text-xs font-bold leading-5 text-primary-1 desktop:text-sm"
                      >
                        {versionName}
                      </dt>
                    ))}
                    <dd className={`mt-1 ${textClass}`}>{entry.flavorText}</dd>
                  </dl>
                ))
              )}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

export default DetailFlavorTextPanel
