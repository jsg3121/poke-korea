---
slug: robots-disallow
title: 'robots.txt 소스 코드 경로 크롤링 차단'
description: 'Google Search Console에서 소스 코드 경로가 404로 감지되는 문제를 robots.txt Disallow 규칙 추가로 해결'
authors: [jsg3121, claude]
tags: [seo]
---

# robots.txt 소스 코드 경로 크롤링 차단

> **작업 날짜**: 2026-02-13
> **브랜치**: `feature/1.33.1-robots-disallow`

## 📋 작업 개요

**작업 유형**: 버그 수정
**담당**: jsg3121, claude

## 🎯 작업 목표

Google Search Console에서 `/src/...`, `/changelog/*.md`, `/package.json`, `/CLAUDE.md` 등 소스 코드 경로가 404 페이지로 감지되는 문제 해결. Next.js 빌드 번들 내 메타데이터에 포함된 소스 경로 문자열을 Google 크롤러가 URL로 오인하여 크롤링을 시도한 것이 원인으로, `robots.txt`에 Disallow 규칙을 추가하여 크롤러 접근을 차단.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: robots.ts Disallow 규칙 추가

**변경 전**:

```typescript
disallow: '/image',
```

**변경 후**:

```typescript
disallow: [
  '/image',
  '/src/',
  '/changelog/*.md',
  '/package.json',
  '/CLAUDE.md',
],
```

## 🔍 원인 분석

| 경로 패턴                                      | 노출 원인                                                     |
| ---------------------------------------------- | ------------------------------------------------------------- |
| `/src/components/...`, `/src/constants/...` 등 | Next.js webpack 빌드 번들의 청크 파일 내 소스 경로 메타데이터 |
| `/changelog/*.md`                              | Docusaurus 블로그의 마크다운 원본 파일 경로 참조              |
| `/package.json`, `/CLAUDE.md`                  | 빌드 번들 내 프로젝트 루트 파일 경로 문자열                   |

Google 크롤러가 JavaScript 번들을 파싱하면서 내부 문자열을 URL로 오인하여 크롤링을 시도했으며, 해당 경로는 실제 페이지가 아니므로 404 응답이 반환됨.

## 🔧 기술적 세부사항

- **수정 파일**: `src/app/robots.ts`
- `disallow` 값을 단일 문자열에서 배열로 변경하여 다수의 경로 차단 규칙 추가
- Next.js Metadata API의 `MetadataRoute.Robots` 타입은 `disallow`에 `string | string[]`을 지원

## 📌 참고 사항

- `robots.txt` 차단 후에도 이미 인덱싱된 URL은 일정 시간이 지나야 Search Console에서 제거됨
- 즉시 제거가 필요한 경우 Google Search Console의 "삭제" 도구에서 일괄 삭제 요청 가능
