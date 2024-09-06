// ----- Server -----
const { db } = require('./private/database')
const express = require('express')
const path = require('path')

const app = express()

app.use('/api', express.json(), require('./private/api').router)

app.use(express.static(path.join(__dirname, 'public')))

app.listen(8080, () => {
   console.log('Server is running on port 80')
})
