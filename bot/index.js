require('dotenv').config()
const { Client, GatewayIntentBits, Partials, REST, Routes, SlashCommandBuilder } = require('discord.js')
const { MongoClient } = require('mongodb')
const loader = require('./loader')

const mongoClient = new MongoClient(process.env.MONGODB_URI)

// Built-in moderation slash commands always registered
const BUILTIN_COMMANDS = [
  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .addUserOption((o) => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason')),
  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member')
    .addUserOption((o) => o.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason')),
  new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption((o) => o.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason')),
  new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption((o) => o.setName('user').setDescription('User to timeout').setRequired(true))
    .addIntegerOption((o) => o.setName('minutes').setDescription('Duration in minutes'))
    .addStringOption((o) => o.setName('reason').setDescription('Reason')),
  new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages')
    .addIntegerOption((o) => o.setName('amount').setDescription('Number of messages to delete').setRequired(true)),
].map((c) => c.toJSON())

async function registerCommands(token, clientId, db) {
  const rest = new REST({ version: '10' }).setToken(token)

  // Load canvas commands from MongoDB
  const canvasCommands = await db.collection('commands').find({}).toArray()
  const dynamicCommands = []

  for (const cmd of canvasCommands) {
    const trigger = (cmd.nodes || []).find((n) => n.type === 'trigger')
    if (!trigger?.data?.command) continue
    const name = trigger.data.command.replace('/', '').toLowerCase().trim()
    if (!name || !/^[\w-]{1,32}$/.test(name)) continue
    dynamicCommands.push(
      new SlashCommandBuilder()
        .setName(name)
        .setDescription(`Custom command: ${name}`)
        .toJSON()
    )
  }

  const allCommands = [...BUILTIN_COMMANDS, ...dynamicCommands]

  try {
    await rest.put(Routes.applicationCommands(clientId), { body: allCommands })
    console.log(`Registered ${allCommands.length} slash command(s)`)
  } catch (err) {
    console.error('Failed to register commands:', err.message)
  }
}

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
    partials: [Partials.Message, Partials.Reaction],
  })

  await loader.load(client, db)

  client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`)

    await registerCommands(config.token, client.user.id, db)

    await db.collection('config').updateOne(
      { key: 'uptime' },
      { $set: { key: 'uptime', since: new Date() } },
      { upsert: true }
    )
  })

  await client.login(config.token)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
