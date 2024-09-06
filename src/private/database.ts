const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017'

const client = new MongoClient(url)
client.once('open', () => console.log('Connected to MongoDB'))
client.connect()

const db = client.db('test')
const users = db.collection('users')

module.exports = { db, users }