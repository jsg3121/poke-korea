---
slug: oauth-credential-guard
title: 'OAuth 자격증명 gitignore 방어선 추가'
description: '애드센스 API 연동에 쓸 OAuth 클라이언트 시크릿과 리프레시 토큰이 저장소에 커밋되지 않도록 gitignore 패턴을 추가하고, 자격증명 관리 규약을 analyzer/index.md에 명문화했습니다.'
authors: [jsg3121, claude]
tags: [chore]
---

# OAuth 자격증명 gitignore 방어선 추가

> **작업 날짜**: 2026-08-31
> **브랜치**: `feature/1.58.9`

## 📋 작업 개요

**작업 유형**: 개발 환경 개선
**담당**: jsg3121, claude

## 🎯 작업 목표

애드센스 API 연동에서 다룰 OAuth 자격증명이 저장소로 들어오지 못하게 막는다.

<!-- truncate -->

## 📉 왜 필요했나

애드센스는 서비스 계정을 지원하지 않아 OAuth 사용자 인증을 써야 한다. 이 과정에서 두 종류의 비밀 파일이 생긴다.

- **클라이언트 시크릿** — GCP에서 발급받는 `client_secret_*.json`
- **리프레시 토큰** — 브라우저 동의로 받아 저장하는 파일

특히 리프레시 토큰은 **만료 없이 계정 데이터에 접근**할 수 있어 서비스 계정 키와 동급의 위험도를 가진다. 유출되면 애드센스 수익 데이터가 통째로 노출된다.

기존 `.gitignore`에는 서비스 계정 키 방어선(`*service-account*.json`, `gcp-*.json`)만 있었다. 다운로드 파일명이 `gcp_adsense_secret.json`이었던 것처럼 이름은 제각각이라, OAuth 계열 패턴을 별도로 추가해야 했다.

## 🔨 작업 내용

### `.gitignore` 패턴 추가

```text
*oauth*.json
*-client.json
client_secret*.json
```

기존 서비스 계정 블록 바로 아래에 두고, 애드센스가 왜 OAuth를 쓰는지와 스크립트는 정상 커밋된다는 점을 주석으로 남겼다.

### `analyzer/index.md`에 자격증명 관리 규약 추가

스크립트와 자격증명의 분리 원칙을 표로 명시했다.

| 대상 | 위치 | 커밋 |
| --- | --- | --- |
| 조회 스크립트 | `.claude/analyzer/scripts/` | O |
| 서비스 계정 키 | `~/.config/poke-korea/gcp-service-account.json` | X |
| OAuth 클라이언트 시크릿 | `~/.config/poke-korea/adsense-client.json` | X |
| OAuth 리프레시 토큰 | `~/.config/poke-korea/adsense-oauth.json` | X |

## ⚠️ 설계 시 고려한 점

### gitignore는 1차 방어선이 아니다

패턴 매칭은 **파일명이 예상 범위에 있을 때만** 동작한다. `token.json`이나 `credentials.json` 같은 이름이면 그대로 뚫린다. 그래서 문서에 "최후의 안전망일 뿐 1차 규칙이 아니다"라고 명시했다.

진짜 규칙은 **비밀값을 애초에 저장소 밖에 쓰는 것**이다. 앞으로 작성할 `adsense-authorize.js`도 토큰 저장 위치를 `~/.config/poke-korea/`로 고정한다.

### 스크립트는 계속 커밋된다

`.claude/analyzer/*.*` 패턴은 폴더 직속 파일(수익 CSV·zip)만 제외하고 `scripts/` 하위는 걸리지 않는다. 이는 의도된 설계이며, 이번 변경으로 달라지지 않는다. 스크립트에는 경로만 있고 비밀값이 없어 공유해도 안전하다.

패턴 추가 후 기존 추적 파일 중 새로 제외되는 것이 없는지 확인했다 — 해당 없음.

## ✅ 검증

`git check-ignore`로 9개 케이스를 확인했다.

**차단 (5종)** — `adsense-oauth.json`, `adsense-client.json`, `client_secret_123.json`, `gcp-service-account.json`, `src/oauth-config.json`

**추적 유지 (4종)** — `scripts/ga4.js`, `scripts/google-auth.js`, `package.json`, `src/app/privacy/page.tsx`

## 📌 여담: 훅이 바로 잡아냈다

이 브랜치를 만들 때 1.58.8에서 추가한 push 훅이 실제로 작동했다.

`git checkout -b feature/1.58.9 origin/main`으로 분기했더니 git이 **upstream을 `origin/main`으로 자동 설정**했다. 이대로 `git push`하면 작업 커밋이 main으로 올라가는, 바로 그 훅이 막으려던 상황이다.

```text
현재 브랜치 'feature/1.58.9'의 upstream이 'origin/main'입니다.
이대로 push하면 작업 커밋이 main에 올라갑니다.
```

원인은 `branch.autoSetupMerge` 기본값이다. 원격 추적 브랜치(`origin/main`)에서 분기하면 git이 자동으로 추적을 건다. `workflow.md`에는 "이 명령은 upstream을 설정하지 않는다"고 적혀 있었는데 사실과 달랐고, 이번 커밋에서 함께 고쳤다.

분기 직후 `git branch --unset-upstream`을 실행하도록 절차에 추가했다. 훅이 없었다면 문서의 오류도, 실제 위험도 모른 채 지나갔을 것이다.
