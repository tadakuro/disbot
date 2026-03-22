const { EmbedBuilder } = require('discord.js')

function init(client, db) {
  client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return
    if (reaction.partial) { try { await reaction.fetch() } catch { return } }

    const poll = await db.collection('polls').findOne({ messageId: reaction.message.id, active: true })
    if (!poll) return

    const emoji = reaction.emoji.name
    const optionIndex = poll.options.findIndex((_, i) => getEmoji(i) === emoji)
    if (optionIndex === -1) return

    if (!poll.multiVote) {
      const existingVote = poll.votes?.[user.id]
      if (existingVote !== undefined && existingVote !== optionIndex) {
        try { await reaction.message.reactions.cache.get(getEmoji(existingVote))?.users.remove(user.id) } catch {}
      }
    }

    await db.collection('polls').updateOne(
      { _id: poll._id },
      { $set: { [`votes.${user.id}`]: optionIndex } }
    )
  })

  setInterval(async () => {
    const now = new Date()
    const ended = await db.collection('polls').find({ active: true, endsAt: { $lte: now } }).toArray()

    for (const poll of ended) {
      await db.collection('polls').updateOne({ _id: poll._id }, { $set: { active: false, endedAt: now } })
      const guild = client.guilds.cache.first()
      if (!guild) continue
      const channel = guild.channels.cache.get(poll.channelId)
      if (!channel) continue

      const votes = poll.votes || {}
      const counts = poll.options.map((_, i) => Object.values(votes).filter(v => v === i).length)
      const total = counts.reduce((a, b) => a + b, 0)
      const winnerIdx = counts.indexOf(Math.max(...counts))

      const embed = new EmbedBuilder()
        .setColor('#5865f2')
        .setTitle(`📊 Poll Ended: ${poll.question}`)
        .setDescription(poll.options.map((opt, i) => {
          const pct = total > 0 ? Math.round((counts[i] / total) * 100) : 0
          const bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10))
          return `${i === winnerIdx ? '🏆' : getEmoji(i)} **${opt}**\n${bar} ${pct}% (${counts[i]} votes)`
        }).join('\n\n'))
        .setFooter({ text: `${total} total votes` })
        .setTimestamp()

      channel.send({ embeds: [embed] })
    }
  }, 30000)
}

function getEmoji(index) {
  return ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'][index] || `${index + 1}`
}

module.exports = { init }
