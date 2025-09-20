import { useState } from 'react'
import ImageComponent from '~/components/Image.component'
import { imageMode } from '~/module/buildMode'

interface SilhouetteQuizImageProps {
  pokemonId: number
  onClickSkipAnswer: () => void
}

const SilhouetteQuizImage = ({
  pokemonId,
  onClickSkipAnswer,
}: SilhouetteQuizImageProps) => {
  const [showHint, setShowHint] = useState<boolean>(false)

  const handleClickHint = () => {
    setShowHint(() => true)
  }

  const handleClickSkipAnswer = () => {
    onClickSkipAnswer()
  }

  return (
    <div className="w-1/2 mx-auto relative flex justify-center">
      <ImageComponent
        height="18rem"
        width="18rem"
        src={`${imageMode}/${pokemonId}.webp`}
        alt="실루엣 포켓몬"
        className={`${showHint ? 'brightness-[0.25]' : 'brightness-0'}`}
      />
      <button
        className="min-w-[4rem] h-[2rem] bg-primary-1 rounded-[1rem] px-[1rem] text-primary-4 text-[0.75rem] leading-[calc(2rem+2px)] absolute top-0 right-0"
        onClick={handleClickHint}
      >
        힌트보기
      </button>
      <button
        className="min-w-[4rem] h-[2rem] bg-primary-2 rounded-[1rem] px-[1rem] text-primary-4 text-[0.75rem] leading-[calc(2rem+2px)] absolute top-0 left-0"
        onClick={handleClickSkipAnswer}
      >
        다음문제
      </button>
    </div>
  )
}

export default SilhouetteQuizImage
