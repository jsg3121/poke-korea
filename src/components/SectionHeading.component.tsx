import { ReactNode } from 'react'

interface SectionHeadingProps {
  children: ReactNode
  id?: string
}

const SectionHeading = ({ children, id }: SectionHeadingProps) => {
  return (
    <h2
      id={id}
      className="min-h-9 text-2xl desktop:min-h-12 desktop:text-4xl font-bold text-primary-4 text-center"
    >
      {children}
    </h2>
  )
}

export default SectionHeading
