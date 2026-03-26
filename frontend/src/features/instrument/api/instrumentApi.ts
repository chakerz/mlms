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

export interface InstrumentDto {
  id: string
  code: string
  name: string
  manufacturer: string | null
  model: string | null
  protocolType: string
  transportType: string
  directionMode: string
  isActive: boolean
  location: string | null
  createdAt: string
  updatedAt: string
}

export interface InstrumentConnectionDto {
  id: string
  instrumentId: string
  host: string | null
  port: number | null
  serialPort: string | null
  baudRate: number | null
  parity: string | null
  dataBits: number | null
  stopBits: number | null
  fileImportPath: string | null
  fileExportPath: string | null
  ackEnabled: boolean
  encoding: string | null
  timeoutMs: number | null
  retryLimit: number
  createdAt: string
  updatedAt: string
}

export interface InstrumentTestMappingDto {
  id: string
  instrumentId: string
  internalTestCode: string
  instrumentTestCode: string
  sampleType: string | null
  specimenCode: string | null
  unit: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface InstrumentOutboxDto {
  id: string
  instrumentId: string
  specimenId: string | null
  orderId: string | null
  messageType: string
  payloadJson: unknown
  rawPayload: string | null
  status: string
  retryCount: number
  sentAt: string | null
  ackReceivedAt: string | null
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

export interface InstrumentInboxDto {
  id: string
  instrumentId: string
  messageType: string
  rawPayload: string
  parsedPayloadJson: unknown | null
  sampleId: string | null
  barcode: string | null
  matchingStatus: string
  importStatus: string
  receivedAt: string
  processedAt: string | null
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

export interface InstrumentRawResultDto {
  id: string
  instrumentId: string
  specimenId: string | null
  orderId: string | null
  internalTestCode: string | null
  instrumentTestCode: string
  resultValue: string | null
  resultText: string | null
  unit: string | null
  flagCode: string | null
  deviceStatus: string | null
  resultStatus: string
  measuredAt: string | null
  importedAt: string | null
  rawMessageId: string | null
  createdAt: string
  updatedAt: string
}

export interface InstrumentSimulatorConfigDto {
  id?: string
  instrumentId: string
  rackCount: number
  slotsPerRack: number
  statSlots: number
  throughputPerHour: number
  processingTimeMinMs: number
  processingTimeMaxMs: number
  abnormalRate: number
  errorRate: number
  calibrationIntervalMs: number
}

export interface InstrumentCatalogItemDto {
  id: string
  code: string
  name: string
  manufacturer: string
  model: string
  category: string | null
  protocolType: string
  transportType: string
  directionMode: string
  defaultPort: number | null
  defaultBaudRate: number | null
  notes: string | null
}

interface Paginated<T> { data: T[]; total: number; page: number; pageSize: number }

export const instrumentApi = createApi({
  reducerPath: 'instrumentApi',
  baseQuery,
  tagTypes: ['Instrument', 'InstrumentCatalog', 'InstrumentConnection', 'InstrumentTestMapping', 'InstrumentOutbox', 'InstrumentInbox', 'InstrumentRawResult', 'InstrumentSimulatorConfig'],
  endpoints: (builder) => ({
    getInstrumentCatalog: builder.query<InstrumentCatalogItemDto[], { search?: string }>({
      query: (p = {}) => ({ url: '/instruments/catalog', params: p }),
      providesTags: ['InstrumentCatalog'],
    }),
    createInstrumentCatalogEntry: builder.mutation<InstrumentCatalogItemDto, Partial<InstrumentCatalogItemDto>>({
      query: (body) => ({ url: '/instruments/catalog', method: 'POST', body }),
      invalidatesTags: ['InstrumentCatalog'],
    }),
    updateInstrumentCatalogEntry: builder.mutation<InstrumentCatalogItemDto, { id: string } & Partial<InstrumentCatalogItemDto>>({
      query: ({ id, ...body }) => ({ url: `/instruments/catalog/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['InstrumentCatalog'],
    }),
    getInstruments: builder.query<Paginated<InstrumentDto>, { page?: number; pageSize?: number; search?: string; isActive?: boolean }>({
      query: (p = {}) => ({ url: '/instruments', params: p }),
      providesTags: ['Instrument'],
    }),
    getInstrument: builder.query<InstrumentDto, string>({
      query: (id) => `/instruments/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Instrument', id }],
    }),
    createInstrument: builder.mutation<InstrumentDto, Partial<InstrumentDto>>({
      query: (body) => ({ url: '/instruments', method: 'POST', body }),
      invalidatesTags: ['Instrument'],
    }),
    updateInstrument: builder.mutation<InstrumentDto, { id: string } & Partial<InstrumentDto>>({
      query: ({ id, ...body }) => ({ url: `/instruments/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_r, _e, { id }) => ['Instrument', { type: 'Instrument', id }],
    }),
    deleteInstrument: builder.mutation<void, string>({
      query: (id) => ({ url: `/instruments/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Instrument'],
    }),
    getInstrumentConnection: builder.query<InstrumentConnectionDto, string>({
      query: (id) => `/instruments/${id}/connection`,
      providesTags: (_r, _e, id) => [{ type: 'InstrumentConnection', id }],
    }),
    setInstrumentConnection: builder.mutation<InstrumentConnectionDto, { instrumentId: string } & Partial<InstrumentConnectionDto>>({
      query: ({ instrumentId, ...body }) => ({ url: `/instruments/${instrumentId}/connection`, method: 'POST', body }),
      invalidatesTags: (_r, _e, { instrumentId }) => [{ type: 'InstrumentConnection', id: instrumentId }],
    }),
    getTestMappings: builder.query<InstrumentTestMappingDto[], string>({
      query: (id) => `/instruments/${id}/mappings`,
      providesTags: ['InstrumentTestMapping'],
    }),
    createTestMapping: builder.mutation<InstrumentTestMappingDto, { instrumentId: string } & Partial<InstrumentTestMappingDto>>({
      query: ({ instrumentId, ...body }) => ({ url: `/instruments/${instrumentId}/mappings`, method: 'POST', body }),
      invalidatesTags: ['InstrumentTestMapping'],
    }),
    updateTestMapping: builder.mutation<InstrumentTestMappingDto, { instrumentId: string; id: string } & Partial<InstrumentTestMappingDto>>({
      query: ({ instrumentId, id, ...body }) => ({ url: `/instruments/${instrumentId}/mappings/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['InstrumentTestMapping'],
    }),
    deleteTestMapping: builder.mutation<void, { instrumentId: string; id: string }>({
      query: ({ instrumentId, id }) => ({ url: `/instruments/${instrumentId}/mappings/${id}`, method: 'DELETE' }),
      invalidatesTags: ['InstrumentTestMapping'],
    }),
    getOutboxMessages: builder.query<Paginated<InstrumentOutboxDto>, { page?: number; pageSize?: number; instrumentId?: string; status?: string }>({
      query: (p = {}) => ({ url: '/instruments/outbox/list', params: p }),
      providesTags: ['InstrumentOutbox'],
    }),
    getOutboxMessage: builder.query<InstrumentOutboxDto, string>({
      query: (id) => `/instruments/outbox/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'InstrumentOutbox', id }],
    }),
    retryOutboxMessage: builder.mutation<InstrumentOutboxDto, string>({
      query: (id) => ({ url: `/instruments/outbox/${id}/retry`, method: 'POST' }),
      invalidatesTags: ['InstrumentOutbox'],
    }),
    cancelOutboxMessage: builder.mutation<InstrumentOutboxDto, string>({
      query: (id) => ({ url: `/instruments/outbox/${id}/cancel`, method: 'POST' }),
      invalidatesTags: ['InstrumentOutbox'],
    }),
    getInboxMessages: builder.query<Paginated<InstrumentInboxDto>, { page?: number; pageSize?: number; instrumentId?: string; importStatus?: string; matchingStatus?: string }>({
      query: (p = {}) => ({ url: '/instruments/inbox/list', params: p }),
      providesTags: ['InstrumentInbox'],
    }),
    getInboxMessage: builder.query<InstrumentInboxDto, string>({
      query: (id) => `/instruments/inbox/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'InstrumentInbox', id }],
    }),
    reprocessInboxMessage: builder.mutation<InstrumentInboxDto, string>({
      query: (id) => ({ url: `/instruments/inbox/${id}/reprocess`, method: 'POST' }),
      invalidatesTags: ['InstrumentInbox'],
    }),
    getRawResults: builder.query<Paginated<InstrumentRawResultDto>, { page?: number; pageSize?: number; instrumentId?: string; specimenId?: string; resultStatus?: string }>({
      query: (p = {}) => ({ url: '/instruments/raw-results/list', params: p }),
      providesTags: ['InstrumentRawResult'],
    }),
    getRawResult: builder.query<InstrumentRawResultDto, string>({
      query: (id) => `/instruments/raw-results/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'InstrumentRawResult', id }],
    }),
    getSimulatorConfig: builder.query<InstrumentSimulatorConfigDto, string>({
      query: (id) => `/instruments/${id}/simulator-config`,
      providesTags: (_r, _e, id) => [{ type: 'InstrumentSimulatorConfig', id }],
    }),
    upsertSimulatorConfig: builder.mutation<InstrumentSimulatorConfigDto, { instrumentId: string } & Partial<InstrumentSimulatorConfigDto>>({
      query: ({ instrumentId, ...body }) => ({ url: `/instruments/${instrumentId}/simulator-config`, method: 'POST', body }),
      invalidatesTags: (_r, _e, { instrumentId }) => [{ type: 'InstrumentSimulatorConfig', id: instrumentId }],
    }),
    sendOrderToInstrument: builder.mutation<
      { sent: boolean; resultCount: number; rawResponse: string; outboxId: string; inboxId?: string; error?: string },
      { instrumentId: string; orderId: string }
    >({
      query: ({ instrumentId, orderId }) => ({
        url: `/instruments/${instrumentId}/send-order`,
        method: 'POST',
        body: { orderId },
      }),
      invalidatesTags: ['InstrumentOutbox', 'InstrumentInbox', 'InstrumentRawResult'],
    }),
  }),
})

export const {
  useDeleteInstrumentMutation,
  useGetInstrumentCatalogQuery,
  useCreateInstrumentCatalogEntryMutation,
  useUpdateInstrumentCatalogEntryMutation,
  useGetInstrumentsQuery,
  useGetInstrumentQuery,
  useCreateInstrumentMutation,
  useUpdateInstrumentMutation,
  useGetInstrumentConnectionQuery,
  useSetInstrumentConnectionMutation,
  useGetTestMappingsQuery,
  useCreateTestMappingMutation,
  useUpdateTestMappingMutation,
  useDeleteTestMappingMutation,
  useGetOutboxMessagesQuery,
  useGetOutboxMessageQuery,
  useRetryOutboxMessageMutation,
  useCancelOutboxMessageMutation,
  useGetInboxMessagesQuery,
  useGetInboxMessageQuery,
  useReprocessInboxMessageMutation,
  useGetRawResultsQuery,
  useGetRawResultQuery,
  useGetSimulatorConfigQuery,
  useUpsertSimulatorConfigMutation,
  useSendOrderToInstrumentMutation,
} = instrumentApi
