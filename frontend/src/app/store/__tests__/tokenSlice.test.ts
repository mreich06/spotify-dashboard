import tokenReducer, { setToken, clearToken } from '../tokenSlice';

describe('tokenSlice', () => {
  const initialState = {
    accessToken: null,
  };

  it('returns the initial state', () => {
    const state = tokenReducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  it('handles setToken', () => {
    const action = setToken('abc123');
    const state = tokenReducer(initialState, action);
    expect(state.accessToken).toBe('abc123');
  });

  it('handles clearToken', () => {
    const loggedInState = { accessToken: 'abc123' };
    const state = tokenReducer(loggedInState, clearToken());
    expect(state.accessToken).toBeNull();
  });
});
