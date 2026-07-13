import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedFlight: null,
  searchParams: null,
  passengerDetails: null,
  bookingReference: null,
  selectedClass: 'Economy',
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedFlight: (state, action) => {
      state.selectedFlight = action.payload
    },
    setSearchParams: (state, action) => {
      state.searchParams = action.payload
    },
    setPassengerDetails: (state, action) => {
      state.passengerDetails = action.payload
    },
    setBookingReference: (state, action) => {
      state.bookingReference = action.payload
    },
    setSelectedClass: (state, action) => {
      state.selectedClass = action.payload
    },
    clearBooking: (state) => {
      state.selectedFlight = null
      state.passengerDetails = null
      state.bookingReference = null
      state.selectedClass = 'Economy'
    },
  },
})

export const {
  setSelectedFlight,
  setSearchParams,
  setPassengerDetails,
  setBookingReference,
  setSelectedClass,
  clearBooking,
} = bookingSlice.actions

export default bookingSlice.reducer
