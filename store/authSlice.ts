import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunk to check authentication
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        return data.user;
      }
      return rejectWithValue(data.error || 'Login failed');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to signup
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        return data.user;
      }
      return rejectWithValue(data.error || 'Signup failed');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Check Auth
    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    });
    builder.addCase(checkAuth.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.user = null;
      state.isAuthenticated = false;
    });

    // Signup
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.user = null;
      state.isAuthenticated = false;
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

