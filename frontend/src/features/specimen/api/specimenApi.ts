import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface SpecimenDto {
  id: string
  orderId: string
  barcode: string
  type: string
  containerType: string | null
  status: string
  collectionTime: string
  preleveur: string | null
  receivedAt: string | null
  receivedBy: string | null
  sentAt: string | null
  transportConditions: string | null
  conservedUntil: string | null
  conservationSite: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateSpecimenRequest {
  orderId: string
  barcode?: string
  type: string
  containerType?: string
  collectionTime: string
  preleveur?: string
  sentAt?: string
  transportConditions?: string
  conservedUntil?: string
  conservationSite?: string
  notes?: string
}

interface PaginatedSpecimens {
  data: SpecimenDto[]
  total: number
  page: number
  pageSize: number
}

export const specimenApi = createApi({
  reducerPath: 'specimenApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Specimen'],
  endpoints: (builder) => ({
    listAllSpecimens: builder.query<PaginatedSpecimens, { page?: number; pageSize?: number }>({
      query: ({ page = 1, pageSize = 20 } = {}) => ({
        url: '/specimens',
        params: { page, pageSize },
      }),
      providesTags: ['Specimen'],
    }),
    getSpecimen: builder.query<SpecimenDto, string>({
      query: (id) => `/specimens/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Specimen', id }],
    }),
    getSpecimensByOrder: builder.query<SpecimenDto[], string>({
      query: (orderId) => `/orders/${orderId}/specimens`,
      providesTags: (_result, _err, orderId) => [{ type: 'Specimen', id: `order-${orderId}` }],
    }),
    createSpecimen: builder.mutation<SpecimenDto, CreateSpecimenRequest>({
      query: (body) => ({ url: '/specimens', method: 'POST', body }),
      invalidatesTags: (_result, _err, req) => [
        'Specimen',
        { type: 'Specimen', id: `order-${req.orderId}` },
      ],
    }),
    updateSpecimenStatus: builder.mutation<
      SpecimenDto,
      { id: string; status: string; receivedAt?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/specimens/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Specimen', id }, 'Specimen'],
    }),
  }),
})

export const {
  useListAllSpecimensQuery,
  useGetSpecimenQuery,
  useGetSpecimensByOrderQuery,
  useCreateSpecimenMutation,
  useUpdateSpecimenStatusMutation,
} = specimenApi
