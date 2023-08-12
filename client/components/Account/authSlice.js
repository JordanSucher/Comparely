import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Constant Variables
const TOKEN = 'token';

//Thunks
export const me = createAsyncThunk('auth/me', async () => {
  const token = window.localStorage.getItem(TOKEN);
  try{
    if (token) {
      const res = await axios.get('/auth/me', {
        headers: {
          authorization: token,
        },
      });
      return res.data;
    } else {
      return {};
    }
  } catch(err) {
    if (err.response.data) {
      return thunkAPI.rejectWithValue(err.response.data);
    } else {
      return 'There was an issue with your request.';
    }
  }
});

export const authenticate = createAsyncThunk('auth/authenticate', async(body, thunkAPI) => {
  try{
    const res = await axios.post(`/auth/${body.method}`, body);
    window.localStorage.setItem(TOKEN, res.data.token);
    thunkAPI.dispatch(me());
  } catch(err) {
    if (err.response.data) {
      return thunkAPI.rejectWithValue(err.response.data);
    } else {
      return 'There was an issue with your request.';
    }
  }
});

//SLICE
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    me: {},
    error: null,
  },
  reducers: {
    logout(state, action) {
      window.localStorage.removeItem(TOKEN);
      state.me = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(me.fulfilled, (state, action) => {
      state.me = action.payload;
    });
    builder.addCase(me.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(authenticate.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

//Actions
export const { logout } = authSlice.actions;

//Reducer
export default authSlice.reducer;
