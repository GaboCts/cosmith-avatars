import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { corsMiddleware } from './middlewares/cors.js'
import { avatarRouter } from './routes/avatar.js'
import { formatRouter } from './routes/format.js'
import { providerRouter } from './routes/providers.js'

process.loadEnvFile()

const PORT = process.env.PORT || 3000
const BASE_URL = process.env.BASE_URL || "http://127.0.0.1"
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(corsMiddleware())

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src *")
    next()
})

app.use(
    '/providers',
    express.static(path.join(__dirname, 'public', 'providers'))
)

app.use('/providers', providerRouter)

app.use("/avatar", avatarRouter)

app.use(formatRouter)

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Active avatar server in ${ BASE_URL }:${ PORT }`)
})

export default app