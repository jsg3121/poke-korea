# iOS 16 AVIF 이미지 버그 수정 (fix-ios16-avif)

## 📋 작업 개요

**브랜치**: `feature/1.30.0-fix-ios16-avif`
**작업 유형**: 버그 수정
**작업 기간**: 2026-01-21
**담당**: Claude Code

## 🎯 작업 목표

iOS 16.0 ~ 16.3 버전에서 AVIF 이미지가 렌더링되지 않는 문제를 해결합니다.

## 🐛 문제 상황

### 증상

- iOS 16 버전에서 포켓몬 이미지가 표시되지 않음
- iOS 15.4에서는 정상적으로 WebP fallback이 작동함

### 원인

iOS 16.0 ~ 16.3 버전의 Safari에서 `<picture>` 태그 내 AVIF 처리 시 발생하는 알려진 버그:

1. iOS 16이 AVIF를 "지원한다고 인식"하지만, 실제로 일부 AVIF 이미지를 제대로 렌더링하지 못함
2. 이미지 로드 실패 시 다음 `<source>`로 fallback하지 않는 문제 발생
3. iOS 16 이전 버전은 AVIF를 인식하지 못해 자동으로 WebP fallback 사용

## ✨ 주요 변경사항

### AVIF source 제거

**변경 전**:

```tsx
<picture className="w-full h-full block">
  <source type="image/avif" srcSet={generateAvifSrcSet()} />
  <source type="image/webp" srcSet={generateWebpSrcSet()} />
  <img ... />
</picture>
```

**변경 후**:

```tsx
<picture className="w-full h-full block">
  <source type="image/webp" srcSet={generateWebpSrcSet()} />
  <img ... />
</picture>
```

**주요 영향 파일**:

- [src/components/Image.component.tsx](../../src/components/Image.component.tsx)

## 🔧 기술적 세부사항

### 삭제된 코드

- `generateAvifSrcSet()` 함수 제거
- `<source type="image/avif">` 요소 제거

### 유지되는 기능

- WebP srcSet 생성 (고밀도 디스플레이 지원)
- 기본 WebP fallback 이미지

## 📊 영향 범위

| 항목              | 설명                                                 |
| ----------------- | ---------------------------------------------------- |
| 영향받는 컴포넌트 | 모든 이미지 컴포넌트                                 |
| 파일 크기 변화    | WebP 사용으로 AVIF 대비 약간 증가 가능 (무시할 수준) |
| 브라우저 호환성   | iOS 14+ 완벽 지원                                    |

## ✅ 테스트 체크리스트

- [ ] iOS 16.0 ~ 16.3에서 이미지 정상 표시 확인
- [ ] iOS 15.x에서 이미지 정상 표시 확인
- [ ] iOS 17+에서 이미지 정상 표시 확인
- [ ] Chrome/Firefox 데스크톱에서 WebP 이미지 로드 확인
- [ ] Safari 데스크톱에서 이미지 정상 표시 확인

## 🔗 참고 자료

### 관련 버그 리포트

- [WebKit Bug #241904 - AVIF 이미지 지원 관련](https://bugs.webkit.org/show_bug.cgi?id=241904)
- [WebKit Bug #207750 - AVIF 디코딩 지원](https://bugs.webkit.org/show_bug.cgi?id=207750)
- [ImageMagick Issue #7062 - Safari 16.3에서 작은 AVIF 이미지 렌더링 안 됨](https://github.com/ImageMagick/ImageMagick/issues/7062)

### 커뮤니티 이슈

- [Cloudflare Community - iOS 16, AVIF and image resizing bug](https://community.cloudflare.com/t/ios-16-avif-and-image-resizing-bug/418851)
- [Apple Developer Forums - Safari on iOS Simulator 16.2 AVIF 문제](https://developer.apple.com/forums/thread/722994)

### 해결 방법 관련 문서

- [Tyler Gaw - Re-encode AVIF images for iOS 16](https://tylergaw.com/blog/ios-16-avif-fix/)
- [WebKit Blog - Safari 16.1 Features](https://webkit.org/blog/13399/webkit-features-in-safari-16-1/)

## 📝 향후 작업

- iOS 16.4+ 사용자 비율이 충분히 높아지면 AVIF 재도입 검토 가능
- 서버 사이드에서 User-Agent 기반 이미지 포맷 분기 처리 고려

## 🚀 머지 정보

**머지 대상**: `feature/1.30.0`
**머지 예정일**: TBD
**관련 PR**: TBD

## 📌 참고 사항

- WebP는 iOS 14+에서 완벽히 지원되며, 충분히 좋은 압축률을 제공함
- AVIF 대비 약간의 파일 크기 증가가 있을 수 있으나, 호환성 확보가 우선
