import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface TestDefinitionDto {
  id: string
  code: string
  nameFr: string
  nameAr: string
  category: string
  unit: string | null
  referenceLow: number | null
  referenceHigh: number | null
  isActive: boolean
  tubeType: string | null
  minVolumeMl: number | null
  fastingRequired: boolean
  lightSensitive: boolean
  maxDelayMinutes: number | null
  storageTemp: string | null
  specialNotesFr: string | null
  specialNotesAr: string | null
  subcontracted: boolean
  // Catalogue bilingue
  synonymes: string | null
  sampleTypeFr: string | null
  sampleTypeAr: string | null
  tubeFr: string | null
  tubeAr: string | null
  method: string | null
  collectionConditionFr: string | null
  collectionConditionAr: string | null
  preAnalyticDelay: string | null
  preAnalyticDelayAr: string | null
  turnaroundTime: string | null
  turnaroundTimeAr: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTestDefinitionRequest {
  code: string
  nameFr: string
  nameAr: string
  category: string
  unit?: string
  referenceLow?: number
  referenceHigh?: number
  tubeType?: string
  minVolumeMl?: number
  fastingRequired?: boolean
  lightSensitive?: boolean
  maxDelayMinutes?: number
  storageTemp?: string
  specialNotesFr?: string
  specialNotesAr?: string
  subcontracted?: boolean
  synonymes?: string
  sampleTypeFr?: string
  sampleTypeAr?: string
  tubeFr?: string
  tubeAr?: string
  method?: string
  collectionConditionFr?: string
  collectionConditionAr?: string
  preAnalyticDelay?: string
  preAnalyticDelayAr?: string
  turnaroundTime?: string
  turnaroundTimeAr?: string
}

export interface UpdateTestDefinitionRequest {
  nameFr?: string
  nameAr?: string
  category?: string
  unit?: string | null
  referenceLow?: number | null
  referenceHigh?: number | null
  isActive?: boolean
  tubeType?: string | null
  minVolumeMl?: number | null
  fastingRequired?: boolean
  lightSensitive?: boolean
  maxDelayMinutes?: number | null
  storageTemp?: string | null
  specialNotesFr?: string | null
  specialNotesAr?: string | null
  subcontracted?: boolean
  synonymes?: string | null
  sampleTypeFr?: string | null
  sampleTypeAr?: string | null
  tubeFr?: string | null
  tubeAr?: string | null
  method?: string | null
  collectionConditionFr?: string | null
  collectionConditionAr?: string | null
  preAnalyticDelay?: string | null
  preAnalyticDelayAr?: string | null
  turnaroundTime?: string | null
  turnaroundTimeAr?: string | null
}

interface PaginatedTestDefinitions {
  data: TestDefinitionDto[]
  total: number
  page: number
  pageSize: number
}

interface GetTestDefinitionsParams {
  page?: number
  pageSize?: number
  category?: string
  search?: string
  activeOnly?: boolean
}

export const testDefinitionApi = createApi({
  reducerPath: 'testDefinitionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['TestDefinition'],
  endpoints: (builder) => ({
    getTestDefinitions: builder.query<PaginatedTestDefinitions, GetTestDefinitionsParams>({
      query: ({ page = 1, pageSize = 50, category, search, activeOnly } = {}) => ({
        url: '/test-definitions',
        params: {
          page,
          pageSize,
          ...(category ? { category } : {}),
          ...(search ? { search } : {}),
          ...(activeOnly ? { activeOnly: 'true' } : {}),
        },
      }),
      providesTags: ['TestDefinition'],
    }),
    getTestDefinitionById: builder.query<TestDefinitionDto, string>({
      query: (id) => `/test-definitions/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'TestDefinition', id }],
    }),
    createTestDefinition: builder.mutation<TestDefinitionDto, CreateTestDefinitionRequest>({
      query: (body) => ({ url: '/test-definitions', method: 'POST', body }),
      invalidatesTags: ['TestDefinition'],
    }),
    updateTestDefinition: builder.mutation<TestDefinitionDto, { id: string } & UpdateTestDefinitionRequest>({
      query: ({ id, ...body }) => ({ url: `/test-definitions/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['TestDefinition'],
    }),
  }),
})

export const {
  useGetTestDefinitionsQuery,
  useGetTestDefinitionByIdQuery,
  useCreateTestDefinitionMutation,
  useUpdateTestDefinitionMutation,
} = testDefinitionApi
