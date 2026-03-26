import { Module } from '@nestjs/common';
import { PrismaModule } from '../infrastructure/persistence/prisma/prisma.module';
import { UserPrismaRepository } from '../infrastructure/persistence/repositories/UserPrismaRepository';
import { PatientPrismaRepository } from '../infrastructure/persistence/repositories/PatientPrismaRepository';
import { OrderPrismaRepository } from '../infrastructure/persistence/repositories/OrderPrismaRepository';
import { SpecimenPrismaRepository } from '../infrastructure/persistence/repositories/SpecimenPrismaRepository';
import { ResultPrismaRepository } from '../infrastructure/persistence/repositories/ResultPrismaRepository';
import { ReportPrismaRepository } from '../infrastructure/persistence/repositories/ReportPrismaRepository';
import { ReagentPrismaRepository } from '../infrastructure/persistence/repositories/ReagentPrismaRepository';
import { TestDefinitionPrismaRepository } from '../infrastructure/persistence/repositories/TestDefinitionPrismaRepository';
import { NonConformitePrismaRepository } from '../infrastructure/persistence/repositories/NonConformitePrismaRepository';
import { PractitionerPrismaRepository } from '../infrastructure/persistence/repositories/PractitionerPrismaRepository';
import { InvoicePrismaRepository } from '../infrastructure/persistence/repositories/InvoicePrismaRepository';
import { PaymentPrismaRepository } from '../infrastructure/persistence/repositories/PaymentPrismaRepository';
import { QCMaterialPrismaRepository } from '../infrastructure/persistence/repositories/QCMaterialPrismaRepository';
import { QCSchedulePrismaRepository } from '../infrastructure/persistence/repositories/QCSchedulePrismaRepository';
import { QCResultPrismaRepository } from '../infrastructure/persistence/repositories/QCResultPrismaRepository';
import { PricingTierPrismaRepository } from '../infrastructure/persistence/repositories/PricingTierPrismaRepository';
import { SamplePrismaRepository } from '../infrastructure/persistence/repositories/SamplePrismaRepository';
import { SampleInventoryLinePrismaRepository } from '../infrastructure/persistence/repositories/SampleInventoryLinePrismaRepository';
import { InstrumentPrismaRepository } from '../infrastructure/persistence/repositories/InstrumentPrismaRepository';
import { InstrumentConnectionPrismaRepository } from '../infrastructure/persistence/repositories/InstrumentConnectionPrismaRepository';
import { InstrumentTestMappingPrismaRepository } from '../infrastructure/persistence/repositories/InstrumentTestMappingPrismaRepository';
import { InstrumentOrderOutboxPrismaRepository } from '../infrastructure/persistence/repositories/InstrumentOrderOutboxPrismaRepository';
import { InstrumentResultInboxPrismaRepository } from '../infrastructure/persistence/repositories/InstrumentResultInboxPrismaRepository';
import { InstrumentRawResultPrismaRepository } from '../infrastructure/persistence/repositories/InstrumentRawResultPrismaRepository';

export const USER_REPOSITORY = 'IUserRepository';
export const PATIENT_REPOSITORY = 'IPatientRepository';
export const ORDER_REPOSITORY = 'IOrderRepository';
export const SPECIMEN_REPOSITORY = 'ISpecimenRepository';
export const RESULT_REPOSITORY = 'IResultRepository';
export const REPORT_REPOSITORY = 'IReportRepository';
export const REAGENT_REPOSITORY = 'IReagentRepository';
export const TEST_DEFINITION_REPOSITORY = 'ITestDefinitionRepository';
export const NON_CONFORMITE_REPOSITORY = 'INonConformiteRepository';
export const PRACTITIONER_REPOSITORY = 'IPractitionerRepository';
export const INVOICE_REPOSITORY = 'IInvoiceRepository';
export const PAYMENT_REPOSITORY = 'IPaymentRepository';
export const QC_MATERIAL_REPOSITORY = 'IQCMaterialRepository';
export const QC_SCHEDULE_REPOSITORY = 'IQCScheduleRepository';
export const QC_RESULT_REPOSITORY = 'IQCResultRepository';
export const PRICING_TIER_REPOSITORY = 'IPricingTierRepository';
export const SAMPLE_REPOSITORY = 'ISampleRepository';
export const SAMPLE_INVENTORY_LINE_REPOSITORY = 'ISampleInventoryLineRepository';
export const INSTRUMENT_REPOSITORY = 'IInstrumentRepository';
export const INSTRUMENT_CONNECTION_REPOSITORY = 'IInstrumentConnectionRepository';
export const INSTRUMENT_TEST_MAPPING_REPOSITORY = 'IInstrumentTestMappingRepository';
export const INSTRUMENT_ORDER_OUTBOX_REPOSITORY = 'IInstrumentOrderOutboxRepository';
export const INSTRUMENT_RESULT_INBOX_REPOSITORY = 'IInstrumentResultInboxRepository';
export const INSTRUMENT_RAW_RESULT_REPOSITORY = 'IInstrumentRawResultRepository';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
    { provide: PATIENT_REPOSITORY, useClass: PatientPrismaRepository },
    { provide: ORDER_REPOSITORY, useClass: OrderPrismaRepository },
    { provide: SPECIMEN_REPOSITORY, useClass: SpecimenPrismaRepository },
    { provide: RESULT_REPOSITORY, useClass: ResultPrismaRepository },
    { provide: REPORT_REPOSITORY, useClass: ReportPrismaRepository },
    { provide: REAGENT_REPOSITORY, useClass: ReagentPrismaRepository },
    { provide: TEST_DEFINITION_REPOSITORY, useClass: TestDefinitionPrismaRepository },
    { provide: NON_CONFORMITE_REPOSITORY, useClass: NonConformitePrismaRepository },
    { provide: PRACTITIONER_REPOSITORY, useClass: PractitionerPrismaRepository },
    { provide: INVOICE_REPOSITORY, useClass: InvoicePrismaRepository },
    { provide: PAYMENT_REPOSITORY, useClass: PaymentPrismaRepository },
    { provide: QC_MATERIAL_REPOSITORY, useClass: QCMaterialPrismaRepository },
    { provide: QC_SCHEDULE_REPOSITORY, useClass: QCSchedulePrismaRepository },
    { provide: QC_RESULT_REPOSITORY, useClass: QCResultPrismaRepository },
    { provide: PRICING_TIER_REPOSITORY, useClass: PricingTierPrismaRepository },
    { provide: SAMPLE_REPOSITORY, useClass: SamplePrismaRepository },
    { provide: SAMPLE_INVENTORY_LINE_REPOSITORY, useClass: SampleInventoryLinePrismaRepository },
    { provide: INSTRUMENT_REPOSITORY, useClass: InstrumentPrismaRepository },
    { provide: INSTRUMENT_CONNECTION_REPOSITORY, useClass: InstrumentConnectionPrismaRepository },
    { provide: INSTRUMENT_TEST_MAPPING_REPOSITORY, useClass: InstrumentTestMappingPrismaRepository },
    { provide: INSTRUMENT_ORDER_OUTBOX_REPOSITORY, useClass: InstrumentOrderOutboxPrismaRepository },
    { provide: INSTRUMENT_RESULT_INBOX_REPOSITORY, useClass: InstrumentResultInboxPrismaRepository },
    { provide: INSTRUMENT_RAW_RESULT_REPOSITORY, useClass: InstrumentRawResultPrismaRepository },
  ],
  exports: [
    USER_REPOSITORY, PATIENT_REPOSITORY, ORDER_REPOSITORY, SPECIMEN_REPOSITORY,
    RESULT_REPOSITORY, REPORT_REPOSITORY, REAGENT_REPOSITORY, TEST_DEFINITION_REPOSITORY,
    NON_CONFORMITE_REPOSITORY, PRACTITIONER_REPOSITORY, INVOICE_REPOSITORY, PAYMENT_REPOSITORY,
    QC_MATERIAL_REPOSITORY, QC_SCHEDULE_REPOSITORY, QC_RESULT_REPOSITORY,
    PRICING_TIER_REPOSITORY, SAMPLE_REPOSITORY, SAMPLE_INVENTORY_LINE_REPOSITORY,
    INSTRUMENT_REPOSITORY, INSTRUMENT_CONNECTION_REPOSITORY, INSTRUMENT_TEST_MAPPING_REPOSITORY,
    INSTRUMENT_ORDER_OUTBOX_REPOSITORY, INSTRUMENT_RESULT_INBOX_REPOSITORY, INSTRUMENT_RAW_RESULT_REPOSITORY,
  ],
})
export class PersistenceModule {}
