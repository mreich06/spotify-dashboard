"use strict";
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
const spotifyService = __importStar(require("../services/spotify"));
const axios_1 = __importDefault(require("axios"));
// Mock the whole spotify service
jest.mock('../services/spotify');
// test /login route
describe('GET /login', () => {
    it('should redirect to Spotify login with default returnTo (/dashboard)', async () => {
        // Mock getAuthUrl to return a fake Spotify login URL
        spotifyService.getAuthUrl.mockReturnValue('https://accounts.spotify.com/authorize?state=%2Fdashboard');
        const res = await (0, supertest_1.default)(app_1.default).get('/auth/login');
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe('https://accounts.spotify.com/authorize?state=%2Fdashboard');
    });
});
describe('/callback', () => {
    it('should return 400 if auth code is missing', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/auth/callback');
        expect(res.status).toBe(400);
        expect(res.text).toContain('Authorization code is missing in callback');
    });
    it('should redirect with token if valid code is given', async () => {
        spotifyService.getTokens.mockResolvedValue({
            access_token: 'test-access',
            refresh_token: 'test-refresh',
        });
        // pass test code as query param
        const res = await (0, supertest_1.default)(app_1.default).get('/auth/callback?code=mock-code&state=/dashboard');
        expect(res.status).toBe(302);
        // should contain mocked access token and refresh token
        expect(res.headers.location).toContain('/dashboard?access_token=test-access&refresh_token=test-refresh');
    });
    it('Should return a 500 error if getTokens throws an error', async () => {
        spotifyService.getTokens.mockRejectedValue(new Error('Spotify error'));
        const res = await (0, supertest_1.default)(app_1.default).get('/auth/callback?code=bad-code&state=/dashboard');
        expect(res.status).toBe(500);
        expect(res.text).toContain('Failed to get access token from Spotify');
    });
});
describe('/refresh', () => {
    it('should return 400 if refresh_token is missing', async () => {
        const res = await (0, supertest_1.default)(app_1.default).post('/auth/refresh').send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Missing refresh_token');
    });
    it('should return 500 if axios POST request returns an error', async () => {
        jest.spyOn(axios_1.default, 'post').mockRejectedValueOnce(new Error('Spotify API error'));
        const res = await (0, supertest_1.default)(app_1.default).post('/auth/refresh').send({ refresh_token: 'invalid_token' });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Failed to refresh token');
    });
    it('Should return a new access token if refresh_token is valid', async () => {
        jest.spyOn(axios_1.default, 'post').mockResolvedValueOnce({
            data: {
                access_token: 'test_access_new',
                token_type: 'Bearer',
                expires_in: 3600,
            },
        });
        const res = await (0, supertest_1.default)(app_1.default).post('/auth/refresh').send({ refresh_token: 'valid_token' });
        expect(res.status).toBe(200);
        expect(res.body.access_token).toBe('test_access_new');
        expect(res.body.token_type).toBe('Bearer');
        expect(res.body.expires_in).toBe(3600);
    });
    it('Should return 500 error if Spotify gives an error', async () => {
        jest.spyOn(axios_1.default, 'post').mockRejectedValueOnce(new Error('Spotify error'));
        const res = await (0, supertest_1.default)(app_1.default).post('/auth/refresh').send({ refresh_token: 'invalid_token' });
        expect(res.status).toBe(500);
        expect(res.body.error).toBe('Failed to refresh token');
    });
});
