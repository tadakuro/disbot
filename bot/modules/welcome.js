const { EmbedBuilder } = require('discord.js')

function getAccountAge(createdAt) {
  const diff = Date.now() - createdAt.getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 30) return `${days} days`
  if (days < 365) return `${Math.floor(days / 30)} months`
  return `${Math.floor(days / 365)} years`
}

function init(client, db) {
  client.on('guildMemberAdd', async (member) => {
    const config = await db.collection('modules').findOne({ key: 'welcome' })
    if (!config?.enabled || !config.welcomeChannel) return

    const channel = member.guild.channels.cache.get(config.welcomeChannel)
    if (!channel) return

    const memberCount = member.guild.memberCount
    const username = member.user.username
    const server = member.guild.name
    const accountAge = getAccountAge(member.user.createdAt)
    const joinDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const avatarUrl = member.user.displayAvatarURL({ size: 256, extension: 'png' })

    function replace(str) {
      if (!str) return ''
      return str
        .replace(/{username}/g, username)
        .replace(/{server}/g, server)
        .replace(/{memberCount}/g, memberCount)
        .replace(/{accountAge}/g, accountAge)
        .replace(/{joinDate}/g, joinDate)
    }

    const embed = config.welcomeEmbed || {}

    if (!embed.title && !embed.description) {
      // Plain text fallback
      await channel.send(`Welcome ${member.toString()} to **${server}**! You are member #${memberCount}.`)
      return
    }

    const e = new EmbedBuilder()
      .setColor(embed.color || '#5865f2')
      .setTimestamp()

    if (embed.title) e.setTitle(replace(embed.title))
    if (embed.description) e.setDescription(replace(embed.description))
    if (embed.authorName) e.setAuthor({ name: replace(embed.authorName), iconURL: avatarUrl })
    if (embed.footer) e.setFooter({ text: replace(embed.footer) })
    if (embed.bannerUrl) e.setImage(embed.bannerUrl)
    if (embed.showAvatar) e.setThumbnail(avatarUrl)

    const fields = []
    if (embed.showMemberCount) fields.push({ name: 'Member Count', value: `#${memberCount}`, inline: true })
    if (embed.showAccountAge) fields.push({ name: 'Account Age', value: accountAge, inline: true })
    if (embed.showJoinDate) fields.push({ name: 'Joined', value: joinDate, inline: true })
    if (fields.length) e.addFields(fields)

    await channel.send({ content: member.toString(), embeds: [e] })

    if (config.welcomeDM) {
      try { await member.send({ embeds: [e] }) } catch {}
    }
  })

  client.on('guildMemberRemove', async (member) => {
    const config = await db.collection('modules').findOne({ key: 'welcome' })
    if (!config?.enabled || !config.goodbyeChannel || !config.goodbyeMessage) return

    const channel = member.guild.channels.cache.get(config.goodbyeChannel)
    if (!channel) return

    const msg = config.goodbyeMessage
      .replace(/{username}/g, member.user.username)
      .replace(/{server}/g, member.guild.name)

    await channel.send(msg)
  })
}

module.exports = { init }
