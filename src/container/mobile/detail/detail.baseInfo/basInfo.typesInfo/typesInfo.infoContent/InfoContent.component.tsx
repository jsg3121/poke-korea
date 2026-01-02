'use client'
import { useState } from 'react'
import { UseRelationType } from '~/module/calculateRelationType'
import TypeListComponent from './components/TypeList.component'

interface InfoContentComponentProps {
  relationType: ReturnType<UseRelationType>
}

const InfoContentComponent = ({ relationType }: InfoContentComponentProps) => {
  const [activeTab, setActiveTab] = useState<'strong' | 'weak'>('strong')

  const handleClickChangeStrong = () => {
    if (activeTab !== 'strong') {
      setActiveTab('strong')
    }
  }

  const handleClickChangeWeak = () => {
    if (activeTab !== 'weak') {
      setActiveTab('weak')
    }
  }

  return (
    <article className="w-full">
      <div className="w-full h-12 bg-primary-1 rounded-2xl flex items-center gap-4 p-2">
        <button
          className={`w-[calc(50%-0.5rem)] h-8 rounded-[0.725rem] text-lg text-aligned-base text-center ${
            activeTab === 'strong'
              ? 'bg-primary-4 text-primary-1 font-bold'
              : 'text-primary-2'
          }`}
          onClick={handleClickChangeStrong}
        >
          강점
        </button>
        <button
          className={`w-[calc(50%-0.5rem)] h-8 rounded-[0.725rem] text-lg text-aligned-base text-center ${
            activeTab === 'weak'
              ? 'bg-primary-4 text-primary-1 font-bold'
              : 'text-primary-2'
          }`}
          onClick={handleClickChangeWeak}
        >
          약점
        </button>
      </div>
      <dl className="w-full h-[calc(100%-2rem)] flex flex-col gap-4 mt-6">
        {activeTab === 'strong' && (
          <>
            {relationType.half.length > 0 && (
              <TypeListComponent
                list={relationType.half}
                title="0.5배의 데미지를 받음"
                grade="good"
              />
            )}
            {relationType.quarter.length > 0 && (
              <TypeListComponent
                list={relationType.quarter}
                title="0.25배의 데미지를 받음"
                grade="better"
              />
            )}
            {relationType.zero.length > 0 && (
              <TypeListComponent
                list={relationType.zero}
                title="데미지를 받지 않음"
                grade="best"
              />
            )}
          </>
        )}
        {activeTab === 'weak' && (
          <>
            {relationType.double.length > 0 && (
              <TypeListComponent
                list={relationType.double}
                title="2배의 데미지를 받음"
                grade="warning"
              />
            )}
            {relationType.quad.length > 0 && (
              <TypeListComponent
                list={relationType.quad}
                title="4배의 데미지를 받음"
                grade="danger"
              />
            )}
          </>
        )}
      </dl>
    </article>
  )
}

export default InfoContentComponent
