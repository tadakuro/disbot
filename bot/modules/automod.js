const spamMap = new Map()

function init(client, db) {
  client.on('messageCreate', async (message) => {
    if (message.author.bot) return
    if (!message.guild) return

    const config = await db.collection('modules').findOne({ key: 'automod' })
    if (!config?.enabled) return

    // Check exempt channel
    if (config.exemptChannels && message.channelId === config.exemptChannels) return

    // Check exempt roles
    if (config.exemptRoles) {
      const exemptIds = config.exemptRoles.split(',').map(r => r.trim()).filter(Boolean)
      const member = message.member
      if (member && exemptIds.some(id => member.roles.cache.has(id))) return
    }

    const content = message.content
    const contentLower = content.toLowerCase()
    const userId = message.author.id

    // Anti-spam
    if (config.filterSpam) {
      const now = Date.now()
      const history = spamMap.get(userId) || []
      const recent = history.filter(t => now - t < 5000)
      recent.push(now)
      spamMap.set(userId, recent)
      if (recent.length >= 5) {
        await handleViolation(message, db, config, 'Spam detected')
        return
      }
    }

    // Links
    if (config.filterLinks && /(https?:\/\/|www\.)\S+/.test(contentLower)) {
      await handleViolation(message, db, config, 'Link blocked')
      return
    }

    // Invites
    if (config.filterInvites && /(discord\.gg|discord\.com\/invite)\/\S+/.test(contentLower)) {
      await handleViolation(message, db, config, 'Invite link blocked')
      return
    }

    // Mass mentions
    if (config.filterMentions && message.mentions.users.size >= 5) {
      await handleViolation(message, db, config, 'Mass mention blocked')
      return
    }

    // Excessive caps (>70% uppercase, minimum 8 chars)
    if (config.filterCaps && content.length >= 8) {
      const letters = content.replace(/[^a-zA-Z]/g, '')
      const upper = content.replace(/[^A-Z]/g, '')
      if (letters.length > 0 && (upper.length / letters.length) > 0.7) {
        await handleViolation(message, db, config, 'Excessive caps')
        return
      }
    }

    // Emoji spam (more than 8 emojis)
    if (config.filterEmoji) {
      const emojiCount = (content.match(/\p{Emoji}/gu) || []).length
      if (emojiCount > 8) {
        await handleViolation(message, db, config, 'Emoji spam')
        return
      }
    }

    // Banned words
    if (config.bannedWords) {
      const banned = config.bannedWords.split(',').map(w => w.trim().toLowerCase()).filter(Boolean)
      if (banned.some(w => contentLower.includes(w))) {
        await handleViolation(message, db, config, 'Banned word detected')
        return
      }
    }
  })
}

async function handleViolation(message, db, config, reason) {
  try { await message.delete() } catch {}

  await db.collection('tracker').insertOne({
    type: 'automod', reason,
    userId: message.author.id,
    guildId: message.guild.id,
    at: new Date(),
  }).catch(() => {})

  if (config.action === 'warn') {
    try { await message.author.send(`Your message was removed in **${message.guild.name}**: ${reason}`) } catch {}
  } else if (config.action === 'timeout') {
    try {
      const member = await message.guild.members.fetch(message.author.id)
      await member.timeout(5 * 60000, reason)
    } catch {}
  } else if (config.action === 'kick') {
    try {
      const member = await message.guild.members.fetch(message.author.id)
      await member.kick(reason)
    } catch {}
  }
}

module.exports = { init }
