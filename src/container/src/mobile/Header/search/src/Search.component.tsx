import { useRouter } from 'next/router'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { Image } from '~/components'
import { SearchInputName } from '../components'

const Search = styled.div`
  width: 80%;
  height: 3.5rem;
  margin: 0 auto;

  & > .form__search--name {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #ffffff;
    border-radius: 1.5rem;
    padding: 0;

    & > .search__button--icon {
      width: 2rem;
      height: 2rem;
      right: 1rem;
      top: 0.75rem;
      position: absolute;
    }
  }
`

type SearchFormType = {
  name: string | null
}

const SearchComponent: React.FC = () => {
  const router = useRouter()

  const searchFormMethods = useForm<SearchFormType>({
    defaultValues: {
      name: (router.query.name as string) ?? null,
    },
  })

  const { handleSubmit, register, setValue } = searchFormMethods

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

  React.useEffect(() => {
    const name = router.query.name === undefined ? '' : `${router.query.name}`
    setValue('name', name)
  }, [router.query])

  return (
    <Search>
      <FormProvider {...searchFormMethods}>
        <form
          onSubmit={handleSubmit(onSubmitSearch)}
          className="form__search--name"
          role="search"
        >
          <SearchInputName
            dataLabel="search-input-name"
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
