const MOD_COMMANDS = ['ban', 'kick', 'warn', 'timeout', 'purge']
const CUSTOM_COMMAND_CACHE = new Set()

function init(client, db) {
  // Cache custom command names to avoid DB hit on every interaction
  async function refreshCache() {
    const cmds = await db.collection('commands').find({}, { projection: { name: 1 } }).toArray()
    CUSTOM_COMMAND_CACHE.clear()
    cmds.forEach(c => { if (c.name) CUSTOM_COMMAND_CACHE.add(c.name.toLowerCase()) })
  }
  refreshCache().catch(() => {})
  // Refresh cache every 2 minutes
  setInterval(() => refreshCache().catch(() => {}), 120000)

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return
    // Skip mod commands — moderation.js tracks those
    if (MOD_COMMANDS.includes(interaction.commandName)) return
    // Skip custom commands — commands.js tracks those
    if (CUSTOM_COMMAND_CACHE.has(interaction.commandName)) return

    await db.collection('tracker').insertOne({
      type: 'command',
      command: `/${interaction.commandName}`,
      userId: interaction.user.id,
      guildId: interaction.guild?.id,
      at: new Date(),
    }).catch(() => {})
  })
}

module.exports = { init }
