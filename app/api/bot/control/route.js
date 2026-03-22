import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/mongodb'

const RAILWAY_API = 'https://backboard.railway.com/graphql/v2'

async function railwayQuery(query, variables = {}) {
  const token = process.env.RAILWAY_API_TOKEN
  if (!token) throw new Error('RAILWAY_API_TOKEN not configured')

  const res = await fetch(RAILWAY_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`)
  if (data.errors) throw new Error(`Railway error: ${JSON.stringify(data.errors)}`)
  return data
}

export async function POST(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await request.json()
  if (!['start', 'restart', 'stop'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const environmentId = process.env.RAILWAY_ENVIRONMENT_ID
  const serviceId = process.env.RAILWAY_SERVICE_ID

  if (!environmentId || !serviceId) {
    return NextResponse.json({ error: 'RAILWAY_ENVIRONMENT_ID or RAILWAY_SERVICE_ID not configured' }, { status: 500 })
  }

  try {
    if (action === 'restart' || action === 'start') {
      await railwayQuery(
        `mutation serviceInstanceRedeploy($environmentId: String!, $serviceId: String!) {
          serviceInstanceRedeploy(environmentId: $environmentId, serviceId: $serviceId)
        }`,
        { environmentId, serviceId }
      )
    } else if (action === 'stop') {
      // First get latest deployment id then stop it
      const projectId = process.env.RAILWAY_PROJECT_ID
      const data = await railwayQuery(
        `query deployments($projectId: String!, $environmentId: String!, $serviceId: String!) {
          deployments(first: 1, input: { projectId: $projectId, environmentId: $environmentId, serviceId: $serviceId }) {
            edges { node { id } }
          }
        }`,
        { projectId, environmentId, serviceId }
      )
      const deploymentId = data?.data?.deployments?.edges?.[0]?.node?.id
      if (!deploymentId) throw new Error('No active deployment found to stop')
      await railwayQuery(
        `mutation deploymentStop($id: String!) { deploymentStop(id: $id) }`,
        { id: deploymentId }
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

    const res = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bot ${config.token}` },
    })

    return NextResponse.json({ status: res.ok ? 'ONLINE' : 'OFFLINE', online: res.ok })
  } catch {
    return NextResponse.json({ status: 'OFFLINE', online: false })
  }
}
