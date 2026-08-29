---
slug: deploy-blog-build
title: '배포 스크립트에 블로그 빌드 통합 — npm run deploy로 일원화'
description: '배포 스크립트가 Next.js만 빌드해 changelog 글이 블로그에 반영되지 않던 문제를 해결했습니다. Docusaurus 빌드를 스크립트에 포함하고 진입점을 npm run deploy로 통일했습니다.'
authors: [jsg3121, claude]
tags: [refactoring, docs]
---

# 배포 스크립트에 블로그 빌드 통합

> **작업 날짜**: 2026-08-30
> **브랜치**: `hotfix/1.58.6`

## 📋 작업 개요

**작업 유형**: 리팩토링 (배포 절차 개선)
**담당**: jsg3121, claude

## 🎯 작업 목표

1.58.4에서 도입한 `deploy.sh`가 Next.js만 빌드해, changelog에 새 글을 추가해도 블로그에 반영되지 않는 문제가 있었다. Docusaurus 빌드를 스크립트에 포함하고 배포 진입점을 `npm run deploy` 하나로 통일한다.

<!-- truncate -->

## 📉 문제

`ecosystem.config.js`의 블로그 프로세스는 이렇게 정의돼 있다.

```js
{
  name: 'poke-korea-blog',
  cwd: './changelog',
  script: 'npx',
  args: 'docusaurus serve --port 3001 --no-open',
}
```

`docusaurus serve`는 **이미 빌드된 `changelog/build/` 를 서빙만** 한다. 빌드는 하지 않는다.

1.58.4에서 만든 `deploy.sh`에는 블로그 빌드 단계가 없었다. 따라서 배포를 해도 `git pull`로 마크다운 파일만 내려올 뿐, 빌드 산출물이 갱신되지 않아 **새 changelog 글이 블로그에 나타나지 않는다.**

`pm2 restart`가 `ecosystem.config.js` 전체를 대상으로 해서 블로그 프로세스도 재시작되지만, 옛 빌드 결과물을 다시 서빙할 뿐이었다.

### 기존 `npm run deploy`와의 중복

확인해 보니 `package.json`에 이미 배포 스크립트가 있었다.

```json
"deploy": "npm run build:docs && NODE_OPTIONS='--max-old-space-size=3072' next build && pm2 restart ecosystem.config.js --env production"
```

여기에는 `build:docs`(블로그 빌드)가 들어 있었다. 즉 **1.58.4에서 `deploy.sh`를 만들며 기존 스크립트의 존재를 놓쳤고, 결과적으로 배포 경로가 두 개로 갈라져 있었다.** 한쪽은 블로그를 빌드하고 한쪽은 안 하는 상태였다.

## ✨ 주요 변경사항

### 1. `deploy.sh`에 블로그 빌드 단계 추가

```bash
echo "▶ 의존성 설치 (루트)"
npm install

echo "▶ 의존성 설치 (changelog)"
npm install --prefix changelog

echo "▶ 블로그 빌드"
npm run build:docs

echo "▶ 프론트 빌드"
npm run build
```

`changelog`는 별도 Docusaurus 프로젝트라 자체 `node_modules`가 필요하므로 의존성 설치도 함께 넣었다.

### 2. `package.json`의 `deploy`를 스크립트 호출로 교체

```diff
- "deploy": "npm run build:docs && NODE_OPTIONS='--max-old-space-size=3072' next build && pm2 restart ecosystem.config.js --env production",
+ "deploy": "bash deploy.sh",
```

배포 경로가 하나로 합쳐진다.

## 🔧 기술적 세부사항

### 블로그를 프론트보다 먼저 빌드하는 이유

순서를 블로그 → 프론트로 잡았다. `set -e`가 걸려 있어 어느 단계든 실패하면 즉시 중단되는데, **블로그 빌드가 실패했을 때 본 서비스를 건드리지 않은 상태로 남기기 위해서**다.

반대 순서라면 프론트 빌드가 끝난 뒤 블로그에서 실패했을 때, `.next`는 새 빌드로 교체됐지만 `pm2 restart`는 실행되지 않은 어중간한 상태가 된다. 본 서비스가 더 중요하므로 위험한 단계를 앞에 둔다.

### 왜 조건부가 아닌 항상 빌드인가

changelog 변경이 있을 때만 빌드하는 방안도 검토했으나, 항상 빌드하는 쪽을 택했다.

조건부는 `git diff HEAD@{1} HEAD` 로 변경을 감지해야 하는데, 이 방식은 reflog에 의존해서 배포 서버처럼 히스토리가 단순한 환경에서 예외 상황이 생길 수 있다. 판정을 잘못하면 블로그가 조용히 갱신되지 않고, 그건 지금 고치려는 문제와 똑같다.

빌드 시간이 늘어나는 비용보다 **"배포하면 항상 최신"이라는 단순함**이 낫다고 판단했다.

### `npm run deploy` 로 통일한 이유

`./deploy.sh` 직접 실행도 가능하지만 몇 가지 이점이 있다.

- 진입점이 `npm run dev` / `npm run build` 와 같은 자리에 놓여 배포 방법을 따로 기억할 필요가 없다
- `bash deploy.sh` 형태로 호출하므로 실행 권한이 없어도 `Permission denied` 가 나지 않는다
- `package.json` scripts만 봐도 배포 방법을 알 수 있다

### 검증

| 항목 | 결과 |
| --- | --- |
| `bash -n deploy.sh` | 통과 |
| `npm run build:docs` 실제 실행 | 성공 — `Generated static files in "build"` |
| 빌드 산출물 gitignore | `changelog/.gitignore` 에서 `/build`, `/node_modules` 처리 확인 |
| 변경 파일 | `deploy.sh`, `package.json` 2건만 |

블로그 빌드 시 기존 앵커 링크 관련 경고가 출력되지만 빌드는 정상 완료된다. 이번 변경과 무관한 기존 사항이다.

## 📌 참고 사항

- 배포 명령이 `npm run deploy` 로 바뀐다. `CF_DISTRIBUTION_ID` 환경변수는 그대로 필요하다.
- 블로그 빌드가 추가되면서 배포 소요 시간과 메모리 사용량이 늘어난다. 서버는 t3.small(2GB)에 Postgres·GraphQL 백엔드가 함께 올라가 있으나 스왑 4GB가 있고 OOM 이력은 없다. 다만 Next.js 빌드와 Docusaurus 빌드가 연달아 도는 구성이므로, 배포 중 메모리 사용을 한 번 관찰해 둘 필요가 있다.
- 블로그만 갱신하고 싶을 때는 기존대로 `npm run build:docs && pm2 restart poke-korea-blog` 를 쓰면 된다.

## 🔗 참고 자료

- [Docusaurus — Deployment](https://docusaurus.io/docs/deployment)
- [npm — install `--prefix`](https://docs.npmjs.com/cli/v10/commands/npm-install)
- [PM2 — Ecosystem File](https://pm2.keymetrics.io/docs/usage/application-declaration/)
