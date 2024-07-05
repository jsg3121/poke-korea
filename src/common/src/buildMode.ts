export const GqlMode =
  process.env.NODE_ENV === 'production'
    ? 'http://127.0.0.1:4000/graphql'
    : 'http://localhost:4000/graphql'

export const imageMode =
  process.env.NODE_ENV === 'production'
    ? 'http://43.202.59.139:4000/image'
    : 'http://localhost:4000/image'
