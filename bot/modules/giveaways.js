const { EmbedBuilder } = require('discord.js')

function findChannel(client, channelId) {
  for (const guild of client.guilds.cache.values()) {
    const ch = guild.channels.cache.get(channelId)
    if (ch) return ch
  }
  return null
}

function init(client, db) {
  // Send unsent giveaway messages
  setInterval(async () => {
    const unsent = await db.collection('giveaways').find({
      active: true,
      messageId: { $exists: false },
    }).toArray()

    for (const giveaway of unsent) {
      try {
        const channel = findChannel(client, giveaway.channelId)
        if (!channel) {
          await db.collection('giveaways').updateOne(
            { _id: giveaway._id },
            { $set: { messageId: 'failed', active: false } }
          )
          console.error(`Giveaway channel not found: ${giveaway.channelId}`)
          continue
        }

        const endsAt = new Date(giveaway.endsAt)
        const embed = new EmbedBuilder()
          .setColor('#5865f2')
          .setTitle('🎉 Giveaway!')
          .setDescription(`**Prize:** ${giveaway.prize}\n\nReact with 🎉 to enter!\n\n**Winners:** ${giveaway.winners || 1}\n**Ends:** ${endsAt.toLocaleString()}`)
          .setFooter({ text: giveaway.requiredRole ? `Required role ID: ${giveaway.requiredRole}` : 'Anyone can enter' })
          .setTimestamp(endsAt)

        const msg = await channel.send({ embeds: [embed] })
        await msg.react('🎉')

        await db.collection('giveaways').updateOne(
          { _id: giveaway._id },
          { $set: { messageId: msg.id } }
        )
      } catch (err) {
        console.error('Giveaway send error:', err.message)
        await db.collection('giveaways').updateOne(
          { _id: giveaway._id },
          { $set: { messageId: 'failed' } }
        ).catch(() => {})
      }
    }
  }, 5000)

  // Track entries via reactions
  client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return
    if (reaction.partial) { try { await reaction.fetch() } catch { return } }
    if (reaction.emoji.name !== '🎉') return

    const giveaway = await db.collection('giveaways').findOne({
      messageId: reaction.message.id,
      active: true,
    })
    if (!giveaway) return

    if (giveaway.requiredRole) {
      try {
        const member = await reaction.message.guild.members.fetch(user.id)
        if (!member.roles.cache.has(giveaway.requiredRole)) {
          await reaction.users.remove(user.id).catch(() => {})
          return
        }
      } catch {}
    }

    await db.collection('giveaways').updateOne(
      { _id: giveaway._id },
      { $addToSet: { entries: user.id } }
    ).catch(() => {})
  })

  // End expired giveaways
  setInterval(async () => {
    const now = new Date()
    const ended = await db.collection('giveaways').find({
      active: true,
      messageId: { $exists: true, $ne: 'failed' },
      endsAt: { $lte: now },
    }).toArray()

    for (const giveaway of ended) {
      await db.collection('giveaways').updateOne(
        { _id: giveaway._id },
        { $set: { active: false, endedAt: now } }
      )

      const channel = findChannel(client, giveaway.channelId)
      if (!channel) continue

      const entries = giveaway.entries || []
      if (!entries.length) {
        channel.send(`🎉 Giveaway for **${giveaway.prize}** ended with no entries.`).catch(() => {})
        continue
      }

      const shuffled = [...entries]
      const winners = []
      for (let i = 0; i < Math.min(giveaway.winners || 1, shuffled.length); i++) {
        const idx = Math.floor(Math.random() * shuffled.length)
        winners.push(`<@${shuffled.splice(idx, 1)[0]}>`)
      }

      await db.collection('giveaways').updateOne(
        { _id: giveaway._id },
        { $set: { winner: winners[0] } }
      ).catch(() => {})

      channel.send({
        embeds: [new EmbedBuilder()
          .setColor('#5865f2')
          .setTitle('🎉 Giveaway Ended!')
          .setDescription(`**Prize:** ${giveaway.prize}\n**Winner(s):** ${winners.join(', ')}`)
          .setTimestamp()],
      }).catch(() => {})
    }
  }, 30000)
}

module.exports = { init }
