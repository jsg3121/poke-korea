export const toBooleanOrUndefined = (
  value: string | undefined,
): boolean | undefined => {
  return value === 'true' ? true : value === 'false' ? false : undefined
}

export const changeTypeArrayToString = (type: string | undefined): string[] => {
  return type ? type.split(',') : []
}
