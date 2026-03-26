import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/model/authSlice'
import { authApi } from '@/features/auth/api/authApi'
import { patientApi } from '@/features/patient/api/patientApi'
import { orderApi } from '@/features/order/api/orderApi'
import { specimenApi } from '@/features/specimen/api/specimenApi'
import { resultApi } from '@/features/result/api/resultApi'
import { reportApi } from '@/features/report/api/reportApi'
import { reagentApi } from '@/features/reagent/api/reagentApi'
import { portalApi } from '@/features/portal/api/portalApi'
import { userApi } from '@/features/user/api/userApi'
import { testDefinitionApi } from '@/features/test-definition/api/testDefinitionApi'
import { nonConformiteApi } from '@/features/non-conformite/api/nonConformiteApi'
import { practitionerApi } from '@/features/practitioner/api/practitionerApi'
import { invoiceApi } from '@/features/invoice/api/invoiceApi'
import { paymentApi } from '@/features/payment/api/paymentApi'
import { qcApi } from '@/features/qc/api/qcApi'
import { pricingApi } from '@/features/pricing/api/pricingApi'
import { sampleApi } from '@/features/sample/api/sampleApi'
import { instrumentApi } from '@/features/instrument/api/instrumentApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [specimenApi.reducerPath]: specimenApi.reducer,
    [resultApi.reducerPath]: resultApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [reagentApi.reducerPath]: reagentApi.reducer,
    [portalApi.reducerPath]: portalApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [testDefinitionApi.reducerPath]: testDefinitionApi.reducer,
    [nonConformiteApi.reducerPath]: nonConformiteApi.reducer,
    [practitionerApi.reducerPath]: practitionerApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [qcApi.reducerPath]: qcApi.reducer,
    [pricingApi.reducerPath]: pricingApi.reducer,
    [sampleApi.reducerPath]: sampleApi.reducer,
    [instrumentApi.reducerPath]: instrumentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      patientApi.middleware,
      orderApi.middleware,
      specimenApi.middleware,
      resultApi.middleware,
      reportApi.middleware,
      reagentApi.middleware,
      portalApi.middleware,
      userApi.middleware,
      testDefinitionApi.middleware,
      nonConformiteApi.middleware,
      practitionerApi.middleware,
      invoiceApi.middleware,
      paymentApi.middleware,
      qcApi.middleware,
      pricingApi.middleware,
      sampleApi.middleware,
      instrumentApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
