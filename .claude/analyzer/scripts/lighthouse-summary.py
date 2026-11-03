"""Lighthouse 일괄 측정 결과를 페이지별 중앙값으로 요약한다.

사용법: python3 .claude/analyzer/scripts/lighthouse-summary.py <결과 폴더> [--json 저장경로]
lighthouse-batch.sh가 만든 결과 폴더를 읽는다. "느린 측정"은 FCP가 4초를 넘은 회차 수다.
"""
import glob
import json
import os
import statistics
import sys

ORDER = ["home", "list", "detail_25", "detail_25_moves", "moves", "moves_85", "ability", "ability_9",
         "type-effectiveness", "type-effectiveness_fire", "champions_double", "champions_double_list", "quiz"]
PATH = {"home": "/"}

d = sys.argv[1]
rows = []
for name in ORDER:
    runs = []
    for f in sorted(glob.glob(os.path.join(d, f"{name}.*.json"))):
        try:
            r = json.load(open(f))
        except Exception:
            continue
        a = r["audits"]
        if r["categories"]["performance"]["score"] is None:
            continue
        req = a["network-requests"]["details"]["items"]
        fonts = sum(i["transferSize"] for i in req if i.get("resourceType") == "Font")
        try:
            lcp_el = a["largest-contentful-paint-element"]["details"]["items"][0]["items"][0]["node"]["snippet"]
            lcp_type = "img" if lcp_el.startswith("<img") else "text"
        except Exception:
            lcp_type = "-"
        runs.append({
            "score": r["categories"]["performance"]["score"] * 100,
            "fcp": a["first-contentful-paint"]["numericValue"],
            "lcp": a["largest-contentful-paint"]["numericValue"],
            "tbt": a["total-blocking-time"]["numericValue"],
            "cls": a["cumulative-layout-shift"]["numericValue"],
            "si": a["speed-index"]["numericValue"],
            "kb": sum(i["transferSize"] for i in req) / 1024,
            "font_kb": fonts / 1024,
            "lcp_type": lcp_type,
        })
    if not runs:
        continue
    med = lambda k: statistics.median(x[k] for x in runs)
    rows.append({
        "page": PATH.get(name, "/" + name.replace("_", "/")),
        "slow": sum(1 for x in runs if x["fcp"] > 4000),
        "n": len(runs), "score": med("score"), "fcp": med("fcp"), "lcp": med("lcp"), "tbt": med("tbt"),
        "cls": med("cls"), "si": med("si"), "kb": med("kb"), "font_kb": med("font_kb"),
        "lcp_type": max(set(x["lcp_type"] for x in runs), key=[x["lcp_type"] for x in runs].count),
    })

print("| 페이지 | 점수 | FCP | LCP | TBT | CLS | Speed Index | 전송량 | 폰트 | LCP 요소 | 느린 측정 |")
print("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |")
for x in rows:
    print(f"| `{x['page']}` | {x['score']:.0f} | {x['fcp']/1000:.1f}s | {x['lcp']/1000:.1f}s | {x['tbt']:.0f}ms | "
          f"{x['cls']:.3f} | {x['si']/1000:.1f}s | {x['kb']:.0f}KB | {x['font_kb']:.0f}KB | {'이미지' if x['lcp_type']=='img' else '텍스트'} | {x['slow']}/{x['n']} |")
print(f"\n측정 횟수: 페이지당 {', '.join(str(x['n']) for x in rows)}회 (중앙값)")
if "--json" in sys.argv:
    json.dump(rows, open(sys.argv[sys.argv.index("--json") + 1], "w"), ensure_ascii=False, indent=2)
