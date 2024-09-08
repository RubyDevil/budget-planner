const args = require('yargs').argv
console.log(args)
if (args.h) {
   console.info('\t--ip\t\tIP address to run the server on')
   console.info('\t--port\t\tPort number to run the server on')
   process.exit(0)
} else if (args.ip === undefined) {
   console.error('Please provide an IP address with the --ip flag')
   process.exit(1)
} else if (args.port === undefined) {
   args.port = 80
}
// ----- Server -----
import express from 'express'

const app = express()

app.use(express.static(require('path').join(__dirname, 'public')))

app.listen(+args.port || 80, args.ip, () => console.log(`Server is running on http://${args.ip}:${args.port}/`))
