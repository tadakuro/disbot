function init(client, db) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const config = await db.collection('modules').findOne({ key: 'moderation' })
    if (!config?.enabled) return

    const { commandName, options, guild, member } = interaction
    const modCommands = ['ban', 'kick', 'warn', 'timeout', 'purge']
    if (!modCommands.includes(commandName)) return

    if (!member.permissions.has('ModerateMembers')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true })
    }

    await interaction.deferReply({ ephemeral: true })

    try {
      if (commandName === 'ban') {
        const target = options.getUser('user')
        const reason = options.getString('reason') || 'No reason provided'
        await guild.members.ban(target.id, { reason })
        await interaction.editReply(`✅ Banned **${target.tag}** — ${reason}`)
        await logAction(db, config, interaction, 'BAN', target, reason)
      }

      else if (commandName === 'kick') {
        const target = options.getMember('user')
        const reason = options.getString('reason') || 'No reason provided'
        await target.kick(reason)
        await interaction.editReply(`✅ Kicked **${target.user.tag}** — ${reason}`)
        await logAction(db, config, interaction, 'KICK', target.user, reason)
      }

      else if (commandName === 'warn') {
        const target = options.getUser('user')
        const reason = options.getString('reason') || 'No reason provided'
        await db.collection('tracker').insertOne({
          type: 'mod_action', action: 'WARN',
          userId: target.id, reason,
          guildId: guild.id, at: new Date(),
        })
        if (config.dmOnAction) {
          try { await target.send(`You have been warned in **${guild.name}**: ${reason}`) } catch {}
        }
        const warnCount = await db.collection('tracker').countDocuments({
          type: 'mod_action', action: 'WARN',
          userId: target.id, guildId: guild.id,
        })
        if (config.maxWarns && warnCount >= config.maxWarns) {
          await guild.members.ban(target.id, { reason: `Auto-ban: reached ${config.maxWarns} warnings` })
          await interaction.editReply(`🔨 Auto-banned **${target.tag}** after reaching ${warnCount} warnings.`)
        } else {
          await interaction.editReply(`⚠️ Warned **${target.tag}** (${warnCount} total) — ${reason}`)
        }
      }

      else if (commandName === 'timeout') {
        const target = options.getMember('user')
        const minutes = options.getInteger('minutes') || 10
        const reason = options.getString('reason') || 'No reason provided'
        await target.timeout(minutes * 60000, reason)
        await interaction.editReply(`⏱️ Timed out **${target.user.tag}** for ${minutes}m — ${reason}`)
        await logAction(db, config, interaction, 'TIMEOUT', target.user, reason)
      }

      else if (commandName === 'purge') {
        const amount = Math.min(options.getInteger('amount') || 10, 100)
        const deleted = await interaction.channel.bulkDelete(amount, true)
        await interaction.editReply(`🗑️ Deleted ${deleted.size} messages.`)
      }

    } catch (err) {
      console.error(`Moderation error (${commandName}):`, err.message)
      try {
        await interaction.editReply(`❌ Failed to execute command: ${err.message}`)
      } catch {}
    }
  })
}

async function logAction(db, config, interaction, action, target, reason) {
  await db.collection('tracker').insertOne({
    type: 'mod_action', action,
    userId: target.id, reason,
    guildId: interaction.guild.id,
    at: new Date(),
  }).catch(() => {})
}

module.exports = { init }
