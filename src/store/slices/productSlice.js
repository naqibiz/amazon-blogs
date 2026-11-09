import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/services/firebase/products.service";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getProducts();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  selectedProduct: null,
  searchTerm: "",
  selectedCategory: "",
  isLoading: false,
  error: null,
  lastFetched: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearProductFilters: (state) => {
      state.searchTerm = "";
      state.selectedCategory = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedProduct,
  setSearchTerm,
  setSelectedCategory,
  clearProductFilters,
} = productSlice.actions;

export default productSlice.reducer;

