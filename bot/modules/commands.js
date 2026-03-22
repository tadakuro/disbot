function init(client, db) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    // Defer immediately before any async operations
    try {
      await interaction.deferReply()
    } catch {
      return // Interaction already expired
    }

    try {
      const cmd = await db.collection('commands').findOne({ name: interaction.commandName })
      if (!cmd?.code) {
        await interaction.editReply({ content: 'Command not found.' })
        return
      }

      const fn = new Function('module', 'require', `
        ${cmd.code}
        return module.exports
      `)
      const handler = fn({ exports: {} }, require)
      if (typeof handler === 'function') {
        await handler(interaction, client)
      }

      await db.collection('tracker').insertOne({
        type: 'command',
        command: `/${cmd.name}`,
        userId: interaction.user.id,
        guildId: interaction.guild?.id,
        at: new Date(),
      }).catch(() => {})

    } catch (err) {
      console.error(`Error executing command /${interaction.commandName}:`, err.message)
      try {
        await interaction.editReply({ content: `Error: ${err.message}` })
      } catch {}
    }
  })
}

module.exports = { init }
