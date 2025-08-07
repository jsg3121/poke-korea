# Poke Korea

한국어 포켓몬 정보 웹사이트

## 📅 최근 업데이트 (2025.07.23)

### ✨ 현재 기술 스택

프로젝트는 Next.js App Router와 Tailwind CSS를 사용하여 최신 웹 기술로 구성되어 있습니다.

#### 현재 사용 중인 기술

**Core Framework**

- Next.js: `14.2.15` (App Router 사용)
- React: `18.3.1`
- React-DOM: `18.3.1`
- TypeScript: `5.7.2`

**GraphQL & Data Fetching**

- Apollo Client: `3.11.8`
- GraphQL: `16.9.0`
- GraphQL Codegen으로 타입 자동 생성

**Styling**

- Tailwind CSS: `3.4.17` 
- PostCSS: `8.5.4`
- Autoprefixer: `10.4.21`

**Development Tools**

- ESLint: `8.57.1`
- TypeScript ESLint: `7.18.0`
- Prettier integration

#### 주요 특징

- ✅ App Router로 Server Components 최적화 적용
- ✅ Tailwind CSS로 유틸리티 기반 스타일링
- ✅ 모바일/데스크톱 반응형 이중 구조 유지
- ✅ GraphQL 코드 생성으로 타입 안전성 보장
- ✅ 가상 스크롤로 대용량 리스트 최적화

## 🛠️ 개발 환경

### 시작하기

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# ESLint 실행
npm run lint

# GraphQL 타입 생성
npm run codegen
```

### 환경 요구사항

- Node.js 18+
- GraphQL 서버 (localhost:4000/graphql)

### 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Data Fetching**: Apollo Client + GraphQL
- **Language**: TypeScript
- **UI**: 모바일/데스크톱 반응형 디자인

## 📁 프로젝트 구조

```
src/
├── app/               # Next.js App Router 페이지
│   ├── layout.tsx    # 루트 레이아웃
│   ├── page.tsx      # 메인 페이지
│   ├── detail/       # 포켓몬 상세 페이지
│   └── type-effectiveness/  # 타입 상성 계산기
├── container/         # 디바이스별 컨테이너 컴포넌트
│   ├── desktop/      # 데스크톱 전용 컴포넌트
│   └── mobile/       # 모바일 전용 컴포넌트
├── views/            # 페이지 레벨 뷰 컴포넌트
├── components/       # 공통 UI 컴포넌트
├── context/          # React Context 상태 관리
├── hook/             # 커스텀 React 훅
├── gql/              # GraphQL 쿼리 및 프래그먼트
└── graphql/          # 생성된 GraphQL 타입
```

## 🔗 관련 링크

- [Next.js 15 문서](https://nextjs.org/docs)
- [Apollo Client 문서](https://www.apollographql.com/docs/react/)
- [TypeScript 문서](https://www.typescriptlang.org/docs/)
