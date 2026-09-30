# 시안의 디자인 시스템 정합

`ui-publisher`가 시안을 그릴 때 프로젝트 디자인 시스템(Storybook DS) 규격을 재현하는 절차다.

> **Why:** 시안을 자유롭게 그리면 본 구현 때 DS 컴포넌트 규격과 어긋나 재설계가 발생한다. 시안 단계부터 DS 규격으로 그려야 시안 → 구현이 1:1로 이어진다.

## 1. 작업 전 DS 인벤토리 파악

시안 작성 전 현재 DS에 등록된 컴포넌트를 조사한다.

- **컴포넌트 목록**: `src/components/**/*.stories.tsx`를 Glob으로 검색 — story가 있는 컴포넌트가 DS 등록 컴포넌트다(원자: `button/`·`tab/`·`chip/`·`input/`·`checkbox/`·`radio/`·`ball/`·`pageHeader/`·`tag/` 등, organism: `*.organism.tsx`).
- **토큰**: `tailwind.config.js`의 색상(`primary-1~4`, `white-*`, `black-*`, `damage-*`)·spacing(`touch` 등)·fontSize 토큰.
- 시안에 들어갈 요소(버튼·탭·칩·인풋·카드 등)와 겹치는 DS 컴포넌트는 **해당 컴포넌트 코드와 스타일 파일**(`buttonStyle.ts`·`tabItemStyle.ts`·`chipStyle.ts` 등)을 직접 읽어 실제 규격(크기·radius·색·터치 타겟·상태 스타일)을 추출한다.

## 2. 시안에서 DS 규격 재현

- 시안은 순수 HTML/CSS지만 **DS 컴포넌트의 시각 규격을 그대로 재현**한다 — 버튼 높이 44px(`min-h-touch`), 탭 밑줄/채움 variant, 칩 28px 등 실제 값 사용. 임의 스타일 발명 금지.
- CSS 변수명은 토큰명과 일치시킨다(`--primary-1` 등). **임의 hex 직접 사용 금지** — `tailwind.config.js`에 등록된 값만 변수로 옮겨 쓴다.
- 반응형 분기는 DS와 동일하게 모바일 퍼스트 + `desktop:` 브레이크포인트(768px) 기준.

## 3. DS 부재 요소는 명시적으로 표시

시안에 필요하지만 DS에 없는 요소는 시안에 그리되, HTML 주석과 보고에 **"DS 부재 — 신규 규격화 후보"**로 명시한다. 이 목록은 페이지 개편 시 분자/도메인 컴포넌트 규격화 대상 판단의 입력이 된다(승격 기준: 2곳 이상 재사용 + variant 명확).

## 4. 자사 시각 무드 재현

컬러 변수의 hex 값만 보고 추측하면 무드가 어긋난다. 변수명이 아니라 **실제 사용 패턴**을 봐야 한다.

- 메인 세션이 전달한 자사 사이트 스크린샷(데스크톱 1280 + 모바일 375)이 있으면 이를 근거로 배경색·텍스트 색·강조 색·대비 강도·여백 패턴을 파악한다.
- 스크린샷이 없으면 **실제 컴포넌트 코드 3개 이상**을 읽고 `className`의 `bg-*`·`text-*` 패턴을 추출한다. 예: `primary-1`이 hex로는 짙은 네이비여도 코드에서 `bg-primary-1` 패턴이 다수면 배경으로 쓰인다는 뜻이다.
- 코드 패턴만으로 추정한 경우 보고에 **"실제 화면 미확인, 코드 패턴 기반 추정"**을 명시하고 사용자에게 무드 일치 여부를 확인 요청한다.

시안 작성 전 색상 사용 모델을 아래 형식으로 결정해 보고에 포함한다.

```text
배경 — primary-1 (짙은 네이비)
주요 텍스트 — white-1 또는 primary-4
보조 텍스트 — primary-3
카드 배경 — primary-2 또는 primary-1 + opacity
강조 — primary-4
```

## 참조

- `tailwind.config.js` — 토큰 원본
- `src/components/**/*.stories.tsx` — DS 등록 컴포넌트 인벤토리
- `src/components/**/[a-z]*Style.ts` — DS 시각 규격의 SSOT
- `.claude/specs/plans/mobile-redesign-plan.md` 4.2 — DS 컴포넌트 승격 기준
