const PROVIDERS_BASE_URL = process.env.PROVIDERS_BASE_URL || 'http://localhost:3000/providers'

export const Providers  = {
    providers: {
        bluesky: {
            provider: 'BlueSky',
            logo_url: `${PROVIDERS_BASE_URL}/bluesky.svg`,
            input_type: 'username',
            provider_site: 'bsky.app'
        },dockerhub: {
            provider: 'Docker Hub',
            logo_url: `${PROVIDERS_BASE_URL}/dockerhub.svg`,
            input_type: 'username',
            provider_site: 'hub.docker.com'
        },
        github: {
            provider: 'GitHub',
            logo_url: `${PROVIDERS_BASE_URL}/github.svg`,
            input_type: 'username',
            provider_site: 'github.com'
        },
        gitlab: {
            provider: 'GitLab',
            logo_url: `${PROVIDERS_BASE_URL}/gitlab.svg`,
            input_type: 'username',
            provider_site: 'gitlab.com'
        },
        gravatar: {
            provider: 'Gravatar',
            logo_url: `${PROVIDERS_BASE_URL}/gravatar.svg`,
            input_type: 'email',
            provider_site: 'gravatar.com'
        },
        kick: {
            provider: 'Kick',
            logo_url: `${PROVIDERS_BASE_URL}/kick.svg`,
            input_type: 'channel',
            provider_site: 'kick.com'
        },
        mastodon: {
            provider: 'Mastodon',
            logo_url: `${PROVIDERS_BASE_URL}/mastodon.svg`,
            input_type: 'username',
            provider_site: 'mastodon.social'
        },
        // reddit: {
        //     provider: 'Reddit',
        //     logo_url: `${PROVIDERS_BASE_URL}/reddit.svg`,
        //     input_type: 'username'
        // },
        stackoverflow: {
            provider: 'Stack Overflow',
            logo_url: `${PROVIDERS_BASE_URL}/stackoverflow.svg`,
            input_type: 'user_id',
            provider_site: 'stackoverflow.com'
        },
        twitch: {
            provider: 'Twitch',
            logo_url: `${PROVIDERS_BASE_URL}/twitch.svg`,
            input_type: 'channel',
            provider_site: 'twitch.tv'
        },
        vimeo: {
            provider: 'Vimeo',
            logo_url: `${PROVIDERS_BASE_URL}/vimeo.svg`,
            input_type: 'user_id',
            provider_site: 'vimeo.com'
        },
        xbox: {
            provider: 'Xbox',
            logo_url: `${PROVIDERS_BASE_URL}/xbox.svg`,
            input_type: 'gamertag',
            provider_site: 'xbox.com'
        }
    }
}