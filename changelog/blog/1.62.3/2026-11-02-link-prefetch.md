---
slug: link-prefetch
title: '공통 메뉴 링크의 prefetch를 꺼 CloudFront 요청 줄이기'
description: '모든 페이지에 붙는 모바일 탭바·헤더 메뉴 링크 18개의 prefetch를 꺼, 클릭하지 않는 링크가 만들던 RSC 요청과 그로 인한 CloudFront 요청 비용·오리진 부하를 줄였다.'
authors: [jsg3121, claude]
tags: [performance, nextjs]
---

# 공통 메뉴 링크의 prefetch를 꺼 CloudFront 요청 줄이기

> **작업 날짜**: 2026-11-02
> **브랜치**: `feature/1.62.3-link-prefetch`

## 📋 작업 개요

**작업 유형**: 성능 개선 (패치)
**담당**: jsg3121, Claude

## 🎯 작업 목표

모든 페이지에 렌더링되는 공통 메뉴 링크가 페이지 조회마다 만들던 RSC prefetch 요청을 없애, CloudFront 요청 비용과 EC2 오리진 부하를 줄인다.

<!-- truncate -->

## 📉 왜 필요했나

CloudFront 요금이 5~6월 월 $1~2에서 7월 이후 월 $9~14로 늘었다. 비용은 거의 전부 요청 수 과금이고, 계정 전체 월 요청 수(10월 약 1,630만 건)가 무료 한도 1,000만 건을 넘은 것이 원인이었다.

`poke-korea.com` 액세스 로그를 분석한 결과, 요청 대부분이 Next.js `<Link>` prefetch가 만든 RSC 요청이었다.

| 지표 (2026-10-28 표본)              | 값      |
| ----------------------------------- | ------- |
| 전체 요청 중 RSC(`?_rsc=`) 요청     | 약 70%  |
| 페이지 조회 1회당 RSC 요청          | 약 8.4건 |
| 오리진(EC2)까지 간 요청 중 RSC 비율 | 78%     |

Next.js 15는 화면에 들어온 링크를 미리 받아 둔다. 모바일 탭바(링크 7개)는 항상 화면에 고정되어 있고, 데스크톱 헤더(메뉴 7개 + 드롭다운 4개)도 모든 페이지에 있다. 검색으로 들어와 한두 페이지만 보는 방문자에게도 매번 이 링크들을 미리 받고 있었다.

결정 근거와 검토한 대안은 [ADR-0025](https://github.com/jsg3121/poke-korea/blob/main/.claude/decisions/records/ADR-0025-layout-link-prefetch-off.md)에 정리했다.

## ✨ 주요 변경사항

### 변경 1: 모바일 탭바 링크 7개의 prefetch 끄기

`src/components/MobileTabBar.component.tsx`의 모든 `<Link>`(홈·도감·기술·특성·상성·퀴즈·챔피언스)에 `prefetch={false}`를 추가했다.

**변경 전**:

```tsx
<Link
  href="/list"
  className={...}
>
```

**변경 후**:

```tsx
<Link
  href="/list"
  prefetch={false}
  className={...}
>
```

### 변경 2: 데스크톱 헤더 메뉴 링크 11개의 prefetch 끄기

`src/containers/desktop/header/nav/HeaderNav.container.tsx`의 메뉴 7개와 챔피언스 드롭다운 4개(홈·포켓몬 도감·티어 리스트·대회)에 같은 방식으로 `prefetch={false}`를 추가했다. 드롭다운은 `invisible`로 숨겨져 있지만 레이아웃 공간을 차지해 prefetch 대상이 될 수 있어 함께 포함했다.

## 🔍 검증

- `npm run format:check` 통과
- 변경한 두 파일에 `eslint` 통과, `tsc --noEmit`에서 두 파일 관련 타입 에러 없음
- 두 파일의 `<Link>` 수(7개, 11개)와 `prefetch={false}` 수가 일치하는지 확인
- **전체 `npm run lint`·`tsc`는 작업 환경에서 통과시키지 못했다**: GraphQL 생성 파일(`src/graphql/gqlGenerated.ts`·`typeGenerated.ts`)이 없어 이 파일을 import하는 모든 파일에서 에러가 났다. 생성에 필요한 로컬 GraphQL 서버를 띄울 수 없었고, 운영 서버는 introspection이 꺼져 있다. 이번 변경과 무관한 에러지만, `npm run codegen` 후 전체 린트·빌드 확인이 필요하다.
- **확인하지 않은 것**: prefetch는 프로덕션 빌드에서만 동작해 개발 서버로는 차이를 볼 수 없다. 배포 후 브라우저 개발자 도구 Network 탭에서 메뉴 링크의 `?_rsc=` 요청이 페이지 진입 시 나가지 않는지 확인이 필요하다.

## 📌 참고 사항

- `prefetch={false}`는 hover 때의 prefetch도 끈다. 메뉴를 누르면 그때 RSC를 요청하므로 이동 전에 짧은 대기가 생길 수 있다. 메뉴 목적지는 캐시 적중률이 높아 대기는 짧을 것으로 예상한다.
- 페이지 본문 링크(목록 카드, 상세 페이지 내부 링크)는 기본 prefetch를 유지한다.
- **후속 관찰 대상** (1~2주):
  - CloudFront `Requests`(`E3TRB0VXGC6JWI`)와 Cost Explorer `AP-Requests-Tier2-HTTPS`
  - ALB `TargetResponseTime`(`poke-korea-group`), EC2 메모리 사용률
  - Search Console Core Web Vitals
