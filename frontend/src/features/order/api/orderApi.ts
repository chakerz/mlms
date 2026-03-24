import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface TestOrderDto {
  id: string
  testCode: string
  testNameFr: string
  testNameAr: string
  priority: string
  notes: string | null
}

export interface OrderDto {
  id: string
  patientId: string
  status: string
  priority: string
  prescriptorName: string | null
  prescriptorType: string | null
  createdBy: string | null
  tests: TestOrderDto[]
  createdAt: string
  updatedAt: string
}

export interface CreateTestOrderItem {
  testCode: string
  testNameFr: string
  testNameAr: string
  priority?: string
  notes?: string
}

export interface CreateOrderRequest {
  patientId: string
  priority: string
  prescriptorName?: string
  prescriptorType?: string
  tests: CreateTestOrderItem[]
}

interface PaginatedOrders {
  data: OrderDto[]
  total: number
  page: number
  pageSize: number
}

interface GetOrdersParams {
  page?: number
  pageSize?: number
  patientId?: string
  status?: string
}

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.query<PaginatedOrders, GetOrdersParams>({
      query: ({ page = 1, pageSize = 20, patientId, status } = {}) => ({
        url: '/orders',
        params: {
          page,
          pageSize,
          ...(patientId ? { patientId } : {}),
          ...(status ? { status } : {}),
        },
      }),
      providesTags: ['Order'],
    }),
    getOrder: builder.query<OrderDto, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation<OrderDto, CreateOrderRequest>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation<OrderDto, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Order', id }, 'Order'],
    }),
    cancelOrder: builder.mutation<OrderDto, string>({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: (_result, _err, id) => [{ type: 'Order', id }, 'Order'],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = orderApi
