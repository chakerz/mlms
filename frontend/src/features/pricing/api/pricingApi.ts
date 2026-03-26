import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface PricingTierDto {
  id: string
  name: string
  description: string | null
  isActive: boolean
  defaultRate: number
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface CreatePricingTierDto {
  name: string
  description?: string
  isActive?: boolean
  defaultRate?: number
  notes?: string
}

interface Paginated<T> { data: T[]; total: number; page: number; pageSize: number }

export const pricingApi = createApi({
  reducerPath: 'pricingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['PricingTier'],
  endpoints: (builder) => ({
    getPricingTiers: builder.query<Paginated<PricingTierDto>, { page?: number; pageSize?: number; isActive?: string }>({
      query: (p = {}) => ({ url: '/pricing-tiers', params: p }),
      providesTags: ['PricingTier'],
    }),
    getPricingTier: builder.query<PricingTierDto, string>({
      query: (id) => `/pricing-tiers/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'PricingTier', id }],
    }),
    createPricingTier: builder.mutation<PricingTierDto, CreatePricingTierDto>({
      query: (body) => ({ url: '/pricing-tiers', method: 'POST', body }),
      invalidatesTags: ['PricingTier'],
    }),
    updatePricingTier: builder.mutation<PricingTierDto, { id: string } & Partial<CreatePricingTierDto>>({
      query: ({ id, ...body }) => ({ url: `/pricing-tiers/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'PricingTier', id }, 'PricingTier'],
    }),
  }),
})

export const {
  useGetPricingTiersQuery,
  useGetPricingTierQuery,
  useCreatePricingTierMutation,
  useUpdatePricingTierMutation,
} = pricingApi
