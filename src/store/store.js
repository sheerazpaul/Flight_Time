import { configureStore } from '@reduxjs/toolkit'
import { flightApi } from './flightApi'
import bookingReducer from './bookingSlice'

export const store = configureStore({
  reducer: {
    [flightApi.reducerPath]: flightApi.reducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(flightApi.middleware),
})
