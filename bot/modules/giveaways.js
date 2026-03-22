const { EmbedBuilder } = require('discord.js')

function init(client, db) {
  client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return
    if (reaction.partial) { try { await reaction.fetch() } catch { return } }
    if (reaction.emoji.name !== '🎉') return

    const giveaway = await db.collection('giveaways').findOne({
      messageId: reaction.message.id,
      active: true,
    })
    if (!giveaway) return

    await db.collection('giveaways').updateOne(
      { _id: giveaway._id },
      { $addToSet: { entries: user.id } }
    )
  })

  setInterval(async () => {
    const now = new Date()
    const ended = await db.collection('giveaways').find({
      active: true,
      endsAt: { $lte: now },
    }).toArray()

    for (const giveaway of ended) {
      await db.collection('giveaways').updateOne(
        { _id: giveaway._id },
        { $set: { active: false, endedAt: now } }
      )

      const guild = client.guilds.cache.first()
      if (!guild) continue
      const channel = guild.channels.cache.get(giveaway.channelId)
      if (!channel) continue

      const entries = giveaway.entries || []
      if (!entries.length) {
        channel.send(`🎉 Giveaway for **${giveaway.prize}** ended with no entries.`)
        continue
      }

      const winners = []
      for (let i = 0; i < Math.min(giveaway.winners || 1, entries.length); i++) {
        const idx = Math.floor(Math.random() * entries.length)
        winners.push(`<@${entries.splice(idx, 1)[0]}>`)
      }

      channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#5865f2')
            .setTitle('🎉 Giveaway Ended')
            .setDescription(`**Prize:** ${giveaway.prize}\n**Winner(s):** ${winners.join(', ')}`)
            .setTimestamp(),
        ],
      })
    }
  }, 30000)
}

module.exports = { init }
