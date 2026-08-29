#!/usr/bin/env bash
#
# 프로덕션 배포 스크립트
#
# 빌드 → PM2 재시작 → 기동 확인 → CloudFront 무효화를 한 번에 수행한다.
#
# 무효화를 스크립트 안에 둔 이유:
#   HTML에는 배포마다 해시가 바뀌는 JS 청크 파일명이 박혀 있다. CDN이 옛 HTML을
#   들고 있으면 그 HTML이 참조하는 청크가 서버에 없어 404가 나고, hydration이
#   실패해 페이지 전체가 클릭 불가 상태가 된다. 화면은 SSR로 정상 렌더되므로
#   눈으로는 알아챌 수 없다. 무효화를 사람이 기억해야 하는 절차로 두면 언젠가
#   반드시 빠지므로 배포 흐름에 포함시킨다.
#
# 무효화를 기동 확인 "뒤"에 두는 이유:
#   무효화는 캐시를 비울 뿐 이후 요청을 막지 않는다. 새 빌드가 응답을 시작하기
#   전에 캐시를 비우면, 그 사이 들어온 요청이 옛 응답을 다시 캐싱해 무효화가
#   무의미해진다.
#
# 사용법:
#   export CF_DISTRIBUTION_ID=E...        # 필수
#   export APP_DIR=/root/pokemon-server   # 선택, 기본값은 스크립트 위치
#   export HEALTH_URL=http://localhost/   # 선택
#   ./deploy.sh
#
set -euo pipefail

# 스크립트가 놓인 디렉토리를 기본 APP_DIR로 삼는다. 어디서 실행하든 동작한다.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

APP_DIR="${APP_DIR:-$SCRIPT_DIR}"
HEALTH_URL="${HEALTH_URL:-http://localhost/}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-60}"

if [ -z "${CF_DISTRIBUTION_ID:-}" ]; then
  echo "✗ CF_DISTRIBUTION_ID 환경변수가 없습니다."
  echo "  export CF_DISTRIBUTION_ID=E3XXXXXXXXXXXX"
  exit 1
fi

cd "$APP_DIR"

echo "▶ 배포 시작: $APP_DIR"
echo "  브랜치: $(git branch --show-current)"

echo "▶ 코드 갱신"
# --ff-only: 로컬에 예상치 못한 커밋이 있으면 머지 커밋을 만들지 않고 실패시킨다.
git pull --ff-only

echo "▶ 의존성 설치"
npm install

echo "▶ 빌드"
npm run build

echo "▶ PM2 재시작"
pm2 restart ecosystem.config.js --env production

echo "▶ 기동 확인 (최대 ${HEALTH_TIMEOUT}초)"
for i in $(seq 1 "$HEALTH_TIMEOUT"); do
  if curl -sf -o /dev/null --max-time 5 "$HEALTH_URL"; then
    echo "  기동 완료 (${i}초)"
    break
  fi
  if [ "$i" -eq "$HEALTH_TIMEOUT" ]; then
    echo "✗ 기동 실패 — CloudFront 무효화를 건너뜁니다."
    echo "  서버가 죽은 상태에서 캐시를 비우면 CDN이 오리진 에러를 캐싱해"
    echo "  상황이 더 나빠집니다. pm2 logs 로 원인을 확인하세요."
    exit 1
  fi
  sleep 1
done

echo "▶ CloudFront 무효화"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$CF_DISTRIBUTION_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' --output text)
echo "  무효화 생성: $INVALIDATION_ID"
echo "  전 엣지 반영까지 수 분 걸립니다."

echo "✓ 배포 완료"
