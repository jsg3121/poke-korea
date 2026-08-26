/**
 * 서비스 계정 → 액세스 토큰 (Node 내장 crypto만 사용).
 *
 * googleapis 패키지를 쓰지 않는 이유: 이 스크립트는 분석용 보조 도구라
 * 프로덕션 번들과 무관한데, 의존성을 추가하면 package.json이 오염되고
 * 설치 시간도 늘어난다. JWT 서명은 crypto.createSign으로 충분하다.
 *
 * 키 파일은 저장소 밖(기본 ~/.config/poke-korea/gcp-service-account.json)에
 * 두고 경로만 참조한다. 절대 저장소 안으로 옮기지 말 것.
 */

const crypto = require('crypto')
const fs = require('fs')
const os = require('os')
const path = require('path')

const DEFAULT_KEY_PATH = path.join(
  os.homedir(),
  '.config/poke-korea/gcp-service-account.json',
)

const base64url = (input) =>
  Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

/**
 * @param {string[]} scopes OAuth 스코프 목록
 * @param {string} [keyPath] 서비스 계정 JSON 경로. 생략 시 GOOGLE_APPLICATION_CREDENTIALS → 기본 경로 순
 * @returns {Promise<string>} 액세스 토큰(1시간 유효)
 */
const getAccessToken = async (scopes, keyPath) => {
  const resolved =
    keyPath || process.env.GOOGLE_APPLICATION_CREDENTIALS || DEFAULT_KEY_PATH

  if (!fs.existsSync(resolved)) {
    throw new Error(
      `서비스 계정 키를 찾을 수 없다: ${resolved}\n` +
        `.claude/analyzer/index.md의 "Google API 연동" 절을 참고해 발급·배치할 것.`,
    )
  }

  const key = JSON.parse(fs.readFileSync(resolved, 'utf8'))
  const now = Math.floor(Date.now() / 1000)

  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = base64url(
    JSON.stringify({
      iss: key.client_email,
      scope: scopes.join(' '),
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    }),
  )

  const signer = crypto.createSign('RSA-SHA256')
  signer.update(`${header}.${claim}`)
  const jwt = `${header}.${claim}.${base64url(signer.sign(key.private_key))}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(`토큰 발급 실패(${res.status}): ${JSON.stringify(json)}`)
  }
  return json.access_token
}

module.exports = { getAccessToken, DEFAULT_KEY_PATH }
