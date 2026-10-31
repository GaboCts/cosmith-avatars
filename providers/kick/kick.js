import { makeRequest } from '../../utils/request.js'

const KICK_API_KEY = process.env.KICK_API_KEY || 'none'

export async function getKickAvatar(channel) {
    try {
        if (KICK_API_KEY === 'none') {
            return {
                error: 'Credential error',
                message: 'Contact the administrator to fix the problem.',
                status: 500
            }
        }

        const responseUserId = await makeRequest(
            `https://api.kick.com/public/v1/channels?slug=${encodeURIComponent(channel)}`,
            'GET',
            null,
            {
                'User-Agent': 'cosmith-avatar-app',
                'Authorization': `bearer ${ KICK_API_KEY }`
            }
        )

        const dataId = JSON.parse(responseUserId)

        if (dataId.data.length  === 0) {
            return {
                error: 'User not found',
                message: `User "${user_id}" not found`,
                status: 404
            }
        }

        const responseBody = await makeRequest(
            `https://api.kick.com/public/v1/users?id=${encodeURIComponent(dataId.data[0].broadcaster_user_id)}`,
            'GET',
            null,
            {
                'User-Agent': 'cosmith-avatar-app',
                'Authorization': `bearer ${ KICK_API_KEY }`
            }
        )

        const data = JSON.parse(responseBody)

        if (data.error === `The requested user couldn't be found.` || !data.pictures.base_link) {
            return {
                error: 'User not found',
                message: `User "${user_id}" not found`,
                status: 404
            }
        }

        const avatar_url = data.pictures.base_link.split('?')[0]

        return {
            avatar_url: avatar_url
        }
    } catch (error) {
        return {
            error: 'Error fetching Vimeo',
            message: error.message,
            status: 502
        }
    }
}