export const GqlMode =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.49.91:4000/graphql'
    : 'http://localhost:4000/graphql'

export const imageMode =
  process.env.NODE_ENV === 'production'
    ? 'http://43.201.49.91:4000/image'
    : 'http://localhost:4000/image'
