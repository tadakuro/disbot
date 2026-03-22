function init(client, db) {
  client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return

    const commands = await db.collection('commands').find({}).toArray()
    if (!commands.length) return

    for (const cmd of commands) {
      const nodes = cmd.nodes || []
      const edges = cmd.edges || []

      const trigger = nodes.find((n) => n.type === 'trigger')
      if (!trigger?.data?.command) continue

      const prefix = trigger.data.command
      if (!message.content.startsWith(prefix)) continue

      const actionEdge = edges.find((e) => e.source === trigger.id)
      if (!actionEdge) continue

      const actionNode = nodes.find((n) => n.id === actionEdge.target)
      if (!actionNode) continue

      if (actionNode.type === 'action' && actionNode.data?.message) {
        await message.channel.send(actionNode.data.message)
        await db.collection('tracker').insertOne({
          type: 'command', command: prefix,
          userId: message.author.id,
          guildId: message.guild.id,
          at: new Date(),
        })
      }
    }
  })
}

module.exports = { init }
