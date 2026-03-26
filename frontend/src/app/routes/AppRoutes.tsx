import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { MainLayout } from '@/app/layout/MainLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { PatientListPage } from '@/features/patient/pages/PatientListPage'
import { PatientCreatePage } from '@/features/patient/pages/PatientCreatePage'
import { PatientDetailPage } from '@/features/patient/pages/PatientDetailPage'
import { PatientEditPage } from '@/features/patient/pages/PatientEditPage'
import { OrderListPage } from '@/features/order/pages/OrderListPage'
import { OrderCreatePage } from '@/features/order/pages/OrderCreatePage'
import { OrderDetailPage } from '@/features/order/pages/OrderDetailPage'
import { SpecimenListPage } from '@/features/specimen/pages/SpecimenListPage'
import { SpecimenCreatePage } from '@/features/specimen/pages/SpecimenCreatePage'
import { SpecimenDetailPage } from '@/features/specimen/pages/SpecimenDetailPage'
import { SpecimensAllPage } from '@/features/specimen/pages/SpecimensAllPage'
import { ResultEntryPage } from '@/features/result/pages/ResultEntryPage'
import { ResultReviewPage } from '@/features/result/pages/ResultReviewPage'
import { ResultHistoryPage } from '@/features/result/pages/ResultHistoryPage'
import { ResultsIndexPage } from '@/features/result/pages/ResultsIndexPage'
import { ReportValidationQueue } from '@/features/report/pages/ReportValidationQueue'
import { ReportDetailPage } from '@/features/report/pages/ReportDetailPage'
import { ReportPreviewPage } from '@/features/report/pages/ReportPreviewPage'
import { ReportHistoryPage } from '@/features/report/pages/ReportHistoryPage'
import { ReagentListPage } from '@/features/reagent/pages/ReagentListPage'
import { ReagentCreatePage } from '@/features/reagent/pages/ReagentCreatePage'
import { ReagentLotPage } from '@/features/reagent/pages/ReagentLotPage'
import { InventoryDashboardPage } from '@/features/reagent/pages/InventoryDashboardPage'
import { PatientPortalLayout } from '@/app/layout/PatientPortalLayout'
import { PortalLoginPage } from '@/features/portal/pages/PortalLoginPage'
import { MyReportsPage } from '@/features/portal/pages/MyReportsPage'
import { MyReportDetailPage } from '@/features/portal/pages/MyReportDetailPage'
import { MyProfilePage } from '@/features/portal/pages/MyProfilePage'
import { UserListPage } from '@/features/user/pages/UserListPage'
import { UserCreatePage } from '@/features/user/pages/UserCreatePage'
import { UserEditPage } from '@/features/user/pages/UserEditPage'
import { TestDefinitionListPage } from '@/features/test-definition/pages/TestDefinitionListPage'
import { TestDefinitionDetailPage } from '@/features/test-definition/pages/TestDefinitionDetailPage'
import { TestDefinitionCreatePage } from '@/features/test-definition/pages/TestDefinitionCreatePage'
import { TestDefinitionEditPage } from '@/features/test-definition/pages/TestDefinitionEditPage'
import { NonConformiteListPage } from '@/features/non-conformite/pages/NonConformiteListPage'
import { NonConformiteCreatePage } from '@/features/non-conformite/pages/NonConformiteCreatePage'
import { PractitionerListPage } from '@/features/practitioner/pages/PractitionerListPage'
import { PractitionerCreatePage } from '@/features/practitioner/pages/PractitionerCreatePage'
import { PractitionerEditPage } from '@/features/practitioner/pages/PractitionerEditPage'
import { InvoiceListPage } from '@/features/invoice/pages/InvoiceListPage'
import { InvoiceDetailPage } from '@/features/invoice/pages/InvoiceDetailPage'
import { PaymentListPage } from '@/features/payment/pages/PaymentListPage'
import { PaymentCreatePage } from '@/features/payment/pages/PaymentCreatePage'
import { QCMaterialListPage } from '@/features/qc/pages/QCMaterialListPage'
import { QCScheduleListPage } from '@/features/qc/pages/QCScheduleListPage'
import { QCResultListPage } from '@/features/qc/pages/QCResultListPage'
import { PricingTierListPage } from '@/features/pricing/pages/PricingTierListPage'
import { PricingTierFormPage } from '@/features/pricing/pages/PricingTierFormPage'
import { SampleListPage } from '@/features/sample/pages/SampleListPage'
import { SampleInventoryListPage } from '@/features/sample/pages/SampleInventoryListPage'
import { InstrumentListPage } from '@/features/instrument/pages/InstrumentListPage'
import { InstrumentFormPage } from '@/features/instrument/pages/InstrumentFormPage'
import { InstrumentDetailPage } from '@/features/instrument/pages/InstrumentDetailPage'
import { InstrumentOutboxPage } from '@/features/instrument/pages/InstrumentOutboxPage'
import { InstrumentInboxPage } from '@/features/instrument/pages/InstrumentInboxPage'
import { InstrumentRawResultsPage } from '@/features/instrument/pages/InstrumentRawResultsPage'
import { UserRole } from '@/shared/types/app.types'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route
            element={
              <ProtectedRoute
                roles={[UserRole.ADMIN, UserRole.RECEPTION, UserRole.PHYSICIAN, UserRole.TECHNICIAN]}
              />
            }
          >
            <Route path="/patients" element={<PatientListPage />} />
            <Route path="/patients/new" element={<PatientCreatePage />} />
            <Route path="/patients/:id" element={<PatientDetailPage />} />
            <Route path="/patients/:id/edit" element={<PatientEditPage />} />
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/orders/new" element={<OrderCreatePage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />

            <Route
              element={
                <ProtectedRoute roles={[UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.RECEPTION]} />
              }
            >
              <Route path="/specimens" element={<SpecimensAllPage />} />
              <Route path="/orders/:orderId/specimens" element={<SpecimenListPage />} />
              <Route path="/orders/:orderId/specimens/new" element={<SpecimenCreatePage />} />
              <Route path="/specimens/:id" element={<SpecimenDetailPage />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  roles={[UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.PHYSICIAN]}
                />
              }
            >
              <Route path="/results" element={<ResultsIndexPage />} />
              <Route path="/specimens/:specimenId/results" element={<ResultReviewPage />} />
              <Route path="/specimens/:specimenId/results/new" element={<ResultEntryPage />} />
              <Route path="/orders/:orderId/results" element={<ResultHistoryPage />} />
            </Route>

            <Route
              element={
                <ProtectedRoute roles={[UserRole.ADMIN, UserRole.PHYSICIAN]} />
              }
            >
              <Route path="/reports" element={<ReportValidationQueue />} />
              <Route path="/reports/history" element={<ReportHistoryPage />} />
              <Route path="/reports/:id" element={<ReportDetailPage />} />
              <Route path="/reports/:id/preview" element={<ReportPreviewPage />} />
            </Route>

            <Route
              element={<ProtectedRoute roles={[UserRole.ADMIN]} />}
            >
              <Route path="/users" element={<UserListPage />} />
              <Route path="/users/new" element={<UserCreatePage />} />
              <Route path="/users/:id/edit" element={<UserEditPage />} />
              <Route path="/test-definitions/new" element={<TestDefinitionCreatePage />} />
              <Route path="/test-definitions/:id/edit" element={<TestDefinitionEditPage />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  roles={[UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.PHYSICIAN, UserRole.RECEPTION]}
                />
              }
            >
              <Route path="/test-definitions" element={<TestDefinitionListPage />} />
              <Route path="/test-definitions/:id" element={<TestDefinitionDetailPage />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  roles={[UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE, UserRole.RECEPTION]}
                />
              }
            >
              <Route path="/non-conformites" element={<NonConformiteListPage />} />
              <Route path="/non-conformites/new" element={<NonConformiteCreatePage />} />
            </Route>

            <Route
              element={
                <ProtectedRoute roles={[UserRole.ADMIN, UserRole.TECHNICIAN]} />
              }
            >
              <Route path="/reagents" element={<ReagentListPage />} />
              <Route path="/reagents/new" element={<ReagentCreatePage />} />
              <Route path="/reagents/:id/lots" element={<ReagentLotPage />} />
              <Route path="/inventory" element={<InventoryDashboardPage />} />
            </Route>

            <Route
              element={
                <ProtectedRoute roles={[UserRole.ADMIN, UserRole.RECEPTION]} />
              }
            >
              <Route path="/practitioners" element={<PractitionerListPage />} />
              <Route path="/practitioners/new" element={<PractitionerCreatePage />} />
              <Route path="/practitioners/:id/edit" element={<PractitionerEditPage />} />
              <Route path="/invoices" element={<InvoiceListPage />} />
              <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
              <Route path="/payments" element={<PaymentListPage />} />
              <Route path="/payments/new" element={<PaymentCreatePage />} />
              <Route path="/pricing-tiers" element={<PricingTierListPage />} />
              <Route path="/pricing-tiers/new" element={<PricingTierFormPage />} />
              <Route path="/pricing-tiers/:id/edit" element={<PricingTierFormPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.BIOLOGISTE, UserRole.RECEPTION]} />}>
              <Route path="/qc/materials" element={<QCMaterialListPage />} />
              <Route path="/qc/schedules" element={<QCScheduleListPage />} />
              <Route path="/qc/results" element={<QCResultListPage />} />
              <Route path="/samples" element={<SampleListPage />} />
              <Route path="/sample-inventory" element={<SampleInventoryListPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.TECHNICIAN]} />}>
              <Route path="/instruments" element={<InstrumentListPage />} />
              <Route path="/instruments/new" element={<InstrumentFormPage />} />
              <Route path="/instruments/outbox" element={<InstrumentOutboxPage />} />
              <Route path="/instruments/inbox" element={<InstrumentInboxPage />} />
              <Route path="/instruments/raw-results" element={<InstrumentRawResultsPage />} />
              <Route path="/instruments/:id" element={<InstrumentDetailPage />} />
              <Route path="/instruments/:id/edit" element={<InstrumentFormPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Patient Portal */}
      <Route path="/portal/login" element={<PortalLoginPage />} />
      <Route element={<ProtectedRoute roles={[UserRole.PATIENT]} />}>
        <Route element={<PatientPortalLayout />}>
          <Route path="/portal/reports" element={<MyReportsPage />} />
          <Route path="/portal/reports/:id" element={<MyReportDetailPage />} />
          <Route path="/portal/profile" element={<MyProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
