"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserListeningData = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchUserListeningData = async (token) => {
    const timeRanges = ['short_term', 'medium_term', 'long_term'];
    const topTracksByRange = {
        short_term: { items: [] },
        medium_term: { items: [] },
        long_term: { items: [] },
    };
    const artistMap = {};
    for (const range of timeRanges) {
        const response = await axios_1.default.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: { Authorization: `Bearer ${token}` },
            params: { time_range: range, limit: 50 },
        });
        topTracksByRange[range] = response.data;
        const tracks = response.data.items;
        const artistIds = [...new Set(tracks.flatMap((track) => track.artists.map((a) => a.id)))];
        // Batch fetch artist details
        for (let i = 0; i < artistIds.length; i += 50) {
            const batch = artistIds.slice(i, i + 50);
            const artistResponse = await axios_1.default.get('https://api.spotify.com/v1/artists', {
                headers: { Authorization: `Bearer ${token}` },
                params: { ids: batch.join(',') },
            });
            artistResponse.data.artists.forEach((artist) => {
                artistMap[artist.id] = {
                    genres: artist.genres,
                    popularity: artist.popularity,
                };
            });
            await new Promise((res) => setTimeout(res, 300)); // avoid 429
        }
    }
    return { topTracksByRange, artistMap };
};
exports.fetchUserListeningData = fetchUserListeningData;
