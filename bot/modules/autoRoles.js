function init(client, db) {
  client.on('guildMemberAdd', async (member) => {
    const config = await db.collection('modules').findOne({ key: 'auto-roles' })
    if (!config?.enabled || !config.roles?.length) return

    for (const rule of config.roles) {
      if (!rule.roleId) continue
      const isBot = member.user.bot
      if (rule.type === 'bots' && !isBot) continue
      if (rule.type === 'humans' && isBot) continue
      try {
        await member.roles.add(rule.roleId)
      } catch (err) {
        console.error('Auto-role error:', err.message)
      }
    }
  })
}

module.exports = { init }
