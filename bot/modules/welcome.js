function init(client, db) {
  client.on('guildMemberAdd', async (member) => {
    const config = await db.collection('modules').findOne({ key: 'welcome' })
    if (!config?.enabled || !config.welcomeChannel || !config.welcomeMessage) return

    const channel = member.guild.channels.cache.get(config.welcomeChannel)
    if (!channel) return

    const msg = config.welcomeMessage
      .replace('{user}', member.toString())
      .replace('{server}', member.guild.name)

    await channel.send(msg)
  })

  client.on('guildMemberRemove', async (member) => {
    const config = await db.collection('modules').findOne({ key: 'welcome' })
    if (!config?.enabled || !config.goodbyeChannel || !config.goodbyeMessage) return

    const channel = member.guild.channels.cache.get(config.goodbyeChannel)
    if (!channel) return

    const msg = config.goodbyeMessage
      .replace('{user}', member.user.username)
      .replace('{server}', member.guild.name)

    await channel.send(msg)
  })
}

module.exports = { init }
