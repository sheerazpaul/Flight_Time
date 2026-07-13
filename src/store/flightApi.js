import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_KEY = '6a5492d127b06d9fd8ec12c7'
const BASE_URL = 'https://api.flightapi.io'

export const flightApi = createApi({
  reducerPath: 'flightApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    searchOneWay: builder.query({
      query: ({ from, to, date, adults = 1, children = 0, infants = 0, cabin = 'Economy', currency = 'USD' }) =>
        `/onewaytrip/${API_KEY}/${from}/${to}/${date}/${adults}/${children}/${infants}/${cabin}/${currency}`,
    }),
    searchRoundTrip: builder.query({
      query: ({ from, to, depDate, retDate, adults = 1, children = 0, infants = 0, cabin = 'Economy', currency = 'USD' }) =>
        `/roundtrip/${API_KEY}/${from}/${to}/${depDate}/${retDate}/${adults}/${children}/${infants}/${cabin}/${currency}`,
    }),
  }),
})

export const {
  useSearchOneWayQuery,
  useSearchRoundTripQuery,
} = flightApi
