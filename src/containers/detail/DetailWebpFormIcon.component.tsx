import Image from '~/components/Image.component'

interface DetailWebpFormIconProps {
  src: string
  alt: string
  active: boolean
}

const DetailWebpFormIcon = ({ src, alt, active }: DetailWebpFormIconProps) => (
  <i
    className={`block h-5 w-5 shrink-0 will-change-[filter] ${active ? 'grayscale-0' : 'grayscale'}`}
  >
    <Image
      alt={alt}
      width="1.25rem"
      height="1.25rem"
      imageSize={{ width: 20, height: 20 }}
      src={src}
    />
  </i>
)

export default DetailWebpFormIcon
