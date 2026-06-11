

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import AuthReducer from './feature/authSlice';
import loadingSlice from './feature/loadingSlice';

// Redux Persist Configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: AuthReducer,
  loading: loadingSlice
});

// Apply Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid serialization issues
    }),
});

// Persist Store
const persistor = persistStore(store);

// Debugging: Check Persisted State
persistor.subscribe(() => {
  AsyncStorage.getItem('persist:root').then((data) => {
  });
});

export { store, persistor };
