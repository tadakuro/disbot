import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/mongodb'

const RAILWAY_API = 'https://backboard.railway.app/graphql/v2'

async function railwayRequest(query, variables = {}) {
  const token = process.env.RAILWAY_API_TOKEN
  const serviceId = process.env.RAILWAY_SERVICE_ID
  const environmentId = process.env.RAILWAY_ENVIRONMENT_ID

  if (!token || !serviceId) {
    throw new Error('RAILWAY_API_TOKEN or RAILWAY_SERVICE_ID not configured')
  }

  const res = await fetch(RAILWAY_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { serviceId, environmentId, ...variables } }),
  })

  const data = await res.json()
  if (data.errors) throw new Error(data.errors[0].message)
  return data
}

export async function POST(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await request.json()
  if (!['start', 'stop', 'restart'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  try {
    if (action === 'restart') {
      await railwayRequest(
        `mutation ServiceInstanceRedeploy($serviceId: String!, $environmentId: String) {
          serviceInstanceRedeploy(serviceId: $serviceId, environmentId: $environmentId)
        }`
      )
    } else if (action === 'start') {
      await railwayRequest(
        `mutation ServiceInstanceDeploy($serviceId: String!, $environmentId: String) {
          serviceInstanceDeploy(serviceId: $serviceId, environmentId: $environmentId) { id }
        }`
      )
    } else if (action === 'stop') {
      await railwayRequest(
        `mutation ServiceInstanceStop($serviceId: String!, $environmentId: String) {
          serviceInstanceStop(serviceId: $serviceId, environmentId: $environmentId)
        }`
      )
    }

    return NextResponse.json({ success: true, action })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const db = await getDb()
    const config = await db.collection('config').findOne({ key: 'bot' })

    if (!config?.token) {
      return NextResponse.json({ status: 'NO_TOKEN', online: false })
    }

    // Check if bot is online by hitting Discord API with the token
    const res = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bot ${config.token}` },
    })

    if (res.ok) {
      return NextResponse.json({ status: 'ONLINE', online: true })
    } else {
      return NextResponse.json({ status: 'OFFLINE', online: false })
    }
  } catch (err) {
    return NextResponse.json({ status: 'OFFLINE', online: false, error: err.message })
  }
}
