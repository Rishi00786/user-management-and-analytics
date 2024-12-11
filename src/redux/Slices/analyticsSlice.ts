import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  createdAt: string;
  location: string;
  status: boolean;
}

interface AnalyticsState {
  filteredUsers: User[];
}

const initialState: AnalyticsState = {
  filteredUsers: [],
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setFilteredUsers: (state, action: PayloadAction<User[]>) => {
      state.filteredUsers = action.payload;
    },
  },
});

export const { setFilteredUsers } = analyticsSlice.actions;

export default analyticsSlice.reducer;
