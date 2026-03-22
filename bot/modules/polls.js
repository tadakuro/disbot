const { EmbedBuilder } = require('discord.js')

function getEmoji(index) {
  return ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'][index] || `${index + 1}`
}

function init(client, db) {
  // Check for new polls that haven't been sent yet
  setInterval(async () => {
    const unsent = await db.collection('polls').find({ active: true, messageId: { $exists: false } }).toArray()

    for (const poll of unsent) {
      try {
        const guild = client.guilds.cache.first()
        if (!guild) continue

        const channel = guild.channels.cache.get(poll.channelId)
        if (!channel) {
          console.error(`Poll channel not found: ${poll.channelId}`)
          continue
        }

        const endsAt = new Date(poll.endsAt)
        const embed = new EmbedBuilder()
          .setColor('#5865f2')
          .setTitle(`📊 ${poll.question}`)
          .setDescription(poll.options.map((opt, i) => `${getEmoji(i)} **${opt}**`).join('\n\n'))
          .setFooter({ text: `${poll.winners > 1 ? 'Multiple choice' : 'Single choice'} · Ends ${endsAt.toLocaleString()}` })
          .setTimestamp()

        const msg = await channel.send({ embeds: [embed] })

        // Add reaction emojis
        for (let i = 0; i < poll.options.length; i++) {
          await msg.react(getEmoji(i)).catch(() => {})
        }

        // Save messageId so we know it's been sent
        await db.collection('polls').updateOne(
          { _id: poll._id },
          { $set: { messageId: msg.id } }
        )
      } catch (err) {
        console.error('Failed to send poll:', err.message)
        // Mark as failed so we don't retry forever
        await db.collection('polls').updateOne(
          { _id: poll._id },
          { $set: { messageId: 'failed' } }
        )
      }
    }
  }, 5000) // Check every 5 seconds for new polls

  // Track votes via reactions
  client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return
    if (reaction.partial) { try { await reaction.fetch() } catch { return } }

    const poll = await db.collection('polls').findOne({ messageId: reaction.message.id, active: true })
    if (!poll) return

    const emoji = reaction.emoji.name
    const optionIndex = poll.options.findIndex((_, i) => getEmoji(i) === emoji)
    if (optionIndex === -1) return

    if (!poll.multiVote) {
      // Remove other reactions from this user
      const otherReactions = reaction.message.reactions.cache.filter(r => r.emoji.name !== emoji)
      for (const [, r] of otherReactions) {
        await r.users.remove(user.id).catch(() => {})
      }
    }

    await db.collection('polls').updateOne(
      { _id: poll._id },
      { $set: { [`votes.${user.id}`]: optionIndex } }
    )
  })

  // End polls when time is up
  setInterval(async () => {
    const now = new Date()
    const ended = await db.collection('polls').find({
      active: true,
      messageId: { $exists: true, $ne: 'failed' },
      endsAt: { $lte: now },
    }).toArray()

    for (const poll of ended) {
      await db.collection('polls').updateOne({ _id: poll._id }, { $set: { active: false, endedAt: now } })

      const guild = client.guilds.cache.first()
      if (!guild) continue
      const channel = guild.channels.cache.get(poll.channelId)
      if (!channel) continue

      const votes = poll.votes || {}
      const counts = poll.options.map((_, i) => Object.values(votes).filter(v => v === i).length)
      const total = counts.reduce((a, b) => a + b, 0)
      const maxVotes = Math.max(...counts)
      const winnerIdx = counts.indexOf(maxVotes)

      const embed = new EmbedBuilder()
        .setColor('#5865f2')
        .setTitle(`📊 Poll Ended: ${poll.question}`)
        .setDescription(poll.options.map((opt, i) => {
          const pct = total > 0 ? Math.round((counts[i] / total) * 100) : 0
          const bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10))
          const winner = i === winnerIdx && total > 0 ? ' 🏆' : ''
          return `${getEmoji(i)} **${opt}**${winner}\n${bar} ${pct}% (${counts[i]} votes)`
        }).join('\n\n'))
        .setFooter({ text: `${total} total votes` })
        .setTimestamp()

      channel.send({ embeds: [embed] }).catch(() => {})
    }
  }, 30000)
}

module.exports = { init }
