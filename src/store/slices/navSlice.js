import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNavigationItems } from "@/services/firebase/navigations.service";

export const fetchNavigations = createAsyncThunk(
  "nav/fetchNavigations",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getNavigationItems();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  mostPopular: [],
  isCategoryDrawerOpen: false,
  isLoading: false,
  error: null,
  lastFetched: null,
};

const navSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    toggleCategoryDrawer: (state) => {
      state.isCategoryDrawerOpen = !state.isCategoryDrawerOpen;
    },
    setCategoryDrawerOpen: (state, action) => {
      state.isCategoryDrawerOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNavigations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNavigations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.mostPopular = action.payload.filter(
          (val) => val?.type === "Most Popular"
        );
        state.lastFetched = Date.now();
      })
      .addCase(fetchNavigations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleCategoryDrawer, setCategoryDrawerOpen } = navSlice.actions;
export default navSlice.reducer;

