import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { Image } from '~/components'
import { ListContext } from '~/context'
import { Input } from '../components'
import { FormProvider, useForm } from 'react-hook-form'

const Search = styled.div`
  width: 100%;
  max-width: 41.66666667rem;
  height: 3.33333333rem;
  border: 1px solid #dddddd;
  box-shadow:
    0 3px 12px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.08);
  border-radius: 2.22222222rem;
  background-color: #ffffff;
  position: relative;
  top: 3.33333333rem;
  left: 50%;
  transform: translateX(-50%);
  transition:
    top 0.3s,
    width 0.3s,
    max-width 0.3s;
  will-change: top, width, max-width;

  &[data-scrolling='true'],
  &[data-searching='has-query'] {
    width: 40%;
    max-width: 600px;
    top: -3.33333333rem;

    @media screen and (max-width: 890px) {
      left: 80%;
    }
  }

  &:hover {
    background-color: #ebebeb;
    border-radius: 2.22222222rem;
  }

  .search__input {
    width: calc(100% - 3.5rem);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .search__button--icon {
    width: 2rem;
    height: 2rem;
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translate(0, -50%);
    cursor: pointer;
  }
`

type SearchFormType = {
  name: string | null
}

const SearchComponent: React.FC = () => {
  const { scrolling, searching } = React.useContext(ListContext)
  const router = useRouter()

  const searchFormMethods = useForm<SearchFormType>({
    defaultValues: {
      name: (router.query.name as string) ?? null,
    },
  })

  const { handleSubmit, register, setValue, watch } = searchFormMethods

  const onSubmitSearch = (form: SearchFormType) => {
    const { name } = form
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...(name && { name: name.trim() }),
      },
    })
  }

  const name = watch('name') || ''
  const hasValue = name.length > 0

  React.useEffect(() => {
    const name = router.query.name === undefined ? '' : `${router.query.name}`
    setValue('name', name)
  }, [router.query])

  return (
    <Search
      data-scrolling={scrolling}
      data-searching={searching ? 'has-query' : ''}
    >
      <FormProvider {...searchFormMethods}>
        <form
          onSubmit={handleSubmit(onSubmitSearch)}
          className="search__input"
          role="search"
        >
          <Input
            hasValue={hasValue}
            dataLabel="search-input-name"
            label="포켓몬 검색"
            {...register('name')}
          />
          <button type="submit" className="search__button--icon">
            <Image
              src="/assets/image/search.svg"
              width="2rem"
              height="2rem"
              alt="포켓몬 검색"
            />
          </button>
        </form>
      </FormProvider>
    </Search>
  )
}

export default SearchComponent
