function init(client, db) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return
    await db.collection('tracker').insertOne({
      type: 'command',
      command: `/${interaction.commandName}`,
      userId: interaction.user.id,
      guildId: interaction.guild?.id,
      at: new Date(),
    })
  })
}

module.exports = { init }
