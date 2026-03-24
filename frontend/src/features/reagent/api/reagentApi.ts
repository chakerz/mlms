import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface ReagentDto {
  id: string
  name: string
  manufacturer: string
  catalogNumber: string | null
  category: string
  storageTemp: string | null
  createdAt: string
  updatedAt: string
}

export interface ReagentLotDto {
  id: string
  reagentId: string
  lotNumber: string
  expiryDate: string
  initialQuantity: number
  currentQuantity: number
  isBlocked: boolean
  storageLocation: string | null
  isExpired: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateReagentRequest {
  name: string
  manufacturer: string
  catalogNumber?: string
  category: string
  storageTemp?: string
}

export interface ReceiveReagentLotRequest {
  reagentId: string
  lotNumber: string
  expiryDate: string
  initialQuantity: number
  storageLocation?: string
}

export interface ConsumeReagentRequest {
  lotId: string
  quantity: number
  testCode: string
}

interface PaginatedReagents {
  data: ReagentDto[]
  total: number
  page: number
  pageSize: number
}

interface GetReagentsParams {
  page?: number
  pageSize?: number
  category?: string
}

export const reagentApi = createApi({
  reducerPath: 'reagentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Reagent', 'ReagentLot'],
  endpoints: (builder) => ({
    getReagents: builder.query<PaginatedReagents, GetReagentsParams>({
      query: ({ page = 1, pageSize = 20, category } = {}) => ({
        url: '/reagents',
        params: { page, pageSize, ...(category ? { category } : {}) },
      }),
      providesTags: ['Reagent'],
    }),
    createReagent: builder.mutation<ReagentDto, CreateReagentRequest>({
      query: (body) => ({ url: '/reagents', method: 'POST', body }),
      invalidatesTags: ['Reagent'],
    }),
    getReagentLots: builder.query<ReagentLotDto[], string>({
      query: (reagentId) => `/reagents/${reagentId}/lots`,
      providesTags: (_result, _err, id) => [{ type: 'ReagentLot', id }],
    }),
    receiveLot: builder.mutation<ReagentLotDto, ReceiveReagentLotRequest>({
      query: (body) => ({ url: '/reagents/lots', method: 'POST', body }),
      invalidatesTags: ['ReagentLot', 'Reagent'],
    }),
    consumeReagent: builder.mutation<ReagentLotDto, ConsumeReagentRequest>({
      query: (body) => ({ url: '/reagents/consume', method: 'POST', body }),
      invalidatesTags: ['ReagentLot'],
    }),
  }),
})

export const {
  useGetReagentsQuery,
  useCreateReagentMutation,
  useGetReagentLotsQuery,
  useReceiveLotMutation,
  useConsumeReagentMutation,
} = reagentApi
