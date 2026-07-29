---
slug: build-heap-memory
title: 'AWS 빌드 힙 메모리 할당 옵션 추가'
description: 'AWS 빌드 과정에서 발생하는 JavaScript heap out of memory 오류를 해결하기 위해 build/deploy 스크립트에 V8 힙 메모리 상한 옵션을 추가했습니다.'
authors: [jsg3121, claude]
tags: [performance, nextjs]
---

# AWS 빌드 힙 메모리 할당 옵션 추가

> **작업 날짜**: 2026-07-29
> **브랜치**: `feature/1.54.2-build-heap-memory`

## 📋 작업 개요

**작업 유형**: 성능 개선 (빌드 안정화)
**담당**: jsg3121, claude

## 🎯 작업 목표

AWS 빌드 환경에서 Next.js 프로덕션 빌드 도중 Node.js V8 힙 메모리 한계를 초과해 `JavaScript heap out of memory` (OOM) 오류로 빌드가 실패하는 문제를 해결한다. `build`/`deploy` 스크립트에서 실행되는 `next build`에 힙 메모리 상한 옵션을 명시하여 빌드 안정성을 확보한다.

<!-- truncate -->

## ✨ 주요 변경사항

### 변경 1: `build` 스크립트에 힙 메모리 옵션 추가

`next build` 실행 시 `NODE_OPTIONS`로 V8 old space 힙 상한을 명시한다. Next.js는 빌드 워커를 `fork`할 때 `NODE_OPTIONS`를 상속하므로 자식 프로세스에도 동일하게 적용된다.

**변경 전**:
```json
"build": "next build",
```

**변경 후**:
```json
"build": "NODE_OPTIONS='--max-old-space-size=3072' next build",
```

### 변경 2: `deploy` 스크립트의 `next build`에 동일 옵션 적용

`deploy`는 `build:docs`(Docusaurus 빌드) → `next build` → `pm2 restart` 순으로 실행된다. Docusaurus 빌드에는 영향을 주지 않도록 `next build` 앞에만 옵션을 인라인으로 배치했다.

**변경 전**:
```json
"deploy": "npm run build:docs && next build && pm2 restart ecosystem.config.js --env production",
```

**변경 후**:
```json
"deploy": "npm run build:docs && NODE_OPTIONS='--max-old-space-size=3072' next build && pm2 restart ecosystem.config.js --env production",
```

## 🔧 기술적 세부사항

- **옵션**: [`--max-old-space-size=<MB>`](https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-megabytes) — V8 old space(주요 힙)의 최대 크기를 MB 단위로 설정한다.
- **적용 방식**: `package.json` 스크립트에 `NODE_OPTIONS` 환경변수를 인라인으로 지정. 인프라(buildspec/셸) 설정에 의존하지 않아 재현성이 높다.
- **적용 값**: `3072` (3GB) — 빌드 인스턴스에서 안전하게 확보 가능한 최대치
- **수정 파일**: `package.json` (`scripts.build`, `scripts.deploy`)

## 📌 참고 사항

- **인스턴스 사양과의 관계**: `--max-old-space-size`는 V8 힙 상한이며, Node 런타임/네이티브 버퍼/OS가 별도로 메모리를 사용한다. 빌드 인스턴스 총 메모리의 약 75~80% 이하로 설정하는 것이 안전하다. `3072`는 현재 빌드 인스턴스에서 안전하게 확보 가능한 최대치로 설정한 값이다.
- **크로스플랫폼**: `NODE_OPTIONS='...'` 인라인 방식은 POSIX 셸(Linux/macOS) 기준이다. AWS 빌드가 Linux 환경이므로 현재 영향은 없으나, Windows에서 동일 스크립트 실행이 필요해지면 `cross-env` 도입을 검토한다.
- **후속 조정**: 빌드가 계속 실패하면 힙 값 추가 상향은 인스턴스 여유 메모리 한계상 어려우므로, 빌드 인스턴스 메모리 승급을 함께 검토한다.
