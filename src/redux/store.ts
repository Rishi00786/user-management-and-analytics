import { configureStore } from '@reduxjs/toolkit';
import userSlice from './Slices/userSlice';
import analyticsSlice from './Slices/analyticsSlice';

const store = configureStore({
  reducer: {
    users: userSlice,
    analytics: analyticsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
