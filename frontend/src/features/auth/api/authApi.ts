import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthUser } from '@/shared/types/app.types'

type StateWithAuth = { auth: { token: string | null } }

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
  user: AuthUser
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithAuth).auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    getMe: builder.query<AuthUser, void>({
      query: () => '/auth/me',
    }),
    changeLanguage: builder.mutation<AuthUser, { language: string }>({
      query: (body) => ({ url: '/auth/me/language', method: 'PATCH', body }),
    }),
  }),
})

export const { useLoginMutation, useGetMeQuery, useChangeLanguageMutation } = authApi
