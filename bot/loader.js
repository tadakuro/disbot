const moderation = require('./modules/moderation')
const automod = require('./modules/automod')
const welcome = require('./modules/welcome')
const reactionRoles = require('./modules/reactionRoles')
const logging = require('./modules/logging')
const autoRoles = require('./modules/autoRoles')
const commands = require('./modules/commands')
const giveaways = require('./modules/giveaways')
const tracker = require('./modules/tracker')

async function load(client, db) {
  const modules = await db.collection('modules').find({}).toArray()
  const moduleMap = {}
  modules.forEach((m) => { moduleMap[m.key] = m })

  tracker.init(client, db)

  if (moduleMap['moderation']?.enabled) moderation.init(client, db)
  if (moduleMap['automod']?.enabled) automod.init(client, db, moduleMap['automod'])
  if (moduleMap['welcome']?.enabled) welcome.init(client, db, moduleMap['welcome'])
  if (moduleMap['reaction-roles']?.enabled) reactionRoles.init(client, db, moduleMap['reaction-roles'])
  if (moduleMap['logging']?.enabled) logging.init(client, db, moduleMap['logging'])
  if (moduleMap['auto-roles']?.enabled) autoRoles.init(client, db, moduleMap['auto-roles'])

  commands.init(client, db)
  giveaways.init(client, db)

  console.log('Modules loaded.')
}

module.exports = { load }
