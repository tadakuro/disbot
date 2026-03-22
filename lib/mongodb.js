import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let clientPromise

if (!uri) {
  console.warn('MONGODB_URI not set. Database features will not work.')
} else if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  const client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise

export async function getDb() {
  if (!clientPromise) throw new Error('MONGODB_URI is not configured')
  const client = await clientPromise
  return client.db('botforge')
}
