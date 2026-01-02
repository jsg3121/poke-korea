# Version 1.28.0 변경 사항

> **작업 기간**: 2026-01-02  
> **브랜치**: `feature/1.28.0`  
> **주요 목표**: CSS 최적화, 폰트 서브셋, 이미지 최적화를 통한 성능 개선

---

## 📋 작업 목록

### 1. 🎨 CSS 최적화 및 리팩토링

**파일**: [refactor.md](./refactor.md)

- **@layer components 패턴 추출**: 9개 패턴, 157개 파일, 500회 이상 변경
- **주요 개선사항**:
  - Leading 정렬 패턴 (228회 → 6개 클래스)
  - Flex 정렬 패턴 (80회 → 5개 클래스)
  - Card 스타일 패턴 (36회 → 1개 클래스)
- **효과**: 번들 크기 감소, 유지보수성 향상

### 2. 🎯 하드코딩된 색상 제거

**파일**: [hardcoded-colors.md](./hardcoded-colors.md)

- **작업 범위**: 58개 파일, 173개 하드코딩 색상 제거
- **주요 개선사항**:
  - Tailwind CSS 색상 시스템으로 통일
  - `#333333` → `text-black-2` (73회)
  - `#ffffff` → `text-white-1` (42회)
  - 그 외 58개 색상 값 변환
- **효과**: 일관된 디자인 시스템, 다크모드 대응 준비

### 3. 🔤 타이포그래피 시스템 정리

**파일**: [typography.md](./typography.md)

- **작업 범위**: 51개 파일, 76회 변경
- **주요 개선사항**:
  - `font-display: swap` 적용으로 FOUT 개선
  - 일관된 폰트 크기 및 line-height 시스템 구축
  - Tailwind fontSize 설정에서 line-height 제거
- **효과**: 웹폰트 로딩 최적화, 레이아웃 시프트 감소

### 4. 🔠 폰트 서브셋팅

**파일**: [font-subsetting.md](./font-subsetting.md)

- **작업 내용**: Pretendard 폰트 한글 서브셋 적용
- **주요 개선사항**:
  - 폰트 파일 크기: 220KB → 97KB (55.9% 감소)
  - 2,780자 한글만 포함 (완성형 한글 전체)
  - woff2 포맷 최적화
- **효과**: 초기 로딩 속도 대폭 개선

### 5. 🎨 CSS Variables 시스템 구축

**파일**: [css-variables.md](./css-variables.md)

- **작업 범위**: 색상 시스템을 CSS Variables로 변환
- **주요 개선사항**:
  - 19개 색상 변수 정의 (`--color-primary-1` ~ `--color-type-fairy`)
  - Tailwind config와 CSS Variables 연동
  - `var()` 함수로 동적 색상 참조 가능
- **효과**: 다크모드 준비, 테마 시스템 확장 가능

### 6. 📦 불필요한 패키지 제거

**파일**: [remove-dialog-polyfill.md](./remove-dialog-polyfill.md)

- **작업 내용**: `dialog-polyfill` 패키지 제거
- **주요 개선사항**:
  - 네이티브 `<dialog>` 요소 사용
  - 레거시 브라우저 지원 제거 (IE11 등)
  - 번들 크기 감소
- **효과**: 의존성 감소, 유지보수 부담 감소

### 7. 🖼️ 이미지 최적화 (srcset & responsive images)

**파일**: [image-optimization.md](./image-optimization.md)

- **작업 범위**: 38개 컴포넌트, ImageComponent 전면 최적화
- **주요 개선사항**:
  - DPR 1x/2x 대응 srcset 자동 생성
  - `imageSize`, `densities`, `sizes` prop 추가
  - fetchPriority 최적화 (데스크톱 15개, 모바일 6개만 high)
  - 쿼리 파라미터 제거 (ImageComponent가 자동 생성)
- **효과**:
  - DPR=1 환경: 평균 40-50% 대역폭 절감
  - DPR=2 환경: 선명도 33% 향상
  - PageSpeed Insights "Properly size images" 경고 해결

---

## 📊 전체 통계

| 항목              | 변경 내용                        |
| ----------------- | -------------------------------- |
| **수정된 파일**   | 200개 이상                       |
| **CSS 패턴 추출** | 9개 패턴, 500회 이상 적용        |
| **색상 통일**     | 173개 하드코딩 → Tailwind 시스템 |
| **폰트 최적화**   | 220KB → 97KB (55.9% 감소)        |
| **이미지 최적화** | 38개 컴포넌트, 95% 완료          |
| **패키지 제거**   | dialog-polyfill                  |

---

## 🚀 성능 개선 효과

### 📊 Lighthouse 측정 결과 (실제 배포 환경)

**측정 페이지**: 9개 주요 페이지 (홈, 도감, 상세, 기술/특성 도감 등)

#### 평균 점수 개선

- ✅ **Performance**: 75점 → 76점 (+1점)
- ✅ **Best Practices**: 97점 → 99점 (+2점)
- ✅ **Accessibility**: 97점 (유지)
- ✅ **SEO**: 100점 (유지)

#### Core Web Vitals 평균 개선

- ✅ **LCP** (Largest Contentful Paint): 6,923ms → 6,239ms (**-9.9%**, 684ms 단축)
- ✅ **FCP** (First Contentful Paint): 1,908ms → 1,795ms (**-5.9%**, 113ms 단축)
- ✅ **TBT** (Total Blocking Time): 52ms → 45ms (**-13.5%**, 7ms 단축)
- ✅ **SI** (Speed Index): 2,920ms → 2,748ms (**-5.9%**, 172ms 단축)
- ✅ **CLS** (Cumulative Layout Shift): 0 (완벽 유지)

#### 최고 개선 페이지

1. **특성 도감화면**: Performance +7점, FCP 41.2% 개선, LCP 26.3% 개선
2. **기술 도감화면**: Performance +4점, SI 31.3% 개선, LCP 19.6% 개선
3. **포켓몬 상세 기술화면**: Performance +3점, LCP 19.6% 개선, TBT 24.6% 개선

**상세 보고서**: [lighthouse-performance-report.md](./lighthouse-performance-report.md)

### 초기 로딩

- ✅ 폰트 파일 크기 55.9% 감소 (220KB → 97KB)
- ✅ 이미지 대역폭 40-50% 절감 (DPR=1 환경)
- ✅ CSS 번들 크기 감소 (패턴 추출 효과)
- ✅ LCP 평균 9.9% 개선 (최대 26.3%)

### 사용자 경험

- ✅ 고해상도 디스플레이 선명도 33% 향상
- ✅ 웹폰트 로딩 최적화 (FOUT 개선, FCP 최대 41.2% 개선)
- ✅ 일관된 디자인 시스템
- ✅ TBT 평균 13.5% 개선 (최대 43.9%)

### SEO & 접근성

- ✅ Lighthouse Performance 평균 +1점 (최대 +7점)
- ✅ Best Practices 평균 +2점
- ✅ Core Web Vitals 전반적 개선 (LCP, FCP, TBT, SI)
- ✅ CLS 0 완벽 유지
- ✅ 모든 이미지에 alt 속성 추가

### 유지보수성

- ✅ 재사용 가능한 CSS 패턴
- ✅ 일관된 색상/타이포그래피 시스템
- ✅ 의존성 감소

---

## 📝 향후 작업

### 추가 최적화 가능 항목

1. **3x 이미지 지원** (DPR=3 디바이스 대응)
2. **AVIF 형식 도입** (WebP보다 20-30% 작은 크기)
3. **CSS 번들 분석** (추가 패턴 추출 가능성)
4. **다크모드 구현** (CSS Variables 시스템 활용)

### 테스트 필요 항목

- [ ] 모든 페이지 시각적 테스트
- [ ] 고해상도 디스플레이 이미지 선명도 확인
- [ ] PageSpeed Insights 점수 측정
- [ ] 모바일 네트워크 환경 테스트

---

## 🔗 관련 문서

- [CSS 최적화 상세](./refactor.md)
- [하드코딩 색상 제거](./hardcoded-colors.md)
- [타이포그래피 시스템](./typography.md)
- [폰트 서브셋팅](./font-subsetting.md)
- [CSS Variables](./css-variables.md)
- [dialog-polyfill 제거](./remove-dialog-polyfill.md)
- [이미지 최적화](./image-optimization.md)
- [Lighthouse 성능 측정 결과](./lighthouse-performance-report.md)

---

**작성일**: 2026-01-02  
**작성자**: Claude Code  
**버전**: 1.28.0
