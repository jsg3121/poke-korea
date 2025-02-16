import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import ImageComponent from '~/components/Image.component'

const MegaSwitch = () => {
  const router = useRouter()
  const isMega = router.query.activeType === 'mega' ? true : false

  const megaHref = {
    query: {
      ...router.query,
      activeType: isMega ? 'normal' : 'mega',
    },
  }

  return (
    <Li className={isMega ? 'active-mega' : ''}>
      <Link
        href={megaHref}
        className="switch-mega"
        aria-label="메가진화 모습 변환 스위치"
        replace
      >
        <i className="icon-mega" aria-hidden>
          <ImageComponent
            alt="메가진화 보기"
            height="1.625rem"
            width="1.625rem"
            src="/assets/icons/mega.webp"
          />
        </i>
        <span>메가진화</span>
      </Link>
    </Li>
  )
}

export default MegaSwitch

const Li = styled.li`
  position: relative;
  left: -2.75rem;
  transition: left 0.2s ease-out;

  &:hover {
    left: -7rem;
  }

  &.active-mega {
    left: -7rem;

    & > .switch-mega {
      & > span {
        color: #333333;
      }

      & > .icon-mega {
        filter: grayscale(0);
      }
    }
  }

  & > .switch-mega {
    width: 8rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0 1rem 0 0.5rem;
    border-top-left-radius: 9999px;
    border-bottom-left-radius: 9999px;
    background-color: var(--color-primary-4);
    cursor: pointer;

    &:active {
      color: #333333;
      background-color: var(--color-primary-3);
    }

    & > span {
      height: 2rem;
      font-size: 1rem;
      font-weight: normal;
      line-height: calc(2rem + 2px);
      color: #888888;
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
