const https = require('https')
const fs = require('fs')

const RENDER_API_KEY = 'rnd_5cwR2BOZB7vHQkACwKovGAnMZWtr'
const REPO_URL = 'https://github.com/helloadam0x-lang/orda-platform'
const SERVICE_NAME = 'orda-whatsapp-server'

function renderRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.render.com',
      path: `/v1${path}`,
      method,
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) })
        } catch { resolve({ status: res.statusCode, body: data }) }
      })
    })
    req.on('error', reject)
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')) })
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

async function deploy() {
  console.log('\n🚀 ORDA — Deploying Express server to Render\n')

  // 1. Get owner ID
  console.log('1. Getting Render account...')
  const ownersRes = await renderRequest('GET', '/owners?limit=5')
  if (ownersRes.status !== 200) {
    console.log('Response:', JSON.stringify(ownersRes.body, null, 2))
    throw new Error(`Auth failed (${ownersRes.status}). Check API key.`)
  }
  const owners = ownersRes.body
  const ownerId = owners[0]?.owner?.id
  const ownerName = owners[0]?.owner?.name || owners[0]?.owner?.email
  console.log(`   ✅ Account: ${ownerName} (${ownerId})`)

  // 2. Check if service already exists
  console.log('2. Checking existing services...')
  const servicesRes = await renderRequest('GET', '/services?limit=50')
  const services = Array.isArray(servicesRes.body) ? servicesRes.body : []
  const existing = services.find(s =>
    s.service?.name === SERVICE_NAME
  )

  let serviceId, serviceUrl

  if (existing) {
    serviceId = existing.service.id
    serviceUrl = 'https://' + (existing.service.serviceDetails?.url || `${SERVICE_NAME}.onrender.com`)
    console.log(`   ✅ Service exists: ${serviceId}`)
    console.log(`   URL: ${serviceUrl}`)

    console.log('3. Triggering redeploy...')
    const deployRes = await renderRequest('POST', `/services/${serviceId}/deploys`, {
      clearCache: 'do_not_clear'
    })
    console.log(`   ✅ Deploy triggered (${deployRes.status})`)
  } else {
    console.log('3. Creating new service...')
    const createRes = await renderRequest('POST', '/services', {
      type: 'web_service',
      name: SERVICE_NAME,
      ownerId: ownerId,
      repo: REPO_URL,
      autoDeploy: 'yes',
      branch: 'main',
      rootDir: 'server',
      buildCommand: 'npm install',
      startCommand: 'node index.js',
      plan: 'free',
      region: 'oregon',
      serviceDetails: {
        env: 'node',
        numInstances: 1,
        plan: 'free',
        envSpecificDetails: {
          buildCommand: 'npm install',
          startCommand: 'node index.js'
        }
      },
      envVars: [
        { key: 'NODE_ENV',          value: 'production' },
        { key: 'PORT',              value: '10000' },
        { key: 'SUPABASE_URL',      value: 'https://zscxzwzjcatxvdflgavz.supabase.co' },
        { key: 'SUPABASE_ANON_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzY3h6d3pqY2F0eHZkZmxnYXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjE1ODIsImV4cCI6MjA5NDU5NzU4Mn0.Lh3J1IxgqXHjTEt8FOXBhDgOehK1xNxP4o_hq-pR6Bw' },
        { key: 'GEMINI_API_KEY',    value: 'AQ.Ab8RN6LYCId5SgLdQwbwSpkjmP2pp-mDk681nyd_ojCt7sg_6A' },
        { key: 'SENTRY_DSN',        value: 'https://7d194ef06489541d2a0c60b9819c1320@o4511491753246720.ingest.de.sentry.io/4511508422197328' },
        { key: 'NEXT_URL',          value: 'https://orda-landing-adam-s-projects20.vercel.app' },
        { key: 'RESEND_API_KEY',    value: 're_EtGB5KC7_NioBdp1XGT88GCfoZ9ZHRWE1' }
      ]
    })

    if (createRes.status === 201 || createRes.status === 200) {
      serviceId = createRes.body?.service?.id
      const rawUrl = createRes.body?.service?.serviceDetails?.url || createRes.body?.service?.url
      serviceUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl) : `https://${SERVICE_NAME}.onrender.com`
      console.log(`   ✅ Service created: ${serviceId}`)
      console.log(`   URL: ${serviceUrl}`)
    } else {
      console.log(`   Response (${createRes.status}):`, JSON.stringify(createRes.body, null, 2))
      throw new Error(`Failed to create service: ${createRes.status}`)
    }
  }

  // 4. Poll until live
  console.log('\n4. Waiting for deploy (may take 3-8 min on free tier)...')
  let liveUrl = serviceUrl
  const startTime = Date.now()

  for (let attempt = 1; attempt <= 24; attempt++) {
    await new Promise(r => setTimeout(r, 20000))
    const elapsed = Math.round((Date.now() - startTime) / 1000 / 60 * 10) / 10

    try {
      const statusRes = await renderRequest('GET', `/services/${serviceId}`)
      const svc = statusRes.body?.service || statusRes.body
      const rawUrl = svc?.serviceDetails?.url || svc?.url
      if (rawUrl) {
        liveUrl = rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl
      }

      // Ping health
      const healthStatus = await new Promise((res) => {
        const req = https.get(`${liveUrl}/health`, r => {
          let d = ''
          r.on('data', c => d += c)
          r.on('end', () => res({ status: r.statusCode, body: d }))
        })
        req.on('error', () => res({ status: 0, body: '' }))
        req.setTimeout(8000, () => { req.destroy(); res({ status: 0, body: 'timeout' }) })
      })

      console.log(`   [${elapsed}min] ${liveUrl} → HTTP ${healthStatus.status || 'pending'}`)

      if (healthStatus.status === 200) {
        console.log(`\n   🎉 SERVER IS LIVE!\n   Health: ${healthStatus.body.slice(0, 120)}`)
        return liveUrl
      }
    } catch (e) {
      console.log(`   [${elapsed}min] Waiting... (${e.message})`)
    }
  }

  console.log(`\n   Deploy submitted. URL: ${liveUrl}`)
  return liveUrl
}

deploy()
  .then(url => {
    console.log('\n✅ Render deploy complete')
    console.log(`URL: ${url}`)
    fs.writeFileSync('.render-url', url)
    console.log('Render URL saved to .render-url')
  })
  .catch(err => {
    console.error('\n❌ Deploy failed:', err.message)
    process.exit(1)
  })
