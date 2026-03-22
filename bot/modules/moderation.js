function init(client, db) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const config = await db.collection('modules').findOne({ key: 'moderation' })
    if (!config?.enabled) return

    const { commandName, options, guild, member } = interaction

    if (!member.permissions.has('ModerateMembers')) return

    if (commandName === 'ban') {
      const target = options.getUser('user')
      const reason = options.getString('reason') || 'No reason provided'
      await guild.members.ban(target.id, { reason })
      await interaction.reply({ content: `Banned ${target.tag} — ${reason}`, ephemeral: true })
      await logAction(db, config, interaction, 'BAN', target, reason)
    }

    if (commandName === 'kick') {
      const target = options.getMember('user')
      const reason = options.getString('reason') || 'No reason provided'
      await target.kick(reason)
      await interaction.reply({ content: `Kicked ${target.user.tag} — ${reason}`, ephemeral: true })
      await logAction(db, config, interaction, 'KICK', target.user, reason)
    }

    if (commandName === 'warn') {
      const target = options.getUser('user')
      const reason = options.getString('reason') || 'No reason provided'
      await db.collection('tracker').insertOne({ type: 'mod_action', action: 'WARN', userId: target.id, reason, guildId: guild.id, at: new Date() })
      if (config.dmOnAction) {
        try { await target.send(`You have been warned in ${guild.name}: ${reason}`) } catch {}
      }
      const warnCount = await db.collection('tracker').countDocuments({ type: 'mod_action', action: 'WARN', userId: target.id, guildId: guild.id })
      if (config.maxWarns && warnCount >= config.maxWarns) {
        await guild.members.ban(target.id, { reason: `Auto-ban: reached ${config.maxWarns} warnings` })
        await interaction.reply({ content: `Auto-banned ${target.tag} after ${warnCount} warnings.`, ephemeral: true })
      } else {
        await interaction.reply({ content: `Warned ${target.tag} (${warnCount} total) — ${reason}`, ephemeral: true })
      }
    }

    if (commandName === 'timeout') {
      const target = options.getMember('user')
      const minutes = options.getInteger('minutes') || 10
      const reason = options.getString('reason') || 'No reason provided'
      await target.timeout(minutes * 60000, reason)
      await interaction.reply({ content: `Timed out ${target.user.tag} for ${minutes}m — ${reason}`, ephemeral: true })
      await logAction(db, config, interaction, 'TIMEOUT', target.user, reason)
    }

    if (commandName === 'purge') {
      const amount = options.getInteger('amount') || 10
      await interaction.channel.bulkDelete(Math.min(amount, 100), true)
      await interaction.reply({ content: `Deleted ${amount} messages.`, ephemeral: true })
    }
  })
}

async function logAction(db, config, interaction, action, target, reason) {
  await db.collection('tracker').insertOne({
    type: 'mod_action', action,
    userId: target.id, reason,
    guildId: interaction.guild.id,
    at: new Date(),
  })
}

module.exports = { init }
