import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface InvoiceLineDto {
  id: string
  invoiceId: string
  testOrderId?: string | null
  itemDescription: string
  quantity: number
  unitPrice: number
  totalPrice: number
  taxRate: number
  taxAmount: number
  discountPercentage: number
  discountAmount: number
  subTotal: number
  lineTotal: number
  billingCode?: string | null
  createdAt: string
  updatedAt: string
}

export interface InvoiceDto {
  id: string
  invoiceNumber: string
  orderId?: string | null
  patientId?: string | null
  practitionerId?: string | null
  customerName: string
  customerAddress?: string | null
  customerEmail?: string | null
  customerPhone?: string | null
  invoiceDate: string
  dueDate: string
  paymentTerms?: string | null
  status: string
  subtotal: number
  totalDiscount: number
  totalTax: number
  total: number
  amountPaid: number
  balanceDue: number
  billingCodes?: string | null
  comments?: string | null
  totalInWordsFr?: string | null
  totalInWordsEn?: string | null
  lines: InvoiceLineDto[]
  createdAt: string
  updatedAt: string
}

export interface CreateInvoiceLineDto {
  testOrderId?: string
  itemDescription: string
  quantity?: number
  unitPrice?: number
  taxRate?: number
  discountPercentage?: number
  billingCode?: string
}

export interface CreateInvoiceDto {
  orderId?: string
  patientId?: string
  practitionerId?: string
  customerName: string
  customerAddress?: string
  customerEmail?: string
  customerPhone?: string
  invoiceDate?: string
  dueDate?: string
  paymentTerms?: string
  billingCodes?: string
  comments?: string
  lines: CreateInvoiceLineDto[]
}

export interface UpdateInvoiceStatusDto {
  status: string
}

interface PaginatedInvoices {
  data: InvoiceDto[]
  total: number
  page: number
  pageSize: number
}

interface GetInvoicesParams {
  page?: number
  pageSize?: number
  status?: string
  patientId?: string
  dateFrom?: string
  dateTo?: string
}

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Invoice'],
  endpoints: (builder) => ({
    getInvoices: builder.query<PaginatedInvoices, GetInvoicesParams>({
      query: ({ page = 1, pageSize = 20, status, patientId, dateFrom, dateTo } = {}) => ({
        url: '/invoices',
        params: {
          page,
          pageSize,
          ...(status ? { status } : {}),
          ...(patientId ? { patientId } : {}),
          ...(dateFrom ? { dateFrom } : {}),
          ...(dateTo ? { dateTo } : {}),
        },
      }),
      providesTags: ['Invoice'],
    }),
    getInvoice: builder.query<InvoiceDto, string>({
      query: (id) => `/invoices/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Invoice', id }],
    }),
    createInvoice: builder.mutation<InvoiceDto, CreateInvoiceDto>({
      query: (body) => ({ url: '/invoices', method: 'POST', body }),
      invalidatesTags: ['Invoice'],
    }),
    updateInvoiceStatus: builder.mutation<InvoiceDto, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/invoices/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Invoice', id }, 'Invoice'],
    }),
  }),
})

export const {
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceStatusMutation,
} = invoiceApi
