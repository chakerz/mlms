import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { authConfig } from './config/auth.config';
import { databaseConfig } from './config/database.config';
import { PrismaModule } from './infrastructure/persistence/prisma/prisma.module';
import { SharedModule } from './modules/shared.module';
import { PersistenceModule } from './modules/persistence.module';
import { AuthModule } from './modules/auth.module';
import { PatientModule } from './modules/patient.module';
import { OrderModule } from './modules/order.module';
import { SpecimenModule } from './modules/specimen.module';
import { ResultModule } from './modules/result.module';
import { ReportModule } from './modules/report.module';
import { ReagentModule } from './modules/reagent.module';
import { PortalModule } from './modules/portal.module';
import { UserModule } from './modules/user.module';
import { TestDefinitionModule } from './modules/test-definition.module';
import { NonConformiteModule } from './modules/non-conformite.module';
import { PractitionerModule } from './modules/practitioner.module';
import { InvoiceModule } from './modules/invoice.module';
import { PaymentModule } from './modules/payment.module';
import { QCModule } from './modules/qc.module';
import { PricingModule } from './modules/pricing.module';
import { SampleModule } from './modules/sample.module';
import { InstrumentModule } from './modules/instrument.module';
import { LanguageMiddleware } from './interfaces/http/middleware/LanguageMiddleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
    }),
    PrismaModule,
    SharedModule,
    PersistenceModule,
    AuthModule,
    PatientModule,
    OrderModule,
    SpecimenModule,
    ResultModule,
    ReportModule,
    ReagentModule,
    PortalModule,
    UserModule,
    TestDefinitionModule,
    NonConformiteModule,
    PractitionerModule,
    InvoiceModule,
    PaymentModule,
    QCModule,
    PricingModule,
    SampleModule,
    InstrumentModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  }
}
