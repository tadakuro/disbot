function init(client, db) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const cmd = await db.collection('commands').findOne({ name: interaction.commandName })
    if (!cmd?.code) return

    try {
      await interaction.deferReply()

      const fn = new Function('module', 'require', `
        ${cmd.code}
        return module.exports
      `)
      const handler = fn({ exports: {} }, require)
      if (typeof handler === 'function') {
        await handler(interaction, client)
      }
    } catch (err) {
      console.error(`Error executing command /${cmd.name}:`, err.message)
      try {
        if (interaction.deferred) {
          await interaction.editReply({ content: 'An error occurred running this command.' })
        } else {
          await interaction.reply({ content: 'An error occurred running this command.', ephemeral: true })
        }
      } catch {}
    }

    try {
      await db.collection('tracker').insertOne({
        type: 'command',
        command: `/${cmd.name}`,
        userId: interaction.user.id,
        guildId: interaction.guild?.id,
        at: new Date(),
      })
    } catch {}
  })
}

module.exports = { init }
