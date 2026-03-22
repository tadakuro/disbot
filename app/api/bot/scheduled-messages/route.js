import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = await getDb()
  const messages = await db.collection('scheduled_messages').find({}).sort({ scheduledAt: 1 }).toArray()
  return NextResponse.json(messages)
}

export async function POST(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const db = await getDb()
  const result = await db.collection('scheduled_messages').insertOne({ ...body, sent: false, createdAt: new Date() })
  return NextResponse.json({ success: true, id: result.insertedId })
}

export async function DELETE(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  const { ObjectId } = await import('mongodb')
  const db = await getDb()
  await db.collection('scheduled_messages').deleteOne({ _id: new ObjectId(id) })
  return NextResponse.json({ success: true })
}
