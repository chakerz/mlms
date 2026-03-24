import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface PortalPatientDto {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  gender: string
  phone: string | null
  email: string | null
  address: string | null
}

export interface PortalReportDto {
  id: string
  orderId: string
  status: string
  commentsFr: string | null
  commentsAr: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PortalResultDto {
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
}

export interface PortalOrderDto {
  id: string
  patientId: string
  status: string
  priority: string
  tests: { id: string; testCode: string; testNameFr: string; testNameAr: string }[]
}

export interface PortalReportDetailDto {
  report: PortalReportDto
  patient: PortalPatientDto
  order: PortalOrderDto
  results: PortalResultDto[]
}

interface PaginatedReports {
  data: PortalReportDto[]
  meta: { page: number; pageSize: number; total: number; totalPages: number }
}

export const portalApi = createApi({
  reducerPath: 'portalApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['PortalReport'],
  endpoints: (builder) => ({
    getPortalMe: builder.query<PortalPatientDto, void>({
      query: () => '/portal/me',
    }),
    getPortalReports: builder.query<PaginatedReports, { page?: number }>({
      query: ({ page = 1 } = {}) => `/portal/reports?page=${page}`,
      providesTags: ['PortalReport'],
    }),
    getPortalReport: builder.query<PortalReportDetailDto, string>({
      query: (id) => `/portal/reports/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'PortalReport', id }],
    }),
  }),
})

export const { useGetPortalMeQuery, useGetPortalReportsQuery, useGetPortalReportQuery } = portalApi
