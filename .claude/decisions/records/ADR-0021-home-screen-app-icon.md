# ADR-0021: 홈 화면 아이콘은 metadata.icons 경로와 매니페스트로 제공하고 주소창은 유지한다

- **상태**: 승인
- **날짜**: 2026-10-11
- **담당**: jsg3121 + Claude

## 맥락

사용자 제보: 아이폰에서 "홈 화면에 추가"를 하면 아이콘이 로고가 아니라 **"포" 한 글자**로 표시된다.

원인은 홈 화면용 아이콘이 하나도 없다는 것이다. 루트 레이아웃의 `metadata.icons`에는 `favicon.ico`(16×16·32×32)만 있고, `apple-touch-icon`과 웹 앱 매니페스트가 없다. iOS Safari는 `apple-touch-icon`이 없으면 페이지 제목의 첫 글자로 아이콘을 만들고, Android Chrome도 쓸 만한 크기의 아이콘이 없으면 비슷한 대체 아이콘을 만든다.

플랫폼마다 아이콘을 읽는 위치가 다르다.

| 플랫폼  | 읽는 위치                         | 필요한 이미지                         |
| ------- | --------------------------------- | ------------------------------------- |
| iOS     | `<link rel="apple-touch-icon">`   | 180×180 PNG, 불투명 배경              |
| Android | 웹 앱 매니페스트 `icons`          | 192×192·512×512 PNG, `maskable` 권장  |

함께 정해야 할 것은 **홈 화면에서 열었을 때 주소창을 유지할지**다. 주소창이 없는 앱 모드(`standalone`)는 브라우저 뒤로가기 버튼이 사라진다. 내부 페이지 이동이 많은 서비스 특성상 이것이 불편할 수 있다는 우려가 있었다.

## 결정

**1. 아이콘 이미지는 `public/assets/icons/`에 두고, iOS는 `metadata.icons.apple`로, Android는 `src/app/manifest.ts`로 연결한다.**

- `app-icon-apple-180.png`(180×180): 루트 레이아웃 `metadata.icons.apple`에 경로 지정
- `app-icon-192.png`·`app-icon-512.png`·`app-icon-maskable-512.png`: `manifest.ts`의 `icons`에 지정
- 브라우저 탭 favicon은 기존 `public/favicon.ico`와 `metadata.icons.icon`을 그대로 둔다
- 이미지는 로고(`logo.svg`)의 글자를 "POKE / KOREA" 2줄로 나누고 몬스터볼을 1.9배로 키워, 테마 색 `#27374D` 배경 위에 얹어 만든다. maskable 아이콘은 로고를 가운데 안전 영역(지름 80%) 안에 둔다

**2. 주소창은 유지한다.**

- 매니페스트 `display`는 `'browser'`로 한다
- iOS 앱 모드 메타 태그(`appleWebApp.capable` → `apple-mobile-web-app-capable`)는 넣지 않는다

## 근거

- **처음에는 파일 규칙(`src/app/icon.png`·`apple-icon.png`)으로 결정했으나 실측에서 뒤집혔다.** Next.js 15.5.18 소스를 확인한 결과, 두 가지 제약이 있었다.
  - **설정이 있으면 아이콘 파일이 무시된다.** `metadata.icons`가 하나라도 있으면 파일 기반 아이콘이 적용되지 않는다(`next/dist/lib/metadata/resolve-metadata.js`의 `if (!resolvedMetadata.icons)` 분기). 그래서 설정을 지우고 favicon까지 `src/app/favicon.ico`로 옮겨야 한다.
  - **favicon을 옮기면 캐시 정책이 바뀐다.** Next.js가 favicon 라우트에 `public, max-age=0, must-revalidate`를 고정으로 붙인다(`next/dist/build/webpack/loaders/next-metadata-route-loader.js`). 기존 `next.config.js`의 `/favicon.ico` 캐싱(브라우저 1일 / CloudFront 1년)은 성능 개선으로 일부러 넣은 규칙인데, 이것과 충돌한다.
  - 그래서 favicon을 건드리지 않고 `metadata.icons`에 `apple` 경로 한 줄만 추가하는 쪽이 변경이 가장 작다.
- **`manifest.ts` 파일 규칙은 `metadata.icons`와 별개로 적용된다.** 매니페스트는 위 분기의 영향을 받지 않으므로 파일 규칙을 그대로 쓴다.
- **`src/app/icon.png`(192px)는 두지 않는다.** 이 파일이 있으면 브라우저 탭과 검색 결과의 favicon 후보에 큰 로고 이미지가 끼어든다. Android 홈 화면은 매니페스트 아이콘을 쓰므로 필요 없다.
- **iOS는 투명 배경을 검은색으로 채운다.** 그래서 로고 SVG를 그대로 쓰지 않고 불투명한 배경색을 깔아 PNG로 만든다.
- **`display: 'browser'`는 Chrome 설치 기준을 충족하지 않는다.** 설치 기준은 `fullscreen`·`standalone`·`minimal-ui`·`window-controls-overlay`만 인정한다. 그래서 Android에서는 앱으로 설치되지 않고 바로가기로 추가되어 일반 브라우저 탭으로 열린다. 매니페스트 아이콘은 그대로 적용된다.

### iOS 26의 제약과 허용 판단

iOS 26부터 Safari의 "홈 화면에 추가"에는 **"웹 앱으로 열기" 토글이 기본으로 켜져 있다.** 매니페스트나 메타 태그와 관계없이 모든 사이트가 주소창 없는 웹 앱으로 열리고, 이 토글은 사용자만 끌 수 있다. 즉 **iOS 26 이상에서는 사이트가 주소창 유지를 강제할 수 없다.**

| 환경            | 결과                                                 |
| --------------- | ---------------------------------------------------- |
| Android Chrome  | 바로가기로 추가, 브라우저 탭으로 열림 → 주소창 유지 |
| iOS 15.4~18     | Safari로 열림 → 주소창 유지                          |
| iOS 26 이상     | 기본이 웹 앱 모드 → 주소창 없음(사용자가 토글로 변경 가능) |

이 제약은 허용한다. iOS 홈 화면 웹 앱은 iOS 12.2부터 **화면 가장자리 스와이프로 뒤로·앞으로 가기**를 지원한다. 지원 범위(iOS ≥15.4) 전체에서 동작하고, Next.js의 클라이언트 내비게이션은 History API에 기록되므로 스와이프로 이전 페이지에 돌아갈 수 있다. 원래 우려했던 "뒤로가기 불가"는 발생하지 않는다.

## 대안

| 대안 | 장점 | 단점 | 불채택 사유 |
| ---- | ---- | ---- | ----------- |
| 코드로 아이콘 생성 (`icon.tsx`·`apple-icon.tsx` + `ImageResponse`) | 이미지 파일 관리 불필요 | 디자인 세부 조정이 어렵고, 정적 아이콘에 비해 구조가 과함 | 아이콘은 거의 바뀌지 않는 정적 자산이다 |
| 파일 규칙으로 통일 (`src/app/favicon.ico`·`apple-icon.png`, `metadata.icons` 삭제) | URL에 해시가 붙어 교체가 쉬움 | favicon 캐시가 Next.js 고정값(매번 재검증)으로 바뀌어 기존 캐싱 정책과 충돌 | 기존 성능 최적화를 되돌리면서까지 얻는 이득이 작다 |
| `display: 'standalone'` (앱 모드) | Android에서 앱처럼 설치, 몰입감 | 브라우저 UI가 사라져 새로고침·공유·주소 확인 불가 | 주소창 유지를 원했다 |
| `display: 'minimal-ui'` | Android에서 설치되면서 뒤로가기·새로고침 바 제공 | iOS 미지원. Android는 시스템 뒤로가기 제스처가 있어 이득이 작음 | 비용 대비 효과가 작다 |
| 앱 모드 전용 뒤로가기 버튼 (`display-mode: standalone` 감지 후 헤더에 표시) | iOS 26 사용자에게 보이는 뒤로가기 제공 | 헤더 UI 변경이 필요하고 범위가 커짐 | 스와이프로 뒤로 갈 수 있어 지금은 불필요 |

## 결과

- iOS·Android 홈 화면에 로고 아이콘이 표시된다.
- Android와 iOS 18 이하에서는 홈 화면에서 열어도 주소창이 유지된다.
- iOS 26 이상에서는 기본적으로 주소창 없이 열리지만 스와이프로 뒤로 갈 수 있다.
- 아이콘 이미지는 `/assets/*.png` 규칙에 따라 1년 `immutable`로 캐시된다. **아이콘을 바꿀 때는 같은 파일을 덮어쓰지 말고 파일명을 바꿔야** 기존 방문자에게 반영된다.
- **재검토 조건**: iOS 앱 모드에서 이동이 불편하다는 제보가 들어오면, 기각한 "앱 모드 전용 뒤로가기 버튼"을 다시 검토한다.

## 참고 자료

- [Next.js — App Icons 파일 규칙](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
- [Next.js — manifest.json 파일 규칙](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)
- [Apple — Configuring Web Applications (apple-touch-icon)](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfigureWebApps/ConfigureWebApps.html)
- [web.dev — Maskable icons](https://web.dev/articles/maskable-icon)
- [web.dev — Add a web app manifest](https://web.dev/articles/add-manifest)
- [web.dev — Chrome 설치 기준](https://web.dev/articles/install-criteria)
- [WebKit — News from WWDC25: Safari 26 beta (Open as Web App 기본값)](https://webkit.org/blog/16993/news-from-wwdc25-web-technology-coming-this-fall-in-safari-26-beta/)
- [WebKit Features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)
- [WebKit Bugzilla #195177 — 홈 화면 웹 앱 스와이프 내비게이션](https://bugs.webkit.org/show_bug.cgi?id=195177)
