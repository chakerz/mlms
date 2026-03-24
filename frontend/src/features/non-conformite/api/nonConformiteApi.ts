import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface NonConformiteDto {
  id: string
  specimenId: string | null
  orderId: string | null
  reason: string
  details: string | null
  action: string
  recordedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateNonConformiteRequest {
  specimenId?: string
  orderId?: string
  reason: string
  details?: string
  action: string
}

interface PaginatedNonConformites {
  data: NonConformiteDto[]
  total: number
  page: number
  pageSize: number
}

export const NON_CONFORMITE_REASONS = [
  'ABSENCE_ORDONNANCE',
  'PRESCRIPTION_ILLISIBLE',
  'IDENTITE_ABSENTE',
  'DISCORDANCE_IDENTITE',
  'TUBE_INADEQUAT',
  'TUBE_MANQUANT',
  'VOLUME_INSUFFISANT',
  'ECHANTILLON_COAGULE',
  'ECHANTILLON_HEMOLYSE',
  'PRESENCE_CAILLOTS',
  'DELAI_DEPASSE',
  'TEMPERATURE_NON_RESPECTEE',
  'HEURE_PRELEVEMENT_MANQUANTE',
  'CONSENTEMENT_MANQUANT',
  'ECHANTILLON_ABSENT',
  'AUTRE',
] as const

export const CONFORMITE_ACTIONS = [
  'ACCEPTE',
  'ACCEPTE_SOUS_RESERVE',
  'REFUSE',
] as const

export const nonConformiteApi = createApi({
  reducerPath: 'nonConformiteApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['NonConformite'],
  endpoints: (builder) => ({
    listNonConformites: builder.query<PaginatedNonConformites, { page?: number; pageSize?: number }>({
      query: ({ page = 1, pageSize = 20 } = {}) => ({
        url: '/non-conformites',
        params: { page, pageSize },
      }),
      providesTags: ['NonConformite'],
    }),
    getNonConformite: builder.query<NonConformiteDto, string>({
      query: (id) => `/non-conformites/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'NonConformite', id }],
    }),
    getNonConformitesBySpecimen: builder.query<NonConformiteDto[], string>({
      query: (specimenId) => `/non-conformites/by-specimen/${specimenId}`,
      providesTags: (_result, _err, specimenId) => [{ type: 'NonConformite', id: `specimen-${specimenId}` }],
    }),
    createNonConformite: builder.mutation<NonConformiteDto, CreateNonConformiteRequest>({
      query: (body) => ({ url: '/non-conformites', method: 'POST', body }),
      invalidatesTags: ['NonConformite'],
    }),
  }),
})

export const {
  useListNonConformitesQuery,
  useGetNonConformiteQuery,
  useGetNonConformitesBySpecimenQuery,
  useCreateNonConformiteMutation,
} = nonConformiteApi
