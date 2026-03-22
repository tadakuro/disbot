function init(client, db) {
  setInterval(async () => {
    const now = new Date()
    const due = await db.collection('scheduled_messages').find({
      sent: false,
      scheduledAt: { $lte: now },
    }).toArray()

    for (const msg of due) {
      const guild = client.guilds.cache.first()
      if (!guild) continue
      const channel = guild.channels.cache.get(msg.channelId)
      if (!channel) continue

      try {
        await channel.send(msg.message)
      } catch (err) {
        console.error('Scheduled message error:', err.message)
        continue
      }

      if (msg.repeat === 'none' || !msg.repeat) {
        await db.collection('scheduled_messages').updateOne({ _id: msg._id }, { $set: { sent: true } })
      } else {
        const intervals = { hourly: 3600000, daily: 86400000, weekly: 604800000 }
        const next = new Date(now.getTime() + (intervals[msg.repeat] || 86400000))
        await db.collection('scheduled_messages').updateOne({ _id: msg._id }, { $set: { scheduledAt: next } })
      }
    }
  }, 30000)
}

module.exports = { init }
