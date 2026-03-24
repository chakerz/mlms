import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface ResultDto {
  id: string
  specimenId: string
  testCode: string
  testNameFr: string
  testNameAr: string
  value: string
  unit: string | null
  referenceLow: number | null
  referenceHigh: number | null
  flag: string
  measuredAt: string
  measuredBy: string | null
  createdAt: string
  updatedAt: string
}

export interface RecordResultRequest {
  specimenId: string
  testCode: string
  testNameFr: string
  testNameAr: string
  value: string
  unit?: string
  referenceLow?: number
  referenceHigh?: number
  flag: string
  measuredAt: string
}

export interface UpdateResultRequest {
  value?: string
  unit?: string | null
  referenceLow?: number | null
  referenceHigh?: number | null
  flag?: string
  measuredAt?: string
}

export const resultApi = createApi({
  reducerPath: 'resultApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Result'],
  endpoints: (builder) => ({
    getResultsBySpecimen: builder.query<ResultDto[], string>({
      query: (specimenId) => `/specimens/${specimenId}/results`,
      providesTags: (_r, _e, id) => [{ type: 'Result', id: `specimen-${id}` }],
    }),
    getResultsByOrder: builder.query<ResultDto[], string>({
      query: (orderId) => `/orders/${orderId}/results`,
      providesTags: (_r, _e, id) => [{ type: 'Result', id: `order-${id}` }],
    }),
    recordResult: builder.mutation<ResultDto, RecordResultRequest>({
      query: (body) => ({ url: '/results', method: 'POST', body }),
      invalidatesTags: (_r, _e, req) => [
        { type: 'Result', id: `specimen-${req.specimenId}` },
        'Result',
      ],
    }),
    updateResult: builder.mutation<ResultDto, { id: string } & UpdateResultRequest>({
      query: ({ id, ...body }) => ({ url: `/results/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, req) => [{ type: 'Result', id: req.id }, 'Result'],
    }),
  }),
})

export const {
  useGetResultsBySpecimenQuery,
  useGetResultsByOrderQuery,
  useRecordResultMutation,
  useUpdateResultMutation,
} = resultApi
