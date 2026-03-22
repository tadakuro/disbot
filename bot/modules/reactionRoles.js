function init(client, db) {
  async function handleReaction(reaction, user, add) {
    if (user.bot) return
    if (reaction.partial) { try { await reaction.fetch() } catch { return } }

    const config = await db.collection('modules').findOne({ key: 'reaction-roles' })
    if (!config?.enabled || !config.rules?.length) return

    const emoji = reaction.emoji.name
    const messageId = reaction.message.id
    const guild = reaction.message.guild
    if (!guild) return

    const rule = config.rules.find((r) => r.emoji === emoji && r.messageId === messageId)
    if (!rule?.roleId) return

    try {
      const member = await guild.members.fetch(user.id)
      if (add) {
        await member.roles.add(rule.roleId)
      } else {
        await member.roles.remove(rule.roleId)
      }
    } catch (err) {
      console.error('Reaction role error:', err.message)
    }
  }

  client.on('messageReactionAdd', (reaction, user) => handleReaction(reaction, user, true))
  client.on('messageReactionRemove', (reaction, user) => handleReaction(reaction, user, false))
}

module.exports = { init }
