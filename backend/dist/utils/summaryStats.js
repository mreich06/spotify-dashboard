"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSummaryStats = void 0;
const axios_1 = __importDefault(require("axios"));
const spotifyRequest_1 = require("../utils/spotifyRequest");
const fetchSummaryStats = async (req, res) => {
    const token = (0, spotifyRequest_1.getAccessToken)(req);
    if (!token) {
        res.status(401).json({ error: 'Access token is missing' });
        return;
    }
    const result = (0, spotifyRequest_1.createEmptyTimeRangeResult)({
        totalTracks: 0,
        totalMinutes: '0.0',
        avgMinutesPerDay: 0,
        avgPlaysPerDay: 0,
        genres: [],
    });
    try {
        for (const range of spotifyRequest_1.timeRanges) {
            const response = await axios_1.default.get('https://api.spotify.com/v1/me/top/tracks', {
                headers: { Authorization: `Bearer ${token}` },
                params: { time_range: range, limit: 50 },
            });
            const items = response.data.items;
            if (!items || !Array.isArray(items))
                continue;
            const totalTracks = items.length;
            const totalMinutes = items.reduce((sum, track) => sum + track.duration_ms / 60000, 0);
            const days = range === 'short_term' ? 28 : range === 'medium_term' ? 180 : 730;
            const avgMinutesPerDay = +(totalMinutes / days).toFixed(1);
            const avgPlaysPerDay = +(totalTracks / days).toFixed(1);
            const artistIds = Array.from(new Set(items.flatMap((track) => track.artists.map((artist) => artist.id)))).slice(0, 50);
            const genreMap = {};
            if (artistIds.length > 0) {
                const artistResponse = await axios_1.default.get('https://api.spotify.com/v1/artists', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { ids: artistIds.join(',') },
                });
                artistResponse.data.artists.forEach((artist) => {
                    artist.genres.forEach((genre) => {
                        genreMap[genre] = (genreMap[genre] || 0) + 1;
                    });
                });
            }
            const genres = Object.entries(genreMap)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);
            result[range] = {
                totalTracks,
                totalMinutes: totalMinutes.toFixed(1),
                avgMinutesPerDay,
                avgPlaysPerDay,
                genres,
            };
        }
        res.json(result);
    }
    catch (err) {
        console.error('Error fetching summary stats:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
        });
        res.status(500).json({ error: 'Failed to fetch summary stats' });
    }
};
exports.fetchSummaryStats = fetchSummaryStats;
