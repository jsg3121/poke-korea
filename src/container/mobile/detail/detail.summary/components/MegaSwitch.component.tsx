import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import ImageComponent from '~/components/Image.component'

const Li = styled.li`
  & > .switch-mega {
    width: 8rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 0.5rem;
    border-radius: 1rem;
    background-color: var(--color-primary-4);
    opacity: 0.65;

    &:active {
      color: #333333;
      background-color: var(--color-primary-3);
    }

    &.active-mega > .icon-mega {
      filter: grayscale(0);
    }

    & > p {
      height: 2rem;
      font-size: 1rem;
      font-weight: normal;
      line-height: calc(2rem + 2px);
      color: #000000;
      flex-shrink: 0;
    }

    & > .icon-mega {
      width: 1.625rem;
      height: 1.625rem;
      flex-shrink: 0;
      display: block;
      filter: grayscale(1);
    }
  }
`

const MegaSwitchComponent = () => {
  const router = useRouter()
  const isMega = router.query.activeType === 'mega' ? true : false

  const megaHref = {
    query: {
      ...router.query,
      activeType: isMega ? 'normal' : 'mega',
    },
  }

  return (
    <Li>
      <Link
        href={megaHref}
        className={`switch-mega ${isMega ? 'active-mega' : ''}`}
        replace
      >
        <i className="icon-mega">
          <ImageComponent
            alt="메가진화 보기 스위치"
            height="1.625rem"
            width="1.625rem"
            src="/assets/icons/mega.webp"
          />
        </i>
        <p>메가진화</p>
      </Link>
    </Li>
  )
}

export default MegaSwitchComponent
