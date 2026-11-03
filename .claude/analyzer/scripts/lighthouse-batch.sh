#!/usr/bin/env bash
# Lighthouse 모바일 성능 일괄 측정 (운영 사이트)
#
# 사용법:
#   bash .claude/analyzer/scripts/lighthouse-batch.sh <결과 폴더> [측정 회차들]
#   예) bash .claude/analyzer/scripts/lighthouse-batch.sh /tmp/lh-after "1 2 3 4 5"
#
# - 페이지마다 CloudFront 캐시를 1회 예열한 뒤 지정한 회차만큼 측정한다.
# - 결과 요약은 lighthouse-summary.py로 본다.
# - CHROME_PATH로 Chrome 경로를, HTTPS_PROXY로 프록시를 넘길 수 있다.
# - 측정 중에는 빌드처럼 CPU를 많이 쓰는 작업을 돌리지 않는다. Lighthouse가 CPU 성능을 반영해 TBT 등을 계산한다.
set -u
OUT=${1:?결과 폴더를 지정하세요}
RUNS=${2:-1 2 3 4 5}
mkdir -p "$OUT"
ANDROID_UA='Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36'
PAGES="/ /list /detail/25 /detail/25/moves /moves /moves/85 /ability /ability/9 /type-effectiveness /type-effectiveness/fire /champions/double /champions/double/list /quiz"
CHROME_FLAGS="--headless=new --no-sandbox"
[ -n "${HTTPS_PROXY:-}" ] && CHROME_FLAGS="$CHROME_FLAGS --proxy-server=$HTTPS_PROXY"

for p in $PAGES; do
  name=$(echo "$p" | sed 's#^/##; s#/#_#g'); [ -z "$name" ] && name=home
  curl -sS -o /dev/null -A "$ANDROID_UA" "https://poke-korea.com$p"
  for i in $RUNS; do
    npx -y lighthouse@12.6.1 "https://poke-korea.com$p" --quiet \
      --only-categories=performance --form-factor=mobile --output=json \
      --output-path="$OUT/$name.$i.json" --chrome-flags="$CHROME_FLAGS" >/dev/null 2>>"$OUT/errors.log"
    echo "$(date +%T) $p run$i exit=$?" >> "$OUT/progress.log"
  done
done
echo "DONE $RUNS" >> "$OUT/progress.log"
