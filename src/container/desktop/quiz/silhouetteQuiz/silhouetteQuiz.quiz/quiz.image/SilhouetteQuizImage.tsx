import ImageComponent from '~/components/Image.component'
import { imageMode } from '~/module/buildMode'

interface SilhouetteQuizImageProps {
  pokemonId: number
}

const SilhouetteQuizImage = ({ pokemonId }: SilhouetteQuizImageProps) => {
  return (
    <div className="w-1/2 mx-auto relative flex justify-center">
      <ImageComponent
        height="18rem"
        width="18rem"
        src={`${imageMode}/${pokemonId}.webp?w=288&h=288`}
        alt="실루엣 포켓몬"
        className="!brightness-0"
      />
    </div>
  )
}

export default SilhouetteQuizImage
