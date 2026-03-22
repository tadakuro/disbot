import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = await getDb()
  const commands = await db.collection('commands').find({}).toArray()
  return NextResponse.json(commands)
}

export async function POST(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const db = await getDb()
  const result = await db.collection('commands').insertOne({
    ...body,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return NextResponse.json({ success: true, id: result.insertedId })
}

export async function PUT(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...body } = await request.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const { ObjectId } = await import('mongodb')
  const db = await getDb()
  await db.collection('commands').updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...body, updatedAt: new Date() } }
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const { ObjectId } = await import('mongodb')
  const db = await getDb()
  await db.collection('commands').deleteOne({ _id: new ObjectId(id) })
  return NextResponse.json({ success: true })
}
