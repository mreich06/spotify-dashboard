"use strict";
// Tests for checking that server routes call fetchSpotifyData correctly
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const spotifyUtils = __importStar(require("../utils/spotifyRequest"));
jest.mock('../utils/spotifyRequest');
const mockFetchSpotifyData = spotifyUtils.fetchSpotifyData;
beforeEach(() => {
    mockFetchSpotifyData.mockImplementation((_endpoint, _req, res) => {
        res.status(200).json({ message: 'mocked' }); // simulate sending response
    });
});
// Test that we are calling fetchSpotifyData with /me/top-artists with time range added when we have GET request to /top-artists
describe('GET /top-artists', () => {
    it('calls fetchSpotifyData with correct time_range', async () => {
        await (0, supertest_1.default)(app_1.default).get('/top-artists?time_range=short_term');
        expect(mockFetchSpotifyData).toHaveBeenCalledWith('me/top/artists?time_range=short_term', expect.anything(), expect.anything());
    });
    // default time range should be medium
    it('calls fetchSpotifyData with medium_term time_range', async () => {
        await (0, supertest_1.default)(app_1.default).get('/top-artists');
        expect(mockFetchSpotifyData).toHaveBeenCalledWith('me/top/artists?time_range=medium_term', expect.anything(), expect.anything());
    });
});
// Test that we are calling fetchSpotifyData with /me/top/tracks when we have GET request to /top-tracks
describe('GET /top-tracks', () => {
    it('calls fetchSpotifyData with correct endpoint', async () => {
        await (0, supertest_1.default)(app_1.default).get('/top-tracks');
        expect(mockFetchSpotifyData).toHaveBeenCalledWith('me/top/tracks', expect.anything(), expect.anything());
    });
});
// Test that we are calling fetchSpotifyData with /me/top/playlists when we have GET request to /playlists
describe('GET /playlists', () => {
    it('calls fetchSpotifyData with correct endpoint', async () => {
        await (0, supertest_1.default)(app_1.default).get('/playlists');
        expect(mockFetchSpotifyData).toHaveBeenCalledWith('me/playlists', expect.anything(), expect.anything());
    });
});
