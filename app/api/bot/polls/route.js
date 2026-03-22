import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = await getDb()
  const polls = await db.collection('polls').find({}).sort({ createdAt: -1 }).toArray()
  return NextResponse.json(polls)
}

export async function POST(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const db = await getDb()
  const result = await db.collection('polls').insertOne({ ...body, active: true, votes: {}, createdAt: new Date() })
  return NextResponse.json({ success: true, id: result.insertedId })
}

export async function PUT(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, action } = await request.json()
  const { ObjectId } = await import('mongodb')
  const db = await getDb()
  if (action === 'end') {
    await db.collection('polls').updateOne({ _id: new ObjectId(id) }, { $set: { active: false, endedAt: new Date() } })
  }
  return NextResponse.json({ success: true })
}
