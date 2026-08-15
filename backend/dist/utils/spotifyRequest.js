"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeRangeData = exports.timeRanges = exports.createEmptyTimeRangeResult = exports.getAccessToken = exports.fetchSpotifyData = exports.fetchSpotify = exports.refreshAccessToken = void 0;
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
/**
 * Fetcher that handles both 401 (expired token) and 429 (rate limit)
 */
const fetchSpotify = async (url, accessToken, refreshToken, params = {}, retries = 2) => {
    try {
        const res = await axios_1.default.get(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params,
        });
        return res.data;
    }
    catch (err) {
        const status = err.response?.status;
        // Handle rate limiting
        if (status === 429 && retries > 0) {
            const retryAfter = parseInt(err.response.headers['retry-after'] || '1', 10) * 1000;
            console.warn(`Rate limited. Retrying after ${retryAfter} ms...`);
            await new Promise((resolve) => setTimeout(resolve, retryAfter));
            return (0, exports.fetchSpotify)(url, accessToken, refreshToken, params, retries - 1);
        }
        // Handle expired token
        if (status === 401 && refreshToken) {
            console.warn('Access token expired. Refreshing...');
            const refreshed = await (0, exports.refreshAccessToken)(refreshToken);
            const res = await axios_1.default.get(url, {
                headers: { Authorization: `Bearer ${refreshed.access_token}` },
                params,
            });
            return res.data;
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
        const data = await (0, exports.fetchSpotify)(url, accessToken, refreshToken);
        if (customHandler) {
            await customHandler(data, req, res);
        }
        else {
            res.json(data);
        }
    }
    catch (error) {
        console.error(`Failed to fetch ${endpoint}`, error.message);
        res.status(500).json({ error: `Failed to fetch ${endpoint}` });
    }
};
exports.fetchSpotifyData = fetchSpotifyData;
const getAccessToken = (req) => req.headers.authorization?.replace('Bearer ', '');
exports.getAccessToken = getAccessToken;
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
