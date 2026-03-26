import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface SampleDto {
  id: string
  sampleCode: string
  name: string
  sampleType: string
  sampleDescription: string | null
  collectionMethod: string | null
  containerType: string | null
  storageConditions: string | null
  handlingInstructions: string | null
  sampleStatus: string
  qcPassed: boolean
  qcNotes: string | null
  createdAt: string
  updatedAt: string
}

export interface SampleInventoryLineDto {
  id: string
  barcode: string
  inventoryCode: string
  sampleId: string | null
  receptionDate: string
  receivedBy: string | null
  currentLocation: string | null
  currentStatus: string
  quantity: number
  unit: string | null
  qcPassed: boolean
  qcNotes: string | null
  expirationDate: string | null
  createdAt: string
  updatedAt: string
}

interface Paginated<T> { data: T[]; total: number; page: number; pageSize: number }

export const sampleApi = createApi({
  reducerPath: 'sampleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Sample', 'SampleInventoryLine'],
  endpoints: (builder) => ({
    getSamples: builder.query<Paginated<SampleDto>, { page?: number; pageSize?: number; search?: string; sampleType?: string }>({
      query: (p = {}) => ({ url: '/samples', params: p }),
      providesTags: ['Sample'],
    }),
    getSample: builder.query<SampleDto, string>({
      query: (id) => `/samples/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Sample', id }],
    }),
    createSample: builder.mutation<SampleDto, Partial<SampleDto>>({
      query: (body) => ({ url: '/samples', method: 'POST', body }),
      invalidatesTags: ['Sample'],
    }),
    getInventoryLines: builder.query<Paginated<SampleInventoryLineDto>, { page?: number; pageSize?: number; sampleId?: string; currentStatus?: string; search?: string }>({
      query: (p = {}) => ({ url: '/samples/inventory/lines', params: p }),
      providesTags: ['SampleInventoryLine'],
    }),
    updateInventoryLine: builder.mutation<SampleInventoryLineDto, { id: string } & Partial<SampleInventoryLineDto>>({
      query: ({ id, ...body }) => ({ url: `/samples/inventory/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['SampleInventoryLine'],
    }),
  }),
})

export const {
  useGetSamplesQuery,
  useGetSampleQuery,
  useCreateSampleMutation,
  useGetInventoryLinesQuery,
  useUpdateInventoryLineMutation,
} = sampleApi
