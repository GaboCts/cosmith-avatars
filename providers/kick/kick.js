import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'url'
import { dirname } from 'node:path'
import { makeRequest } from '../../utils/request.js'

process.loadEnvFile()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const KICK_CLIENT_ID = process.env.KICK_CLIENT_ID || 'none'
const KICK_CLIENT_SECRET = process.env.KICK_CLIENT_SECRET || 'none'
const TOKEN_CACHE_FILE = path.join(__dirname, '.kick-token-cache.json')

let cachedToken = null
let tokenExpiration = null

export async function getKickAvatar(channel) {
    try {
        if (KICK_CLIENT_ID === 'none' || KICK_CLIENT_SECRET === 'none') {
            return {
                error: 'Credential error',
                message: 'Contact the administrator to fix the problem.',
                status: 500
            }
        }

        const token = await getAccessToken()

        const responseUserId = await makeRequest(
            `https://api.kick.com/public/v1/channels?slug=${encodeURIComponent(channel)}`,
            'GET',
            null,
            {
                'User-Agent': 'cosmith-avatar-app',
                'Authorization': `Bearer ${ token }`
            }
        )

        const dataId = JSON.parse(responseUserId)

        if (dataId.data.length  === 0) {
            return {
                error: 'User not found',
                message: `User "${channel}" not found`,
                status: 404
            }
        }

        const responseBody = await makeRequest(
            `https://api.kick.com/public/v1/users?id=${encodeURIComponent(dataId.data[0].broadcaster_user_id)}`,
            'GET',
            null,
            {
                'User-Agent': 'cosmith-avatar-app',
                'Authorization': `Bearer ${ token }`
            }
        )

        const data = JSON.parse(responseBody)

        if (data.message !== 'OK' || !data.data[0].profile_picture) {
            return {
                error: 'User not found',
                message: `User "${channel}" not found`,
                status: 404
            }
        }

        const avatar_url = data.data[0].profile_picture.replace(
            /-(small|medium|large)?\.webp$/i,
            '-fullsize.webp'
        )

        return {
            avatar_url: avatar_url
        }
    } catch (error) {
        return {
            error: 'Error fetching Kick',
            message: error.message,
            status: 502
        }
    }
}

async function getAccessToken() {
    loadTokenFromFile()

    if (cachedToken && Date.now() < tokenExpiration) {
        return cachedToken
    }

    const params = new URLSearchParams({
        client_id: KICK_CLIENT_ID,
        client_secret: KICK_CLIENT_SECRET,
        grant_type: 'client_credentials'
    })

    const tokenResponse = await makeRequest(
        'https://id.kick.com/oauth/token',
        'POST',
        params.toString(),
        {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    )

    const data = JSON.parse(tokenResponse)
    cachedToken = data.access_token
    tokenExpiration = new Date(Date.now() + (data.expires_in - 60) * 1000)

    saveTokenToFile(cachedToken, tokenExpiration)

    return cachedToken
}

function loadTokenFromFile() {
    try {
        if (!fs.existsSync(TOKEN_CACHE_FILE)) {
            return
        }

        const fileContent = fs.readFileSync(TOKEN_CACHE_FILE, 'utf-8')
        const tokenData = JSON.parse(fileContent)

        const expiresAt = new Date(tokenData.expires_at)

        if (tokenData.token && expiresAt && new Date() < expiresAt) {
            cachedToken = tokenData.token
            tokenExpiration = expiresAt
        }
    } catch (error) {
        console.warn('[Kick] Error loading Token:', error.message)
    }
}

function saveTokenToFile(token, expiresAt) {
    try {
        const tokenData = {
            token: token,
            expires_at: expiresAt.toISOString()
        }

        fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify(tokenData, null, 2), 'utf-8')
        console.log('[Kick] Token saved:', expiresAt.toLocaleString())
    } catch (error) {
        console.warn('[Kick] Token error:', error.message)
    }
}