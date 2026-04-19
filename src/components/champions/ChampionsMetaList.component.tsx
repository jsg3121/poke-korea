interface ChampionsMetaListProps {
  title: string
  items: Array<{ name: string; usageRate: number }>
}

const ChampionsMetaList = ({ title, items }: ChampionsMetaListProps) => {
  const maxRate = Math.max(...items.map((item) => item.usageRate), 1)

  return (
    <div className="p-4 bg-primary-3/30 rounded-xl">
      <h3 className="font-bold text-sm mb-3 text-gray-700">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => {
          const percentage = (item.usageRate / maxRate) * 100

          return (
            <li key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-600">
                  {item.usageRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-primary-4 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-1 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ChampionsMetaList
