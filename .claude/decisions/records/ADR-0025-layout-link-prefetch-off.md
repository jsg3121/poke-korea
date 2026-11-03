# ADR-0025: 공통 레이아웃 메뉴 링크의 prefetch 비활성화

- **상태**: 승인
- **날짜**: 2026-11-02
- **담당**: jsg3121, Claude

## 맥락

2026년 7월부터 CloudFront 요금이 늘었다. 5~6월에는 월 $1~2였는데 7월 $8.8, 8월 $14.4, 9월 $13.8, 10월 $19.0이 됐다(10월은 api 도메인의 CloudFront 경유분 $6.3 포함, 이 부분은 11월 2일 ALB 직행으로 되돌렸다). 비용은 거의 전부 **요청 수 과금**이고, 데이터 전송 비용은 월 $0.4 수준이다.

`poke-korea.com` 배포의 액세스 로그(2026-08-07, 2026-10-28 하루치)를 분석한 결과는 다음과 같다.

| 지표                                | 값                                                   |
| ----------------------------------- | ---------------------------------------------------- |
| 전체 요청 중 RSC(`?_rsc=`) 요청     | 약 70%                                               |
| 페이지(HTML) 조회 1회당 RSC 요청    | 약 8.4건                                             |
| 오리진(EC2)까지 간 요청 중 RSC 비율 | 78%                                                  |
| 계정 전체 월 요청 수 (10월)         | 약 1,630만 건 (CloudFront 무료 한도: 월 1,000만 건) |

RSC 요청은 Next.js `<Link>`의 기본 prefetch가 만든다. Next.js 15는 화면에 들어온 링크를 미리 받아 두고, 정적 경로(ISR)는 경로 전체를 prefetch한다. 모든 페이지에 렌더링되는 공통 메뉴에는 링크가 많다.

- `MobileTabBar.component.tsx`: 링크 7개. 모바일에서 항상 화면 하단에 고정되어 있다.
- `HeaderNav.container.tsx`: 메뉴 7개와 챔피언스 드롭다운 4개. 드롭다운은 `invisible`(visibility: hidden)이라 보이지 않지만 레이아웃 공간을 차지해 prefetch 대상이 될 수 있다.

방문자 상당수는 검색으로 들어와 한두 페이지만 본다. 그런데도 들어올 때마다 메뉴 링크를 미리 받는다. 이 prefetch는 대부분 실제 이동으로 이어지지 않는다.

## 결정

**공통 레이아웃 메뉴(`MobileTabBar`, `HeaderNav`)의 모든 `<Link>`에 `prefetch={false}`를 적용한다.**

- 대상은 링크 18개다(탭바 7개, 헤더 11개).
- 페이지 본문의 링크(목록 카드, 상세 페이지 내부 링크 등)는 기본 prefetch를 유지한다.

## 근거

**비용: 의미 없는 요청을 줄인다.** CloudFront는 캐시 적중 여부와 관계없이 요청마다 과금한다. 메뉴 링크 prefetch는 페이지 조회마다 반복되고, 대부분 클릭으로 이어지지 않는다. 계정 전체가 무료 한도에 들어가면 이 배포의 월 비용은 약 $12.7에서 $2~3 수준이 된다(요청 과금은 사라지고 Origin Shield·CloudFront Functions·전송 비용이 남는다). 한도에 못 미쳐도 요청 1만 건당 약 $0.012씩 줄어든다.

**서버 부하: 오리진 요청이 줄어든다.** 캐시를 통과하지 못하고 EC2까지 간 요청의 78%가 RSC다. prefetch를 끄면 실제로 클릭한 링크의 요청만 남는다. EC2(t3.small)는 CPU 여유가 크지만(14일 평균 9%) 메모리가 최대 86%까지 올라간다. 2026-08-29에는 서버 리소스 문제로 전체 장애가 있었으므로, 오리진 요청 감소는 안정성에도 도움이 된다.

**UX: 영향이 작은 곳부터 끈다.** prefetch를 끄면 클릭 후 RSC 응답을 기다리는 시간이 생긴다. 메뉴의 목적지(`/`, `/list`, `/moves` 등)는 모든 사용자가 같은 페이지를 받아 캐시 적중률이 높고, 오리진 응답도 빠르다(ALB 기준 p50 4ms, p90 86ms). 반대로 목록 카드는 목적지가 다양해 캐시 Miss가 많으므로 대기가 체감될 가능성이 크다. 그래서 메뉴만 대상으로 한다. 처음 들어온 페이지에서 동시에 나가던 prefetch 요청이 줄어, 모바일 첫 화면 로딩에는 오히려 유리하다.

**SEO: 영향이 없다.** `<Link>`는 서버 HTML에 `<a href>`로 그대로 출력되어 크롤러의 링크 발견에는 변화가 없다. LCP·CLS는 첫 페이지 로딩에서 측정되고, INP는 클릭 후 다음 화면이 그려질 때까지를 측정하므로 데이터 도착 대기는 포함되지 않는다.

## 대안

| 대안                                                         | 장점                                                       | 단점                                                                                                                         | 불채택 사유                                                                                                         |
| ------------------------------------------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **목록 카드(`PokemonCard`, `MoveListCard`)도 prefetch 끄기** | 무한 스크롤 중 카드마다 생기는 요청까지 제거. 감소 폭이 큼 | 목적지가 다양해 캐시 Miss가 많고, `loading.tsx`가 없어 클릭 후 화면 변화 없이 기다린다. 도감 탐색이 핵심 흐름이라 체감 영향이 큼 | 비용 절감보다 핵심 탐색 경험의 저하가 더 크다                                                                      |
| **마우스 hover 때만 prefetch** (`prefetch={false}` + `router.prefetch()`) | 데스크톱에서는 체감 속도 유지                              | 모바일에는 hover가 없다. 링크마다 이벤트 처리 코드가 늘어난다                                                               | 트래픽 대부분이 모바일이라 효과가 적고 코드만 복잡해진다                                                           |
| **현재 유지**                                                | 작업 없음, 이동 속도 최상                                  | 사용자 증가에 비례해 요청 비용과 오리진 부하가 늘어난다                                                                      | 구조적으로 커지는 비용을 방치하게 된다                                                                              |
| **CloudFront 정액 요금제로 전환**                            | 요청 수와 무관한 고정 요금                                 | Free(100만 요청)·Pro(1,000만 요청)는 한도가 부족하고 커스텀 캐싱이 없다. 커스텀 캐싱은 Business($200/월)부터 지원한다       | 이 배포는 기기별 캐시 키와 CloudFront Function을 쓴다. 현재 종량제 비용(월 약 $13)보다 비싸지거나 기능을 잃는다 |

## 결과

- 메뉴를 눌렀을 때 미리 받은 데이터 없이 RSC를 요청한다. 캐시가 적중하면 짧은 대기, Miss면 오리진 응답 시간만큼 대기한다.
- `prefetch={false}`는 hover 때의 prefetch도 끈다(Next.js 15 문서).
- 적용 후 1~2주 동안 아래 지표로 효과를 확인한다.
  - CloudFront `Requests`(`E3TRB0VXGC6JWI`)와 Cost Explorer `AP-Requests-Tier2-HTTPS`: 요청·비용 감소
  - ALB `TargetResponseTime`(`poke-korea-group`), CloudWatch Agent `mem_used_percent`: 오리진 부하
  - Search Console Core Web Vitals: UX·SEO 지표 변화
- 새 공통 레이아웃 링크를 추가할 때도 같은 기준으로 `prefetch={false}`를 붙인다.

## 참고 자료

- [Next.js 15 — Link: prefetch](https://nextjs.org/docs/15/app/api-reference/components/link#prefetch)
- [Amazon CloudFront 요금](https://aws.amazon.com/cloudfront/pricing/)
- [AWS — Interpreting your CloudFront bill and usage reports](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/reports-billing.html)
- [web.dev — Interaction to Next Paint (INP)](https://web.dev/articles/inp)
- 변경 기록: `changelog/blog/1.62.3/2026-11-02-link-prefetch.md`
