const MOD_COMMANDS = ['ban', 'kick', 'warn', 'timeout', 'purge']

function init(client, db) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    // Skip mod commands — moderation.js handles those with its own defer
    if (MOD_COMMANDS.includes(interaction.commandName)) return

    // Defer immediately before any async work
    try {
      await interaction.deferReply()
    } catch {
      return // Interaction expired
    }

    try {
      const cmd = await db.collection('commands').findOne({ name: interaction.commandName })
      if (!cmd?.code) return // Not a custom command, skip silently

      const fn = new Function('module', 'require', `
        ${cmd.code}
        return module.exports
      `)
      const handler = fn({ exports: {} }, require)
      if (typeof handler === 'function') {
        await handler(interaction, client)
      } else {
        await interaction.editReply({ content: '❌ Command does not export a function. Check your code.' })
        return
      }

      await db.collection('tracker').insertOne({
        type: 'command',
        command: `/${cmd.name}`,
        userId: interaction.user.id,
        guildId: interaction.guild?.id,
        at: new Date(),
      }).catch(() => {})

    } catch (err) {
      console.error(`Error in command /${interaction.commandName}:`, err.message)
      try {
        await interaction.editReply({ content: '❌ An error occurred while running this command.' })
      } catch {}
    }
  })
}

module.exports = { init }
