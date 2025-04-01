export const SHINY_QNA_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '이로치 포켓몬이란 무엇인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '이로치 포켓몬은 일반 포켓몬과 색상만 다른 희귀한 포켓몬을 의미합니다. 색상이 다르다는 점 외에는 능력치와 성능이 일반 포켓몬과 완전히 동일하며, 진화해도 이로치의 색상을 유지합니다.',
      },
    },
    {
      '@type': 'Question',
      name: '이로치 포켓몬의 출현 확률은 얼마나 되나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '이로치 포켓몬의 기본 출현 확률은 초기 세대(2~5세대)는 약 1/8192이며, 6세대 이후부터는 약 1/4096으로 높아졌습니다. 추가로 국제 교배, 빛나는 부적 등의 방법을 사용하면 확률을 더 높일 수 있습니다.',
      },
    },
  ],
}
