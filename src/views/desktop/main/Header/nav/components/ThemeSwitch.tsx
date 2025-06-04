import { useState } from 'react'
import styled from 'styled-components'
import ImageComponent from '~/components/Image.component'

type ThemeType = 'dark' | 'light'

const Switch = styled.button`
  width: 2rem;
  height: 2rem;
  display: block;

  &[data-theme='light'] {
    & > div {
      transform: rotate(180deg);
    }
  }

  & > div {
    width: 2rem;
    height: 4rem;
    transition: transform 0.3s cubic-bezier(0.47, 1.64, 0.41, 0.8);

    & > i {
      width: 2rem;
      height: 2rem;
      display: block;
      padding: 0.15rem;
    }
  }
`

const ThemeSwitch = () => {
  const [theme, setTheme] = useState<ThemeType>('dark')

  const handleChangeTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <>
      <Switch data-theme={theme} onClick={handleChangeTheme}>
        <div>
          <i>
            <ImageComponent
              src="/assets/icons/icon-theme-dark.svg"
              width="1.7rem"
              height="1.7rem"
              alt="theme-dark"
            />
          </i>
          <i>
            <ImageComponent
              src="/assets/icons/icon-theme-light.svg"
              width="1.7rem"
              height="1.7rem"
              alt="theme-light"
            />
          </i>
        </div>
      </Switch>
    </>
  )
}

export default ThemeSwitch
