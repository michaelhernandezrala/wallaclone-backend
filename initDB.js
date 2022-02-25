'use strict'

require('dotenv').config() 

const { askUser } = require('./lib/utils')
const { mongoose, connectMongoose, Advert, User } = require('./models')

const ADVERTS_JSON = './adverts.json'
require('./lib/i18nSetup')

main().catch(err => console.error('Error!', err))

async function main () {
  
  await connectMongoose

  const answer = await askUser('Are you sure you want to empty DB and load initial data? (no) ')
  if (answer.toLowerCase() !== 'yes') {
    console.log('DB init aborted! nothing has been done')
    return process.exit(0)
  }

  const AdvertsResult = await initAdverts(ADVERTS_JSON)
  console.log(`\nAdverts: Deleted ${AdvertsResult.deletedCount}, loaded ${AdvertsResult.loadedCount} from ${ADVERTS_JSON}`)

  const usuariosResult = await initUsers()
  console.log(`\nUser: Deleted ${userResult.deletedCount}, loaded ${usersResult.loadedCount.length}`)

  // Cuando termino, cierro la conexión a la BD
  await mongoose.connection.close()
  console.log('\nDone.')
  return process.exit(0)
}

async function initAdverts (fichero) {
  const { deletedCount } = await Advert.deleteMany()
  const loadedCount = await Advert.cargaJson(fichero)
  return { deletedCount, loadedCount }
}

async function initUsers () {
  const { deletedCount } = await User.deleteMany()
  const loadedCount = await User.insertMany([
    {name: 'user', email: 'user@example.com', password: User.hashPassword('1234')},
    {name: 'user2', email: 'user2@example.com', password: User.hashPassword('1234')}
  ])
  return { deletedCount, loadedCount }
}
