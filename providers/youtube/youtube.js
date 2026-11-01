import { makeRequest } from '../../utils/request.js'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'none'

export async function getYouTubeAvatar(channel) {
    try {
        if (YOUTUBE_API_KEY === 'none') {
            return {
                error: 'Credential error',
                message: 'Contact the administrator to fix the problem.',
                status: 500
            }
        }

        const responseBody = await makeRequest(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet&forHandle=${encodeURIComponent(channel)}&key=${ YOUTUBE_API_KEY }`,
            'GET',
            null,
            {
                'User-Agent': 'cosmith-avatar-app'
            }
        )

        const data = JSON.parse(responseBody)

        if (data.pageInfo.totalResults === 0) {
            return {
                error: 'User not found',
                message: `User "${channel}" not found`,
                status: 404
            }
        }

        const avatar_url = data.items[0].snippet.thumbnails.high.url

        return {
            avatar_url: avatar_url
        }
    } catch (error) {
        return {
            error: 'Error fetching YouTube',
            message: error.message,
            status: 502
        }
    }
}