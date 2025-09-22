type TextSizeType = (text: string) => 'small' | 'normal'

export const getTextSize: TextSizeType = (text) => {
  const answerTextSize = text.length > 5 ? 'small' : 'normal'

  return answerTextSize
}
