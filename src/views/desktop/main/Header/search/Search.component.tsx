'use client'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import { ListContext } from '~/context/List.context'
import InputComponents from './components/Input.component'
import ImageComponent from '~/components/Image.component'
import { useContext, useEffect } from 'react'

type SearchFormType = {
  name: string | null
}

const SearchComponent = () => {
  const { scrolling, searching } = useContext(ListContext)
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

  useEffect(() => {
    const name = router.query.name === undefined ? '' : `${router.query.name}`
    setValue('name', name)
  }, [router.query])

  return (
    <div
      className={`max-w-[41.66666667rem] h-[3.33333333rem] border border-[#dddddd] shadow-[0_3px_12px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.08)] rounded-[2.22222222rem] bg-white relative  left-1/2 -translate-x-1/2 transition-[top,width,max-width] duration-300 will-change-[top,width,max-width] hover:bg-[#ebebeb] hover:rounded-[2.22222222rem] ${
        scrolling || searching
          ? 'desktop-890:left-[80%] max-[890px]:left-[80%] w-[40%] max-w-[600px] top-0 '
          : 'top-8 w-full'
      }`}
    >
      <FormProvider {...searchFormMethods}>
        <form
          onSubmit={handleSubmit(onSubmitSearch)}
          className="w-[calc(100%-3.5rem)] h-full flex items-center justify-between"
          role="search"
        >
          <InputComponents
            hasValue={hasValue}
            dataLabel="search-input-name"
            label="포켓몬 검색"
            {...register('name')}
          />
          <button
            type="submit"
            className="w-8 h-8 absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
          >
            <ImageComponent
              src="/assets/image/search.svg"
              width="2rem"
              height="2rem"
              alt="포켓몬 검색"
            />
          </button>
        </form>
      </FormProvider>
    </div>
  )
}

export default SearchComponent
