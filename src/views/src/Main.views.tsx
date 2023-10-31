import React from 'react'
import isEqual from 'fast-deep-equal'
import { ListProvider } from '~/context'
import { Header, List } from '~/container'

const MainViews: React.FC = () => {
  return (
    <ListProvider>
      <Header />
      <List />
    </ListProvider>
  )
}

export default React.memo(MainViews, isEqual)
