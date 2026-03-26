import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface PractitionerDto {
  id: string
  fullName: string
  email: string
  phoneNumber?: string | null
  address?: string | null
  speciality?: string | null
  qualification?: string | null
  licenseNumber?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePractitionerDto {
  fullName: string
  email: string
  phoneNumber?: string
  address?: string
  speciality?: string
  qualification?: string
  licenseNumber?: string
  isActive?: boolean
}

export interface UpdatePractitionerDto {
  fullName?: string
  email?: string
  phoneNumber?: string | null
  address?: string | null
  speciality?: string | null
  qualification?: string | null
  licenseNumber?: string | null
  isActive?: boolean
}

interface PaginatedPractitioners {
  data: PractitionerDto[]
  total: number
  page: number
  pageSize: number
}

interface GetPractitionersParams {
  page?: number
  pageSize?: number
  search?: string
  speciality?: string
  isActive?: string
}

export const practitionerApi = createApi({
  reducerPath: 'practitionerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Practitioner'],
  endpoints: (builder) => ({
    getPractitioners: builder.query<PaginatedPractitioners, GetPractitionersParams>({
      query: ({ page = 1, pageSize = 20, search, speciality, isActive } = {}) => ({
        url: '/practitioners',
        params: {
          page,
          pageSize,
          ...(search ? { search } : {}),
          ...(speciality ? { speciality } : {}),
          ...(isActive !== undefined ? { isActive } : {}),
        },
      }),
      providesTags: ['Practitioner'],
    }),
    getPractitioner: builder.query<PractitionerDto, string>({
      query: (id) => `/practitioners/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Practitioner', id }],
    }),
    createPractitioner: builder.mutation<PractitionerDto, CreatePractitionerDto>({
      query: (body) => ({ url: '/practitioners', method: 'POST', body }),
      invalidatesTags: ['Practitioner'],
    }),
    updatePractitioner: builder.mutation<PractitionerDto, { id: string } & UpdatePractitionerDto>({
      query: ({ id, ...body }) => ({ url: `/practitioners/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Practitioner', id }, 'Practitioner'],
    }),
  }),
})

export const {
  useGetPractitionersQuery,
  useGetPractitionerQuery,
  useCreatePractitionerMutation,
  useUpdatePractitionerMutation,
} = practitionerApi
