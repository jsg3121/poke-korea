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

  &[data-is-scroll='scroll'] {
    &::after {
      content: '';
      width: 100%;
      height: 4rem;
      background-color: var(--color-primary-1);
      border-bottom: 1px solid var(--color-primary-4);
      padding: 1rem 0;
      display: block;
      position: fixed;
      top: 0;
      z-index: 10;
    }

    & > .form__search--name {
      height: 4rem;
      position: fixed;
      top: 1rem;
      z-index: 100;

      & > .search__button--icon {
      }
    }
  }

  & > .form__search--name {
    width: calc(100% - 3rem);
    height: 5rem;
    background-color: #ffffff;
    border-radius: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    transition: height 0.2s;
    padding: 0 1.5rem;

    & > .search__button--icon {
      width: 2rem;
      height: 2rem;
      flex-shrink: 0;
      display: block;
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
    <Search ref={observerRef} data-is-scroll={isScroll ? 'scroll' : ''}>
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
