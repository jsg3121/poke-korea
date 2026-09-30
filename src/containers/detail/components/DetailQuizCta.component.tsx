import LinkButton from '~/components/button/LinkButton.component'

interface DetailQuizCtaProps {
  title: string
  description: string
  href: string
  ctaLabel?: string
}

const DetailQuizCta = ({
  title,
  description,
  href,
  ctaLabel = '도전하기',
}: DetailQuizCtaProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-2 rounded-2xl bg-primary-4 p-3 shadow-lg desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-3 desktop:p-5">
      <div>
        <p className="text-sm font-bold text-primary-1 desktop:text-base">
          {title}
        </p>
        <p className="mt-1 text-2xs text-primary-2 desktop:text-sm">
          {description}
        </p>
      </div>
      <LinkButton href={href} variant="primary" size="sm" showArrow>
        {ctaLabel}
      </LinkButton>
    </div>
  )
}

export default DetailQuizCta
