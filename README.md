# Poke Korea

한국어 포켓몬 정보 웹사이트

## 📅 최근 업데이트 (2025.06.04)

### ✨ Next.js 15 마이그레이션 완료

프로젝트의 안정성과 성능 향상을 위해 주요 패키지들을 최신 버전으로 업그레이드했습니다.

#### 업그레이드 내역

**Core Framework**

- Next.js: `13.5.8` → `15.3.3`
- React: `18` → `18.3.1` (최신 안정화 버전)
- React-DOM: `18` → `18.3.1`
- TypeScript: `5` → `5.7.2`

**GraphQL & Data Fetching**

- Apollo Client: `3.8.6` → `3.11.8`
- GraphQL: `16.8.1` → `16.9.0`
- GraphQL Codegen 관련 패키지들 최신화

**Development Tools**

- ESLint: `8` → `8.57.1`
- TypeScript ESLint: `7.0.0` → `7.18.0`
- 기타 개발 도구들 Next.js 15 호환 버전으로 업데이트

#### 개선사항

- ✅ 빌드 성능 향상 (4.0초 빌드 완료)
- ✅ 보안 업데이트 적용
- ✅ Pages Router 구조 유지 (기존 코드 호환성 보장)
- ✅ 기존 GraphQL 스키마 및 타입 생성 시스템 정상 작동

## 🚀 향후 마이그레이션 계획

### 1단계: Tailwind CSS 마이그레이션 (예정)

**목표**: Styled Components → Tailwind CSS 전환

- 기존 Pages Router 구조 유지
- 모바일/데스크톱 이중 구조 보존
- 점진적 컴포넌트 전환

**예상 기간**: 2-3주

### 2단계: App Router 마이그레이션 (예정)

**목표**: Pages Router → App Router 전환

- Server Components 최적화
- 레이아웃 시스템 재설계
- 성능 최적화

**예상 기간**: 3-4주

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

- **Framework**: Next.js 15 (Pages Router)
- **Styling**: Styled Components (Tailwind CSS 마이그레이션 예정)
- **Data Fetching**: Apollo Client + GraphQL
- **Language**: TypeScript
- **UI**: 모바일/데스크톱 반응형 디자인

## 📁 프로젝트 구조

```
src/
├── container/          # 디바이스별 컨테이너 컴포넌트
│   ├── desktop/       # 데스크톱 전용 컴포넌트
│   └── mobile/        # 모바일 전용 컴포넌트
├── views/             # 페이지 레벨 뷰 컴포넌트
├── components/        # 공통 UI 컴포넌트
├── context/           # React Context 상태 관리
├── hook/              # 커스텀 React 훅
├── gql/               # GraphQL 쿼리 및 프래그먼트
└── pages/             # Next.js 페이지 (Pages Router)
```

## 🔗 관련 링크

- [Next.js 15 문서](https://nextjs.org/docs)
- [Apollo Client 문서](https://www.apollographql.com/docs/react/)
- [TypeScript 문서](https://www.typescriptlang.org/docs/)
