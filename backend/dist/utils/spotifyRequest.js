"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeRangeData = exports.timeRanges = exports.createEmptyTimeRangeResult = exports.getRefreshToken = exports.getAccessToken = exports.fetchSpotifyData = exports.fetchSpotify = exports.refreshAccessToken = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
/**
 * Refresh an access token using the refresh token.
 */
const refreshAccessToken = async (refreshToken) => {
    const authString = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    const response = await axios_1.default.post('https://accounts.spotify.com/api/token', querystring_1.default.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    }), {
        headers: {
            Authorization: `Basic ${encodedAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data; // contains access_token and expires_in
};
exports.refreshAccessToken = refreshAccessToken;
// so routes can send 401 instead of 500 when the refresh itself fails
class SpotifyAuthError extends Error {
    constructor() {
        super(...arguments);
        this.status = 401;
    }
}
// retries on expired tokens (401) and rate limits (429), passes new tokens back via res
const fetchSpotify = async (url, accessToken, refreshToken, params = {}, retries = 2, res) => {
    try {
        const response = await axios_1.default.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params,
        });
        return response.data;
    }
    catch (err) {
        const status = err.response?.status;
        // rate limited, back off and try again
        if (status === 429 && retries > 0) {
            const retryAfter = parseInt(err.response.headers['retry-after'] || '1', 10) * 1000;
            console.warn(`Rate limited. Retrying after ${retryAfter} ms...`);
            await new Promise((resolve) => setTimeout(resolve, retryAfter));
            return (0, exports.fetchSpotify)(url, accessToken, refreshToken, params, retries - 1, res);
        }
        // token's expired, try refreshing it
        if (status === 401 && refreshToken) {
            console.warn('Access token expired. Refreshing...');
            let refreshed;
            try {
                refreshed = await (0, exports.refreshAccessToken)(refreshToken);
            }
            catch (refreshErr) {
                console.warn('Refresh token invalid or expired. User must log in again.');
                throw new SpotifyAuthError('Refresh token invalid or expired');
            }
            res?.setHeader('x-new-access-token', refreshed.access_token);
            if (refreshed.refresh_token) {
                res?.setHeader('x-new-refresh-token', refreshed.refresh_token);
            }
            const retried = await axios_1.default.get(url, {
                headers: { Authorization: `Bearer ${refreshed.access_token}` },
                params,
            });
            return retried.data;
        }
        throw err;
    }
};
exports.fetchSpotify = fetchSpotify;
/**
 * Route helper: wrap fetchSpotify for use inside Express routes.
 */
const fetchSpotifyData = async (endpoint, req, res, customHandler) => {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    const refreshToken = req.headers['x-refresh-token'];
    if (!accessToken || !refreshToken) {
        res.status(401).json({ error: 'Access or refresh token is missing' });
        return;
    }
    try {
        const url = `https://api.spotify.com/v1/${endpoint}`;
        const data = await (0, exports.fetchSpotify)(url, accessToken, refreshToken, {}, 2, res);
        if (customHandler) {
            await customHandler(data, req, res);
        }
        else {
            res.json(data);
        }
    }
    catch (error) {
        console.error(`Failed to fetch ${endpoint}`, error.message);
        res.status(error.status === 401 ? 401 : 500).json({ error: `Failed to fetch ${endpoint}` });
    }
};
exports.fetchSpotifyData = fetchSpotifyData;
const getAccessToken = (req) => req.headers.authorization?.replace('Bearer ', '');
exports.getAccessToken = getAccessToken;
const getRefreshToken = (req) => req.headers['x-refresh-token'];
exports.getRefreshToken = getRefreshToken;
const createEmptyTimeRangeResult = (defaultValue) => ({
    short_term: defaultValue,
    medium_term: defaultValue,
    long_term: defaultValue,
});
exports.createEmptyTimeRangeResult = createEmptyTimeRangeResult;
exports.timeRanges = ['short_term', 'medium_term', 'long_term'];
const getTimeRangeData = (token, res) => {
    if (!token) {
        res.status(401).json({ error: 'Access token is missing' });
    }
};
exports.getTimeRangeData = getTimeRangeData;
