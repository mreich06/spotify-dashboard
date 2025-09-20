"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokens = void 0;
exports.getAuthUrl = getAuthUrl;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getSpotifyCredentials = () => {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
    return { client_id, client_secret, redirect_uri };
};
/**
 * Builds the Spotify OAuth authorization URL.
 *
 * URL used to redirect the user to Spotify's login screen, where
 * they authorize the app to access user's listening data
 *
 * @returns A full Spotify login URL with query parameters with:
 * - client_id
 * - scope
 * - response_type
 * - redirect_uri
 */
function getAuthUrl(returnTo) {
    const { client_id, redirect_uri } = getSpotifyCredentials();
    // data we are requesting from Spotify user profile
    const scope = [
        'user-top-read',
        'user-read-recently-played',
        'user-library-read',
        'user-read-playback-position',
        'user-read-playback-state',
        'user-read-email',
        'playlist-read-private',
    ].join(' ');
    const query = querystring_1.default.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state: returnTo,
    });
    return `https://accounts.spotify.com/authorize?${query}`;
}
/**
 * Exchanges Spotify authorization code for access + refresh tokens
 *
 * Called after the user logs in through Spotify OAuth flow, they're
 * redirected back to the server with the code in the query string
 *
 * 1. Create POST request to send to Spotify's token endpoint
 * 2. Sends the authorization code along with client credentials
 * 3. Retrieves access token, refresh token and expiry time
 *
 * @param code - The authorization code received from Spotify when login
 * @returns object with access token, refresh token, expiry time
 */
const getTokens = async (code) => {
    const { client_id, redirect_uri, client_secret } = getSpotifyCredentials();
    const data = {
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id,
        client_secret,
    };
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
    };
    const response = await axios_1.default.post('https://accounts.spotify.com/api/token', querystring_1.default.stringify(data), { headers });
    return response.data;
};
exports.getTokens = getTokens;
