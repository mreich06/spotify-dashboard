import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import tokenReducer from '@/app/store/tokenSlice';
import topTracksReducer from '@/app/store/topTracksSlice';
import artistsReducer from '@/app/store/artistsSlice';
import playlistsReducer from '@/app/store/playlistsSlice';
import summaryStatsReducer from '@/app/store/summarySlice';
import timeRangeReducer, { TimeRange } from '@/app/store/timeRangeSlice';
import MostStreamedTrackReducer from '@/app/store/mostStreamedTrackSlice';
import TopArtistsReducer from '@/app/store/topArtistsSlice';
import GenreTrendsReducer from '@/app/store/genreTrendsSlice';

import type { SpotifyTrack, SpotifyArtist, SpotifyPlaylist } from '@/app/types/spotify';

export const renderWithStore = (ui: React.ReactNode) => {
  const store = configureStore({
    reducer: {
      token: tokenReducer,
      topTracks: topTracksReducer,
      artists: artistsReducer,
      topPlaylists: playlistsReducer,
      summaryStats: summaryStatsReducer,
      timeRange: timeRangeReducer,
      mostStreamedTrack: MostStreamedTrackReducer,
      topArtists: TopArtistsReducer,
      genreTrends: GenreTrendsReducer,
    },
    preloadedState: {
      token: { accessToken: 'mockToken' },

      topTracks: {
        topTracks: [
          {
            id: '1',
            name: 'Mock Track',
            album: {
              id: 'album_1',
              name: 'Mock Album',
              album_type: 'album',
              total_tracks: 1,
              available_markets: [],
              images: [],
              href: '',
              uri: 'spotify:album:mock',
              type: 'album',
              release_date: '',
              release_date_precision: 'day',
              artists: [],
              external_urls: { spotify: '' },
            },
            artists: [
              {
                id: 'artist_1',
                name: 'Mock Artist',
                images: [],
                genres: ['pop'],
                popularity: 75,
                followers: { total: 1000 },
                href: '',
                uri: 'spotify:artist:mockuri',
                type: 'artist',
                external_urls: { spotify: '' },
              } as SpotifyArtist,
            ],
            duration_ms: 200000,
            popularity: 50,
            uri: 'spotify:track:mockuri',
            href: '',
            type: 'track',
            external_urls: { spotify: '' },
            genres: [],
            images: [],
          } as SpotifyTrack,
        ],
        loading: false,
        error: null,
      },

      artists: {
        artists: {
          short_term: [],
          medium_term: [
            {
              id: '1',
              name: 'Mock Artist',
              images: [],
              genres: ['pop'],
              popularity: 75,
              followers: { total: 500 },
              uri: 'spotify:artist:mockuri',
              href: '',
              type: 'artist',
              external_urls: { spotify: '' },
            } as SpotifyArtist,
          ],
          long_term: [],
        },
        loading: false,
        error: null,
      },

      topPlaylists: {
        playlists: {
          short_term: {
            href: 'https://api.spotify.com/v1/me/playlists',
            limit: 1,
            total: 1,
            items: [
              {
                id: 'playlist_1',
                href: 'https://api.spotify.com/v1/playlists/playlist_1',
                name: 'Mock Playlist',
                images: [],
                tracks: {
                  href: 'https://api.spotify.com/v1/playlists/playlist_1/tracks',
                  total: 10,
                },
                uri: 'spotify:playlist:mockuri',
                type: 'playlist',
                external_urls: { spotify: '' },
              },
            ],
          },
          medium_term: { href: '', limit: 0, total: 0, items: [] },
          long_term: { href: '', limit: 0, total: 0, items: [] },
        },
        loading: false,
        error: null,
      },
      summaryStats: {
        stats: {
          short_term: {
            totalTracks: 15,
            totalMinutes: '45.2',
            avgMinutesPerDay: 1.6,
            avgPlaysPerDay: 0.5,
            genres: [
              { name: 'pop', count: 5 },
              { name: 'rock', count: 3 },
              { name: 'jazz', count: 2 },
              { name: 'classical', count: 1 },
              { name: 'hip hop', count: 1 },
            ],
          },
          medium_term: {
            totalTracks: 40,
            totalMinutes: '120.7',
            avgMinutesPerDay: 2.1,
            avgPlaysPerDay: 0.7,
            genres: [
              { name: 'pop', count: 10 },
              { name: 'rock', count: 8 },
              { name: 'electronic', count: 6 },
              { name: 'jazz', count: 4 },
              { name: 'indie', count: 3 },
            ],
          },
          long_term: {
            totalTracks: 120,
            totalMinutes: '360.3',
            avgMinutesPerDay: 2.7,
            avgPlaysPerDay: 0.9,
            genres: [
              { name: 'pop', count: 25 },
              { name: 'rock', count: 20 },
              { name: 'indie', count: 15 },
              { name: 'electronic', count: 12 },
              { name: 'jazz', count: 8 },
            ],
          },
        },
        loading: false,
        error: null,
      },
      timeRange: { selectedRange: 'short_term' as TimeRange },
      mostStreamedTrack: {
        track: {
          short_term: { items: [] },
          medium_term: { items: [] },
          long_term: {
            items: [
              {
                id: 'track_1',
                name: 'Mock Track',
                album: {
                  id: 'album_1',
                  name: 'Mock Album',
                  album_type: 'album',
                  images: [{ url: 'https://placekitten.com/200/200', height: 200, width: 200 }],
                  total_tracks: 1,
                  available_markets: [],
                  href: '',
                  uri: '',
                  type: 'album',
                  release_date: '2020-01-01',
                  release_date_precision: 'day',
                  artists: [],
                  external_urls: { spotify: '' },
                },
                artists: [{ id: 'artist_1', name: 'Mock Artist', external_urls: { spotify: '' }, type: 'artist' }],
                duration_ms: 200000,
                popularity: 80,
                genres: ['pop'],
                uri: '',
                href: '',
                type: 'track',
                external_urls: { spotify: '' },
                images: [],
              },
            ],
          },
        },
        loading: false,
        error: null,
      },
      topArtists: {
        artists: [
          {
            id: 'artist_1',
            name: 'Mock Artist',
            genres: ['pop'],
            images: [],
            popularity: 80,
            followers: { total: 1000 },
            external_urls: { spotify: '' },
          },
        ],
        loading: false,
        error: null,
      },
      genreTrends: {
        data: {
          short_term: { pop: 10, rock: 5 },
          medium_term: { pop: 20 },
          long_term: { rock: 10 },
        },
        loading: false,
        error: null,
      },
    },
  });

  return render(<Provider store={store}>{ui}</Provider>);
};
