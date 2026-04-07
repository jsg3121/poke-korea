새 페이지의 풀 세트(page.tsx + views + container + context + SEO)를 한 번에 스캐폴딩해줘.

## 입력

- 페이지명: $ARGUMENTS (인자가 없으면 사용자에게 질문)

## 실행 절차

1. 사용자에게 다음 정보 확인:
   - **라우트 경로**: `/경로` (예: `/damage-calculator`)
   - **동적 라우트 여부**: `[param]` 필요 여부
   - **Context 필요 여부**: 별도 상태 관리가 필요한지
   - **계산 모듈 필요 여부**: `src/module/` 파일 생성 여부

2. `.claude/conventions/guides/coding.md`의 네이밍 규칙에 따라 파일 목록 생성

3. 생성할 파일 목록을 사용자에게 보여주고 확인

4. 승인 후 `references/templates.md`의 템플릿을 참고하여 파일 생성

## 주의사항

- 파일 생성 전에 반드시 사용자에게 파일 목록을 보여주고 확인을 받는다.
- 경로 별칭 `~/` 사용
- `'use client'` 지시문은 views, container, context에만 추가
- page.tsx는 서버 컴포넌트로 유지 (metadata export 때문)
- Tailwind CSS 유틸리티 클래스 사용
- desktop/mobile 분리를 위해 `hidden desktop:block` / `block desktop:hidden` 패턴 사용
- `/component-builder` 스킬과의 차이: 이 스킬은 **페이지 단위** 풀 세트, component-builder는 **컴포넌트 단위**
