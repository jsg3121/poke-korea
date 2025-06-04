import Link from 'next/link'
import styled from 'styled-components'
import ImageComponent from '~/components/Image.component'
import { imageMode } from '~/module/buildMode'

interface ResultListDataProps {
  name: string
  number: number
}

const ResultListData = ({ name, number }: ResultListDataProps) => {
  return (
    <Li>
      <Link href={`/detail/${number}`}>
        <p>{name}</p>
        <ImageComponent
          height="2rem"
          width="2rem"
          alt={`pokemon_id_${number} ${name}`}
          src={`${imageMode}/${number}.webp`}
          unoptimized
        />
      </Link>
    </Li>
  )
}

export default ResultListData

const Li = styled.li`
  width: 100%;
  height: 2.75rem;

  a {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--color-black-2);

    &:visited,
    &:active {
      color: var(--color-black-2);
    }

    & > p {
      height: 2.75rem;
      font-size: 1rem;
      line-height: 2.75rem;
      color: var(--color-black-2);
    }
  }
`
