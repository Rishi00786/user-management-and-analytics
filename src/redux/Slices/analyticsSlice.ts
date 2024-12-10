import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalyticsData {
  registrationsTrend: { month: string; count: number }[];
  activeInactiveRatio: { active: number; inactive: number };
  usersByRegion: { region: string; count: number }[];
}

interface AnalyticsState {
  metrics: AnalyticsData;
  dateRange: { start: string; end: string };
  regionFilter: string | null;
}

const initialState: AnalyticsState = {
  metrics: {
    registrationsTrend: [],
    activeInactiveRatio: { active: 0, inactive: 0 },
    usersByRegion: [],
  },
  dateRange: { start: '', end: '' },
  regionFilter: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setMetrics(state, action: PayloadAction<AnalyticsData>) {
      state.metrics = action.payload;
    },
    setDateRange(state, action: PayloadAction<{ start: string; end: string }>) {
      state.dateRange = action.payload;
    },
    setRegionFilter(state, action: PayloadAction<string | null>) {
      state.regionFilter = action.payload;
    },
  },
});

export const { setMetrics, setDateRange, setRegionFilter } = analyticsSlice.actions;
export default analyticsSlice.reducer;
