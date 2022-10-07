/**
 * Internal function to get the token from the Twitch API.
 */

const { got } = require('../../got');
const redis = require('../../tools/redis.js').Get();

const REDIS_KEY = 'helix:token';
const SCOPES = [];

const REFRESH_URL = 'https://id.twitch.tv/oauth2/token';
const VALIDATE_URL = 'https://id.twitch.tv/oauth2/validate';

/**
 * @returns {Promise<string | ''>}
 */
exports.getToken = async () => {
    const token = await redis.Get(REDIS_KEY);
    if (!token) {
        const refresh = await refreshToken();
        if (!refresh) {
            return '';
        }
        return refresh.access_token;
    }
    const { access_token } = JSON.parse(token);

    const ok = await validateToken(access_token);
    if (!ok) {
        return access_token;
    }

    return ok;
};

/**
 * @param { TwitchToken } token 
 */
const saveToken = async (token) => {
    await redis.Set(REDIS_KEY, JSON.stringify(token))
        .then((fn) => fn(token.expires_in));
};

/**
 * @returns {Promise<TwitchToken | null>}
 */
const refreshToken = async () => {
    const { statusCode, body } = await got(REFRESH_URL, {
        method: 'POST',
        searchParams: {
            'client_id': process.env.TWITCH_CLIENTID,
            'client_secret': process.env.TWITCH_SECRET,
            'grant_type': 'client_credentials',
            'scope': SCOPES.join(' '),
        },
        throwHttpErrors: false
    });

    if (statusCode !== 200) {
        console.error('Failed to get token from Twitch API', JSON.parse(body));
        return null;
    }

    const json = JSON.parse(body);
    
    await saveToken(json);

    return json;
};

/**
 * @param { string } token 
 * @returns { Promise<string | null> }
 */
const validateToken = async (token) => {
    const { statusCode, body } = await got(VALIDATE_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        throwHttpErrors: false
    });

    if (statusCode === 200) {
        return token;
    }

    const json = JSON.parse(body);
    console.error('Failed to validate token from Twitch API', json);

    const newToken = await refreshToken();
    if (!newToken) {
        console.error('Failed to get new token from Twitch API');
        return null;
    }

    await saveToken(newToken);
    
    return newToken;
};

/**
 * @typedef  { Object } TwitchToken
 * @property { string } access_token
 * @property { string } refresh_token
 * @property { string } expires_in
 */