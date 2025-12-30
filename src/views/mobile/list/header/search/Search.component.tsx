'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import ImageComponent from '~/components/Image.component'
import { useHeaderScroll } from '~/hook/useHeaderScroll'
import InputComponents from './components/Input.component'
import { useEffect } from 'react'

type SearchFormType = {
  name: string | null
}

const SearchComponent = () => {
  const { observerRef, isScroll } = useHeaderScroll('mobile')
  const router = useRouter()
  const routerQuery = useSearchParams()
  const pathname = usePathname()

  const searchFormMethods = useForm<SearchFormType>({
    defaultValues: {
      name: routerQuery.get('name') ?? null,
    },
  })

  const { handleSubmit, register, setValue } = searchFormMethods

  const onSubmitSearch = (form: SearchFormType) => {
    const { name } = form
    const params = new URLSearchParams(routerQuery)

    if (name?.trim()) {
      params.set('name', name.trim())
    } else {
      params.delete('name')
    }

    router.push(`${pathname}?${params.toString()}`)

    const activeElement = document.activeElement as HTMLElement
    activeElement.blur()
  }

  useEffect(() => {
    if (routerQuery.get('name')) {
      setValue('name', routerQuery.get('name'))
    } else {
      setValue('name', null)
    }
  }, [routerQuery.get('name')])

  return (
    <div
      ref={observerRef}
      className={`w-full h-16 my-8 relative before:content-[''] before:w-full before:h-16 before:block ${
        isScroll
          ? 'fixed after:content-[""] after:w-full after:h-16 after:bg-primary-1 after:border-b after:border-primary-4 after:py-4 after:block after:fixed after:top-0 after:z-50 after:box-content'
          : ''
      }`}
    >
      <FormProvider {...searchFormMethods}>
        <form
          onSubmit={handleSubmit(onSubmitSearch)}
          className={`w-[calc(100%-3rem)] h-16 bg-white rounded-[2.5rem] flex items-center justify-between gap-4 top-0 left-1/2 -translate-x-1/2 transition-[height] duration-200 px-6 ${
            isScroll ? 'h-16 fixed top-4 z-[100]' : 'absolute'
          }`}
          role="search"
        >
          <InputComponents
            dataLabel="search-input-name"
            {...register('name')}
          />
          <button type="submit" className="w-8 h-8 flex-shrink-0 block">
            <ImageComponent
              src="/assets/image/search.svg"
              width="2rem"
              height="2rem"
              alt="포켓몬 검색"
              fetchPriority="high"
              imageSize={{
                width: 24,
                height: 24,
              }}
            />
          </button>
        </form>
      </FormProvider>
    </div>
  )
}

export default SearchComponent
