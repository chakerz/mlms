import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface ReportDto {
  id: string
  orderId: string
  status: string
  commentsFr: string | null
  commentsAr: string | null
  validatedBy: string | null
  validatedAt: string | null
  signedBy: string | null
  signedAt: string | null
  publishedAt: string | null
  templateVersion: string
  createdAt: string
  updatedAt: string
}

export interface PatientSummaryDto {
  id: string
  firstName: string
  lastName: string
  birthDate: string
  gender: string
  phone: string | null
  email: string | null
}

export interface OrderSummaryDto {
  id: string
  patientId: string
  status: string
  priority: string
  tests: { id: string; testCode: string; testNameFr: string; testNameAr: string }[]
}

export interface ResultSummaryDto {
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

export interface ReportDetailDto {
  report: ReportDto
  patient: PatientSummaryDto
  order: OrderSummaryDto
  results: ResultSummaryDto[]
}

export interface GenerateReportRequest {
  orderId: string
  templateVersion?: string
}

export interface ValidateReportRequest {
  commentsFr?: string | null
  commentsAr?: string | null
}

export interface SignReportRequest {
  commentsFr?: string | null
  commentsAr?: string | null
}

export interface PublishReportRequest {
  publishToPortal: boolean
}

interface PaginatedReports {
  data: ReportDto[]
  meta: { page: number; pageSize: number; total: number; totalPages: number }
}

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Report'],
  endpoints: (builder) => ({
    getReports: builder.query<PaginatedReports, { page?: number; status?: string; orderId?: string }>({
      query: ({ page = 1, status, orderId } = {}) => {
        const params = new URLSearchParams({ page: String(page) })
        if (status) params.set('status', status)
        if (orderId) params.set('orderId', orderId)
        return `/reports?${params.toString()}`
      },
      providesTags: ['Report'],
    }),
    getReport: builder.query<ReportDetailDto, string>({
      query: (id) => `/reports/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Report', id }],
    }),
    generateReport: builder.mutation<ReportDto, GenerateReportRequest>({
      query: (body) => ({ url: '/reports/generate', method: 'POST', body }),
      invalidatesTags: ['Report'],
    }),
    validateReport: builder.mutation<ReportDto, { id: string } & ValidateReportRequest>({
      query: ({ id, ...body }) => ({ url: `/reports/${id}/validate`, method: 'POST', body }),
      invalidatesTags: (_r, _e, req) => [{ type: 'Report', id: req.id }, 'Report'],
    }),
    signReport: builder.mutation<ReportDto, { id: string } & SignReportRequest>({
      query: ({ id, ...body }) => ({ url: `/reports/${id}/sign`, method: 'POST', body }),
      invalidatesTags: (_r, _e, req) => [{ type: 'Report', id: req.id }, 'Report'],
    }),
    publishReport: builder.mutation<ReportDto, { id: string } & PublishReportRequest>({
      query: ({ id, ...body }) => ({ url: `/reports/${id}/publish`, method: 'POST', body }),
      invalidatesTags: (_r, _e, req) => [{ type: 'Report', id: req.id }, 'Report'],
    }),
  }),
})

export const {
  useGetReportsQuery,
  useGetReportQuery,
  useGenerateReportMutation,
  useValidateReportMutation,
  useSignReportMutation,
  usePublishReportMutation,
} = reportApi
