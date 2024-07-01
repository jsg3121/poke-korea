import { useRouter } from 'next/router'
import React, { FC } from 'react'
import styled from 'styled-components'
import ShinyIcon from '~/assets/icons/sparkle.svg'

const Li = styled.li`
  & > input {
    display: none;

    &:checked + label {
      opacity: 1;

      & > .icon-shiny > svg {
        fill: #f5b62e;
      }
    }
  }

  & > label {
    width: 6.5rem;
    height: 2rem;
    font-size: 1rem;
    font-weight: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;
    border-radius: 1rem;
    background-color: var(--color-primary-4);
    opacity: 0.65;

    &:active {
      background-color: var(--color-primary-3);
    }

    & > p {
      flex-shrink: 0;
      color: #000000;
      padding: 0 0.25rem;
    }

    & > .icon-shiny {
      width: 2rem;
      height: 2rem;
      flex-shrink: 0;
      display: block;

      svg {
        fill: transparent;
      }
    }
  }
`

const ShinySwitchComponent: FC = () => {
  const router = useRouter()

  const defaultChecked = router.query.shinyMode === 'shiny' ? true : false

  const handleChangeShiny = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    const { query } = router

    router.replace(
      {
        query: {
          ...query,
          shinyMode: checked ? 'shiny' : 'normal',
        },
      },
      undefined,
      {
        scroll: false,
      },
    )
  }

  return (
    <Li role="button">
      <input
        type="checkbox"
        id="swtich-change-shiny"
        checked={defaultChecked}
        onChange={handleChangeShiny}
      />
      <label htmlFor="swtich-change-shiny">
        <i className="icon-shiny">
          <ShinyIcon />
        </i>
        <p>이로치</p>
      </label>
    </Li>
  )
}

export default ShinySwitchComponent
