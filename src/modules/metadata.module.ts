export const getRobotsConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production'

  return isProduction
    ? {
        index: true,
        follow: true,
        'max-image-preview': 'large' as const,
      }
    : {
        index: false,
        follow: false,
      }
}
