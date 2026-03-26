import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as StateWithAuth).auth.token
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

export interface QCMaterialDto {
  id: string
  barcode: string
  name: string
  lotNumber: string
  manufacturer: string
  expirationDate: string
  expectedValue: number
  standardDeviation: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface QCScheduleDto {
  id: string
  barcode: string
  qcRuleName: string
  scheduledDate: string
  duration: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface QCResultDto {
  id: string
  qcScheduleId: string | null
  testId: string | null
  testName: string
  controlMaterialId: string | null
  resultValue: string | null
  performedDate: string
  performedBy: string | null
  status: string
  acceptableLimitLow: number
  acceptableLimitHigh: number
  warningLimitLow: number
  warningLimitHigh: number
  qualitativeObservation: string | null
  alert: 'GRAY' | 'GREEN' | 'YELLOW' | 'RED'
  comments: string | null
  createdAt: string
  updatedAt: string
}

interface Paginated<T> { data: T[]; total: number; page: number; pageSize: number }

export const qcApi = createApi({
  reducerPath: 'qcApi',
  baseQuery,
  tagTypes: ['QCMaterial', 'QCSchedule', 'QCResult'],
  endpoints: (builder) => ({
    // Materials
    getQCMaterials: builder.query<Paginated<QCMaterialDto>, { page?: number; pageSize?: number; search?: string; isActive?: string }>({
      query: (p = {}) => ({ url: '/qc/materials', params: p }),
      providesTags: ['QCMaterial'],
    }),
    getQCMaterial: builder.query<QCMaterialDto, string>({
      query: (id) => `/qc/materials/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'QCMaterial', id }],
    }),
    createQCMaterial: builder.mutation<QCMaterialDto, Partial<QCMaterialDto>>({
      query: (body) => ({ url: '/qc/materials', method: 'POST', body }),
      invalidatesTags: ['QCMaterial'],
    }),
    updateQCMaterial: builder.mutation<QCMaterialDto, { id: string } & Partial<QCMaterialDto>>({
      query: ({ id, ...body }) => ({ url: `/qc/materials/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'QCMaterial', id }, 'QCMaterial'],
    }),
    // Schedules
    getQCSchedules: builder.query<Paginated<QCScheduleDto>, { page?: number; pageSize?: number; status?: string }>({
      query: (p = {}) => ({ url: '/qc/schedules', params: p }),
      providesTags: ['QCSchedule'],
    }),
    // Results
    getQCResults: builder.query<Paginated<QCResultDto>, { page?: number; pageSize?: number; status?: string; alert?: string; qcScheduleId?: string }>({
      query: (p = {}) => ({ url: '/qc/results', params: p }),
      providesTags: ['QCResult'],
    }),
    updateQCResult: builder.mutation<QCResultDto, { id: string } & Partial<QCResultDto>>({
      query: ({ id, ...body }) => ({ url: `/qc/results/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['QCResult'],
    }),
  }),
})

export const {
  useGetQCMaterialsQuery,
  useGetQCMaterialQuery,
  useCreateQCMaterialMutation,
  useUpdateQCMaterialMutation,
  useGetQCSchedulesQuery,
  useGetQCResultsQuery,
  useUpdateQCResultMutation,
} = qcApi
