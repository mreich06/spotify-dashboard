"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const spotifyRequest_1 = require("../utils/spotifyRequest");
const summaryStats_1 = require("../utils/summaryStats");
const router = express_1.default.Router();
router.get('/top-artists', async (req, res) => {
    const timeRange = req.query.time_range || 'medium_term';
    await (0, spotifyRequest_1.fetchSpotifyData)(`me/top/artists?time_range=${timeRange}`, req, res);
});
router.get('/top-tracks', async (req, res) => {
    (0, spotifyRequest_1.fetchSpotifyData)('me/top/tracks', req, res);
});
// TODO: move this to Playlists tab
router.get('/playlists', async (req, res) => {
    const token = (0, spotifyRequest_1.getAccessToken)(req);
    const refreshToken = (0, spotifyRequest_1.getRefreshToken)(req);
    (0, spotifyRequest_1.getTimeRangeData)(token, res);
    if (!token)
        return;
    const result = (0, spotifyRequest_1.createEmptyTimeRangeResult)({
        href: '',
        limit: 0,
        total: 0,
        items: [],
    });
    try {
        for (const range of spotifyRequest_1.timeRanges) {
            const data = await (0, spotifyRequest_1.fetchSpotify)('https://api.spotify.com/v1/me/playlists', token, refreshToken ?? '', { limit: 10 }, 2, res);
            // Just reuse the same response for all ranges (since Spotify playlists API doesn’t support time_range)
            result[range] = data;
        }
        res.json(result);
    }
    catch (err) {
        console.error('Error fetching top playlists:', err);
        res.status(err.status === 401 ? 401 : 500).json({ error: 'Failed to fetch playlists' });
    }
});
router.get('/summary-stats', summaryStats_1.fetchSummaryStats);
router.get('/most-streamed-track', async (req, res) => {
    const token = (0, spotifyRequest_1.getAccessToken)(req);
    const refreshToken = (0, spotifyRequest_1.getRefreshToken)(req);
    (0, spotifyRequest_1.getTimeRangeData)(token, res);
    if (!token)
        return;
    const result = (0, spotifyRequest_1.createEmptyTimeRangeResult)({
        items: [],
    });
    try {
        for (const range of spotifyRequest_1.timeRanges) {
            const data = await (0, spotifyRequest_1.fetchSpotify)('https://api.spotify.com/v1/me/top/tracks', token, refreshToken ?? '', { time_range: range, limit: 10 }, 2, res);
            const tracks = data.items;
            const artistIds = [...new Set(tracks.flatMap((track) => track.artists.map((a) => a.id)))];
            // Batch artist IDs to avoid hitting the 50 limit
            const batches = [];
            for (let i = 0; i < artistIds.length; i += 50) {
                batches.push(artistIds.slice(i, i + 50));
            }
            const artistMap = {};
            for (const batch of batches) {
                try {
                    const artistData = await (0, spotifyRequest_1.fetchSpotify)('https://api.spotify.com/v1/artists', token, refreshToken ?? '', { ids: batch.join(',') }, 2, res);
                    artistData.artists.forEach((artist) => {
                        artistMap[artist.id] = {
                            genres: artist.genres,
                            popularity: artist.popularity,
                        };
                    });
                }
                catch (error) {
                    console.error('Failed to fetch artist batch:', {
                        ids: batch,
                        message: error.message,
                        status: error.response?.status,
                        data: error.response?.data,
                    });
                }
            }
            const enrichedTracks = tracks.map((track) => {
                const artistId = track.artists[0]?.id;
                const artistData = artistMap[artistId] || { genres: [], popularity: 0 };
                return {
                    ...track,
                    genres: artistData.genres,
                    popularity: artistData.popularity,
                };
            });
            result[range] = {
                ...data,
                items: enrichedTracks,
            };
        }
        res.json(result);
    }
    catch (err) {
        console.error('Error fetching most streamed tracks:', err);
        res.status(err.status === 401 ? 401 : 500).json({ error: 'Failed to fetch most streamed tracks' });
    }
});
// genre counts reflect how often artists appear
// Each artists is fetched only once to reduce API calls, later weighted
// batch in order to reduce num of API calls
router.get('/top-genres-over-time', async (req, res) => {
    const token = (0, spotifyRequest_1.getAccessToken)(req);
    const refreshToken = (0, spotifyRequest_1.getRefreshToken)(req);
    (0, spotifyRequest_1.getTimeRangeData)(token, res);
    if (!token)
        return;
    const results = (0, spotifyRequest_1.createEmptyTimeRangeResult)({});
    try {
        for (const range of spotifyRequest_1.timeRanges) {
            // Get top 50 tracks for this time range
            const data = await (0, spotifyRequest_1.fetchSpotify)('https://api.spotify.com/v1/me/top/tracks', token, refreshToken ?? '', { time_range: range, limit: 50 }, 2, res);
            const tracks = data.items;
            // Count artist frequencies
            const artistFrequency = {};
            for (const track of tracks) {
                for (const artist of track.artists) {
                    artistFrequency[artist.id] = (artistFrequency[artist.id] || 0) + 1;
                }
            }
            // Batch unique artist IDs (Spotify allows max 50 per request)
            const artistIds = Object.keys(artistFrequency);
            const batches = [];
            for (let i = 0; i < artistIds.length; i += 50) {
                batches.push(artistIds.slice(i, i + 50));
            }
            // Fetch artists in batches and weight genres by frequency
            const genreCounts = {};
            for (const batch of batches) {
                const artistData = await (0, spotifyRequest_1.fetchSpotify)('https://api.spotify.com/v1/artists', token, refreshToken ?? '', { ids: batch.join(',') }, 2, res);
                for (const artist of artistData.artists) {
                    const multiplier = artistFrequency[artist.id]; // times this artist appeared
                    for (const genre of artist.genres || []) {
                        genreCounts[genre] = (genreCounts[genre] || 0) + multiplier;
                    }
                }
            }
            //  Save results for this time range
            results[range] = genreCounts;
        }
        res.json(results);
    }
    catch (error) {
        console.error('Error fetching genre trends (batched weighted):', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        res.status(error.status === 401 ? 401 : 500).json({ error: 'Failed to fetch genre trends' });
    }
});
exports.default = router;
