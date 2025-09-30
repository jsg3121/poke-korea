'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import ImageComponent from '~/components/Image.component'
import InputComponents from './components/Input.component'

type SearchFormType = {
  name: string | null
}

const MainSearch = () => {
  const router = useRouter()
  const routerQuery = useSearchParams()
  const pathname = usePathname()

  const searchFormMethods = useForm<SearchFormType>({
    defaultValues: {
      name: routerQuery.get('name') ?? null,
    },
  })

  const { handleSubmit, register, setValue, watch } = searchFormMethods

  const onSubmitSearch = (form: SearchFormType) => {
    const { name } = form
    const params = new URLSearchParams(routerQuery)

    if (name?.trim()) {
      params.set('name', name.trim())
    } else {
      params.delete('name')
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const name = watch('name') || ''
  const hasValue = name.length > 0

  useEffect(() => {
    if (routerQuery.get('name')) {
      setValue('name', routerQuery.get('name'))
    } else {
      setValue('name', null)
    }
  }, [routerQuery.get('name')])

  return (
    <div
      className={`w-[30rem] h-12 absolute left-1/2 -translate-x-1/2 top-0 rounded-[2rem] bg-white`}
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
              fetchPriority="high"
              imageSize={{
                width: 32,
                height: 32,
              }}
            />
          </button>
        </form>
      </FormProvider>
    </div>
  )
}

export default MainSearch
