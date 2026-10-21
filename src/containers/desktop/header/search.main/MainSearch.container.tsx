'use client'

import { ChangeEvent } from 'react'

import { useSearchParamInput } from '~/hooks/useSearchParamInput'
import Image from '~/components/Image.component'

import InputComponents from './components/Input.component'

const MainSearch = () => {
  const { keyword, updateKeyword } = useSearchParamInput('name')
  const hasValue = keyword !== ''

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    updateKeyword(e.target.value)
  }

  return (
    <div className="w-[30rem] h-12 absolute right-1/2 translate-x-1/2 top-0 rounded-[2rem] bg-white">
      <div className="w-[calc(100%-3.5rem)] h-full flex-between" role="search">
        <InputComponents
          hasValue={hasValue}
          dataLabel="search-input-name"
          label="포켓몬 검색"
          name="name"
          autoComplete="off"
          value={keyword}
          onChange={handleChangeKeyword}
        />
        <span
          aria-hidden="true"
          className="w-8 h-8 absolute top-1/2 right-4 -translate-y-1/2"
        >
          <Image
            src="/assets/image/search.svg"
            width="2rem"
            height="2rem"
            alt=""
            fetchPriority="high"
            imageSize={{
              width: 32,
              height: 32,
            }}
          />
        </span>
      </div>
    </div>
  )
}

export default MainSearch
