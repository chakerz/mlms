import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface PatientDto {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  gender: string
  phone?: string
  email?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface CreatePatientDto {
  firstName: string
  lastName: string
  birthDate: string
  gender: string
  phone?: string
  email?: string
  address?: string
}

export interface UpdatePatientDto {
  firstName?: string
  lastName?: string
  birthDate?: string
  gender?: string
  phone?: string | null
  email?: string | null
  address?: string | null
}

interface PaginatedPatients {
  data: PatientDto[]
  meta: { total: number; page: number; pageSize: number }
}

interface GetPatientsParams {
  page?: number
  pageSize?: number
  query?: string
}

export const patientApi = createApi({
  reducerPath: 'patientApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Patient'],
  endpoints: (builder) => ({
    getPatients: builder.query<PaginatedPatients, GetPatientsParams>({
      query: ({ page = 1, pageSize = 20, query } = {}) => ({
        url: '/patients',
        params: { page, pageSize, ...(query ? { query } : {}) },
      }),
      providesTags: ['Patient'],
    }),
    getPatient: builder.query<PatientDto, string>({
      query: (id) => `/patients/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Patient', id }],
    }),
    createPatient: builder.mutation<PatientDto, CreatePatientDto>({
      query: (body) => ({ url: '/patients', method: 'POST', body }),
      invalidatesTags: ['Patient'],
    }),
    updatePatient: builder.mutation<PatientDto, { id: string } & UpdatePatientDto>({
      query: ({ id, ...body }) => ({ url: `/patients/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Patient', id }, 'Patient'],
    }),
    deletePatient: builder.mutation<void, string>({
      query: (id) => ({ url: `/patients/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Patient'],
    }),
  }),
})

export const {
  useGetPatientsQuery,
  useGetPatientQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApi
