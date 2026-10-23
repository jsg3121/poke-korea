---
slug: node-security
title: 'Node.js 2026년 10월 보안 릴리스 대응 — 기준 버전을 22.23.4로 상향'
description: 'Node.js 22.x에서 Brotli RCE 등 High 4건을 포함한 CVE 10건이 패치되어, .nvmrc와 package.json engines의 Node 기준 버전을 패치 버전인 22.23.4로 올렸다.'
authors: [jsg3121, claude]
tags: [bug-fix]
---

# Node.js 2026년 10월 보안 릴리스 대응 — 기준 버전을 22.23.4로 상향

> **작업 날짜**: 2026-10-24
> **브랜치**: `feature/1.61.5-node-security`

## 📋 작업 개요

**작업 유형**: 버그 수정 (핫픽스, 보안)
**담당**: jsg3121, Claude

## 🎯 작업 목표

프로젝트가 기준으로 삼는 Node.js 버전을 2026년 10월 보안 패치가 포함된 `22.23.4`로 올리고, 저장소에 최소 버전을 명시해 로컬·서버 버전이 패치 이전으로 남아 있으면 드러나게 한다.

<!-- truncate -->

## 📉 왜 필요했나

2026-10-21 Node.js가 22.x·24.x·26.x 전 라인에 보안 릴리스를 배포했다. 전체 CVE 10건 중 High가 4건이며, 공식 우회책은 없고 패치 버전으로의 업그레이드만이 대응이다. 아래는 그중 우리가 쓰는 22.x에 해당하는 Medium 이상 건이다(Low 1건 별도).

| CVE             | 내용                                        | 심각도 |
| --------------- | ------------------------------------------- | ------ |
| CVE-2026-111497 | Brotli 디코더 out-of-bounds write, RCE 가능 | High   |
| CVE-2026-105482 | `dns.resolve*()`가 NUL 문자에서 이름을 자름 | High   |
| CVE-2026-106069 | TLS 호스트명 검증 우회 (선행 0이 붙은 IPv4) | High   |
| CVE-2026-105481 | keep-alive 소켓이 미리 쓰인 응답을 처리     | Medium |
| CVE-2026-106072 | 비정규 IPv4 호스트명 인증서 검증 우회       | Medium |
| CVE-2026-106074 | crypto 엔트로피 캐시가 스냅샷에 저장됨      | Medium |

우리 코드(`src/`)는 `zlib`·`tls`·`dns`·`crypto`를 직접 쓰지 않지만, Next.js 서버의 `fetch`(undici)가 GraphQL 백엔드 등에 HTTPS 요청을 보내고 `br` 압축 응답을 해제하는 과정에서 영향 경로를 거칠 수 있다.

기존 `.nvmrc`는 `22.13.1`로, 이번 릴리스뿐 아니라 그 이전 보안 패치도 모두 빠진 버전이었다. `package.json`에는 `engines`가 없어 최소 버전을 확인할 수단이 없었다.

## ✨ 주요 변경사항

### 변경 1: `.nvmrc` 기준 버전 상향

**변경 전**:

```text
22.13.1
```

**변경 후**:

```text
22.23.4
```

### 변경 2: `package.json`에 `engines.node` 추가

```json
"engines": {
  "node": ">=22.23.4"
}
```

`package-lock.json`은 `npm install --package-lock-only`로 갱신했다. 루트 패키지에 `engines`가 기록되었고, npm이 devDependency(`playwright`) 하위의 `fsevents`에 누락돼 있던 `dev: true` 표시를 함께 정규화했다.

## 🔍 검증

- 앱 코드 변경이 없어 빌드·런타임 동작은 바뀌지 않는다.
- `.npmrc`에 `engine-strict`가 없으므로 `engines`는 경고(`EBADENGINE`)만 내고 설치를 막지 않는다. 서버 Node가 아직 낮아도 `deploy.sh`의 `npm install`은 중단되지 않는다.

## 📌 참고 사항

**이 PR을 배포해도 서버의 Node는 올라가지 않는다.** `deploy.sh`에는 Node 버전 전환 단계가 없고, PM2 데몬은 기동 시점의 Node로 앱을 실행하므로 `pm2 restart`만으로는 새 버전이 적용되지 않는다. 실제 대응을 위해 서버에서 다음을 수행해야 한다.

```bash
node -v                       # 22.23.4 미만이면 업그레이드
nvm install && nvm alias default 22.23.4
pm2 update                    # 프로세스 목록 저장 → 데몬을 현재 Node로 재기동
pm2 unstartup && pm2 startup  # 부팅 스크립트의 Node 경로 갱신 (startup 사용 시)
pm2 save
```

### 참고 자료

- [Node.js — Wednesday, October 21, 2026 Security Releases](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
- [PM2 — Update PM2](https://pm2.keymetrics.io/docs/usage/update-pm2)
- [npm Docs — package.json engines](https://docs.npmjs.com/cli/configuring-npm/package-json#engines)
