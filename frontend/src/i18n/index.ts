import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import frCommon from './locales/fr/common.json'
import frAuth from './locales/fr/auth.json'
import frDashboard from './locales/fr/dashboard.json'
import frPatient from './locales/fr/patient.json'
import frOrder from './locales/fr/order.json'
import frSpecimen from './locales/fr/specimen.json'
import frResult from './locales/fr/result.json'
import frReport from './locales/fr/report.json'
import frReagent from './locales/fr/reagent.json'
import frPortal from './locales/fr/portal.json'
import frUsers from './locales/fr/users.json'
import frValidation from './locales/fr/validation.json'
import frStatuses from './locales/fr/statuses.json'
import frMedical from './locales/fr/medical.json'
import frTestDefinition from './locales/fr/testDefinition.json'
import frNonConformite from './locales/fr/nonConformite.json'
import frPractitioner from './locales/fr/practitioner.json'
import frInvoice from './locales/fr/invoice.json'
import frPayment from './locales/fr/payment.json'
import frQc from './locales/fr/qc.json'
import frPricing from './locales/fr/pricing.json'
import frSample from './locales/fr/sample.json'
import frInstrument from './locales/fr/instrument.json'

import arCommon from './locales/ar/common.json'
import arAuth from './locales/ar/auth.json'
import arDashboard from './locales/ar/dashboard.json'
import arPatient from './locales/ar/patient.json'
import arOrder from './locales/ar/order.json'
import arSpecimen from './locales/ar/specimen.json'
import arResult from './locales/ar/result.json'
import arReport from './locales/ar/report.json'
import arReagent from './locales/ar/reagent.json'
import arPortal from './locales/ar/portal.json'
import arUsers from './locales/ar/users.json'
import arValidation from './locales/ar/validation.json'
import arStatuses from './locales/ar/statuses.json'
import arMedical from './locales/ar/medical.json'
import arTestDefinition from './locales/ar/testDefinition.json'
import arNonConformite from './locales/ar/nonConformite.json'
import arPractitioner from './locales/ar/practitioner.json'
import arInvoice from './locales/ar/invoice.json'
import arPayment from './locales/ar/payment.json'
import arQc from './locales/ar/qc.json'
import arPricing from './locales/ar/pricing.json'
import arSample from './locales/ar/sample.json'
import arInstrument from './locales/ar/instrument.json'

void i18n.use(initReactI18next).init({
  resources: {
    fr: {
      common: frCommon, auth: frAuth, dashboard: frDashboard, patient: frPatient,
      order: frOrder, specimen: frSpecimen, result: frResult, report: frReport,
      reagent: frReagent, portal: frPortal, users: frUsers, validation: frValidation,
      statuses: frStatuses, medical: frMedical, testDefinition: frTestDefinition,
      nonConformite: frNonConformite, practitioner: frPractitioner,
      invoice: frInvoice, payment: frPayment,
      qc: frQc, pricing: frPricing, sample: frSample,
      instrument: frInstrument,
    },
    ar: {
      common: arCommon, auth: arAuth, dashboard: arDashboard, patient: arPatient,
      order: arOrder, specimen: arSpecimen, result: arResult, report: arReport,
      reagent: arReagent, portal: arPortal, users: arUsers, validation: arValidation,
      statuses: arStatuses, medical: arMedical, testDefinition: arTestDefinition,
      nonConformite: arNonConformite, practitioner: arPractitioner,
      invoice: arInvoice, payment: arPayment,
      qc: arQc, pricing: arPricing, sample: arSample,
      instrument: arInstrument,
    },
  },
  lng: 'fr',
  fallbackLng: 'fr',
  defaultNS: 'common',
  ns: ['common', 'auth', 'dashboard', 'patient', 'order', 'specimen', 'result',
       'report', 'reagent', 'portal', 'users', 'validation', 'statuses', 'medical', 'testDefinition',
       'nonConformite', 'practitioner', 'invoice', 'payment', 'qc', 'pricing', 'sample', 'instrument'],
  interpolation: { escapeValue: false },
})

export default i18n
