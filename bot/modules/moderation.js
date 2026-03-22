const { EmbedBuilder } = require('discord.js')

function init(client, db) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const modCommands = ['ban', 'kick', 'warn', 'timeout', 'purge']
    if (!modCommands.includes(interaction.commandName)) return

    const config = await db.collection('modules').findOne({ key: 'moderation' })
    if (!config?.enabled) return

    const { commandName, options, guild, member } = interaction

    // Check appropriate permission per command
    const perms = {
      ban: 'BanMembers',
      kick: 'KickMembers',
      warn: 'ModerateMembers',
      timeout: 'ModerateMembers',
      purge: 'ManageMessages',
    }

    if (!member.permissions.has(perms[commandName])) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true })
    }

    await interaction.deferReply({ ephemeral: true })

    try {
      if (commandName === 'ban') {
        const target = options.getUser('user')
        const reason = options.getString('reason') || 'No reason provided'
        await guild.members.ban(target.id, { reason })
        await interaction.editReply(`✅ Banned **${target.username}** — ${reason}`)
        await sendModLog(db, config, guild, 'BAN', target.username, reason, '#ef4444')
        await logAction(db, interaction, 'BAN', target.id, reason)
      }

      else if (commandName === 'kick') {
        const target = options.getMember('user')
        const reason = options.getString('reason') || 'No reason provided'
        await target.kick(reason)
        await interaction.editReply(`✅ Kicked **${target.user.username}** — ${reason}`)
        await sendModLog(db, config, guild, 'KICK', target.user.username, reason, '#f59e0b')
        await logAction(db, interaction, 'KICK', target.user.id, reason)
      }

      else if (commandName === 'warn') {
        const target = options.getUser('user')
        const reason = options.getString('reason') || 'No reason provided'
        await logAction(db, interaction, 'WARN', target.id, reason)
        if (config.dmOnAction) {
          try { await target.send(`⚠️ You have been warned in **${guild.name}**: ${reason}`) } catch {}
        }
        const warnCount = await db.collection('tracker').countDocuments({
          type: 'mod_action', action: 'WARN',
          userId: target.id, guildId: guild.id,
        })
        if (config.maxWarns && warnCount >= config.maxWarns) {
          await guild.members.ban(target.id, { reason: `Auto-ban: reached ${config.maxWarns} warnings` })
          await interaction.editReply(`🔨 Auto-banned **${target.username}** after reaching ${warnCount} warnings.`)
          await sendModLog(db, config, guild, 'AUTO-BAN', target.username, `Reached ${warnCount} warnings`, '#ef4444')
        } else {
          await interaction.editReply(`⚠️ Warned **${target.username}** (${warnCount} total) — ${reason}`)
          await sendModLog(db, config, guild, 'WARN', target.username, reason, '#f59e0b')
        }
      }

      else if (commandName === 'timeout') {
        const target = options.getMember('user')
        const minutes = options.getInteger('minutes') || 10
        const reason = options.getString('reason') || 'No reason provided'
        await target.timeout(minutes * 60000, reason)
        await interaction.editReply(`⏱️ Timed out **${target.user.username}** for ${minutes}m — ${reason}`)
        await sendModLog(db, config, guild, 'TIMEOUT', target.user.username, `${minutes}m — ${reason}`, '#f59e0b')
        await logAction(db, interaction, 'TIMEOUT', target.user.id, reason)
      }

      else if (commandName === 'purge') {
        const amount = Math.min(options.getInteger('amount') || 10, 100)
        const deleted = await interaction.channel.bulkDelete(amount, true)
        await interaction.editReply(`🗑️ Deleted ${deleted.size} messages.`)
      }

    } catch (err) {
      console.error(`Moderation error (${commandName}):`, err.message)
      try {
        await interaction.editReply(`❌ Failed: ${err.message}`)
      } catch {}
    }
  })
}

async function sendModLog(db, config, guild, action, username, detail, color) {
  if (!config.modLogChannel) return
  const ch = guild.channels.cache.get(config.modLogChannel)
  if (!ch) return
  ch.send({
    embeds: [new EmbedBuilder()
      .setColor(color)
      .setTitle(`🔨 ${action}`)
      .setDescription(`**User:** ${username}\n**Detail:** ${detail}`)
      .setTimestamp()],
  }).catch(() => {})
}

async function logAction(db, interaction, action, userId, reason) {
  await db.collection('tracker').insertOne({
    type: 'mod_action', action,
    userId, reason,
    guildId: interaction.guild.id,
    at: new Date(),
  }).catch(() => {})
}

module.exports = { init }
