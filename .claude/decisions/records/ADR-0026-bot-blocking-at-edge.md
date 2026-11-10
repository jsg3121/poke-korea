# ADR-0026: SEO와 무관한 크롤러 차단 — robots.txt + CloudFront Function UA 차단

- **상태**: 승인
- **날짜**: 2026-11-10
- **담당**: jsg3121, Claude

## 맥락

2026-11-04부터 API 서버(`poke-korea-server`)가 PM2 `max_memory_restart`(300MB)에 걸려 하루 여러 번 재시작되고, ALB의 API 5xx가 하루 0건대에서 67~447건으로, ELB 502가 13~107건에서 94~412건으로 늘었다. 재시작 중 요청이 실패하는 문제는 API 서버 저장소에서 별도로 다룬다(Apollo drain 적용). 이 ADR은 **부하 자체를 줄이는 쪽**의 결정이다.

### 부하의 구성 (CloudFront 액세스 로그 `poke-korea.com`, 2026-11-04 UTC)

- 모든 페이지가 동적 렌더링이다. 루트 레이아웃이 기기 판별을 위해 `headers()`를 호출해, 빌드 결과(`prerender-manifest.json`)의 ISR 경로가 0개다. CloudFront 캐시를 통과한 문서 요청은 매번 SSR 전체를 실행한다.
- 시간대별 회귀로 추정하면 오리진 문서 요청 1건당 API 호출은 약 7.8회다.
- 오리진까지 간 문서 요청(`manifest.webmanifest` 제외)의 약 80%가 봇이다.

| 봇 (UA 토큰)      | 오리진 문서 요청 | 사용 IP 수(10/28·11/04) | SEO·수익 관련성                |
| ----------------- | ---------------- | ----------------------- | ------------------------------ |
| `meta-webindexer` | 7,154            | 333                     | Meta AI 검색 노출              |
| `QlyzeBot`        | 6,668            | 2                       | 없음                           |
| `SemrushBot`      | 4,638            | 39                      | 없음 (SEO 분석 도구)           |
| `Baiduspider`     | 3,175            | 601                     | 한국어 서비스라 사실상 없음    |
| `ExaSearchBot`    | 2,083            | 512                     | 낮음 (AI 검색 API용 인덱스)    |

- `QlyzeBot`은 11/04 18시(KST) 한 시간 동안 IP 하나(`176.9.85.184`)에서 6,668페이지를 요청했고, 그 시간대 API 요청이 평소의 약 3배(7.4만 건)로 튀었다.

### 기존 차단 장치

`poke-korea.com` 배포의 viewer-request에 CloudFront Function `device-validator-ipblock`이 붙어 있다. 기기 판정(`x-device-type`) 전에 Bytespider를 UA로, Tencent Cloud(ACEVILLE) 대역을 IP로 차단하고 `403` + `cache-control: no-store`를 반환한다. `robots.ts`는 AI 학습용 크롤러만 `Disallow`하고 있다.

## 결정

1. **`robots.ts`에 SEO와 무관한 크롤러 4종을 `Disallow: /`로 추가한다.** 대상은 `QlyzeBot`, `SemrushBot`, `Baiduspider`, `ExaSearchBot`이다.
2. **같은 4종을 CloudFront Function `device-validator-ipblock`의 UA 차단 목록에 추가한다.** robots.txt를 지키지 않는 크롤러까지 엣지에서 막는다.
3. **차단 판정은 UA를 기본으로 하고, IP 차단은 UA를 위장하는 크롤러에만 쓴다.**
4. **`meta-webindexer`는 허용을 유지한다.** AI 검색 크롤러(`OAI-SearchBot`·`PerplexityBot` 등)를 허용하는 기존 robots 정책과 맞춘다.

다음 크롤러는 SEO·광고·링크 미리보기에 필요하므로 차단하지 않는다: Googlebot, bingbot, Yeti(네이버), Daum, Mediapartners-Google·AdsBot-Google(애드센스), facebookexternalhit·Twitterbot·kakaotalk-scrap.

## 근거

**robots.txt를 먼저 쓰는 이유: 비용 없이 크롤링 자체를 멈춘다.** robots.txt를 지키는 크롤러는 요청을 보내지 않으므로, 오리진은 물론 CloudFront 요청 과금도 생기지 않는다. Semrush는 robots.txt를 따른다고 공식 문서에 밝히고 있다. 다만 robots.txt는 크롤러가 자발적으로 지키는 규약이라(RFC 9309) 강제력이 없어 2번이 필요하다.

**엣지에서 강제하는 이유: 과부하 지점에 도달하기 전에 끊는다.** CloudFront Function은 viewer-request에서 실행되므로 차단된 요청은 ALB·EC2에 도달하지 않는다. 함수가 반환한 응답은 캐시에 저장되지 않아, 봇에게 보낸 403이 같은 경로를 요청한 사용자에게 나갈 위험도 없다. 이미 Bytespider·Tencent 대역 차단에 쓰는 함수라 새 구성 요소가 늘지 않는다.

**UA를 기본으로 하는 이유: 이번 대상은 UA로 자신을 밝히고 IP는 많다.** Baiduspider는 이틀 동안 IP 601개, ExaSearchBot은 512개를 썼다. IP 목록은 금방 낡아 계속 관리해야 하고, UA 토큰 하나는 IP가 바뀌어도 유효하다. UA를 위장하는 크롤러는 UA로 잡히지 않으므로 그때만 IP 대역을 쓴다(기존 Tencent 대역이 그 사례).

**`meta-webindexer`를 허용하는 이유: 기존 정책과의 일관성.** 이 크롤러는 Meta AI의 검색 결과용이다. 현재 robots 정책은 AI 학습 크롤러(`Meta-ExternalAgent` 등)만 막고 AI 검색 크롤러는 허용한다. 요청량은 가장 많지만, 정책을 바꾸려면 AI 검색 유입의 가치를 함께 판단해야 하므로 이번 범위에서 제외한다.

**예상 효과.** 4종이 사라지면 오리진 문서 요청이 하루 약 1.65만 건 줄고, API 호출은 약 13만 건(11/04 API 요청의 약 21%) 줄 것으로 추정한다. 회귀 계수 기반이라 실제 효과는 결과 절의 지표로 확인한다.

## 대안

| 대안                                         | 장점                                                       | 단점                                                                                                                                              | 불채택 사유                                                                     |
| -------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Next.js 미들웨어에서 차단**                | 차단 목록이 저장소에서 버전 관리된다                       | 요청이 CloudFront·ALB를 지나 과부하 상태인 EC2에 도달한 뒤 차단된다. 오리진에서는 실제 IP가 아닌 ALB IP가 보여 `X-Forwarded-For`를 파싱해야 한다. 모든 요청에 미들웨어가 실행된다. 403이 CloudFront 캐시 키(경로·기기)에 저장되면 사용자에게 노출될 수 있다 | 줄이려는 부하가 생기는 지점에서 차단하는 구조다. 기기별 캐시 오염 장애 이력(2026-05-28)도 있다 |
| **AWS WAF 요청 수 제한 규칙**                | UA를 위장한 크롤러도 요청 빈도로 막는다                    | 웹 ACL $5/월 + 규칙 $1/월 + 100만 요청당 $0.60으로, 이 배포 트래픽에서 월 약 $12                                                                 | ADR-0025로 줄인 CloudFront 비용과 맞먹는다. 위장 크롤러가 문제가 되면 재검토한다 |
| **IP 대역 목록으로 차단**                    | UA 위장과 무관하게 동작한다                                | 대상 봇이 수백 개 IP를 쓴다. 목록 관리 부담이 크고 금방 낡는다                                                                                  | UA로 식별되는 크롤러에는 과하다. 위장 크롤러에만 쓴다                           |
| **robots.txt만 추가**                        | 코드 한 곳, 비용 없음                                      | 강제력이 없다. 지키지 않는 크롤러는 그대로 남는다                                                                                                | 단독으로는 효과를 보장하지 못해 엣지 차단과 함께 쓴다                           |
| **`meta-webindexer`까지 차단**               | API 호출이 하루 약 5.6만 건 더 준다                        | Meta AI 검색 노출을 포기한다                                                                                                                      | AI 검색 크롤러 허용 정책과 충돌한다. 정책 재검토 때 다시 판단한다               |

## 결과

- robots.txt를 지키는 크롤러는 크롤링을 멈추고, 지키지 않는 크롤러는 엣지에서 `403`을 받는다.
- CloudFront Function은 저장소 밖(AWS 콘솔)에서 관리된다. 함수를 바꾸면 이 ADR의 결정 2와 일치하는지 함께 확인한다.
- 적용 후 1~2주 동안 아래 지표로 효과를 확인한다.
  - CloudFront 액세스 로그: 대상 UA의 요청 수와 상태 코드(`403` 비율)
  - ALB `api-connect` 대상 그룹 `RequestCount`, `HTTPCode_Target_5XX_Count`
  - API 서버 PM2 로그의 `max-memory-restart` 재시작 횟수
- 남는 과제(별도 결정):
  - prefetch 조정은 **보류**했다(2026-11-10). 의도 기반 prefetch(`FULL`)는 누르지 않은 링크에도 SSR 전체를 실행한다. 11/04 기준 사람 RSC 요청은 GA4 사이트 내 이동 1회당 약 4.1건이라, 약 70~75%가 버려지는 prefetch로 추정된다. 그러나 prefetch를 끄면 줄어드는 양이 API 호출 약 7만 건/일(약 11%), CloudFront 비용 월 약 $2에 그친다. 그에 비해 이동 직후 바로 화면이 뜨는 체감 속도를 잃는다. 백엔드 캐시 상한 수정과 이 ADR의 봇 차단을 적용한 뒤에도 부하가 문제일 때 ADR-0025 개정으로 다시 검토한다.
  - 모든 페이지가 동적 렌더링인 구조(루트 레이아웃 `headers()`)는 렌더링 전략 재검토(ADR-0006·0007 관련)로 다룬다.

## 참고 자료

- [RFC 9309 — Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309)
- [Next.js — robots.txt (Metadata Files)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js — headers (Dynamic API)](https://nextjs.org/docs/app/api-reference/functions/headers)
- [Amazon CloudFront — CloudFront Functions 소개](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html)
- [Amazon CloudFront — CloudFront Functions 이벤트 구조 (`viewer.ip`)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-event-structure.html)
- [Amazon CloudFront — 오리진 오류 응답의 캐싱](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/HTTPStatusCodes.html)
- [AWS WAF 요금](https://aws.amazon.com/waf/pricing/)
- [Semrush — SemrushBot](https://www.semrush.com/bot/)
- [Google — Google 크롤러 목록](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)
- [네이버 서치어드바이저 — robots.txt 설정](https://searchadvisor.naver.com/guide/seo-basic-robots)
- 관련 기록: `.claude/specs/incidents/2026-05-28-device-cache-pollution.md`, ADR-0025
