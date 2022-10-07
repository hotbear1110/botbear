/**
 * This module provides a wrapper around the Twitch API.
 */

const { got } = require('../../got');
const internal = require('./internal.js');

const BASE_URL = 'https://api.twitch.tv/helix';

const DEFAULT_RESULT = {
    statusCode: 200,
    data: [],
};

/**
 * @param { import('got').Method } method 
 * @param { string } path 
 * @param { MakeRequestOptions } options
 * 
 * @template T
 * @returns { Promise<Result<T>> }
 */
const makeRequest = async (method, path, options = {}) => {
    const token = await internal.getToken();
    if (!token) {
        return {
            statusCode: 401,
            data: [],
            error: 'Unauthorized'
        };
    }

    const headers = {
        'Client-ID': process.env.TWITCH_CLIENTID,
        'Authorization': `Bearer ${token}`,
    };
    const url = `${BASE_URL}${path}`;

    options.body && (headers['Content-Type'] = 'application/json');

    const response = await got(url, {
        method,
        headers,
        searchParams: options.searchParams,
        json: options.body,
    });

    const body = JSON.parse(response.body);
    
    if (response.statusCode >= 400) {
        console.error('Failed to make request to Twitch API', { 
            url, request: 
            options, 
            response: body
        });

        return {
            statusCode: response.statusCode,
            data: [],
            error: `${body.error} - ${body.message}`
        };
    }

    return {
        statusCode: response.statusCode,
        data: body.data,
        error: null
    };
};

module.exports = {
    /**
     * @param { { ids: string[], logins: string[] } } users
     * @returns { Promise<Result<Users>> }
     */
    GetUsers: async (users) => {
        if (!users?.ids?.length && !users?.logins?.length) {
            return DEFAULT_RESULT;
        }

        const params = new URLSearchParams();
        
        users.ids?.map((id) => params.append('id', id));
        users.logins?.map((login) => params.append('login', login));

        return makeRequest('GET', '/users', {
            searchParams: params
        });
    }
};

/**
 * @template T
 * @typedef { Object } Result
 * @property { number } statusCode
 * @property { T } data
 * @property { string } [error]
 */

/**
 * @typedef { Object } Users
 * @property { string } id
 * @property { string } login
 * @property { string } display_name
 * @property { 'staff' | 'admin' | 'global_mod' | '' } type
 * @property { string } broadcaster_type
 * @property { string } description
 * @property { string } profile_image_url
 * @property { string } offline_image_url
 * @property { number } view_count
 * @property { boolean } created_at 
 */

/**
 * @typedef { Object } MakeRequestOptions
 * @property { URLSearchParams } [params]
 * @property { Object } [body]
 */