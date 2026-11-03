# ADR-0025: 링크 prefetch 방식 — 모든 내부 링크를 의도 기반 prefetch(`IntentLink`)로 통일

- **상태**: 승인
- **날짜**: 2026-11-02 (2026-11-03 2차 개정)
- **담당**: jsg3121, Claude

## 맥락

2026년 7월부터 CloudFront 요금이 늘었다. 5~6월에는 월 $1~2였는데 7월 $8.8, 8월 $14.4, 9월 $13.8, 10월 $19.0이 됐다(10월은 api 도메인의 CloudFront 경유분 $6.3 포함, 이 부분은 11월 2일 ALB 직행으로 되돌렸다). 비용은 거의 전부 **요청 수 과금**이고, 데이터 전송 비용은 월 $0.4 수준이다.

RSC 요청은 Next.js `<Link>`의 기본 prefetch가 만든다. Next.js 15는 화면에 들어온 링크를 미리 받아 두고, 정적 경로(ISR)는 경로 전체를 prefetch한다.

### RSC 요청의 목적지 (2026-10-27~11-02, `poke-korea.com` 전체 요청 3,209,017건)

전체 요청 중 RSC가 2,236,676건(**69.7%**)이었다.

| 목적지                                   | RSC 요청 | 전체 요청 대비 | 1차 개정까지의 처리     |
| ---------------------------------------- | -------- | -------------- | ----------------------- |
| `/detail/{n}` (포켓몬 상세)              | 886,995  | 27.6%          | 포켓몬 카드 의도 기반   |
| `/moves/…` (기술 상세)                   | 340,676  | 10.6%          | 없음                    |
| `/detail/{n}/…` (상세 하위 탭)           | 263,002  | 8.2%           | 없음                    |
| 메뉴 목적지 7곳                          | 242,870  | 7.6%           | 메뉴 prefetch 끔        |
| `/champions/…`                           | 198,734  | 6.2%           | 없음                    |
| `/type-effectiveness/{type}`             | 166,866  | 5.2%           | 타입 링크 prefetch 끔   |
| `/ability/{n}`                           | 79,866   | 2.5%           | 없음                    |
| `/quiz/…`, `/privacy`                    | 57,667   | 1.8%           | 없음                    |

1차 개정까지 손댄 범위는 전체 요청의 약 40%였다. 나머지 약 29%는 기술 상세, 상세 하위 탭, 챔피언스처럼 **트래픽 상위권을 유지하는 페이지**로 가는 링크였다.

## 결정

**모든 내부 링크를 `IntentLink`로 만든다.** `IntentLink`(`src/components/link/IntentLink.component.tsx`)는 `next/link`를 감싸 `prefetch={false}`로 두고, 터치 시작(`onTouchStart`)·마우스 올림(`onMouseEnter`)·키보드 포커스(`onFocus`) 때 `router.prefetch(href)`를 호출한다.

- `next/link`를 직접 import하는 58개 파일을 모두 `IntentLink`로 바꾼다. 1차 개정까지 `prefetch={false}`로 끈 메뉴·타입 링크도 포함한다.
- ESLint `no-restricted-imports`로 `next/link` 직접 import를 막는다(`IntentLink` 파일만 예외). 규칙은 `coding.md` "링크" 절에 둔다.

## 근거

**비용: 누르지 않은 링크의 요청을 없앤다.** CloudFront는 캐시 적중 여부와 관계없이 요청마다 과금한다. 의도 기반 prefetch는 사용자가 누르려 한 링크만 받으므로, RSC 요청의 대부분을 차지하던 "보이기만 한 링크"의 prefetch가 사라진다. 계정 전체가 무료 한도(월 1,000만 건)에 들어가면 이 배포의 월 비용은 약 $12.7에서 $2~3 수준이 된다.

**서버 부하: 오리진 요청이 줄어든다.** 2026-10-28 표본에서 캐시를 통과하지 못하고 EC2까지 간 요청의 78%가 RSC였다. EC2(t3.small)는 메모리가 최대 86%까지 올라가고, 2026-08-29에는 서버 리소스 문제로 전체 장애가 있었다.

**UX: 실제 진입은 의도 시점의 prefetch로 대응한다.** 기술 상세·상세 하위 탭·챔피언스는 실제 이동이 많은 동선이다. prefetch를 완전히 끄면 클릭 후 화면 변화 없이 기다리게 된다(`loading.tsx` 없음). 의도 기반 prefetch는 터치 시작부터 클릭 확정까지, 데스크톱은 마우스를 올린 순간부터 미리 받기 시작해 대기를 줄인다. 같은 경로를 여러 번 호출해도 라우터 캐시가 중복 요청을 막는다.

**일관성: 링크 방식을 하나로 고정한다.** 1차 개정처럼 링크 성격마다 "끄기 / 의도 기반 / 기본"을 나누면, 새 링크를 만들 때마다 어느 쪽인지 판단해야 하고 빠뜨리기 쉽다. 컴포넌트 하나로 모으고 린트로 강제하면 판단이 필요 없다.

**SEO: 영향이 없다.** `IntentLink`도 서버 HTML에 `<a href>`로 그대로 출력되어 크롤러의 링크 발견에는 변화가 없다. LCP·CLS는 첫 페이지 로딩에서 측정되고, INP는 클릭 후 다음 화면이 그려질 때까지를 측정하므로 데이터 도착 대기는 포함되지 않는다.

## 대안

| 대안                                                         | 장점                                                        | 단점                                                                                                 | 불채택 사유                                                                                                         |
| ------------------------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **링크 성격별 세 갈래 유지** (1차 개정: 메뉴·타입은 끄고 카드만 의도 기반) | 메뉴·타입 링크의 요청이 가장 적음                           | 링크마다 방식을 판단해야 하고, 남은 29%(기술·상세 탭·챔피언스)가 그대로 남는다                        | 트래픽 상위 동선의 요청이 줄지 않고, 규칙이 복잡해진다                                                             |
| **모든 링크 prefetch 끄기**                                  | 요청이 가장 적고 코드가 가장 단순                           | `loading.tsx`가 없어 모든 이동에서 클릭 후 화면 변화 없이 기다린다                                    | 실제 진입이 많은 동선의 체감 속도가 떨어진다                                                                       |
| **마우스 hover 때만 prefetch** (터치 제외)                   | 데스크톱 체감 속도 유지                                     | 모바일에는 hover가 없다                                                                              | 트래픽 대부분이 모바일이다. `onTouchStart`를 함께 쓰는 방식으로 보완해 채택안에 흡수했다                           |
| **현재(기본 prefetch) 유지**                                 | 작업 없음, 이동 속도 최상                                   | 사용자 증가에 비례해 요청 비용과 오리진 부하가 늘어난다                                              | 구조적으로 커지는 비용을 방치하게 된다                                                                              |
| **CloudFront 정액 요금제로 전환**                            | 요청 수와 무관한 고정 요금                                  | Free(100만 요청)·Pro(1,000만 요청)는 한도가 부족하고 커스텀 캐싱이 없다. 커스텀 캐싱은 Business($200/월)부터 | 이 배포는 기기별 캐시 키와 CloudFront Function을 쓴다. 현재 종량제 비용(월 약 $13)보다 비싸지거나 기능을 잃는다 |

## 결과

- 모든 내부 링크는 누르려 할 때(터치·hover·포커스) prefetch한다. 스크롤로 지나친 링크는 요청하지 않는다.
- 모바일에서 링크 위에 손가락을 대고 스크롤을 시작해도 `touchstart`가 발생하므로, 일부 prefetch는 남는다.
- 캐시가 없는 페이지로 이동할 때는 짧은 대기가 생길 수 있다. 체감 문제가 확인되면 `useLinkStatus`로 로딩 표시를 추가한다.
- `IntentLink`가 `next/navigation`의 `useRouter`를 쓰므로 Storybook은 `.storybook/preview.tsx`에서 `nextjs.appDirectory: true`를 전역으로 켠다.
- 적용 후 1~2주 동안 아래 지표로 효과를 확인한다.
  - CloudFront `Requests`(`E3TRB0VXGC6JWI`)와 Cost Explorer `AP-Requests-Tier2-HTTPS`: 요청·비용 감소
  - ALB `TargetResponseTime`(`poke-korea-group`), CloudWatch Agent `mem_used_percent`: 오리진 부하
  - Search Console Core Web Vitals: UX·SEO 지표 변화

## 변경 이력

| 날짜       | 내용                                                                                                                                                                                                                                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-11-02 | 최초 작성(1.62.3). 공통 메뉴 링크 prefetch 끄기만 결정했고, "목록 카드 prefetch 끄기"와 "hover 때만 prefetch"는 불채택 대안이었다.                                                                                                                                                                                                                                   |
| 2026-11-03 | 1차 개정(1.62.4). 목적지별 RSC 집계로 판단 근거를 바로잡았다. 최초 작성 때는 코드 구조만 보고 메뉴를 가장 큰 발생원으로 추정했지만, 실측 결과 메뉴 목적지는 전체 요청의 약 6%였고 포켓몬 카드(31%)와 타입 상세 링크(5%)가 더 컸다. 포켓몬 카드에 의도 기반 prefetch, 타입 상세 링크에 prefetch 끄기를 추가했다.                                                  |
| 2026-11-03 | 2차 개정(1.62.5). 7일 집계에서 1차 개정 범위 밖의 RSC가 전체의 약 29%(기술 상세·상세 하위 탭·챔피언스 등 트래픽 상위 동선)로 확인됐다. 실제 진입이 많은 동선은 의도 기반 prefetch로 대응하기로 하고, 링크 방식을 `IntentLink` 하나로 통일했다. 1차 개정의 "링크 성격별 세 갈래"는 불채택 대안으로 옮겼다.                                                       |

## 참고 자료

- [Next.js 15 — Link: prefetch](https://nextjs.org/docs/15/app/api-reference/components/link#prefetch)
- [Next.js 15 — useRouter: router.prefetch](https://nextjs.org/docs/15/app/api-reference/functions/use-router)
- [Storybook — Next.js framework: next/navigation](https://storybook.js.org/docs/get-started/frameworks/nextjs)
- [ESLint — no-restricted-imports](https://eslint.org/docs/latest/rules/no-restricted-imports)
- [Amazon CloudFront 요금](https://aws.amazon.com/cloudfront/pricing/)
- [AWS — Interpreting your CloudFront bill and usage reports](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/reports-billing.html)
- [web.dev — Interaction to Next Paint (INP)](https://web.dev/articles/inp)
- 변경 기록: `changelog/blog/1.62.3/2026-11-02-link-prefetch.md`, `changelog/blog/1.62.4/2026-11-03-content-link-prefetch.md`, `changelog/blog/1.62.5/2026-11-03-intent-link.md`
