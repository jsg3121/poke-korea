# [Incident] PC 환경에서 모바일 화면이 노출되는 CDN 캐시 오염 이슈

> **발생일**: 2026-05-28 (간헐적 발생, 1.35.1 부분 대응 이후 재발)
> **영향 범위**: 운영 사이트 `https://poke-korea.com` 의 정적 페이지 (특히 `/list`)
> **심각도**: Medium (사용자 경험 직접 영향, 캐시 무효화로 단기 해결 가능)
> **대응 상태**: CF function 키워드 통일 + 전체 캐시 무효화 + 실측 검증으로 1차 대응 완료. Next.js 측 iPad 정책 정리는 후속 작업으로 남음
> **관련 문서**:
>
> - [1.35.1 홈 화면 디바이스 분기 캐싱 이슈 수정](../../../changelog/blog/1.35.1/2026-03-30-fix-home-cache.md)
> - [src/module/device.module.ts](../../../src/module/device.module.ts)
> - CloudFront Functions 코드 (콘솔 관리)

---

## 1. 이슈 개요 (TL;DR)

PC 환경에서 사이트에 접근했을 때 모바일 화면이 노출되는 이슈가 간헐적으로 발생. 발생 페이지를 CloudFront 무효화하면 해결되지만, 며칠~몇 주 간격으로 다른 페이지에서 재발하는 패턴이 반복.

### 최종 진단

**CloudFront Function의 모바일 UA 분류 키워드와 Next.js 의 모바일 UA 분류 정규식이 일치하지 않아, 두 시스템이 같은 UA 를 다르게 판정하면서 발생**.

```
원인 UA 예시: Mozilla/5.0 (Linux; Android 11; ...) Chrome/120 Safari/537.36
              (소문자 'mobile' 키워드 없음, 'Android' 만 포함)

CF function 판정 : desktop  (mobile/iphone/ipod/blackberry/opera mini/windows phone 매칭 안 됨)
Next.js 판정     : mobile   (정규식의 Android 매칭됨)

결과: CDN 의 'desktop' 키 캐시에 origin 의 모바일 HTML 이 박힘
      → 진짜 PC 사용자가 그 캐시를 hit 하면 모바일 화면을 보게 됨
```

### 1차 대응

CloudFront Function 의 `mobileKeywords` 배열에 Next.js 정규식과 일치하는 키워드 (`android`, `iemobile`, `webos`) 추가 + iPad 명시적 desktop 처리. Publish 후 전체 캐시 무효화 1회.

---

## 2. 발생 환경 및 증상

### 시스템 구조

```
브라우저
  │
  ▼
[CloudFront edge]
  │  ├─ CF function (viewer-request): User-Agent → x-device-type 헤더 생성
  │  ├─ Cache Policy: 캐시 키에 x-device-type 포함 → 디바이스별 캐시 분리
  │  └─ x-device-type 헤더를 origin 으로 forward
  │
  ▼
[Origin: Next.js (App Router)]
  ├─ ISR (revalidate=31536000) — 대부분의 페이지
  ├─ Dynamic rendering — searchParams 사용하는 페이지 (실질적 동작)
  └─ headers().get('user-agent') 로 device 판정 (x-device-type 헤더는 안 읽음)
```

### 증상

- PC 환경에서 접속 시 모바일 화면이 표시됨
- 페이지별로 간헐적으로 발생
- 동일 페이지가 한 번 터지면 무효화 전까지 지속
- 무효화 후 해당 페이지는 정상화, 다른 페이지에서 며칠/몇 주 뒤 재발

### 가장 자주 발현된 페이지

`/list` (포켓몬 도감 리스트 페이지)

- 다른 정적 페이지 (`/moves`, `/type-effectiveness`) 보다 발현 빈도가 압도적으로 높았음

---

## 3. 초기 의심 가설

이슈 분석 초기에 다음 5개 시나리오를 의심 가설로 세웠음.

### 가설 A-1. CF function 또는 캐시 정책 변경 직후의 일시적 오작동

**메커니즘 추정**:

- CF function 코드 수정·재배포 시 edge POP 전체 전파에 시간이 걸림 (수십 초 ~ 수 분)
- 일부 POP 은 새 function, 일부는 옛 function 으로 동작
- 옛 function 에 버그가 있어 PC UA 에 `x-device-type=mobile` 을 붙였거나, 캐시 정책이 잠깐 `x-device-type` 를 키에서 누락한 상태에서 PC 사용자가 모바일 HTML 받으면 PC 키 캐시에 1년 박힘

**왜 의심했나**: 캐시 오염이 발생하려면 어느 시점이든 잘못된 응답이 한 번은 박혔어야 함. 정책 변경 직후가 가장 명확한 후보.

**의심 강도**: 중간

### 가설 A-2. 캐시 정책 마이그레이션 시점에 박힌 잔재

**메커니즘 추정**:

- 초기에 `x-device-type` 캐시 분리가 없었거나, 키 대소문자만 다른 시점이 있었음
- 그때 박힌 모바일 HTML 이 PC 키에 그대로 남아 만료까지 잔존

**왜 의심했나**: 사용자가 1.35.1 (2026-03-30) 작업 시점에 `x-device-type` 정책을 추가했음을 확인. 그 이전 캐시 잔재 가능성.

**의심 강도**: 중간

### 가설 A-3. CloudFront POP 정책 전파 불일치 또는 자체 버그

**메커니즘 추정**:

- 정책 변경이 모든 POP 에 전파되는 데 시간이 걸리고, 드물게 일부 POP 에 정책이 제대로 안 붙는 케이스
- 특정 POP 의 사용자들만 영향받음

**왜 의심했나**: 간헐적 발생, 특정 path 만 터지는 패턴이 POP 단위 불일치와 일치할 수 있음.

**의심 강도**: 낮음 (공식 known issue 없음)

### 가설 A-4. searchParams 와 캐시 키의 상호작용

**메커니즘 추정**:

- CloudFront 캐시 정책에서 query string 을 캐시 키에 포함 안 하면 `/list?type=fire` 와 `/list?type=water` 가 같은 키
- searchParams 변종이 서로 섞일 수 있음

**왜 의심했나**: 사용자가 `/list` 에서 가장 많이 발견했다고 함. `/list` 는 시나리오 A 페이지 중 유일하게 searchParams 적극 사용.

**의심 강도**: 높음

### 가설 A-5. 빌드 환경 또는 lighthouse 실행이 모바일 prerender 발생시킴

**메커니즘 추정**:

- 빌드 환경의 어떤 도구가 user-agent 를 모바일로 설정한 채 prerender 트리거
- 또는 Lighthouse 모바일 모드가 사용자 환경에서 실행되면서 cache fill 을 모바일로 만듦

**왜 의심했나**: 사용자가 성능 측정을 위해 lighthouse 를 시크릿/일반 탭에서 실행하는 패턴을 인정.

**의심 강도**: 높음

---

## 4. 가설 검증 과정

### 4.1 가설 A-1, A-2 — 변경 이력 없음으로 폐기

사용자 확인 결과:

- 1.35.1 작업 (2026-03-30) 이후 CF function 또는 캐시 정책 변경 이력 없음
- 캐시 정책에 `x-device-type` 와 `X-Device-Type` (대문자 포함) 양쪽 모두 캐시 키로 등록됨

→ A-1, A-2 모두 변경 이력이 없으므로 폐기.

### 4.2 가설 A-3 — 공식 문서 조사

CloudFront 의 정책 전파에 시간이 걸린다는 사실은 공식 문서에 명시:

> [CloudFront Functions — Updating and testing](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/managing-functions.html)
> "After you publish a function, it can take **a few minutes** for CloudFront to propagate the function to all edge locations."

> [CloudFront — Updating distributions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html)
> "It can take up to **15 minutes** for your distribution to be fully deployed."

전파 중 일시적 불일치는 공식적으로 인정되지만, "전파 완료 후에도 영구히 어긋남" 같은 만성적 버그는 공식 인정된 게 없음 (AWS re:Post 등 커뮤니티 보고는 일부 있으나 known issue 등재 X).

→ 정책 변경 이력이 없으므로 A-3 가능성도 낮다고 판단. 단, 가능성을 완전히 배제할 근거는 없어 보류.

### 4.3 가설 A-4 — `/list` 코드 분석

[src/app/list/page.tsx](../../../src/app/list/page.tsx) 분석 결과:

```ts
// 22번 줄
export const revalidate = 31536000 // 1년

// 55-70번 줄
const ListPage = async ({ searchParams }: PageProps) => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const apolloClient = initializeApollo()

  const {
    type,
    isMega,
    isRegion,
    isGigantamax,
    isEvolution,
    generation,
    name,
  } = await searchParams
  // ...
}
```

[Next.js 공식 문서 — searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional):

> "Pages that use `searchParams` are **opted into dynamic rendering** because they need to be processed on each request."

→ `/list` 는 `revalidate = 31536000` 가 명시되어 있어도 `searchParams` 사용으로 인해 실제로는 **dynamic rendering** 으로 동작. 매 요청마다 page 함수 실행 → 매번 user-agent 분기.

또한 [next.config.js:135-142](../../../next.config.js#L135-L142) 에서 `/list` 응답에 `Cache-Control: public, max-age=31536000` 헤더가 명시적으로 붙어서 CDN/브라우저에는 캐시 가능 상태로 전달.

```
정리:

- origin Next.js: 매 요청마다 dynamic 렌더 (실제 동작)
- 응답 헤더:      Cache-Control: max-age=31536000 (CDN/브라우저 캐시 1년 지시)
- CloudFront:    x-device-type 별로 캐시 분리하여 1년 보관
```

→ A-4 의 query string 변종 자체는 모바일/데스크톱 혼동의 직접 원인은 아님. 다만 `/list` 가 dynamic 으로 동작하면서 매 요청마다 user-agent 분기를 한다는 사실이 다음 가설로 이어지는 결정적 단서가 됨.

### 4.4 가설 A-5 — Lighthouse UA 추적

[Lighthouse user-agent 기본값](https://github.com/GoogleChrome/lighthouse/blob/main/core/config/constants.js):

- Mobile mode 일부 버전: `Mozilla/5.0 (Linux; Android 11; ...) ... Chrome/...` — **`Android` 키워드 포함, 소문자 `mobile` 누락 케이스 있음**
- Desktop mode: 데스크톱 user-agent

이 UA 와 두 분류 시스템을 비교:

| 시스템         | 키워드                                                                    | Lighthouse 모바일 UA 매칭           |
| -------------- | ------------------------------------------------------------------------- | ----------------------------------- |
| CF function    | `mobile, iphone, ipod, blackberry, opera mini, windows phone`             | ❌ 매칭 안 됨 → **desktop** 판정    |
| Next.js 정규식 | `/Android\|webOS\|iPhone\|iPad\|iPod\|BlackBerry\|IEMobile\|Opera Mini/i` | ✅ `Android` 매칭 → **mobile** 판정 |

→ **두 시스템이 같은 UA 를 다르게 판정하는 모순 확인**. A-5 가 강력한 후보로 부상.

### 4.5 추가 검증 — 무효화의 역설적 효과

사용자가 "캐싱이 모두 만료되기 전에 업데이트가 발생하면 캐싱을 전체 다 무효화" 운영 패턴을 사용했다고 함.

분석한 무효화의 부작용:

1. **무효화는 CDN edge 만 비움. Next.js ISR 캐시 (`.next/cache`) 는 그대로**

   - 단, ISR 자체는 `next build` 시 새 빌드 산출물로 교체되므로 배포가 함께 일어나면 ISR 도 갱신
   - `searchParams` 사용 페이지는 dynamic 이라 ISR 적용 안 됨

2. **무효화 = 캐시 미스 동시 다발 이벤트**

   - 평소엔 path 별 자연 만료가 분산되어 origin 부담 적음
   - 무효화는 그 분산을 0 으로 만들고 origin 으로 thundering herd 발생

3. **무효화 직후 cache fill 의 첫 요청자가 누구인지가 모든 걸 결정**
   - 첫 요청자가 PC UA → CDN 'desktop' 키에 데스크톱 HTML 박힘 → 정상
   - 첫 요청자가 Android Bare UA → CF function: desktop, Next.js: mobile → CDN 'desktop' 키에 모바일 HTML 박힘 → 오염

→ 무효화가 단순히 캐시를 비우는 게 아니라 **레이스 컨디션 윈도우를 열어주는 트리거** 임을 확인.

### 4.6 1.35.1 작업 회고

git 히스토리에서 같은 종류의 이슈를 이미 한 번 다룬 적이 있음을 발견:

- PR #107 `feature/1.35.1-fix-home-cache` (머지 커밋 `96b394e`)
- 코드 커밋 `745b8eb`: `src/app/page.tsx` 에서 `revalidate = 3600` → `dynamic = 'force-dynamic'` 변경
- changelog: [changelog/blog/1.35.1/2026-03-30-fix-home-cache.md](../../../changelog/blog/1.35.1/2026-03-30-fix-home-cache.md)

  1.35.1 의 진단:

  > "다른 페이지들은 `revalidate = 31536000` (1년)으로 설정되어 빌드 시점에 이미 데스크톱 HTML이 ISR 캐시에 생성되어 있어 런타임에 재생성되지 않음"

  1.35.1 의 대응:

  > "CloudFront가 CDN 레벨에서 `x-device-type` 기준으로 캐시를 분리해주고 있으므로, Next.js 단의 ISR 캐싱을 제거하고 매 요청마다 정확한 디바이스 판단을 수행하도록 변경"

changelog 말미의 미해결 메모:

> "`layout.tsx`의 `headers()` 호출에 `await`가 누락되어 있으나, 각 페이지에서 직접 `detectUserAgent`를 호출하고 있어 현재 동작에는 영향 없음 (별도 개선 권장)"

→ **1.35.1 작업은 홈 페이지에 한해서만 해결되었고, 같은 구조의 버그가 다른 페이지에서 재발할 여지를 그대로 남겨둠**. 이번 이슈가 그 잠재 위험의 발현.

---

## 5. 막다른 길로 갔던 가설 (반박된 추론)

### 5.1 "ISR 이 모바일 HTML 로 박혀서 발생한다" 가설

**초기 추론**:
1년 캐시 페이지 (`revalidate = 31536000`) 의 ISR 캐시가 모바일 HTML 로 채워지고, 그 ISR 응답이 CDN PC 키 캐시까지 오염시킨다.

**왜 의심했나**:
1.35.1 작업의 진단을 그대로 따라간 추론. 다른 페이지도 같은 메커니즘으로 재발한다고 가정.

**왜 틀렸나**:

[src/app/](../../../src/app/) 하위 모든 페이지 중 `generateStaticParams` 를 가진 곳이 0개임을 확인:

```bash
grep -rn "generateStaticParams" src/app --include="*.tsx" --include="*.ts"
# (결과 없음)
```

이는 dynamic segment 라우트가 ISR 빌드 prerender 대상이 아니라는 뜻. 그리고 정적 라우트 (`/list`, `/moves`, `/type-effectiveness`) 의 경우:

- 빌드 시점 prerender 는 `headers()` 가 비어 있어 user-agent 빈 문자열 → 데스크톱 판정 → **데스크톱 HTML 로 박힘**
- 다음 배포까지 ISR 갱신 없음 (1년)
- **즉, 정적 라우트의 ISR 은 항상 데스크톱 HTML 만 들고 있음**

이게 시나리오 A 페이지에서 "무효화만으로 항상 해결됐던" 진짜 이유. ISR 이 데스크톱 HTML 로 보증되어 있으므로 CDN 무효화 후 cache fill 이 들어와도 origin 이 데스크톱 HTML 을 응답.

→ **ISR 오염 가설은 정적 페이지에서는 성립하지 않음**. dynamic segment 페이지에서는 가능성 있지만 사용자 제보 페이지는 모두 정적 페이지였음.

### 5.2 "PC UA 가 CF function 에서 mobile 로 오판된다" 가설

**초기 추론**:
PC 사용자의 UA 가 CF function 의 mobile 키워드와 우연히 매칭되어 `x-device-type=mobile` 로 분류되고, origin Next.js 는 정상적으로 desktop HTML 을 응답해서 CDN 'mobile' 키에 데스크톱 HTML 이 박힌다.

**왜 의심했나**:
사용자가 "PC 사용자 → 모바일 키 오염" 메커니즘을 직관적으로 제안. 두 분류기의 불일치라는 본질은 맞음.

**왜 틀렸나**:

CF function 의 mobile 키워드 (`mobile, iphone, ipod, blackberry, opera mini, windows phone`) 가 일반 PC 브라우저 UA 에 포함되지 않음:

- Mac Chrome: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/...`
- Windows Chrome: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/...`

→ 어느 키워드도 매칭되지 않음. **PC → mobile 오염 방향은 거의 발생 불가능**.

실제 오염 방향은 반대 — **mobile UA (특히 Android Bare) → desktop 키 오염**. 사용자의 직관은 방향만 거꾸로였고, "두 분류기 불일치가 원인" 이라는 본질은 정확히 짚었음.

### 5.3 "에러 응답이 캐시되어 발생한다" 가설

**초기 추론**:
초기 검증 시 `x-cache: Error from cloudfront` 응답을 받았고, 이 에러 응답이 `Cache-Control: public, max-age=31536000` 와 함께 캐시되어 사용자에게 노출된다.

**왜 의심했나**:
[next.config.js](../../../next.config.js) 의 `headers()` 설정이 status code 와 무관하게 모든 응답에 `Cache-Control` 을 붙이므로, 에러 응답도 1년 캐시될 수 있음. [src/app/error.tsx](../../../src/app/error.tsx) 의 SSR 시점 `isMobile=false` 동작과 결합되면 hydration 깜빡임 등 다양한 증상이 가능.

**왜 틀렸나**:

사용자 확인 결과:

- 에러 페이지가 캐싱되어 노출된 적은 단 한 번도 없음
- 후속 검증에서 정상 응답 (HTTP 200) 으로 일관되게 확인됨

초기 `Error from cloudfront` 는 헤더 일부만 grep 으로 필터링한 출력 형식 문제였을 가능성이 높음. 전체 헤더를 보면 정상 200 응답이었음.

→ 에러 캐싱 가설 폐기. 단, [src/app/error.tsx:18-23](../../../src/app/error.tsx#L18-L23) 의 SSR 시점 항상 desktop 분기 + 모든 응답에 Cache-Control 1년 부착은 향후 리스크로 별도 검토 필요.

---

## 6. 핵심 개념 정리 — ISR 과 CloudFront 캐시 분리

이슈 분석 과정에서 사용자가 헷갈리던 핵심 개념을 정리.

### 6.1 ISR (Incremental Static Regeneration) 동작 원리

```ts
export const revalidate = 31536000 // 1년
```

이 한 줄이 의미하는 것:

**빌드 시점**:

1. 정적 라우트는 빌드 때 HTML prerender → `.next/server/app/<path>.html`
2. Dynamic segment 라우트는 `generateStaticParams` 로 명시한 path 만 prerender
3. Prerender 시 `headers()` 는 비어 있음 (실제 HTTP 요청 아님) → 빈 user-agent → 데스크톱 판정

**런타임 요청 처리**:

```
요청 도착
  │
  ├─ 캐시 히트 + 신선함        → 캐시된 HTML 즉시 반환 (page 함수 실행 X)
  │                              ※ 이 경우 user-agent 분기 코드가 안 돈다
  │
  ├─ 캐시 히트 + stale         → stale HTML 즉시 반환 + 백그라운드 재생성
  │                              백그라운드 실행은 실제 요청 헤더 받음
  │
  └─ 캐시 미스                 → page 함수 실행 → HTML 생성 → 캐시 저장 → 반환
                                  이때 실제 요청 헤더로 분기
```

**중요한 사실 3가지**:

1. **캐시 히트면 page 코드가 안 돈다** — user-agent 분기를 코드로 짜놨어도 ISR 캐시 히트면 무의미
2. **캐시는 path 단위 1개** — 디바이스로 분리되지 않음
3. **cache miss 를 채우는 첫 요청자의 디바이스로 path 가 굳는다**

[Next.js 공식 — Full Route Cache](https://nextjs.org/docs/app/building-your-application/caching#full-route-cache)
[Next.js 공식 — Revalidating](https://nextjs.org/docs/app/building-your-application/caching#revalidating)

### 6.2 `searchParams` 와 dynamic rendering 의 자동 전환

[Next.js 공식 — searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional):

> "Pages that use `searchParams` are opted into dynamic rendering because they need to be processed on each request."

`revalidate` 가 명시되어도 `searchParams` 를 사용하면 dynamic rendering 으로 동작. 즉:

- `/list` (searchParams 사용) → 매 요청 dynamic 렌더
- `/type-effectiveness` (searchParams 없음) → ISR 캐시 hit (빌드 prerender 데스크톱 HTML)

이게 `/list` 가 다른 정적 페이지보다 훨씬 자주 오염된 이유.

### 6.3 CloudFront 캐시 분리와 origin forward 의 관계

CloudFront 에는 2가지 정책이 있음:

| 정책                      | 역할                                           |
| ------------------------- | ---------------------------------------------- |
| **Cache Policy**          | edge 캐시 키 계산에 사용할 헤더/쿠키/쿼리 결정 |
| **Origin Request Policy** | origin 으로 forward 할 헤더/쿠키/쿼리 결정     |

**Cache Policy 에 포함된 헤더는 자동으로 origin 에 forward 됨**. 즉 Cache Policy 에 `x-device-type` 가 있으면:

- edge 캐시가 디바이스별로 분리
- 동시에 origin 도 이 헤더를 받음

이 사실이 매우 중요. 사용자가 "CF function 헤더가 브라우저에 안 보이는데 origin 은 어떻게 받느냐" 라고 의심했지만, **viewer-request CF function 이 추가한 헤더는 origin 요청에 반드시 포함되어 forward 됨**. 브라우저에 안 보이는 것은 응답 헤더가 echo 되지 않는다는 별개 사실.

[AWS 공식 — Cache key and origin requests](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html)

### 6.4 CloudFront 무효화의 정확한 동작

**무효화는 CDN edge 캐시만 비움**. 다른 캐시 레이어는 영향 없음:

| 캐시 레이어                      | CloudFront 무효화로 비워지는가      |
| -------------------------------- | ----------------------------------- |
| CloudFront edge 캐시             | ✅ 비워짐                           |
| Next.js ISR 캐시 (`.next/cache`) | ❌ 그대로                           |
| Apollo Client in-memory 캐시     | ❌ 그대로 (서버 재시작 시만 초기화) |
| 브라우저 캐시                    | ❌ 그대로 (Cache-Control 만료까지)  |

**무효화 = 캐시 미스 동시 다발 이벤트**:

- 모든 path 가 동시 cache miss → origin thundering herd
- 평소엔 path 별 자연 만료가 분산되어 origin 부담 적음
- 무효화는 그 분산을 0 으로 만듦

이게 사용자의 "업데이트마다 전체 무효화" 운영 패턴이 이슈 발생 확률을 끌어올린 핵심 이유.

---

## 7. 실제 검증 (curl + UA 매트릭스)

### 7.1 검증 환경 구축

[src/views/desktop/list/List.desktop.tsx](../../../src/views/desktop/list/List.desktop.tsx) 와 [src/views/mobile/list/List.mobile.tsx](../../../src/views/mobile/list/List.mobile.tsx) 를 분석하여 응답 본문에서 모바일/데스크톱을 구별할 식별자 확보:

| 컴포넌트             | 광고 슬롯 ID |
| -------------------- | ------------ |
| MobileListTopBanner  | `1410249585` |
| DesktopListTopBanner | `1219493182` |

빌드 minify 로 컴포넌트 이름은 제거되지만 광고 슬롯 ID 는 `data-ad-slot` 속성으로 본문에 남으므로 판정 가능.

### 7.2 UA 매트릭스 검증

다양한 UA 로 동일 URL (`/list`) 에 동시 요청, 캐시 상태와 본문을 매트릭스로 정리:

```bash
detect() {
  local label="$1" ua="$2"
  local headers=$(mktemp) body=$(mktemp)
  curl -s -D "$headers" -A "$ua" 'https://poke-korea.com/list' > "$body"

  local xcache=$(grep -i 'x-cache:' "$headers" | sed 's/^x-cache: //i')
  local age=$(grep -i '^age:' "$headers" | sed 's/^age: //i')
  local pop=$(grep -i 'x-amz-cf-pop:' "$headers" | sed 's/^x-amz-cf-pop: //i')

  local mobile_count=$(grep -c '1410249585' "$body")
  local desktop_count=$(grep -c '1219493182' "$body")

  local verdict="?"
  if [ "$mobile_count" -gt 0 ] && [ "$desktop_count" -eq 0 ]; then verdict="MOBILE"
  elif [ "$desktop_count" -gt 0 ] && [ "$mobile_count" -eq 0 ]; then verdict="DESKTOP"
  fi

  printf "%-22s | %-12s | age=%-6s | %s\n" "$label" "$xcache" "${age:-N/A}" "$verdict"
  rm -f "$headers" "$body"
}
```

### 7.3 검증 결과 (1차)

| UA                | x-cache | age      | 본문 판정      |
| ----------------- | ------- | -------- | -------------- |
| PC Mac Chrome     | Hit     | 4529     | 🖥️ DESKTOP     |
| PC Windows Chrome | Hit     | 4530     | 🖥️ DESKTOP     |
| **Android Bare**  | **Hit** | **4530** | **🖥️ DESKTOP** |
| iPhone Safari     | Miss    | N/A      | 📱 MOBILE      |
| Android+Mobile    | Miss    | N/A      | 📱 MOBILE      |
| iPad Safari       | Miss    | N/A      | 📱 MOBILE      |
| Empty UA          | Hit     | 4530     | 🖥️ DESKTOP     |

**핵심 관찰**:

- PC Mac, PC Windows, Android Bare, Empty UA 가 같은 `age=4530` → **같은 'desktop' 키 캐시에 hit**
- iPhone, Android+Mobile, iPad 는 모두 Miss → 'mobile' 키 캐시는 비어 있었음
- 즉 CDN 은 정확히 2개 키 (desktop / mobile) 로 분리되고 있음 확인

### 7.4 검증 결과 (2차, 동일 UA 재호출)

```
PC Mac Chrome     | Hit | age=4541 | 🖥️ DESKTOP
PC Windows Chrome | Hit | age=4541 | 🖥️ DESKTOP
iPhone Safari     | Hit | age=11   | 📱 MOBILE
Android+Mobile    | Hit | age=12   | 📱 MOBILE
Android Bare      | Hit | age=4542 | 🖥️ DESKTOP
iPad Safari       | Hit | age=12   | 📱 MOBILE
Empty UA          | Hit | age=4542 | 🖥️ DESKTOP
```

**핵심 관찰**:

- iPhone, Android+Mobile, iPad 가 같은 `age=11~12` (방금 1차 검증으로 채워짐) → 같은 'mobile' 키 캐시
- PC Mac, PC Windows, Android Bare, Empty UA 는 여전히 `age=4541~4542` (1.25시간 전 핫픽스 무효화 직후 채워진 캐시)
- 캐시 키 분리가 정확히 2개로 작동함 재확인

### 7.5 결정적 발견

**Android Bare UA 가 데스크톱 HTML 을 받았다**:

- CF function 판정: `mobile/iphone/ipod/blackberry/opera mini/windows phone` 매칭 안 됨 → **desktop**
- CDN 캐시 키: `path + x-device-type=desktop`
- 1.25시간 전 진짜 PC 가 먼저 'desktop' 키를 채워둔 데스크톱 HTML 에 cache hit

**그런데 만약 무효화 직후 첫 'desktop' 키 요청이 Android Bare UA 였다면?**

1. CF function: desktop 분류 → CDN 'desktop' 키 cache miss
2. Origin 으로 forward
3. Next.js: `headers().get('user-agent')` → Android 매칭 → **mobile 판정**
4. 모바일 HTML 응답 → CDN 'desktop' 키에 모바일 HTML 1년 박힘 ← **오염**
5. 이후 진짜 PC 사용자 도달 → cache hit → 모바일 화면 봄 ← **사용자 제보 증상**

→ 이 시나리오로 모든 증상이 일관되게 설명됨. **가설 A-5 (Lighthouse) + A-4 (`/list` 의 dynamic 동작) + CF function/Next.js 키워드 불일치** 가 결합된 결과.

---

## 8. 근본 원인 확정

### 8.1 직접 원인

**CloudFront Function 의 모바일 UA 분류 키워드와 Next.js 의 모바일 UA 분류 정규식이 일치하지 않음**.

```
CF function:    ['mobile', 'iphone', 'ipod', 'blackberry', 'opera mini', 'windows phone']
Next.js 정규식: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

차이:
  CF function 에만 있음: (없음)
  Next.js 에만 있음:    Android, iPad, IEMobile, webOS
```

특히 `Android` 가 가장 큰 문제. Android Bare UA (구버전 Chrome on Android Tablet, Lighthouse 일부 버전, 임베디드 안드로이드 등) 가 양쪽에서 다르게 판정됨.

### 8.2 간접 원인 (발현 빈도를 키운 요인)

**1. `/list` 페이지가 dynamic 으로 동작**:

- `revalidate = 31536000` 명시되어 있지만 `searchParams` 사용으로 실질적으로 dynamic
- 매 요청마다 user-agent 분기 실행 → CF function 과 Next.js 의 불일치가 즉시 발현
- 다른 정적 페이지 (`/moves`, `/type-effectiveness`) 는 ISR 데스크톱 HTML 이 보증되어 안전

**2. Lighthouse 모바일 모드 실행**:

- 사용자가 시크릿/일반 탭에서 lighthouse 모바일 모드를 자주 실행
- Lighthouse 모바일 UA 가 정확히 Android Bare 패턴 (구버전 케이스)
- 운영 사이트에 cache fill 을 트리거하는 진입점

**3. 전체 캐시 무효화 운영 패턴**:

- "업데이트마다 전체 무효화" 가 매번 cache miss 폭주 윈도우를 열어줌
- 무효화 직후 첫 'desktop' 키 요청자가 Android Bare UA 일 확률을 키움
- 즉 무효화 자체가 이슈 발현 트리거 역할

**4. 1.35.1 작업의 미해결 숙제**:

- 1.35.1 에서 홈 페이지만 dynamic 으로 전환하여 회피
- "각 페이지가 user-agent 를 직접 읽고, x-device-type 헤더는 활용되지 않음" 이라는 구조적 문제는 미해결로 남김
- 이 미해결 숙제가 다른 페이지에서 같은 종류의 버그로 발현

### 8.3 원인 분포 — 운영 vs 코드

```
운영 측 요인:
  - 전체 무효화 패턴 (이슈 윈도우 확대)
  - Lighthouse 자주 실행 (오염 트리거)

코드 측 요인:
  - CF function ↔ Next.js 키워드 불일치 (직접 원인)
  - searchParams 사용 페이지의 dynamic 자동 전환 인지 부족
  - 1.35.1 의 부분 대응으로 구조적 문제 미해결
```

코드 측 직접 원인이 명확하므로 코드 수정으로 1차 차단 가능.

---

## 9. 해결 방안 (1차 대응)

### 9.1 선택된 방안: CF function 키워드 통일

**왜 이 방안인가** — 4가지 평가 축에서의 비교:

| 옵션                            | 차단 시점                  | 변경 라인   | 재배포 비용       | 부작용         |
| ------------------------------- | -------------------------- | ----------- | ----------------- | -------------- |
| **CF function 키워드 통일**     | CDN edge                   | 1줄         | Functions publish | 없음           |
| Next.js x-device-type 우선 읽기 | origin                     | 25개 페이지 | 풀 빌드+재시작    | 폴백 검증 필요 |
| `/list` 등 `dynamic` 명시       | 없음 (실제 동작 변화 없음) | 2줄         | 풀 빌드+재시작    | 없음           |

CF function 수정이 다음 이유로 가장 효과적:

1. **차단 위치가 가장 앞단** — origin 의 어떤 상태도 무관해짐
2. **변경 범위 최소** — 1줄, 새 버그 가능성 최소
3. **재배포 무중단** — CloudFront Functions publish 는 자동 전파, 즉시 롤백 가능
4. **자동 확산** — 모든 path 와 미래 페이지에 자동 적용

### 9.2 CF function 수정 내용

**변경 1 — `mobileKeywords` 배열 확장**:

```js
// 변경 전
var mobileKeywords = [
  'mobile',
  'iphone',
  'ipod',
  'blackberry',
  'opera mini',
  'windows phone',
]

// 변경 후
var mobileKeywords = [
  'mobile',
  'android',
  'iphone',
  'ipod',
  'blackberry',
  'iemobile',
  'opera mini',
  'webos',
  'windows phone',
]
```

추가된 키워드: `'android'`, `'iemobile'`, `'webos'` (Next.js 정규식과 일치)

**변경 2 — iPad 명시적 desktop 처리**:

```js
// 변경 전 (주석으로만 존재)
// if (userAgent.indexOf('ipad') > -1) { isMobile = true; }

// 변경 후
if (userAgent.indexOf('ipad') > -1) {
  isMobile = false
}
```

iPad 정책 결정:

- iPadOS 13 이후 Safari 가 기본적으로 desktop 모드 동작
- iPad 사용자에게도 데스크톱 UI 제공으로 일관성 유지
- 위 mobileKeywords 의 `'mobile'` 매칭으로 isMobile=true 가 됐을 수 있어 명시적으로 false 처리

### 9.3 배포 순서

```
1. CF function 코드 수정 → Save
2. Test 탭에서 검증
   - PC Mac: desktop ✓
   - iPhone: mobile ✓
   - Android Bare: mobile ✓ (변경 전엔 desktop)
   - iPad: desktop ✓
3. Publish
4. 전파 대기 (1~2분)
5. 전체 캐시 무효화 (/*)
6. 검증 커맨드 재실행
```

**왜 이 순서인가**:

- Publish 후 무효화 순서로 가야 함. 반대로 하면 무효화 직후 옛 function 으로 캐시가 다시 채워짐
- 전파 대기 1~2분은 [공식 문서](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/managing-functions.html) 기준 권장
- 전체 무효화 필요 이유: 옛 분류로 박힌 오염 잔재 제거 + 검증 효과

### 9.4 검증 기대 결과

수정 후 검증 커맨드 실행 시:

| UA           | 기대 결과 | 변경 전 결과 |
| ------------ | --------- | ------------ |
| Android Bare | 📱 MOBILE | 🖥️ DESKTOP   |
| 그 외        | 변경 없음 | 변경 없음    |

핵심은 Android Bare 가 mobile 로 분류되는지 여부.

### 9.5 실제 검증 결과 (배포 후)

CF function publish → 전파 대기 → 전체 캐시 무효화 (`/*`) → 부록 A 의 검증 스크립트 실행:

```
라벨                    | x-cache              | age    | POP        | 본문
-----------------------+----------------------+--------+------------+-----------
PC Mac Chrome          | Miss from cloudfront | N/A    | ICN57-P3   | 🖥️ DESKTOP
PC Windows Chrome      | Hit from cloudfront  | N/A    | ICN57-P3   | 🖥️ DESKTOP
iPhone Safari          | Miss from cloudfront | N/A    | ICN57-P3   | 📱 MOBILE
Android+Mobile         | Miss from cloudfront | N/A    | ICN57-P3   | 📱 MOBILE
Android Bare           | Hit from cloudfront  | N/A    | ICN57-P3   | 📱 MOBILE
iPad Safari            | Hit from cloudfront  | 1      | ICN57-P3   | 🖥️ DESKTOP
Empty UA               | Hit from cloudfront  | 1      | ICN57-P3   | 🖥️ DESKTOP
```

#### 핵심 변화

**Android Bare 가 변경 전 🖥️ DESKTOP 에서 변경 후 📱 MOBILE 로 전환됨**:

- 변경 전: CF function 이 desktop 으로 분류 → 'desktop' 키 캐시에 hit (오염 가능)
- 변경 후: CF function 이 mobile 로 분류 → 'mobile' 키 캐시에 hit (origin 의 모바일 HTML 응답과 일치)

이는 `mobileKeywords` 배열에 `'android'` 키워드가 추가되어 CF function 이 Android Bare UA 를 mobile 로 정확히 분류하기 시작했음을 의미. **'desktop' 키 캐시에 모바일 HTML 이 박힐 경로가 차단됨**.

#### iPad 검증

iPad Safari → 🖥️ DESKTOP 확인. iPad 명시적 desktop 처리 (`if (userAgent.indexOf('ipad') > -1) { isMobile = false; }`) 가 의도대로 동작.

단, 이는 CF function 측 분류만 desktop 으로 만든 것이고, Next.js 정규식은 여전히 iPad 를 mobile 로 매칭. 위 검증에서 iPad 가 desktop HTML 응답을 받은 것은 'desktop' 키 캐시가 무효화 직후 PC UA 가 먼저 채워둔 결과로 추정. 무효화 직후 첫 'desktop' 키 cache miss 가 iPad UA 였다면 origin Next.js 가 모바일 HTML 을 응답해 'desktop' 키에 박힐 가능성은 여전히 남음 → 10.1 잔존 위험 참고.

#### x-cache 상태 분석

- iPad / Empty UA: `Hit, age=1` → 검증 직전 누군가 (검증자 본인일 가능성) 가 이미 채워둔 캐시
- Android Bare: `Hit, age=N/A` → 동일 키로 분류된 다른 UA (PC Mac 또는 Empty UA) 가 채운 'desktop' 키 캐시에 hit. age 값이 안 잡힌 건 정확히 같은 순간 채워졌거나 헤더 출력 형식 문제로 추정. **본문이 DESKTOP 으로 정상 응답된 것이 핵심**.
- PC Mac: `Miss` → 무효화 후 'desktop' 키가 비어 있던 시점에 첫 호출이라 origin 으로 forward
- PC Windows: `Hit` → 같은 'desktop' 키에 PC Mac 응답이 박힌 후 hit

UA 별 cache key 분리는 정확히 2개 (desktop / mobile) 로 작동하고 있음 확인.

#### 결론

1차 대응 (CF function 키워드 통일) 이 의도대로 동작하여 **Android Bare 케이스의 오염 경로가 완전히 차단됨**. 사용자 영향이 가장 큰 케이스가 해결됨.

---

## 10. 잔존 위험 및 후속 작업

### 10.1 잔존 위험: iPad 정책 불일치

CF function 은 iPad 를 desktop 으로 처리하지만 Next.js 정규식은 여전히 iPad 를 mobile 로 매칭:

```ts
// src/module/device.module.ts
const userAgentExp =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
//                    ^^^^                    iPad 가 정규식에 남아있음
```

→ iPad 사용자 진입 시:

1. CF function: desktop → CDN 'desktop' 키 cache miss
2. Origin Next.js: iPad 매칭 → mobile 판정 → 모바일 HTML
3. CDN 'desktop' 키에 모바일 HTML 박힘 ← 잔존 오염 경로

**발현 가능성**: iPad 트래픽 비중과 무효화 직후 cache fill 의 첫 요청자 분포에 따라 결정. iPad 트래픽이 적으면 발현 빈도 낮음.

**후속 작업 권장**:

- [src/module/device.module.ts](../../../src/module/device.module.ts) 의 정규식에서 `iPad` 제거
- 이후 양쪽 모두 iPad → desktop 으로 일관

### 10.2 후속 작업 (구조적 개선)

1순위 (CF function) 만으로 사용자 영향 99% 차단되지만, 구조적으로 더 견고하게 만들려면:

**2순위 — Next.js 가 `x-device-type` 우선 읽기**:

```ts
// src/module/device.module.ts 에 함수 추가
export const detectDevice = (
  deviceTypeHeader: string | null,
  userAgent: string,
): boolean => {
  if (deviceTypeHeader === 'mobile') return true
  if (deviceTypeHeader === 'desktop') return false
  return userAgentExp.test(userAgent) // 로컬 개발 환경 폴백
}
```

각 페이지 호출부 변경:

```ts
const isMobile = detectDevice(
  headersList.get('x-device-type'),
  headersList.get('user-agent') || '',
)
```

→ CF function 의 판정과 origin Next.js 의 판정이 항상 동일한 소스(`x-device-type`)를 보게 됨.

**3순위 — `/list`, `/moves` 의 `revalidate` 제거하고 `dynamic = 'force-dynamic'` 명시**:

- 실제 동작은 이미 dynamic 이지만 코드 의도 명확화
- 향후 코드 리뷰 시 혼란 방지

### 10.3 운영 측 개선 권장

**무효화 패턴 재검토**:

- 전체 무효화 (`/*`) 대신 변경된 path 만 specific 무효화
- 예: 데이터만 바뀐 경우 해당 path 만, 전체 배포 시에만 전체 무효화
- CF function 키워드 통일 후엔 무효화로 인한 오염 발생 위험이 사라지므로 자유롭게 무효화 가능

**Lighthouse 측정 환경**:

- 운영 사이트에 직접 측정하는 대신 staging 환경 활용 고려
- 측정 후 영향받을 수 있는 path 무효화 습관화

---

## 11. 학습 포인트 (Lessons Learned)

### 11.1 진단 측면

**1. ISR 동작에 대한 정확한 이해 부족이 1.35.1 진단을 불완전하게 만들었음**

1.35.1 의 진단:

> "다른 페이지들은 빌드 시점에 이미 데스크톱 HTML 이 ISR 캐시에 생성되어 있어 런타임에 재생성되지 않음"

이 진단은 정적 라우트에만 부분적으로 맞고, dynamic segment 라우트 (`detail/[pokemonId]` 등) 에는 적용되지 않음. `generateStaticParams` 없는 dynamic 라우트는 빌드 prerender 가 없으므로 첫 런타임 요청자의 디바이스로 채워짐.

→ 1.35.1 시점에 dynamic segment 라우트의 위험을 파악하지 못함.

**2. "CDN 캐시 분리 = origin 분기 정렬" 가정이 잘못된 명제**

1.35.1 의 암묵적 전제:

> "CloudFront 가 x-device-type 으로 캐시 분리하면 그게 origin 분기와 정렬되어 원인이 해결된다"

CDN 캐시 분리는 **사후 분리**일 뿐, origin 이 무엇을 응답하는지에 관여하지 않음. origin 이 잘못된 응답을 주면 CDN 은 그걸 충실히 디바이스별로 저장. 즉:

- ✅ 올바른 명제: "CDN 캐시 분리는 origin 이 정답을 줄 때만 의미가 있다"
- ❌ 잘못된 명제: "CDN 캐시 분리가 origin 분기를 보장한다"

**3. "무효화로 해결됐다" 의 진실**

사용자가 "무효화만으로 항상 해결됐다" 고 인식한 것은:

- 시나리오 A 페이지 (정적 라우트) 의 경우 ISR 이 빌드 prerender 데스크톱 HTML 로 보증되어 있어 무효화 후 cache fill 이 결정론적으로 데스크톱
- 즉 **운에 의존한 해결이 아니라 ISR 보증 덕분에 결정론적으로 작동**

다만 사용자 인식에서 "ISR 이 안전망 역할을 했다" 라는 부분이 명시되지 않아 메커니즘 파악이 늦어짐.

### 11.2 운영 측면

**1. 무효화는 단순 청소 행위가 아니라 트리거 행위**

전체 무효화 (`/*`) 는:

- 모든 path 의 동시 cache miss → origin thundering herd
- 매번 cache fill 의 첫 요청자가 누구냐로 다음 1년치 캐시가 결정됨
- 즉 **무효화 자체가 레이스 컨디션 윈도우를 여는 행위**

→ "이슈 발생 시 무효화" 는 응급 처치로 유효하지만, "정기적 무효화" 는 이슈 재발 확률을 키움.

**2. 자기 비판적 회고: 운영 패턴이 이슈를 키운 측면**

사용자 본인의 인정:

> "캐싱이 모두 만료되기 전에 업데이트가 발생하면 캐싱을 전체 다 무효화"

이 패턴이 다음 효과를 만들어냄:

- 매번 cache miss 윈도우 발생 → 이슈 발현 확률 증가
- 무효화로 해결 → "무효화만으로 해결되는구나" 라는 잘못된 학습 → 무효화 의존도 증가
- 근본 원인 (CF function/Next.js 불일치) 탐색이 지연됨

→ 운영 패턴 자체를 의심하는 시점이 늦었음.

**3. 자기 비판적 회고: 1.35.1 시점의 미해결 숙제 방치**

1.35.1 changelog 말미:

> "별도 개선 권장"

이 한 줄로 미해결 숙제를 인지하고도 후속 작업을 진행하지 않음. 그 결과:

- 같은 종류의 버그가 다른 페이지에서 재발
- 사용자 영향 누적
- 디버깅 비용 (이번 분석 전 과정) 발생

→ "현재 동작에는 영향 없음" 으로 후속 작업을 미루는 결정이 결과적으로 더 큰 비용을 만듦. 미해결 숙제는 위험 우선순위와 함께 작업 큐에 명시적으로 등록해야 함.

### 11.3 디버깅 방법론 측면

**1. 가설 → 검증 → 반박 사이클의 가치**

이번 분석은 5개 초기 가설 중 3개를 반박하면서 진짜 원인에 도달함:

- A-1, A-2: 변경 이력 없음으로 폐기
- A-3: 공식 문서 조사로 가능성 낮춤
- A-4 + A-5: 결합된 시나리오로 진짜 원인 확정

→ 막다른 길로 간 가설도 기록할 가치가 있음. "왜 그 가설이 틀렸나" 가 다음 비슷한 이슈에서 빠르게 좁히는 데 도움.

**2. 실제 검증의 중요성 — 추측을 확정으로 전환**

가설 단계에서는 여러 시나리오가 동시에 가능해 보였음. UA 매트릭스 curl 검증으로:

- 캐시 키 분리가 작동함 확정
- CF function 과 Next.js 의 판정 차이 확정
- 발현 메커니즘 확정

→ "이론적으로 가능한 시나리오" 와 "실제 발생한 시나리오" 를 구별하려면 운영 환경 검증이 필수.

**3. 사용자 직관도 부분적으로 맞을 수 있음**

사용자가 제안한 "PC → mobile 키 오염" 메커니즘은 방향은 거꾸로였지만 **"두 분류기 불일치가 원인" 이라는 본질은 정확히 짚음**.

→ 사용자 직관을 단순히 틀렸다고 일축하지 말고 "본질은 맞는데 방향이 다르다" 를 명확히 해줘야 다음 추론이 정확해짐.

---

## 12. 참고 자료

### Next.js 공식 문서

- [Caching in Next.js](https://nextjs.org/docs/app/building-your-application/caching) — ISR, Full Route Cache, Data Cache 동작 원리
- [searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional) — dynamic rendering 자동 전환
- [revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) — On-demand revalidation
- [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — Static prerender 대상 명시

### AWS CloudFront 공식 문서

- [CloudFront Functions — Updating and testing](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/managing-functions.html) — Function 전파 시간
- [Updating distributions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html) — Distribution 변경 전파
- [Cache key and origin requests](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html) — Cache Policy 와 Origin Request Policy 의 관계
- [HTTP Status Code Caching](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/HTTPStatusCodes.html) — 에러 응답 캐싱 동작
- [Troubleshooting — x-cache values](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/web-distribution-troubleshooting.html) — x-cache 헤더 값 의미

### RFC

- [RFC 9110 §6.6.1 — Date](https://www.rfc-editor.org/rfc/rfc9110#field.date) — Date 헤더 정의
- [RFC 9111 §5.1 — Age](https://www.rfc-editor.org/rfc/rfc9111#name-age) — Age 헤더 정의

### 프로젝트 내 관련 문서

- [1.35.1 fix-home-cache changelog](../../../changelog/blog/1.35.1/2026-03-30-fix-home-cache.md) — 동일 이슈의 1차 (부분) 대응
- [src/module/device.module.ts](../../../src/module/device.module.ts) — Next.js 모바일 판정 정규식
- [src/app/list/page.tsx](../../../src/app/list/page.tsx) — 주요 발현 페이지
- [next.config.js](../../../next.config.js) — Cache-Control 응답 헤더 설정

### Lighthouse

- [Lighthouse 설정 (UA 정의)](https://github.com/GoogleChrome/lighthouse/blob/main/core/config/constants.js) — Lighthouse 의 기본 user-agent

---

## 부록 A. 검증 스크립트 전문

검증에 사용한 bash 스크립트:

```bash
#!/bin/bash
# /tmp/cdn-debug/detect.sh

detect() {
  local label="$1"
  local ua="$2"
  local headers=$(mktemp)
  local body=$(mktemp)

  curl -s -D "$headers" -A "$ua" 'https://poke-korea.com/list' > "$body"

  local xcache=$(grep -i 'x-cache:' "$headers" | tr -d '\r' | sed 's/^x-cache: //i')
  local age=$(grep -i '^age:' "$headers" | tr -d '\r' | sed 's/^age: //i')
  local pop=$(grep -i 'x-amz-cf-pop:' "$headers" | tr -d '\r' | sed 's/^x-amz-cf-pop: //i')

  # MobileListTopBanner: data-ad-slot="1410249585"
  # DesktopListTopBanner: data-ad-slot="1219493182"
  local mobile_count=$(grep -c '1410249585' "$body")
  local desktop_count=$(grep -c '1219493182' "$body")

  local verdict="?"
  if [ "$mobile_count" -gt 0 ] && [ "$desktop_count" -eq 0 ]; then
    verdict="MOBILE"
  elif [ "$desktop_count" -gt 0 ] && [ "$mobile_count" -eq 0 ]; then
    verdict="DESKTOP"
  elif [ "$mobile_count" -gt 0 ] && [ "$desktop_count" -gt 0 ]; then
    verdict="BOTH"
  else
    verdict="NEITHER"
  fi

  printf "%-30s | %-12s | age=%-6s | pop=%-12s | %s\n" \
    "$label" "$xcache" "${age:-N/A}" "$pop" "$verdict"

  rm -f "$headers" "$body"
}

detect "PC Mac Chrome"     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
detect "PC Windows Chrome" 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
detect "iPhone Safari"     'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
detect "Android+Mobile"    'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
detect "Android Bare"      'Mozilla/5.0 (Linux; Android 11; moto g power) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
detect "iPad Safari"       'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
detect "Empty UA"          ''
```

---

## 부록 B. CF function 코드 전문 (수정 후)

```js
function handler(event) {
  var request = event.request
  var headers = request.headers
  var userAgent = headers['user-agent']
    ? headers['user-agent'].value.toLowerCase()
    : ''

  // Next.js src/module/device.module.ts 의 정규식과 일치시킴
  // /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  // 단, iPad 는 의도적으로 제외 (iPadOS Safari 가 기본적으로 desktop 모드로 동작)
  var mobileKeywords = [
    'mobile',
    'android',
    'iphone',
    'ipod',
    'blackberry',
    'iemobile',
    'opera mini',
    'webos',
    'windows phone',
  ]

  var isMobile = false

  for (var i = 0; i < mobileKeywords.length; i++) {
    if (userAgent.indexOf(mobileKeywords[i]) > -1) {
      isMobile = true
      break
    }
  }

  // iPad 는 desktop 으로 강제 (iPadOS 13 이후 Safari 기본 동작과 일치)
  // 위 mobileKeywords 의 'mobile' 매칭으로 isMobile=true 가 됐을 수 있으므로 명시적으로 false 처리
  if (userAgent.indexOf('ipad') > -1) {
    isMobile = false
  }

  var deviceType = isMobile ? 'mobile' : 'desktop'

  request.headers['x-device-type'] = { value: deviceType }

  return request
}
```
