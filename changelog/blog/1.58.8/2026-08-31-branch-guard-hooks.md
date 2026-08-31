---
slug: branch-guard-hooks
title: 'main 브랜치 보호 훅 추가 — 편집·push 이중 차단'
description: 'main에서의 파일 편집과 main을 향하는 push를 PreToolUse 훅으로 차단합니다. 브랜치 이름만으로는 잡히지 않는 upstream 오설정까지 검사하며, 버전 확인 근거와 브랜치 생성 방식을 workflow.md에 명문화했습니다.'
authors: [jsg3121, claude]
tags: [chore]
---

# main 브랜치 보호 훅 추가

> **작업 날짜**: 2026-08-31
> **브랜치**: `feature/1.58.8`

## 📋 작업 개요

**작업 유형**: 개발 환경 개선
**담당**: jsg3121, claude

## 🎯 작업 목표

문서로만 존재하던 "main에서 작업하지 않는다" 규칙을 훅으로 강제한다.

<!-- truncate -->

## 📉 왜 필요했나

### 문서 규칙은 실제로 뚫렸다

CLAUDE.md에 "main 브랜치에서는 어떠한 파일 수정·생성·삭제도 절대 수행하지 않는다"가 절대 규칙으로 있었다. 그런데 1.58.7 작업 중 이 규칙이 그대로 뚫렸다.

브랜치는 분명히 생성했고 전환 메시지도 출력됐다. 그런데 이후 파일 6개를 쓴 시점의 실제 브랜치는 `main`이었다. **브랜치 생성과 파일 편집 사이에 checkout이 끼면 그 사이를 확인하는 절차가 없었기 때문이다.** 커밋 전에 발견해 stash로 정상화했지만, push까지 갔다면 main이 오염됐을 상황이다.

### 브랜치 이름으로는 못 잡는 사고가 있다

더 까다로운 경로가 있다. 로컬 브랜치는 `feature/A`인데 upstream이 `origin/main`으로 잡힌 경우다.

```bash
git checkout -b A          # 로컬은 A
git push -u origin main    # upstream이 main으로 고정됨
git push                   # 이후 A의 커밋이 main으로 나간다
```

`git branch --show-current`는 `A`를 반환하므로 화면상 아무 문제가 없어 보인다. 그런데 원격에서는 main만 조용히 갱신된다. 다른 저장소에서 실제로 이 경로로 기능 브랜치 작업이 main에 쌓인 사례가 있었다.

**브랜치 이름 확인만으로는 절대 잡히지 않는다.** push 직전에 upstream이 실제로 어디를 가리키는지 봐야 한다.

## 🔨 작업 내용

### 신규 훅

| 파일 | 대상 | 차단 조건 |
| --- | --- | --- |
| `.claude/hooks/block-main-branch-edit.sh` | `Write`/`Edit` | 현재 브랜치가 `main`·`master` |
| `.claude/hooks/guard-git-push.sh` | `Bash` | main을 향하는 push 5종 |

`guard-git-push.sh`가 검사하는 경로는 다음과 같다.

1. `git push origin main` — 명시적 지정
2. `git push origin HEAD:main` — refspec 형태 (`refs/heads/main` 포함)
3. `git push --all` / `--mirror` — 로컬 main까지 함께 전송
4. **upstream이 `origin/main`인데 현재 브랜치가 main이 아닌 경우** — 위에서 설명한 사고 경로
5. 현재 브랜치가 main인 상태의 push

4번이 이 훅의 핵심이다. 나머지는 명령 문자열에서 드러나지만 4번은 `git push` 한 단어라 문자열 검사로는 잡히지 않는다. `git rev-parse --abbrev-ref @{upstream}`로 실제 목적지를 조회해야 한다.

### 지침 문서 개정

`.claude/conventions/guides/workflow.md`에 4개 절을 추가했다.

- **버전 확인**: `git log origin/main`의 머지 이력이 유일한 권위 원본
- **브랜치 생성**: `git checkout -b feature/{version} origin/main`으로 로컬 main 경유 회피
- **push 전 upstream 확인**: 브랜치명과 목적지를 함께 검증
- **자동 가드**: 훅 목록과 차단 시 대응

## ⚠️ 설계 시 고려한 점

### 버전 확인 근거를 명문화한 이유

1.58.7 작업에서 이미 배포된 `1.58.6`을 놓치고 `1.58.1`로 브랜치를 만든 사고가 있었다. 당시 `ls changelog/blog/ | tail -5` 출력에 `1.58.6`이 있었는데도 읽지 않고 넘겼다.

폴더 목록은 근거가 될 수 없다. 원격에서만 머지된 버전이 로컬에 없을 수 있고, `ls` 출력은 사전순이라 `1.58.10`이 `1.58.2`보다 앞에 온다. 그래서 머지 이력 조회를 명령까지 포함해 규정했다.

### origin/main 분기는 push와 무관하다

`git checkout -b feature/x origin/main`은 시작 커밋만 지정할 뿐 upstream을 설정하지 않는다. 로컬 main의 오염이 딸려 들어가는 것을 막는 효과는 있지만, upstream 오설정을 막지는 못한다. 그래서 훅의 4번 검사가 별도로 필요하다. 문서에도 이 구분을 주석으로 남겼다.

### 원격 브랜치 보호가 있어도 훅이 필요하다

이 저장소는 GitHub에서 "Require a pull request before merging"이 켜져 있다. 그럼에도 훅을 두는 이유는 **인지 시점** 때문이다. 원격 보호는 push가 거부된 뒤에야 알려주므로 개발 중에는 잘못된 상태를 모른 채 진행하게 되고, 보호 규칙이 없는 저장소로 같은 습관이 옮겨가면 그대로 사고가 된다.

### 저장소 밖 파일은 검사하지 않는다

`block-main-branch-edit.sh`는 편집 대상 파일의 디렉토리를 기준으로 저장소를 판별한다. 훅의 실행 디렉토리를 기준으로 하면 스크래치패드나 `~/.config` 파일을 쓸 때 오탐이 난다.

## ✅ 검증

훅 동작을 케이스별로 확인했다.

**`guard-git-push.sh`** — 12개 케이스 전부 기대대로 동작

- 차단 6종: `origin main`, `HEAD:main`, `--all`, `origin master`, `-u origin main`, `HEAD:refs/heads/main`
- 통과 6종: `-u origin feature/1.58.8`, `origin feature/x`, 인자 없는 `push`(정상 upstream), `git log`, `npm run build`, `git pushd-something`

**`block-main-branch-edit.sh`** — 임시 저장소를 만들어 브랜치별로 확인

- 차단: `main`, `master`
- 통과: `feature/1.0.0`, 저장소 밖 경로, `file_path` 없음

검증 과정에서 훅이 자기 테스트 명령("git push origin main"이라는 문자열이 포함된 명령)을 차단하는 것을 확인했다. 오탐이 아니라 의도한 동작이며, 테스트는 저장소 밖 스크립트로 분리해 실행했다.
