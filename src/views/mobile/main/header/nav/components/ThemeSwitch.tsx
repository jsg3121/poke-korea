import { useState } from 'react'
import ImageComponent from '~/components/Image.component'

type ThemeType = 'dark' | 'light'

const ThemeSwitch = () => {
  const [theme, setTheme] = useState<ThemeType>('dark')

  const handleChangeTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <>
      <button
        className="w-8 h-8 block"
        data-theme={theme}
        onClick={handleChangeTheme}
      >
        <div
          className={`w-8 h-16 transition-transform duration-300 ease-[cubic-bezier(0.47,1.64,0.41,0.8)] ${theme === 'light' ? 'rotate-180' : ''}`}
        >
          <i className="w-8 h-8 block p-[0.15rem]">
            <ImageComponent
              src="/assets/icons/icon-theme-dark.svg"
              width="1.7rem"
              height="1.7rem"
              alt="theme-dark"
            />
          </i>
          <i className="w-8 h-8 block p-[0.15rem]">
            <ImageComponent
              src="/assets/icons/icon-theme-light.svg"
              width="1.7rem"
              height="1.7rem"
              alt="theme-light"
            />
          </i>
        </div>
      </button>
    </>
  )
}

export default ThemeSwitch
