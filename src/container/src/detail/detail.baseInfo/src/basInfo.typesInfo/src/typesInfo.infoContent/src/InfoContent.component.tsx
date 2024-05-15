import { FC, useState } from 'react'
import styled from 'styled-components'
import { UseRelationType } from '~/hook'
import { TypeList } from './components'

interface IFProps {
  relationType: ReturnType<UseRelationType>
}

const InfoContentComponent: FC<IFProps> = (props) => {
  const { relationType } = props
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
    <Article>
      <div className="type-tabs">
        <button
          data-active={activeTab === 'strong' ? 'active' : ''}
          onClick={handleClickChangeStrong}
        >
          강점
        </button>
        <button
          data-active={activeTab === 'weak' ? 'active' : ''}
          onClick={handleClickChangeWeak}
        >
          약점
        </button>
      </div>
      <div className="info-description">
        {activeTab === 'strong' && (
          <>
            {relationType.half.length > 0 && (
              <TypeList
                list={relationType.half}
                title="0.5배의 데미지를 받음"
                grade="good"
              />
            )}
            {relationType.quarter.length > 0 && (
              <TypeList
                list={relationType.quarter}
                title="0.25배의 데미지를 받음"
                grade="better"
              />
            )}
            {relationType.zero.length > 0 && (
              <TypeList
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
              <TypeList
                list={relationType.double}
                title="2배의 데미지를 받음"
                grade="warning"
              />
            )}
            {relationType.quad.length > 0 && (
              <TypeList
                list={relationType.quad}
                title="4배의 데미지를 받음"
                grade="danger"
              />
            )}
          </>
        )}
      </div>
    </Article>
  )
}

export default InfoContentComponent

const Article = styled.article`
  width: 100%;
  height: calc(100% - 3rem);
  margin-top: 1rem;

  & > .type-tabs {
    width: 100%;
    height: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    & > button {
      width: calc(50% - 0.5rem);
      height: 100%;
      font-size: 1.125rem;
      line-height: 1.5rem;
      color: var(--color-primary-2);
      text-align: center;

      &[data-active='active'] {
        color: var(--color-primary-1);
        font-weight: 700;
      }
    }
  }

  & > .info-description {
    width: 100%;
    height: calc(100% - 2rem);
    display: flex;
    flex-direction: column;
    margin-top: 0.5rem;
  }
`
