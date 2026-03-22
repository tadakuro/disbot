const spamMap = new Map()

function init(client, db, config) {
  client.on('messageCreate', async (message) => {
    if (message.author.bot) return
    if (!message.guild) return

    const fresh = await db.collection('modules').findOne({ key: 'automod' })
    if (!fresh?.enabled) return

    const content = message.content.toLowerCase()
    const userId = message.author.id

    if (fresh.filterSpam) {
      const now = Date.now()
      const history = spamMap.get(userId) || []
      const recent = history.filter((t) => now - t < 5000)
      recent.push(now)
      spamMap.set(userId, recent)
      if (recent.length >= 5) {
        await handleViolation(message, db, fresh, 'Spam detected')
        return
      }
    }

    if (fresh.filterLinks && /(https?:\/\/|www\.)\S+/.test(content)) {
      await handleViolation(message, db, fresh, 'Link blocked')
      return
    }

    if (fresh.filterInvites && /(discord\.gg|discord\.com\/invite)\/\S+/.test(content)) {
      await handleViolation(message, db, fresh, 'Invite link blocked')
      return
    }

    if (fresh.filterMentions && message.mentions.users.size >= 5) {
      await handleViolation(message, db, fresh, 'Mass mention blocked')
      return
    }

    if (fresh.bannedWords) {
      const banned = fresh.bannedWords.split(',').map((w) => w.trim().toLowerCase()).filter(Boolean)
      if (banned.some((w) => content.includes(w))) {
        await handleViolation(message, db, fresh, 'Banned word detected')
        return
      }
    }
  })
}

async function handleViolation(message, db, config, reason) {
  try {
    await message.delete()
  } catch {}

  await db.collection('tracker').insertOne({
    type: 'automod', reason, userId: message.author.id,
    guildId: message.guild.id, at: new Date(),
  })

  if (config.action === 'warn') {
    try { await message.author.send(`Your message was removed in ${message.guild.name}: ${reason}`) } catch {}
  } else if (config.action === 'timeout') {
    try {
      const member = await message.guild.members.fetch(message.author.id)
      await member.timeout(5 * 60000, reason)
    } catch {}
  }
}

module.exports = { init }
