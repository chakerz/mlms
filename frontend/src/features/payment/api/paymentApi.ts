import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface PaymentDto {
  id: string
  referenceNumber: string
  invoiceId?: string | null
  patientId?: string | null
  patientName?: string | null
  paymentDate: string
  totalAmount: number
  amountPaid: number
  status: string
  paymentMethod: string
  notes?: string | null
  totalAmountInWordsFr?: string | null
  totalAmountInWordsEn?: string | null
  amountPaidInWordsFr?: string | null
  amountPaidInWordsEn?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentDto {
  invoiceId?: string
  patientId?: string
  patientName?: string
  totalAmount: number
  amountPaid: number
  paymentMethod: string
  paymentDate?: string
  notes?: string
  totalAmountInWordsFr?: string
  totalAmountInWordsEn?: string
  amountPaidInWordsFr?: string
  amountPaidInWordsEn?: string
}

interface PaginatedPayments {
  data: PaymentDto[]
  total: number
  page: number
  pageSize: number
}

interface GetPaymentsParams {
  page?: number
  pageSize?: number
  status?: string
  patientId?: string
  invoiceId?: string
}

export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Payment'],
  endpoints: (builder) => ({
    getPayments: builder.query<PaginatedPayments, GetPaymentsParams>({
      query: ({ page = 1, pageSize = 20, status, patientId, invoiceId } = {}) => ({
        url: '/payments',
        params: {
          page,
          pageSize,
          ...(status ? { status } : {}),
          ...(patientId ? { patientId } : {}),
          ...(invoiceId ? { invoiceId } : {}),
        },
      }),
      providesTags: ['Payment'],
    }),
    getPayment: builder.query<PaymentDto, string>({
      query: (id) => `/payments/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Payment', id }],
    }),
    createPayment: builder.mutation<PaymentDto, CreatePaymentDto>({
      query: (body) => ({ url: '/payments', method: 'POST', body }),
      invalidatesTags: ['Payment'],
    }),
    updatePaymentStatus: builder.mutation<PaymentDto, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/payments/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Payment', id }, 'Payment'],
    }),
  }),
})

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
  useUpdatePaymentStatusMutation,
} = paymentApi
