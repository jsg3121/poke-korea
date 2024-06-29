import { useRouter } from 'next/router'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { Image } from '~/components'
import { SearchInputName } from '../components'
import { useHeaderScroll } from '~/hook/src/useHeaderScroll'

type SearchFormType = {
  name: string | null
}

const Search = styled.div`
  width: 100%;
  height: 5rem;
  margin: 2.5rem auto;
  position: relative;

  &::before {
    content: '';
    width: 100%;
    height: 5rem;
    display: block;
  }

  & > .form__search--name {
    width: calc(100% - 3rem);
    height: 5rem;
    background-color: #ffffff;
    border-radius: 2.5rem;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    transition:
      width 0.2s,
      border-radius 0.2s;

    &[data-is-scroll='scroll'] {
      width: 100%;
      border-radius: 0;
      position: fixed;
      top: 0;
      z-index: 100;
    }

    & > .scroll-search-warpper {
      width: 100%;
      height: 5rem;
      position: absolute;
    }

    & > .search__button--icon {
      width: 2rem;
      height: 2rem;
      right: 1.5rem;
      top: 1.5rem;
      position: absolute;
    }
  }
`

const SearchComponent: React.FC = () => {
  const { observerRef, isScroll } = useHeaderScroll('mobile')

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
    <Search ref={observerRef}>
      <FormProvider {...searchFormMethods}>
        <form
          onSubmit={handleSubmit(onSubmitSearch)}
          className="form__search--name"
          data-is-scroll={isScroll ? 'scroll' : ''}
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
