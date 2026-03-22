const DISCORD_API = 'https://discord.com/api/v10'

export async function getBotInfo(token) {
  const res = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bot ${token}` },
  })
  if (!res.ok) throw new Error('Invalid token or Discord API error')
  return res.json()
}

export async function getBotGuilds(token) {
  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bot ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch guilds')
  return res.json()
}

export async function getGuildChannels(token, guildId) {
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch channels')
  return res.json()
}

export async function getGuildRoles(token, guildId) {
  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
    headers: { Authorization: `Bot ${token}` },
  })
  if (!res.ok) throw new Error('Failed to fetch roles')
  return res.json()
}
