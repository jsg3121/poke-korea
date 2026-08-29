---
slug: deploy-script
title: '배포 스크립트 도입 — CDN 캐시 무효화 누락으로 인한 전면 클릭 불가 장애 대응'
description: '배포 후 CloudFront 무효화를 수동으로 하다 한 번 빠뜨려 페이지 전체가 클릭 불가 상태가 된 장애를 겪었습니다. 빌드부터 무효화까지를 한 스크립트로 묶어 절차 누락 자체를 없앴습니다.'
authors: [jsg3121, claude]
tags: [bug-fix, performance]
---

# 배포 스크립트 도입

> **작업 날짜**: 2026-08-30
> **브랜치**: `hotfix/1.58.4`

## 📋 작업 개요

**작업 유형**: 버그 수정 (장애 대응)
**담당**: jsg3121, claude

## 🎯 작업 목표

배포 후 CloudFront 캐시 무효화를 수동으로 수행해 왔는데, 1.58.2 배포에서 이 단계가 누락되어 사이트 전체가 클릭 불가 상태가 되는 장애가 발생했다. 빌드부터 무효화까지를 하나의 스크립트로 묶어 사람이 잊을 수 있는 여지를 제거한다.

<!-- truncate -->

## 🐛 발생한 장애

### 증상

메인 페이지나 도감 목록에서 포켓몬 카드를 눌러 상세로 이동한 뒤, 뒤로가기로 돌아와 다른 포켓몬을 누르면 **아무 반응이 없었다.** 새로고침하면 그 포켓몬은 들어가지지만, 다시 뒤로가기 후 다른 카드를 누르면 동일하게 먹통이었다.

콘솔과 네트워크 로그에 아무것도 찍히지 않아 원인 파악이 어려웠다. 로컬 개발·프로덕션 환경 모두에서 재현되지 않았다.

### 원인

CDN이 들고 있던 **옛 배포의 HTML**이 원인이었다.

HTML에는 빌드마다 해시가 바뀌는 JS 청크 파일명이 그대로 박힌다.

```html
<script src="/_next/static/chunks/webpack-59fc7da40cb9c291.js" async></script>
```

재배포하면 이 해시가 전부 바뀌는데, CloudFront가 옛 HTML을 계속 서빙하면 그 HTML이 요청하는 청크는 서버에 존재하지 않는다. 실제로 확인했을 때 메인 페이지가 참조하는 17개 청크 중 3개가 404였고, 그중 하나가 **웹팩 런타임**이었다.

웹팩 런타임은 나머지 모든 청크를 불러오는 부트스트랩이다. 이것이 404면 hydration이 시작조차 못 한다.

### 증상이 그렇게 나타난 이유

| 관찰 | 원인 |
| --- | --- |
| 화면은 정상 표시 | SSR로 서버가 HTML을 그려 보내므로 보이기는 함 |
| 카드 클릭 무반응 | hydration 실패로 `<Link>`에 이벤트 핸들러가 붙지 않음 |
| 새로고침하면 이동됨 | `<Link>`는 실제 `<a href>`라 JS 없이도 브라우저 기본 이동이 동작 |
| 뒤로가기 후 재발 | 캐시된 동일 HTML이 복원되어 다시 hydration 실패 |
| 콘솔 로그 없음 | `removeConsole: true` 설정으로 프로덕션 콘솔 출력이 제거됨 |
| 로컬 미재현 | 로컬에는 CDN이 없어 HTML과 청크가 항상 같은 빌드 |

카드 이동 코드 자체에는 문제가 없었다. `PokemonCardShell`은 순수한 `<Link href={...}>` 하나만 쓰고 있고, `preventDefault`나 클릭 가드가 코드베이스 전체에 존재하지 않는다. JS만 정상 동작하면 반드시 이동하는 구조였다.

### 타임라인

무효화 이력과 응답의 `age` 헤더를 대조해 시각을 특정했다. 모두 UTC 기준이다.

| 시각 | 사건 |
| --- | --- |
| 13:54:37 | 무효화 (배포 전 작업 중) |
| 약 14:55 | 요청 유입 → 옛 빌드 HTML이 CDN에 캐싱 |
| 14:59:15 | 1.58.2 배포 → 청크 해시 전부 변경 |
| — | **배포 후 무효화 없음** |
| 16:15:56 | 긴급 무효화 → 증상 소멸 |

배포 직후 무효화가 빠졌고, 그 사이 캐싱된 옛 HTML이 `s-maxage=86400` 설정에 따라 하루 동안 고정될 상태였다.

## ✨ 주요 변경사항

### `deploy.sh` 추가

프로젝트 루트에 배포 스크립트를 만들었다. 기존에 손으로 치던 명령을 그대로 옮기고, 무효화를 흐름 안에 포함시켰다.

```bash
git pull --ff-only
npm install
npm run build
pm2 restart ecosystem.config.js --env production
# 기동 확인 후
aws cloudfront create-invalidation --distribution-id "$CF_DISTRIBUTION_ID" --paths "/*"
```

## 🔧 기술적 세부사항

### 무효화를 기동 확인 "뒤"에 두는 이유

무효화는 캐시를 비울 뿐 이후 요청을 막지 않는다. 새 빌드가 응답을 시작하기 전에 캐시를 비우면, 그 틈에 들어온 요청이 옛 응답을 다시 캐싱해 무효화가 무의미해진다.

그래서 헬스체크로 새 빌드의 응답을 확인한 뒤에 무효화한다.

```bash
for i in $(seq 1 "$HEALTH_TIMEOUT"); do
  if curl -sf -o /dev/null --max-time 5 "$HEALTH_URL"; then
    echo "  기동 완료 (${i}초)"
    break
  fi
  if [ "$i" -eq "$HEALTH_TIMEOUT" ]; then
    echo "✗ 기동 실패 — CloudFront 무효화를 건너뜁니다."
    exit 1
  fi
  sleep 1
done
```

기동에 실패하면 무효화를 **건너뛴다.** 서버가 죽은 상태에서 캐시를 비우면 CDN이 오리진 에러를 캐싱해 상황이 더 나빠지기 때문이다. 옛 캐시라도 남아 있는 편이 낫다.

### `set -euo pipefail`

빌드가 실패해도 다음 단계가 이어지던 기존 수동 절차의 문제를 막는다. 어느 단계든 실패하면 즉시 중단된다.

### 환경변수 기반 설정

배포 ID와 경로를 코드에 넣지 않고 환경변수로 받는다.

| 변수 | 필수 | 기본값 |
| --- | --- | --- |
| `CF_DISTRIBUTION_ID` | O | — |
| `APP_DIR` | X | 스크립트가 놓인 디렉토리 |
| `HEALTH_URL` | X | `http://localhost/` |
| `HEALTH_TIMEOUT` | X | `60` (초) |

`CF_DISTRIBUTION_ID`가 없으면 **`git pull` 이전에** 중단한다. 부작용이 하나도 발생하지 않은 상태에서 실패하도록 가드를 맨 앞에 뒀다.

`APP_DIR` 기본값은 `BASH_SOURCE`로 스크립트 위치를 찾아 설정하므로, 어느 디렉토리에서 실행해도 동작한다.

### IAM 권한

EC2 인스턴스 역할에 무효화 권한만 추가했다. 액세스 키를 발급하지 않고 인스턴스 역할을 쓰므로 자격증명이 서버 파일에 남지 않는다.

```json
{
  "Effect": "Allow",
  "Action": "cloudfront:CreateInvalidation",
  "Resource": "arn:aws:cloudfront::<계정ID>:distribution/<배포ID>"
}
```

액션 하나, 배포 하나로 한정했다. 이 권한으로 할 수 있는 일은 캐시를 비우는 것뿐이다.

### 검증

| 항목 | 결과 |
| --- | --- |
| `bash -n` 문법 검사 | 통과 |
| `CF_DISTRIBUTION_ID` 미설정 시 중단 | 통과 — `git pull` 미실행 확인 |
| `set -u` 하에서 선택 변수 미설정 | 통과 — `${VAR:-기본값}`로 안전 |
| 헬스체크 실패 시 무효화 차단 | 통과 — 무효화 라인 도달 전 종료 |

헬스체크 실패 경로는 닫힌 포트로 실제 요청을 보내 확인했다.

## 📌 참고 사항

- **이 스크립트만으로 위험이 완전히 사라지지는 않는다.** 무효화 요청이 전 엣지에 반영되기까지 수 분이 걸리고, 그 사이 같은 레이스가 축소된 형태로 남는다.
- 더 근본적인 문제는 **HTML의 `s-maxage`가 과도하게 길다**는 점이다. 메인은 1일(`86400`)이지만 상세·목록·기술 페이지는 **1년(`31536000`)** 이다. 이번엔 메인이라 최대 1일이었지만, 상세 페이지 캐시가 같은 식으로 굳었다면 자연 복구가 사실상 불가능했다. 상세 페이지는 검색 노출의 49%를 받는 경로다.
- `s-maxage` 상한 조정은 캐싱 정책 전반에 영향을 주므로 이번 작업에 포함하지 않았다. 별도 검토가 필요하다.
- 배포 스크립트를 쓰려면 EC2에서 `CF_DISTRIBUTION_ID`를 export 해야 한다. 셸 프로파일에 넣어두면 매번 지정할 필요가 없다.

## 🔗 참고 자료

- [AWS — Invalidating files](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)
- [AWS — IAM roles for Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html)
- [Next.js — Deploying](https://nextjs.org/docs/app/building-your-application/deploying)
- [React — Hydration mismatch](https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content)
