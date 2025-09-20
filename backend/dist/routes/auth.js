"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const spotify_1 = require("../services/spotify");
dotenv_1.default.config();
const router = express_1.default.Router();
// redirect to Spotify OAuth upon login and redirect to dashboard after login
router.get('/login', (req, res) => {
    const returnTo = req.query.returnTo || '/dashboard';
    const url = (0, spotify_1.getAuthUrl)(returnTo);
    res.redirect(url);
});
// get access token using auth code
router.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        res.status(400).send('Authorization code is missing in callback');
        return;
    }
    try {
        const tokens = await (0, spotify_1.getTokens)(code);
        // Redirect back to frontend with access token in query (temporary solution)
        // return them to page they originally came from with returnTo query param
        const returnTo = req.query.state || '/dashboard';
        // redirect with both access and refresh tokens
        res.redirect(`${process.env.FRONTEND_URL}${returnTo}?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`);
    }
    catch (error) {
        console.log('Error getting access token:', error);
        res.status(500).send('Failed to get access token from Spotify');
    }
});
// get refresh token
router.post('/refresh', async (req, res) => {
    const refresh_token = req.body.refresh_token;
    if (!refresh_token) {
        res.status(400).json({ error: 'Missing refresh_token' });
    }
    try {
        const response = await axios_1.default.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token,
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
            },
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching refresh token', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
});
exports.default = router;
