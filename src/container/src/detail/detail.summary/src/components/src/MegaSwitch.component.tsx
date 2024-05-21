import { useRouter } from 'next/router'
import React, { FC } from 'react'
import styled from 'styled-components'
import { Image } from '~/components'

interface IFProps {}

const MegaSwitchComponent: FC<IFProps> = () => {
  const router = useRouter()

  const defaultChecked = router.query.activeType === 'mega' ? true : false

  const handleChangeMega = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    const { query } = router

    router.push(
      {
        query: {
          ...query,
          activeType: checked ? 'mega' : 'normal',
        },
      },
      undefined,
      {
        scroll: false,
      },
    )
  }

  return (
    <StyledWrapper role="button">
      <input
        type="checkbox"
        id="swtich-change-mega"
        defaultChecked={defaultChecked}
        onChange={handleChangeMega}
      />
      <label htmlFor="swtich-change-mega">
        <i className="icon-mega">
          <Image
            alt="메가진화 보기 스위치"
            height="1.625rem"
            width="1.625rem"
            src="/assets/icons/mega.webp"
          />
        </i>
        <p>메가진화</p>
      </label>
    </StyledWrapper>
  )
}

export default MegaSwitchComponent

const StyledWrapper = styled.div`
  position: absolute;
  top: 3.5rem;
  left: -2.75rem;
  z-index: -1;
  transition: left 0.2s ease-out;

  &:hover {
    left: -7rem;
  }

  & > input {
    display: none;

    &:checked + label > .icon-mega {
      filter: grayscale(0);
    }
  }

  & > label {
    width: 8rem;
    height: 2rem;
    font-size: 1rem;
    font-weight: normal;
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
      background-color: var(--color-primary-3);
    }

    & > p {
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
