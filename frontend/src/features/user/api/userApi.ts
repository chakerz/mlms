import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type StateWithAuth = { auth: { token: string | null } }

export interface UserDto {
  id: string
  email: string
  role: string
  language: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface PaginatedUsers {
  data: UserDto[]
  total: number
  page: number
  pageSize: number
}

interface GetUsersParams {
  page?: number
  pageSize?: number
}

export interface CreateUserDto {
  email: string
  password: string
  role: string
  language: string
}

export interface UpdateUserDto {
  role?: string
  language?: string
  isActive?: boolean
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedUsers, GetUsersParams>({
      query: ({ page = 1, pageSize = 20 } = {}) => ({
        url: '/users',
        params: { page, pageSize },
      }),
      providesTags: ['User'],
    }),

    getUserById: builder.query<UserDto, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<UserDto, CreateUserDto>({
      query: (dto) => ({
        url: '/auth/register',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation<UserDto, { id: string } & UpdateUserDto>({
      query: ({ id, ...dto }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'User', id }, 'User'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = userApi
