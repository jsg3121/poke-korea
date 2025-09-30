import ImageComponent from '~/components/Image.component'
import { imageMode } from '~/module/buildMode'

interface SilhouetteQuizImageProps {
  pokemonId: number
}

const SilhouetteQuizImage = ({ pokemonId }: SilhouetteQuizImageProps) => {
  return (
    <div className="w-[calc(100%-40px)] h-[13rem] mx-auto relative flex justify-center">
      <ImageComponent
        height="12rem"
        width="12rem"
        src={`${imageMode}/${pokemonId}.webp`}
        alt="실루엣 포켓몬"
        className="!brightness-0"
      />
    </div>
  )
}

export default SilhouetteQuizImage
