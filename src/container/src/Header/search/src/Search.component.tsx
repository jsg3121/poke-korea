import isEqual from 'fast-deep-equal'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { Input } from '~/components'
import { ListContext } from '~/context'

const Search = styled.div`
  min-width: 50%;
  max-width: 960px;
  height: 3.33333333rem;
  border: 1px solid #dddddd;
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.08);
  border-radius: 2.22222222rem;
  background-color: #ffffff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  overflow: hidden;

  &:hover {
    background-color: #ebebeb;
    border-radius: 2.22222222rem;
  }
`

const SearchComponent: React.FC = () => {
  const router = useRouter()
  const handleInputChange = React.useCallback(
    (value: string) => {
      router.push(`${router.pathname}?name=${value}`)
    },
    [router]
  )

  return (
    <Search>
      <Input
        dataLabel="search-input-name"
        type="text"
        label="포켓몬"
        placeholder="포켓몬 검색"
        onChange={handleInputChange}
      />
    </Search>
  )
}

export default React.memo(SearchComponent, isEqual)
