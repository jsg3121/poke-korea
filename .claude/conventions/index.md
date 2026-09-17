# conventions/

코딩 및 워크플로우 규칙을 관리하는 폴더입니다.

## guides/

| 파일            | 설명                                                        |
| --------------- | ----------------------------------------------------------- |
| `structure.md`  | 폴더 구조 — `src/` 계층·도메인 배치, `.claude/` 하네스 구조 |
| `naming.md`     | 네이밍 — 파일·컴포넌트·함수·훅·타입·상수                    |
| `coding.md`     | 경로 별칭, 계층별 책임, 코드 작성 규칙                      |
| `comments.md`   | 코드 주석 3원칙, JSDoc/TSDoc 형식, 인라인 주석 허용 범위    |
| `styling.md`    | Tailwind CSS, 색상 체계, 브레이크포인트, SVG 처리           |
| `linting.md`    | ESLint — 코드 품질 규칙, 미사용 import 제거                 |
| `formatting.md` | Prettier — 표기 형식, import 계층 정렬                      |
| `nextjs.md`     | 캐시 정책(ISR·Cache-Control), next.config 의사결정          |
| `workflow.md`   | 브랜치 전략, 버전 관리, PR 규칙                             |
| `changelog.md`  | Docusaurus 기반 changelog 관리 규칙 및 템플릿               |

구조·코드 작성(`structure` → `naming` → `coding` → `comments` → `styling`), 도구·빌드(`linting`, `rendering`), 프로세스(`workflow`, `changelog`) 순으로 배열했습니다.
