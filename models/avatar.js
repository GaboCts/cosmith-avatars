import { getBlueSkyAvatar } from '../providers/bluesky/bluesky.js'
import { getDockerHubAvatar } from '../providers/dockerhub/dockerhub.js'
import { getGitHubAvatar } from '../providers/github/github.js'
import { getGitLabAvatar } from '../providers/gitlab/gitlab.js'
import { getGravatar } from '../providers/gravatar/gravatar.js'
import { getKickAvatar } from '../providers/kick/kick.js'
import { getMastodonAvatar } from '../providers/mastodon/mastodon.js'
import { getStackOverflowAvatar } from '../providers/stackoverflow/stackoverflow.js'
import { getTwitchAvatar } from '../providers/twitch/twitch.js'
import { getVimeoAvatar } from '../providers/vimeo/vimeo.js'
import { getXboxAvatar } from '../providers/xbox/xbox.js'
import { downloadAndResize, generateErrorImage } from '../utils/image.js'
import { Providers } from '../utils/providers.js'

let response

export class avatarModel {

    static async getAvatar({ provider, input }) {
        switch (provider) {
            case 'bluesky':
                response = await getBlueSkyAvatar(input)
                break
            case 'dockerhub':
                response = await getDockerHubAvatar(input)
                break
            case 'github':
                response = await getGitHubAvatar(input)
                break
            case 'gitlab':
                response = await getGitLabAvatar(input)
                break
            case 'gravatar':
                response = await getGravatar(input)
                break
            case 'kick':
                response = await getKickAvatar(input)
                break
            case 'mastodon':
                response = await getMastodonAvatar(input)
                break
            case 'stackoverflow':
                response = await getStackOverflowAvatar(input)
                break
            case 'twitch':
                response = await getTwitchAvatar(input)
                break
            case 'vimeo':
                response = await getVimeoAvatar(input)
                break
            case 'xbox':
                response = await getXboxAvatar(input)
                break
            default:
                return {
                    status: 400,
                    body: {
                        error: 'Provider not supported',
                        message: `Provider "${provider}" is not available.`,
                        Providers
                    }
                }
        }

        if (response.error) {
            const errorImage = await generateErrorImage('Error', response.message)
            return {
                status: response.status || 404,
                body: {
                    image: errorImage.buffer,
                    contentType: errorImage.contentType
                }
            }
        }
    
        try {
            const { buffer, contentType } = await downloadAndResize(response.avatar_url)
            return {
                status: 200,
                body: {
                    image: buffer,
                    contentType: contentType
                }
            }
        } catch (error) {
            return {
                status: 502,
                body: {
                    error: 'Error processing image',
                    message: error.message
                }
            }
        }

    }
}