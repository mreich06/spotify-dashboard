import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, Reducer } from '@reduxjs/toolkit';

export function renderWithState<S>(Component: React.ReactElement, sliceKey: string, sliceReducer: Reducer<S>, mockState: S) {
  const store = configureStore({
    reducer: {
      [sliceKey]: sliceReducer,
    },
    preloadedState: {
      [sliceKey]: mockState,
    },
  });

  return render(<Provider store={store}>{Component}</Provider>);
}
