#!/usr/bin/env node
/**
 * 애드센스 OAuth 최초 인증 (1회용).
 *
 * 브라우저 동의를 거쳐 리프레시 토큰을 저장한다. 이후 adsense.js 가 자동
 * 갱신하므로 재실행할 일이 없다(동의 철회·토큰 무효화 시에만).
 *
 * 사용법:
 *   node .claude/analyzer/scripts/adsense-authorize.js
 *
 *   --client=경로   OAuth 클라이언트 JSON (기본: ~/.config/poke-korea/adsense-client.json)
 *   --out=경로      토큰 저장 위치 (기본: ~/.config/poke-korea/adsense-oauth.json)
 *
 * 사전 준비는 .claude/analyzer/index.md 참조.
 */

const crypto = require('crypto')
const fs = require('fs')
const http = require('http')
const os = require('os')
const path = require('path')
const { execFile } = require('child_process')

const SCOPE = 'https://www.googleapis.com/auth/adsense.readonly'

const DEFAULT_CLIENT_PATH = path.join(
  os.homedir(),
  '.config/poke-korea/adsense-client.json',
)
const DEFAULT_OUT_PATH = path.join(
  os.homedir(),
  '.config/poke-korea/adsense-oauth.json',
)

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.split('=').slice(1).join('=') : fallback
}

const base64url = (buf) =>
  buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

/** 기본 브라우저로 URL을 연다. 실패해도 수동 접속 안내가 있어 무시한다. */
const openBrowser = (url) => {
  const cmd =
    process.platform === 'darwin'
      ? ['open', [url]]
      : process.platform === 'win32'
        ? ['cmd', ['/c', 'start', '', url]]
        : ['xdg-open', [url]]
  execFile(cmd[0], cmd[1], () => {})
}

/**
 * 루프백 서버를 띄우고 포트와 인가 코드 Promise 를 돌려준다.
 * 포트를 먼저 알아야 redirect_uri 를 만들 수 있어 두 값을 분리해 반환한다.
 *
 * 수동 복붙(OOB) 방식은 구글이 폐기해 루프백만 쓸 수 있다.
 * https://developers.google.com/identity/protocols/oauth2/native-app
 */
const listen = (expectedState) =>
  new Promise((resolveOuter, rejectOuter) => {
    let resolveCode
    let rejectCode
    const codePromise = new Promise((res, rej) => {
      resolveCode = res
      rejectCode = rej
    })

    const server = http.createServer((req, res) => {
      const url = new URL(req.url, 'http://127.0.0.1')
      if (url.pathname !== '/') {
        res.writeHead(404).end()
        return
      }

      const reply = (message) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(
          `<!doctype html><meta charset="utf-8"><body style="font-family:system-ui;padding:2rem">` +
            `<p>${message}</p><p>이 창을 닫고 터미널로 돌아가세요.</p></body>`,
        )
      }

      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')
      const error = url.searchParams.get('error')

      if (error) {
        reply(`인증이 취소되었습니다: ${error}`)
        server.close()
        rejectCode(new Error(`인증 거부: ${error}`))
        return
      }
      if (state !== expectedState) {
        reply('state 불일치로 요청을 거부했습니다.')
        server.close()
        rejectCode(new Error('state 불일치 — 요청이 변조되었을 수 있다'))
        return
      }
      if (!code) {
        reply('인가 코드를 받지 못했습니다.')
        server.close()
        rejectCode(new Error('인가 코드 없음'))
        return
      }

      reply('인증이 완료되었습니다.')
      server.close()
      resolveCode(code)
    })

    server.on('error', rejectOuter)
    // 포트 0 = OS가 빈 포트 선택. 데스크톱 앱 유형은 임의 루프백 포트를 허용한다.
    server.listen(0, '127.0.0.1', () => {
      resolveOuter({ port: server.address().port, codePromise })
    })
  })

const main = async () => {
  const clientPath = arg('client', DEFAULT_CLIENT_PATH)
  const outPath = arg('out', DEFAULT_OUT_PATH)

  if (!fs.existsSync(clientPath)) {
    console.error(
      `OAuth 클라이언트 JSON을 찾을 수 없다: ${clientPath}\n` +
        `GCP에서 "데스크톱 앱" 유형으로 발급 후 이 경로에 둘 것.\n` +
        `절차: .claude/analyzer/index.md`,
    )
    process.exit(1)
  }

  const parsed = JSON.parse(fs.readFileSync(clientPath, 'utf8'))
  if (!parsed.installed) {
    console.error(
      `클라이언트 유형이 "데스크톱 앱"이 아니다(최상위 키: ${Object.keys(parsed).join(', ')}).\n` +
        `웹 유형은 루프백 포트를 미리 등록해야 해 이 방식과 맞지 않는다.`,
    )
    process.exit(1)
  }
  const cfg = parsed.installed

  // PKCE — 같은 기기의 다른 프로세스가 인가 코드를 가로채도 토큰으로 못 바꾼다.
  const verifier = base64url(crypto.randomBytes(32))
  const challenge = base64url(
    crypto.createHash('sha256').update(verifier).digest(),
  )
  const state = base64url(crypto.randomBytes(16))

  const { port, codePromise } = await listen(state)
  const redirectUri = `http://127.0.0.1:${port}`

  const authUrl =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      client_id: cfg.client_id,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: SCOPE,
      // 리프레시 토큰을 받으려면 둘 다 필요하다. prompt 없이는 재동의 시 생략된다.
      access_type: 'offline',
      prompt: 'consent',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    })

  console.log('브라우저에서 구글 계정 동의를 진행하세요.')
  console.log('창이 열리지 않으면 아래 주소를 직접 여세요:\n')
  console.log(authUrl + '\n')
  console.log('※ "확인되지 않은 앱" 경고가 뜨면 [고급] → [이동]을 누르세요.\n')
  openBrowser(authUrl)

  const code = await codePromise

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: cfg.client_id,
      client_secret: cfg.client_secret,
      code,
      code_verifier: verifier,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  })

  const token = await res.json()
  if (!res.ok) {
    throw new Error(`토큰 교환 실패(${res.status}): ${JSON.stringify(token)}`)
  }
  if (!token.refresh_token) {
    throw new Error(
      `리프레시 토큰을 받지 못했다. 기존 동의를 철회한 뒤 재시도할 것:\n` +
        `  https://myaccount.google.com/permissions`,
    )
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        client_id: cfg.client_id,
        client_secret: cfg.client_secret,
        refresh_token: token.refresh_token,
      },
      null,
      2,
    ),
  )
  fs.chmodSync(outPath, 0o600)

  console.log(`저장 완료: ${outPath} (권한 600)`)
  console.log('\n이제 조회할 수 있습니다:')
  console.log('  node .claude/analyzer/scripts/adsense.js')
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
}
