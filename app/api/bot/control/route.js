import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/mongodb'

const RAILWAY_API = 'https://backboard.railway.app/graphql/v2'

async function railwayQuery(query, variables = {}) {
  const token = process.env.RAILWAY_API_TOKEN
  if (!token) throw new Error('RAILWAY_API_TOKEN not configured')

  const res = await fetch(RAILWAY_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  })

  const data = await res.json()
  if (data.errors) throw new Error(data.errors[0].message)
  return data
}

async function getLatestDeploymentId() {
  const projectId = process.env.RAILWAY_PROJECT_ID
  const environmentId = process.env.RAILWAY_ENVIRONMENT_ID
  const serviceId = process.env.RAILWAY_SERVICE_ID

  if (!projectId || !environmentId || !serviceId) {
    throw new Error('RAILWAY_PROJECT_ID, RAILWAY_ENVIRONMENT_ID, or RAILWAY_SERVICE_ID not configured')
  }

  const data = await railwayQuery(`
    query deployments($projectId: String!, $environmentId: String!, $serviceId: String!) {
      deployments(
        first: 1
        input: { projectId: $projectId, environmentId: $environmentId, serviceId: $serviceId }
      ) {
        edges { node { id status } }
      }
    }
  `, { projectId, environmentId, serviceId })

  const deployment = data?.data?.deployments?.edges?.[0]?.node
  if (!deployment) throw new Error('No deployment found')
  return deployment
}

export async function POST(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await request.json()
  if (!['restart', 'stop'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action. Use restart or stop.' }, { status: 400 })
  }

  try {
    const deployment = await getLatestDeploymentId()

    if (action === 'restart') {
      await railwayQuery(
        `mutation deploymentRestart($id: String!) { deploymentRestart(id: $id) }`,
        { id: deployment.id }
      )
    } else if (action === 'stop') {
      await railwayQuery(
        `mutation deploymentStop($id: String!) { deploymentStop(id: $id) }`,
        { id: deployment.id }
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
  } catch (err) {
    return NextResponse.json({ status: 'OFFLINE', online: false })
  }
}
