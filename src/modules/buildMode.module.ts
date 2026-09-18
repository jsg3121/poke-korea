export const GqlMode =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/graphql'
    : 'https://api.poke-korea.com/graphql'

export const imageMode = 'https://image-cdn.poke-korea.com'
