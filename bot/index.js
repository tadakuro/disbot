require('dotenv').config()
const { Client, GatewayIntentBits, Partials } = require('discord.js')
const { MongoClient } = require('mongodb')
const loader = require('./loader')

const mongoClient = new MongoClient(process.env.MONGODB_URI)

async function main() {
  await mongoClient.connect()
  const db = mongoClient.db('botforge')

  const config = await db.collection('config').findOne({ key: 'bot' })
  if (!config?.token) {
    console.error('No bot token found in database. Connect your bot via the dashboard first.')
    process.exit(1)
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Reaction, Partials.Channel],
  })

  await loader.load(client, db)

  client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user.username}`)

    // Apply saved bot status
    try {
      const savedStatus = await db.collection('config').findOne({ key: 'botstatus' })
      if (savedStatus?.activityText) {
        const activityTypes = { PLAYING: 0, STREAMING: 1, LISTENING: 2, WATCHING: 3, COMPETING: 5, CUSTOM: 4 }
        const type = activityTypes[savedStatus.activityType] ?? 0
        const activity = { name: savedStatus.activityText, type }
        if (savedStatus.activityType === 'STREAMING' && savedStatus.streamUrl) {
          activity.url = savedStatus.streamUrl
        }
        client.user.setPresence({ status: savedStatus.presence || 'online', activities: [activity] })
        console.log(`Status set: ${savedStatus.activityType} ${savedStatus.activityText}`)
      }
    } catch (err) {
      console.error('Failed to set status:', err.message)
    }

    // Record uptime
    await db.collection('config').updateOne(
      { key: 'uptime' },
      { $set: { key: 'uptime', since: new Date() } },
      { upsert: true }
    )

    console.log('Bot ready. Use the Register Commands button in the dashboard to register slash commands.')
  })

  await client.login(config.token)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
