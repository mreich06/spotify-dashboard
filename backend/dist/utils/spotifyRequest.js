"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeRangeData = exports.timeRanges = exports.createEmptyTimeRangeResult = exports.getAccessToken = exports.batchFetchArtists = exports.fetchSpotifyData = exports.fetchWithRefresh = exports.refreshAccessToken = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const fetchWithRetry = async (endpoint, token, retries = 2) => {
    try {
        const response = await axios_1.default.get(`https://api.spotify.com/v1/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        if (error.response?.status === 429 && retries > 0) {
            const retryAfter = parseInt(error.response.headers['retry-after'] || '1', 10) * 1000;
            await new Promise((resolve) => setTimeout(resolve, retryAfter));
            return fetchWithRetry(endpoint, token, retries - 1);
        }
        throw error;
    }
};
const refreshAccessToken = async (refreshToken) => {
    const authString = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    try {
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
    }
    catch (err) {
        const error = err; // or use a custom error type
        console.error('Error refreshing access token:', error.response?.data || error.message);
    }
};
exports.refreshAccessToken = refreshAccessToken;
const fetchWithRefresh = async (token, refreshToken, url, params = {}) => {
    try {
        const res = await axios_1.default.get(url, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });
        return res.data;
    }
    catch (err) {
        if (err.response?.status === 401) {
            // Token expired, try refreshing
            const refreshed = await (0, exports.refreshAccessToken)(refreshToken); // implement this
            const res = await axios_1.default.get(url, {
                headers: { Authorization: `Bearer ${refreshed.access_token}` },
                params,
            });
            return res.data;
        }
        else {
            throw err;
        }
    }
};
exports.fetchWithRefresh = fetchWithRefresh;
const fetchSpotifyData = async (endpoint, req, res, customHandler) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log('Access token:', token);
    if (!token) {
        res.status(401).json({ error: 'Access token is missing' });
        return;
    }
    try {
        const data = await fetchWithRetry(endpoint, token);
        if (customHandler) {
            await customHandler(data, req, res);
        }
        else {
            console.log('response.data', data, 'endpoint is', endpoint);
            res.json(data);
        }
    }
    catch (error) {
        console.error(`Error fetching ${endpoint}:`, {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        res.status(500).json({ error: `Failed to fetch ${endpoint}` });
    }
};
exports.fetchSpotifyData = fetchSpotifyData;
const batchFetchArtists = async (artistIds, token) => {
    const batches = [];
    for (let i = 0; i < artistIds.length; i += 50) {
        const batch = artistIds.slice(i, i + 50);
        try {
            const response = await fetchWithRetry(`artists?ids=${batch.join(',')}`, token);
            batches.push(...response.artists);
        }
        catch (err) {
            console.error('Error fetching batch:', batch, err);
        }
    }
    return batches;
};
exports.batchFetchArtists = batchFetchArtists;
const getAccessToken = (req) => {
    return req.headers.authorization?.replace('Bearer ', '');
};
exports.getAccessToken = getAccessToken;
const createEmptyTimeRangeResult = (defaultValue) => {
    return {
        short_term: defaultValue,
        medium_term: defaultValue,
        long_term: defaultValue,
    };
};
exports.createEmptyTimeRangeResult = createEmptyTimeRangeResult;
exports.timeRanges = ['short_term', 'medium_term', 'long_term'];
const getTimeRangeData = (token, res) => {
    if (!token) {
        res.status(401).json({ error: 'Access token is missing' });
        return;
    }
};
exports.getTimeRangeData = getTimeRangeData;
