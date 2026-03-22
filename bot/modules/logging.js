const { EmbedBuilder } = require('discord.js')

function init(client, db) {
  async function getLogChannel(guild) {
    const config = await db.collection('modules').findOne({ key: 'logging' })
    if (!config?.enabled || !config.logChannel) return null
    return guild.channels.cache.get(config.logChannel) || null
  }

  async function isEnabled(key) {
    const config = await db.collection('modules').findOne({ key: 'logging' })
    return config?.enabled && config?.[key]
  }

  client.on('messageDelete', async (message) => {
    if (!await isEnabled('messageDelete') || message.author?.bot) return
    const ch = await getLogChannel(message.guild)
    if (!ch) return
    ch.send({ embeds: [new EmbedBuilder().setColor('#ed4245').setTitle('Message Deleted').setDescription(`By ${message.author?.tag} in <#${message.channelId}>\n${message.content || '*(empty)*'}`).setTimestamp()] })
  })

  client.on('messageUpdate', async (oldMsg, newMsg) => {
    if (!await isEnabled('messageEdit') || oldMsg.author?.bot || oldMsg.content === newMsg.content) return
    const ch = await getLogChannel(newMsg.guild)
    if (!ch) return
    ch.send({ embeds: [new EmbedBuilder().setColor('#faa61a').setTitle('Message Edited').setDescription(`By ${oldMsg.author?.tag} in <#${oldMsg.channelId}>\n**Before:** ${oldMsg.content}\n**After:** ${newMsg.content}`).setTimestamp()] })
  })

  client.on('guildMemberAdd', async (member) => {
    if (!await isEnabled('memberJoin')) return
    const ch = await getLogChannel(member.guild)
    if (!ch) return
    ch.send({ embeds: [new EmbedBuilder().setColor('#3ba55d').setTitle('Member Joined').setDescription(`${member.user.tag} (${member.id})`).setTimestamp()] })
  })

  client.on('guildMemberRemove', async (member) => {
    if (!await isEnabled('memberLeave')) return
    const ch = await getLogChannel(member.guild)
    if (!ch) return
    ch.send({ embeds: [new EmbedBuilder().setColor('#ed4245').setTitle('Member Left').setDescription(`${member.user.tag} (${member.id})`).setTimestamp()] })
  })

  client.on('guildBanAdd', async (ban) => {
    if (!await isEnabled('memberBan')) return
    const ch = await getLogChannel(ban.guild)
    if (!ch) return
    ch.send({ embeds: [new EmbedBuilder().setColor('#ed4245').setTitle('Member Banned').setDescription(`${ban.user.tag} — ${ban.reason || 'No reason'}`).setTimestamp()] })
  })

  client.on('guildBanRemove', async (ban) => {
    if (!await isEnabled('memberUnban')) return
    const ch = await getLogChannel(ban.guild)
    if (!ch) return
    ch.send({ embeds: [new EmbedBuilder().setColor('#3ba55d').setTitle('Member Unbanned').setDescription(`${ban.user.tag}`).setTimestamp()] })
  })

  client.on('voiceStateUpdate', async (oldState, newState) => {
    const guild = newState.guild || oldState.guild
    if (oldState.channelId === null && newState.channelId) {
      if (!await isEnabled('voiceJoin')) return
      const ch = await getLogChannel(guild)
      if (ch) ch.send({ embeds: [new EmbedBuilder().setColor('#5865f2').setTitle('Voice Join').setDescription(`${newState.member?.user.tag} joined <#${newState.channelId}>`).setTimestamp()] })
    } else if (oldState.channelId && newState.channelId === null) {
      if (!await isEnabled('voiceLeave')) return
      const ch = await getLogChannel(guild)
      if (ch) ch.send({ embeds: [new EmbedBuilder().setColor('#6b6b80').setTitle('Voice Leave').setDescription(`${oldState.member?.user.tag} left <#${oldState.channelId}>`).setTimestamp()] })
    }
  })
}

module.exports = { init }
