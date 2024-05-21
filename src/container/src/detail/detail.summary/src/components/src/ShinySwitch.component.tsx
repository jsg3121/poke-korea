import React, { FC } from 'react'
import styled from 'styled-components'
import ShinyIcon from '~/assets/icons/sparkle.svg'

interface IFProps {
  onChangeShiny: () => void
}

const ShinySwitchComponent: FC<IFProps> = (props) => {
  const { onChangeShiny } = props
  const handleClickShiny = () => {
    onChangeShiny()
  }

  return (
    <StyledWrapper role="button">
      <input type="checkbox" id="swtich-change-shiny" />
      <label htmlFor="swtich-change-shiny" onClick={handleClickShiny}>
        <i className="icon-shiny">
          <ShinyIcon />
        </i>
        <p>이로치</p>
      </label>
    </StyledWrapper>
  )
}

export default ShinySwitchComponent

const StyledWrapper = styled.div`
  position: absolute;
  top: 1rem;
  left: -2.75rem;
  z-index: -1;
  transition: left 0.2s ease-out;

  &:hover {
    left: -6.5rem;
  }

  & > input {
    display: none;

    &:checked + label > .icon-shiny > svg {
      fill: #f5b62e;
    }
  }

  & > label {
    width: 7rem;
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
