import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import { PokemonWithAbilityInfoFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'

interface PokemonByAbilityCardProps {
  pokemonData: PokemonWithAbilityInfoFragment
}

const PokemonByAbilityCardComponent = ({
  pokemonData,
}: PokemonByAbilityCardProps) => {
  const pokemonNumber = String(pokemonData.number).padStart(4, '0')

  // 폼 타입에 따른 표시 텍스트
  const getFormTypeLabel = () => {
    switch (pokemonData.formType) {
      case 'MEGA':
        return '메가진화'
      case 'REGION_FORM':
        return pokemonData.region ? `${pokemonData.region} 폼` : '지역 폼'
      case 'NORMAL_FORM':
        return pokemonData.formName || '폼'
      default:
        return null
    }
  }

  const formLabel = getFormTypeLabel()

  return (
    <Link
      href={`/detail/${pokemonData.number}`}
      className="block w-full"
      aria-label={`포켓몬 ${pokemonData.name} 카드`}
    >
      <article className="w-full bg-white border-2 border-solid border-gray-300 rounded-lg p-4 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
        <header className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-gray-500 font-medium">
                No.{pokemonNumber}
              </p>
              <h3 className="text-lg font-bold text-gray-900">
                {pokemonData.name}
              </h3>
            </div>
            {formLabel && (
              <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-md font-medium">
                {formLabel}
              </span>
            )}
          </div>
          {pokemonData.isHidden && (
            <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-md font-medium">
              숨겨진 특성
            </span>
          )}
        </header>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 flex-shrink-0 relative">
            <ImageComponent
              height="5rem"
              width="5rem"
              alt={`pokemon_id_${pokemonData.number} ${pokemonData.name}`}
              src={`${imageMode}/${pokemonData.number}.webp?w=120&h=120`}
              fetchPriority="high"
              imageSize={{
                height: 80,
                width: 80,
              }}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {pokemonData.types.map((item, index) => {
              return <TagComponent key={`${item}-id-${index}`} type={item} />
            })}
          </div>
        </div>
      </article>
    </Link>
  )
}

export default PokemonByAbilityCardComponent
