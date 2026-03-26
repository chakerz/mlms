import { PrismaClient, UserRole, Language, Gender, ReagentCategory, QCScheduleStatus, QCResultStatus, QCAlert, SampleInventoryStatus, InstrumentProtocolType, InstrumentTransportType, InstrumentDirectionMode } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// ─── Clear DB ─────────────────────────────────────────────────────────────────

async function clearDatabase() {
  await prisma.payment.deleteMany({});
  await prisma.invoiceLine.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.practitioner.deleteMany({});
  await prisma.auditEntry.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.result.deleteMany({});
  await prisma.nonConformite.deleteMany({});
  await prisma.specimen.deleteMany({});
  await prisma.testOrder.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.pricingTier.deleteMany({});
  await prisma.qCResult.deleteMany({});
  await prisma.qCSchedule.deleteMany({});
  await prisma.qCMaterial.deleteMany({});
  await prisma.sampleInventoryLine.deleteMany({});
  await prisma.sample.deleteMany({});
  await prisma.reagentLot.deleteMany({});
  await prisma.reagent.deleteMany({});
  await prisma.storageLocation.deleteMany({});
  await prisma.testDefinition.deleteMany({});
  await prisma.testPanel.deleteMany({});
  // Instrument tables (ordre: dépendants en premier)
  await prisma.instrumentMessageAudit.deleteMany({});
  await prisma.instrumentRawResult.deleteMany({});
  await prisma.instrumentResultInbox.deleteMany({});
  await prisma.instrumentOrderOutbox.deleteMany({});
  await prisma.instrumentTestMapping.deleteMany({});
  await prisma.instrumentConnection.deleteMany({});
  await prisma.instrument.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('  ✓ database cleared');
}

// ─── Users ────────────────────────────────────────────────────────────────────

async function seedUsers() {
  const users = [
    {
      email: 'admin@mlms.local',
      password: 'Admin1234!',
      role: UserRole.ADMIN,
      language: Language.FR,
    },
    {
      email: 'reception@mlms.local',
      password: 'Reception1234!',
      role: UserRole.RECEPTION,
      language: Language.FR,
    },
    {
      email: 'technician@mlms.local',
      password: 'Tech1234!',
      role: UserRole.TECHNICIAN,
      language: Language.FR,
    },
    {
      email: 'physician@mlms.local',
      password: 'Doctor1234!',
      role: UserRole.PHYSICIAN,
      language: Language.FR,
    },
    {
      email: 'biologiste@mlms.local',
      password: 'Bio1234!',
      role: UserRole.BIOLOGISTE,
      language: Language.FR,
    },
    {
      email: 'simulator@mlms.local',
      password: 'Sim1234!',
      role: UserRole.TECHNICIAN,
      language: Language.FR,
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        passwordHash: await hash(u.password),
        role: u.role,
        language: u.language,
        isActive: true,
      },
    });
  }

  console.log(`  ✓ ${users.length} users seeded`);
}

// ─── Test Definitions — Import depuis mlms_tests.json ─────────────────────────

type JsonTestItem = {
  id: string;
  name: string;
  code: string;
  alias: string;
  testPanelId: string;
  testPanelName: string;
  testPanelOrder: number;
  testPanelParentName: string | null;
  testPanelParentOrder: number | null;
  sampleId: string | null;
  units: string;
  secondaryUnits: string;
  referenceRange: string;
  secondaryReferenceRange: string;
  criticalLow: string;
  criticalHigh: string;
  testComments: string;
  testInterpretation: string;
  loincCode: string;
  price: number;
  cost: number;
  requiresFasting: boolean;
  isActive: boolean;
  turnaroundTimeMinutes: number;
  calculationFormula: string;
  analyticalInstrument: string;
  reportingTime: string;
};

function parseReferenceRange(raw: string): object | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return { default: raw };
  }
}

const CATEGORY_MAP: Record<string, string> = {
  // Biochimie
  'BIOCHIMIE': 'BIOCHEMISTRY',
  'BIOCHIMIE SANGUINE COBAS C311': 'BIOCHEMISTRY',
  'BIOCHIMIE URINAIRE': 'BIOCHEMISTRY',
  'CREATININEMIE': 'BIOCHEMISTRY',
  'GLYCEMIE': 'BIOCHEMISTRY',
  'IONOGRAMME SANGUIN': 'BIOCHEMISTRY',
  'BILAN HÉPATIQUE': 'BIOCHEMISTRY',
  'BILAN LIPIDIQUE': 'BIOCHEMISTRY',
  'TOXICOLOGIE': 'BIOCHEMISTRY',
  // Hématologie
  'HEMATOLOGIE': 'HEMATOLOGY',
  'NUMERATION FORMULE SANGUINE MINDRAY BC5000': 'HEMATOLOGY',
  'NUMERATION FORMULE SANGUINE MINDRAY BC780': 'HEMATOLOGY',
  'GROUPAGE SANGUIN': 'HEMATOLOGY',
  'HEMOCULTURE': 'HEMATOLOGY',
  'ÉLECTROPHORÈSE DE L\'HÉMOGLOBINE': 'HEMATOLOGY',
  // Hémostase
  'HEMOSTASE': 'HEMOSTASIS',
  'BILAN DE COAGULATION': 'HEMOSTASIS',
  'TCA COAGULATION': 'HEMOSTASIS',
  'BANQUE SANG': 'HEMOSTASIS',
  // Hormonologie
  'HORMONOLOGIE': 'HORMONOLOGY',
  'HORMONOLOGIE COBAS E411': 'HORMONOLOGY',
  // Microbiologie / Bactériologie
  'BACTÉRIOLOGIE': 'MICROBIOLOGY',
  'ANTIBIOGRAMME': 'MICROBIOLOGY',
  'ANTIBIOGRAMME VITEK 2 ANTIBIOTIQUES': 'MICROBIOLOGY',
  'ANTIBIOGRAMME VITEK 2 ORGANISMES': 'MICROBIOLOGY',
  'BACTERIOLOGIE DES SELLES': 'MICROBIOLOGY',
  'BACTERIOLOGIE DES URINES': 'MICROBIOLOGY',
  'BACTÉRIO-PARA-MYCO': 'MICROBIOLOGY',
  'BANDELETTE URINAIRE': 'MICROBIOLOGY',
  'COPROCULTURE': 'MICROBIOLOGY',
  'EXAMEN MYCOLOGIQUE': 'MICROBIOLOGY',
  'EXAMEN PARASITOLOGIQUE': 'MICROBIOLOGY',
  'SPERMOCULTURE': 'MICROBIOLOGY',
  'RECHERCHE DE PLASMODIUM PALUDISME': 'MICROBIOLOGY',
  'RECHERCHE DE MYCOPLASMES URO GENITAUX': 'MICROBIOLOGY',
  'RECHERCHE DE BACILLES ACIDO ALCALINO RESISTANTS BAAR BACILLES DE KOCH': 'MICROBIOLOGY',
  // Biologie moléculaire / PCR
  'RECHERCHE DE PATHOGENES GENITAUX PAR AMPLIFICATION GENIQUE': 'MOLECULAR_BIOLOGY',
  'RECHERCHE DE LADN DE CHLAMYDIA TRACHOMATIS ET DE NEISSERIA GONORRHOEAE PAR PCR': 'MOLECULAR_BIOLOGY',
  // Sérologie / Immunologie
  'SEROLOGIE AUTOIMMUNES': 'IMMUNOLOGY',
  'SEROLOGIE ANTIPHOSPHOLIPIDES': 'IMMUNOLOGY',
  'SEROLOGIE MALADIE COELIAQUE': 'IMMUNOLOGY',
  'IMMUNOLOGIE': 'IMMUNOLOGY',
  'IMMUNOTHERAPIE': 'IMMUNOLOGY',
  'SEROLOGIE HEPATITES': 'SEROLOGY',
  'SEROLOGIE HIV': 'SEROLOGY',
  'SEROLOGIE STREPTOCOCCIQUE': 'SEROLOGY',
  'SEROLOGIE PARASITAIRES': 'SEROLOGY',
  'SEROLOGIE VIRALES': 'SEROLOGY',
  'SEROLOGIE COVID 19': 'SEROLOGY',
  'VIROLOGIE': 'SEROLOGY',
  // Allergologie
  'SEROLOGIE IMMUNOLOGIE ALLERGIE': 'ALLERGOLOGY',
  // Marqueurs tumoraux
  'MARQUEURS TUMORAUX': 'TUMOR_MARKERS',
  // Cytologie / Anapath
  'CYTOLOGIE': 'CYTOGENETICS',
  'HISTOLOGIE': 'CYTOGENETICS',
  'ANATOMOPATHOLOGIE': 'CYTOGENETICS',
};

function mapCategory(parentName: string | null, panelName: string): string {
  if (parentName && CATEGORY_MAP[parentName]) return CATEGORY_MAP[parentName];
  if (CATEGORY_MAP[panelName]) return CATEGORY_MAP[panelName];
  return 'BIOCHEMISTRY';
}

async function seedTestDefinitions() {
  const filePath = path.resolve(__dirname, 'data', 'mlms_tests.json');
  if (!fs.existsSync(filePath)) {
    console.warn('  ⚠ mlms_tests.json not found — skipping test definitions');
    return;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw) as { items: JsonTestItem[] };
  const items = data.items;

  // 1. Upsert TestPanels
  const panelMap = new Map<string, { name: string; parentName: string | null; order: number }>();
  for (const item of items) {
    if (item.testPanelId && !panelMap.has(item.testPanelId)) {
      panelMap.set(item.testPanelId, {
        name: item.testPanelName,
        parentName: item.testPanelParentName ?? null,
        order: item.testPanelOrder ?? 0,
      });
    }
  }

  let panelsUpserted = 0;
  for (const [id, panel] of Array.from(panelMap.entries())) {
    await prisma.testPanel.upsert({
      where: { id },
      update: { name: panel.name, parentName: panel.parentName, order: panel.order },
      create: { id, name: panel.name, parentName: panel.parentName, order: panel.order },
    });
    panelsUpserted++;
  }
  console.log(`  ✓ ${panelsUpserted} test panels upserted`);

  // 2. Upsert TestDefinitions
  let upserted = 0;
  let skipped = 0;

  for (const item of items) {
    if (!item.code || !item.name) { skipped++; continue; }

    const category = mapCategory(item.testPanelParentName, item.testPanelName);
    const referenceRange = parseReferenceRange(item.referenceRange);
    const secondaryReferenceRange = parseReferenceRange(item.secondaryReferenceRange);

    await prisma.testDefinition.upsert({
      where: { code: item.code },
      update: {
        nameFr: item.name,
        category,
        unit: item.units || null,
        secondaryUnit: item.secondaryUnits || null,
        referenceRange: referenceRange ?? undefined,
        secondaryReferenceRange: secondaryReferenceRange ?? undefined,
        criticalLow: item.criticalLow || null,
        criticalHigh: item.criticalHigh || null,
        isActive: true,
        fastingRequired: item.requiresFasting ?? false,
        turnaroundTimeMinutes: item.turnaroundTimeMinutes || null,
        price: item.price > 0 ? item.price : null,
        cost: item.cost > 0 ? item.cost : null,
        loincCode: item.loincCode || null,
        alias: item.alias || null,
        calculationFormula: item.calculationFormula || null,
        analyticalInstrument: item.analyticalInstrument || null,
        specialNotesFr: item.testComments || null,
        panelId: item.testPanelId || null,
      },
      create: {
        code: item.code,
        nameFr: item.name,
        nameAr: '',
        category,
        unit: item.units || null,
        secondaryUnit: item.secondaryUnits || null,
        referenceRange: referenceRange ?? undefined,
        secondaryReferenceRange: secondaryReferenceRange ?? undefined,
        criticalLow: item.criticalLow || null,
        criticalHigh: item.criticalHigh || null,
        isActive: true,
        fastingRequired: item.requiresFasting ?? false,
        turnaroundTimeMinutes: item.turnaroundTimeMinutes || null,
        price: item.price > 0 ? item.price : null,
        cost: item.cost > 0 ? item.cost : null,
        loincCode: item.loincCode || null,
        alias: item.alias || null,
        calculationFormula: item.calculationFormula || null,
        analyticalInstrument: item.analyticalInstrument || null,
        specialNotesFr: item.testComments || null,
        panelId: item.testPanelId || null,
      },
    });
    upserted++;
  }

  if (skipped > 0) console.warn(`  ⚠ ${skipped} items skipped (missing code or name)`);
  console.log(`  ✓ ${upserted} test definitions upserted from mlms_tests.json`);
}

// ─── Reference Values (gender-specific) ──────────────────────────────────────

interface RefValueEntry {
  codes: string[];
  referenceRange: Record<string, string>;
  referenceLow?: number;
  referenceHigh?: number;
  unit?: string;
}

async function seedReferenceValues() {
  const filePath = path.resolve(__dirname, 'data', 'mlms_reference_values.json');
  if (!fs.existsSync(filePath)) {
    console.warn('  ⚠ mlms_reference_values.json not found — skipping reference values');
    return;
  }
  const entries: RefValueEntry[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let updated = 0;

  for (const entry of entries) {
    const data: Record<string, unknown> = { referenceRange: entry.referenceRange };
    if (entry.referenceLow !== undefined) data['referenceLow'] = entry.referenceLow;
    if (entry.referenceHigh !== undefined) data['referenceHigh'] = entry.referenceHigh;
    if (entry.unit) data['unit'] = entry.unit;

    for (const code of entry.codes) {
      const result = await prisma.testDefinition.updateMany({ where: { code }, data });
      updated += result.count;
    }
  }
  console.log(`  ✓ ${updated} test definitions updated with gender-specific reference values`);
}

// ─── Storage Locations ────────────────────────────────────────────────────────

async function seedStorageLocations() {
  const locations = [
    { code: 'FRIDGE-1', name: 'Réfrigérateur 1', description: '+2°C à +8°C' },
    { code: 'FRIDGE-2', name: 'Réfrigérateur 2', description: '+2°C à +8°C' },
    { code: 'FREEZER-1', name: 'Congélateur 1', description: '-20°C' },
    { code: 'FREEZER-2', name: 'Congélateur 2', description: '-80°C' },
    { code: 'AMBIENT', name: 'Température ambiante', description: '+15°C à +25°C' },
    { code: 'SHELF-A', name: 'Étagère A', description: 'Stockage sec' },
  ];

  for (const loc of locations) {
    await prisma.storageLocation.upsert({
      where: { code: loc.code },
      update: {},
      create: {
        code: loc.code,
        name: loc.name,
        description: loc.description,
      },
    });
  }

  console.log(`  ✓ ${locations.length} storage locations seeded`);
}

// ─── Demo Reagents ─────────────────────────────────────────────────────────────

async function seedReagents() {
  const reagents = [
    {
      name: 'Réactif Hémogramme',
      manufacturer: 'BioSystems',
      catalogNumber: 'BS-HEM-001',
      category: ReagentCategory.HEMATOLOGY,
      storageTemp: '+2°C à +8°C',
    },
    {
      name: 'Réactif Glucose',
      manufacturer: 'DiaSys',
      catalogNumber: 'DS-GLU-002',
      category: ReagentCategory.CHEMISTRY,
      storageTemp: '+2°C à +8°C',
    },
    {
      name: 'Réactif CRP',
      manufacturer: 'Roche Diagnostics',
      catalogNumber: 'RD-CRP-010',
      category: ReagentCategory.IMMUNOLOGY,
      storageTemp: '+2°C à +8°C',
    },
  ];

  for (const r of reagents) {
    const existing = await prisma.reagent.findFirst({
      where: { catalogNumber: r.catalogNumber },
    });
    if (!existing) {
      await prisma.reagent.create({ data: r });
    }
  }

  console.log(`  ✓ ${reagents.length} reagents seeded`);
}

// ─── Practitioners ───────────────────────────────────────────────────────────

async function seedPractitioners() {
  const practitioners = [
    {
      fullName: 'Dr Larousse',
      email: 'larousse@sante.com',
      speciality: 'Médecine Générale',
    },
    {
      fullName: 'Dr Laroche',
      email: 'pad@pchu.fr',
      speciality: 'Pédiatrie',
    },
    {
      fullName: 'Dr. Martin Rodger',
      email: 'martin.rodget@gmail.com',
      speciality: 'Cardiologie',
    },
    {
      fullName: 'Dr X',
      email: 'bensakhria.ayoub@gmail.com',
      speciality: 'Biologie Médicale',
    },
  ];

  for (const p of practitioners) {
    await prisma.practitioner.upsert({
      where: { email: p.email },
      update: {},
      create: {
        fullName: p.fullName,
        email: p.email,
        speciality: p.speciality,
        isActive: true,
      },
    });
  }

  console.log(`  ✓ ${practitioners.length} practitioners seeded`);
}

// ─── Patients ─────────────────────────────────────────────────────────────────

async function seedPatients() {
  const patients = [
    { firstName: 'Youssef',   lastName: 'Benali',     birthDate: new Date('1985-03-12'), gender: Gender.M, phone: '+212661234501', email: 'y.benali@mail.ma',     address: '12 Rue Ibn Battouta, Casablanca' },
    { firstName: 'Fatima',    lastName: 'El Idrissi', birthDate: new Date('1992-07-24'), gender: Gender.F, phone: '+212661234502', email: 'f.elidrissi@mail.ma',  address: '7 Avenue Hassan II, Rabat' },
    { firstName: 'Khalid',    lastName: 'Ouazzani',   birthDate: new Date('1978-11-05'), gender: Gender.M, phone: '+212661234503',                                address: '34 Boulevard Mohammed V, Fès' },
    { firstName: 'Nadia',     lastName: 'Tazi',       birthDate: new Date('2001-01-30'), gender: Gender.F, phone: '+212661234504', email: 'n.tazi@mail.ma',       address: '5 Rue Al Akhtal, Marrakech' },
    { firstName: 'Hassan',    lastName: 'Berrada',    birthDate: new Date('1965-09-18'), gender: Gender.M, phone: '+212661234505',                                address: '22 Rue de la Liberté, Casablanca' },
    { firstName: 'Zineb',     lastName: 'Chraibi',    birthDate: new Date('1998-04-07'), gender: Gender.F, phone: '+212661234506', email: 'z.chraibi@mail.ma',    address: '9 Quartier Hay Riad, Rabat' },
    { firstName: 'Mohamed',   lastName: 'Lahlou',     birthDate: new Date('1955-12-22'), gender: Gender.M, phone: '+212661234507',                                address: '18 Avenue des FAR, Tanger' },
    { firstName: 'Amina',     lastName: 'Filali',     birthDate: new Date('1989-06-14'), gender: Gender.F, phone: '+212661234508', email: 'a.filali@mail.ma',     address: '3 Rue Zitoun El Kdim, Marrakech' },
    { firstName: 'Rachid',    lastName: 'Senhaji',    birthDate: new Date('1972-02-28'), gender: Gender.M, phone: '+212661234509',                                address: '45 Rue Imam Malik, Agadir' },
    { firstName: 'Hajar',     lastName: 'Benmoussa',  birthDate: new Date('2005-08-03'), gender: Gender.F, phone: '+212661234510', email: 'h.benmoussa@mail.ma',  address: '11 Résidence Al Amal, Meknès' },
    { firstName: 'Omar',      lastName: 'Kettani',    birthDate: new Date('1948-05-17'), gender: Gender.M, phone: '+212661234511',                                address: '67 Rue Sidi Blyout, Casablanca' },
    { firstName: 'Khadija',   lastName: 'Sabir',      birthDate: new Date('1995-10-09'), gender: Gender.F, phone: '+212661234512', email: 'k.sabir@mail.ma',      address: '2 Rue Al Mansour, Oujda' },
    { firstName: 'Amine',     lastName: 'Ziani',      birthDate: new Date('1983-03-25'), gender: Gender.M, phone: '+212661234513',                                address: '29 Avenue Mohammed VI, Tétouan' },
    { firstName: 'Meryem',    lastName: 'Alaoui',     birthDate: new Date('1990-12-01'), gender: Gender.F, phone: '+212661234514', email: 'm.alaoui@mail.ma',     address: '8 Hay Mohammadi, Fès' },
    { firstName: 'Soufiane',  lastName: 'Hajji',      birthDate: new Date('2000-07-19'), gender: Gender.M, phone: '+212661234515',                                address: '14 Rue Ibn Khaldoun, Safi' },
  ];

  await prisma.patient.createMany({ data: patients });
  console.log(`  ✓ ${patients.length} patients seeded`);
}

// ─── QC Materials ────────────────────────────────────────────────────────────

async function seedQCMaterials() {
  const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/mlms_qc_material.json'), 'utf-8'));
  const items = raw.items ?? [];
  for (const m of items) {
    await prisma.qCMaterial.upsert({
      where: { barcode: m.barcode },
      update: {},
      create: {
        barcode: m.barcode,
        name: m.name,
        lotNumber: m.lotNumber,
        manufacturer: m.manufacturer,
        expirationDate: new Date(m.expirationDate),
        expectedValue: Number(m.expectedValue),
        standardDeviation: Number(m.standardDeviation),
        isActive: m.isActive ?? true,
      },
    });
  }
  console.log(`  ✓ ${items.length} QC materials seeded`);
}

// ─── QC Schedules + Results ──────────────────────────────────────────────────

const scheduleStatusMap: Record<string, QCScheduleStatus> = {
  Pending: QCScheduleStatus.PENDING,
  InProgress: QCScheduleStatus.IN_PROGRESS,
  Completed: QCScheduleStatus.COMPLETED,
  Cancelled: QCScheduleStatus.CANCELLED,
};

const resultStatusMap: Record<string, QCResultStatus> = {
  Pending: QCResultStatus.PENDING,
  Accepted: QCResultStatus.ACCEPTED,
  Rejected: QCResultStatus.REJECTED,
};

const alertMap: Record<string, QCAlert> = {
  Gray: QCAlert.GRAY,
  Green: QCAlert.GREEN,
  Yellow: QCAlert.YELLOW,
  Red: QCAlert.RED,
};

async function seedQCSchedules() {
  const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/mlms_qc_schedule.json'), 'utf-8'));
  const items = raw.items ?? [];
  for (const s of items) {
    await prisma.qCSchedule.create({
      data: {
        barcode: s.barcode,
        qcRuleName: s.qcRuleName,
        scheduledDate: new Date(s.scheduledDate),
        duration: s.duration ?? 60,
        status: scheduleStatusMap[s.qcScheduleStatus] ?? QCScheduleStatus.PENDING,
      },
    });
  }
  console.log(`  ✓ ${items.length} QC schedules seeded`);
}

async function seedQCResults() {
  const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/mlms_qc_result.json'), 'utf-8'));
  const items = raw.items ?? [];
  for (const r of items) {
    await prisma.qCResult.create({
      data: {
        testName: r.testName ?? '',
        resultValue: r.resultValue || null,
        performedDate: new Date(r.performedDate),
        performedBy: r.performedBy || null,
        status: resultStatusMap[r.qcResultStatus] ?? QCResultStatus.PENDING,
        acceptableLimitLow: Number(r.acceptableLimitLow ?? 0),
        acceptableLimitHigh: Number(r.acceptableLimitHigh ?? 0),
        warningLimitLow: Number(r.warningLimitLow ?? 0),
        warningLimitHigh: Number(r.warningLimitHigh ?? 0),
        qualitativeObservation: r.qualitativeObservation || null,
        alert: alertMap[r.alert] ?? QCAlert.GRAY,
        comments: r.comments || null,
      },
    });
  }
  console.log(`  ✓ ${items.length} QC results seeded`);
}

// ─── Pricing Tiers ───────────────────────────────────────────────────────────

async function seedPricingTiers() {
  const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/mlms_pricingTier.json'), 'utf-8'));
  const items = raw.items ?? [];
  for (const t of items) {
    await prisma.pricingTier.create({
      data: {
        name: t.name,
        description: t.description || null,
        isActive: t.isActive ?? true,
        defaultRate: Number(t.defaultRate ?? 0),
        notes: t.notes || null,
      },
    });
  }
  console.log(`  ✓ ${items.length} pricing tiers seeded`);
}

// ─── Samples ─────────────────────────────────────────────────────────────────

async function seedSamples() {
  const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/mlms_sample.json'), 'utf-8'));
  // Single object (not paginated)
  const items = Array.isArray(raw) ? raw : (raw.items ?? [raw]);
  for (const s of items) {
    if (!s.sampleCode) continue;
    await prisma.sample.upsert({
      where: { sampleCode: s.sampleCode },
      update: {},
      create: {
        sampleCode: s.sampleCode,
        name: s.name,
        sampleType: s.sampleType ?? 'Unknown',
        sampleDescription: s.sampleDescription || null,
        collectionMethod: s.collectionMethod || null,
        containerType: s.containerType || null,
        storageConditions: s.storageConditions || null,
        handlingInstructions: s.handlingInstructions || null,
        sampleStatus: s.sampleStatus ?? 'Active',
        qcPassed: s.qcPassed ?? true,
        qcNotes: s.qcNotes || null,
      },
    });
  }
  console.log(`  ✓ ${items.length} samples seeded`);
}

// ─── Sample Inventory Lines ───────────────────────────────────────────────────

const inventoryStatusMap: Record<string, SampleInventoryStatus> = {
  Received: SampleInventoryStatus.RECEIVED,
  InStorage: SampleInventoryStatus.IN_STORAGE,
  InUse: SampleInventoryStatus.IN_USE,
  Disposed: SampleInventoryStatus.DISPOSED,
  Expired: SampleInventoryStatus.EXPIRED,
};

async function seedSampleInventoryLines() {
  const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/mlms_sample_inventory_lines.json'), 'utf-8'));
  const items = raw.items ?? [];
  for (const l of items) {
    if (!l.inventoryCode) continue;
    await prisma.sampleInventoryLine.upsert({
      where: { inventoryCode: l.inventoryCode },
      update: {},
      create: {
        barcode: l.barcode ?? '',
        inventoryCode: l.inventoryCode,
        receptionDate: new Date(l.receptionDate),
        receivedBy: l.receivedBy || null,
        currentLocation: l.currentLocation || null,
        currentStatus: inventoryStatusMap[l.currentStatus] ?? SampleInventoryStatus.RECEIVED,
        quantity: l.quantity ?? 1,
        unit: l.unit || null,
        collectionDate: l.collectionDate ? new Date(l.collectionDate) : null,
        collectionSite: l.collectionSite || null,
        collectedBy: l.collectedBy || null,
        qcPassed: l.qcPassed ?? false,
        qcNotes: l.qcNotes || null,
        conservationMethod: l.conservationMethod || null,
        expirationDate: l.expirationDate ? new Date(l.expirationDate) : null,
        history: l.history ? JSON.parse(typeof l.history === 'string' ? l.history : JSON.stringify(l.history)) : null,
      },
    });
  }
  console.log(`  ✓ ${items.length} sample inventory lines seeded`);
}

// ─── Instruments ──────────────────────────────────────────────────────────────

type JsonInstrument = {
  code: string;
  name: string;
  manufacturer: string;
  model: string;
  category: string;
  protocolType: string;
  transportType: string;
  directionMode: string;
  defaultPort: number | null;
  defaultBaudRate?: number | null;
  notes?: string;
  _comment?: string;
};

const PROTOCOL_MAP: Record<string, InstrumentProtocolType> = {
  HL7: InstrumentProtocolType.HL7,
  ASTM: InstrumentProtocolType.ASTM,
  PROPRIETARY: InstrumentProtocolType.PROPRIETARY,
  // legacy aliases from catalog JSON
  VENDOR_CUSTOM: InstrumentProtocolType.PROPRIETARY,
  FILE_IMPORT: InstrumentProtocolType.PROPRIETARY,
  FILE_EXPORT: InstrumentProtocolType.PROPRIETARY,
};

const TRANSPORT_MAP: Record<string, InstrumentTransportType> = {
  TCP: InstrumentTransportType.TCP,
  SERIAL: InstrumentTransportType.SERIAL,
  FILE_SYSTEM: InstrumentTransportType.FILE_SYSTEM,
};

const DIRECTION_MAP: Record<string, InstrumentDirectionMode> = {
  UNIDIRECTIONAL: InstrumentDirectionMode.UNIDIRECTIONAL,
  BIDIRECTIONAL: InstrumentDirectionMode.BIDIRECTIONAL,
};

async function seedInstrumentCatalog() {
  const filePath = path.join(__dirname, 'data', 'mlms_instruments.json');
  const items: JsonInstrument[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const instruments = items.filter((i) => i.code);

  for (const item of instruments) {
    const protocol = PROTOCOL_MAP[item.protocolType];
    const transport = TRANSPORT_MAP[item.transportType];
    const direction = DIRECTION_MAP[item.directionMode];

    if (!protocol || !transport || !direction) {
      console.warn(`  ⚠ Skipping catalog entry ${item.code}: unknown protocol/transport/direction`);
      continue;
    }

    await prisma.instrumentCatalog.upsert({
      where: { code: item.code },
      update: {
        name: item.name,
        manufacturer: item.manufacturer,
        model: item.model,
        category: item.category ?? null,
        protocolType: protocol,
        transportType: transport,
        directionMode: direction,
        defaultPort: item.defaultPort ?? null,
        defaultBaudRate: item.defaultBaudRate ?? null,
        notes: item.notes ?? null,
      },
      create: {
        code: item.code,
        name: item.name,
        manufacturer: item.manufacturer,
        model: item.model,
        category: item.category ?? null,
        protocolType: protocol,
        transportType: transport,
        directionMode: direction,
        defaultPort: item.defaultPort ?? null,
        defaultBaudRate: item.defaultBaudRate ?? null,
        notes: item.notes ?? null,
      },
    });
  }

  console.log(`  ✓ ${instruments.length} instrument catalog entries seeded`);
}

// ─── cobas c 311 (Klinische Chemie) ───────────────────────────────────────────

async function seedCobasC311() {
  const instrument = await prisma.instrument.upsert({
    where: { code: 'COBAS_C311' },
    update: {
      name: 'cobas c 311',
      manufacturer: 'Roche Diagnostics',
      model: 'cobas c 311',
      protocolType: InstrumentProtocolType.ASTM,
      transportType: InstrumentTransportType.TCP,
      directionMode: InstrumentDirectionMode.BIDIRECTIONAL,
      isActive: true,
      location: 'Labo Biochimie',
    },
    create: {
      code: 'COBAS_C311',
      name: 'cobas c 311',
      manufacturer: 'Roche Diagnostics',
      model: 'cobas c 311',
      protocolType: InstrumentProtocolType.ASTM,
      transportType: InstrumentTransportType.TCP,
      directionMode: InstrumentDirectionMode.BIDIRECTIONAL,
      isActive: true,
      location: 'Labo Biochimie',
    },
  });

  await prisma.instrumentConnection.upsert({
    where: { instrumentId: instrument.id },
    update: { host: 'analyzer-simulator', port: 5000 },
    create: {
      instrumentId: instrument.id,
      host: 'analyzer-simulator',
      port: 5000,
      encoding: 'ASCII',
      timeoutMs: 10000,
      retryLimit: 3,
      ackEnabled: true,
    },
  });

  const testMappings = [
    { code: 'GLU',   unit: 'mmol/L' },
    { code: 'CREA',  unit: 'µmol/L' },
    { code: 'UREE',  unit: 'mmol/L' },
    { code: 'ALT',   unit: 'U/L'    },
    { code: 'AST',   unit: 'U/L'    },
    { code: 'GGT',   unit: 'U/L'    },
    { code: 'ALP',   unit: 'U/L'    },
    { code: 'LDH',   unit: 'U/L'    },
    { code: 'TBIL',  unit: 'µmol/L' },
    { code: 'DBIL',  unit: 'µmol/L' },
    { code: 'TP',    unit: 'g/L'    },
    { code: 'ALB',   unit: 'g/L'    },
    { code: 'CHOL',  unit: 'mmol/L' },
    { code: 'TG',    unit: 'mmol/L' },
    { code: 'HDL',   unit: 'mmol/L' },
    { code: 'LDL',   unit: 'mmol/L' },
    { code: 'URIC',  unit: 'µmol/L' },
    { code: 'CA',    unit: 'mmol/L' },
    { code: 'PHOS',  unit: 'mmol/L' },
    { code: 'MG',    unit: 'mmol/L' },
    { code: 'FER',   unit: 'µmol/L' },
    { code: 'CRP',   unit: 'mg/L'   },
    { code: 'HBA1C', unit: '%'      },
    { code: 'AMY',   unit: 'U/L'    },
    { code: 'LIPA',  unit: 'U/L'    },
  ];

  for (const m of testMappings) {
    const existing = await prisma.instrumentTestMapping.findFirst({
      where: { instrumentId: instrument.id, internalTestCode: m.code },
    });
    if (!existing) {
      await prisma.instrumentTestMapping.create({
        data: {
          instrumentId: instrument.id,
          internalTestCode: m.code,
          instrumentTestCode: m.code,
          sampleType: 'SERUM',
          unit: m.unit,
          isActive: true,
        },
      });
    }
  }

  await prisma.instrumentSimulatorConfig.upsert({
    where: { instrumentId: instrument.id },
    update: {},
    create: {
      instrumentId: instrument.id,
      rackCount: 2,
      slotsPerRack: 20,
      statSlots: 3,
      throughputPerHour: 370,
      processingTimeMinMs: 3000,
      processingTimeMaxMs: 8000,
      abnormalRate: 0.12,
      errorRate: 0.02,
      calibrationIntervalMs: 1800000,
    },
  });

  console.log(`  ✓ cobas c 311 seeded with ${testMappings.length} test mappings`);
}

async function seedCobasE411() {
  const instrument = await prisma.instrument.upsert({
    where: { code: 'COBAS_E411' },
    update: {
      name: 'cobas e 411',
      manufacturer: 'Roche Diagnostics',
      model: 'cobas e 411',
      protocolType: InstrumentProtocolType.ASTM,
      transportType: InstrumentTransportType.TCP,
      directionMode: InstrumentDirectionMode.BIDIRECTIONAL,
      isActive: true,
      location: 'Labo Immunologie',
    },
    create: {
      code: 'COBAS_E411',
      name: 'cobas e 411',
      manufacturer: 'Roche Diagnostics',
      model: 'cobas e 411',
      protocolType: InstrumentProtocolType.ASTM,
      transportType: InstrumentTransportType.TCP,
      directionMode: InstrumentDirectionMode.BIDIRECTIONAL,
      isActive: true,
      location: 'Labo Immunologie',
    },
  });

  await prisma.instrumentConnection.upsert({
    where: { instrumentId: instrument.id },
    update: {
      host: 'analyzer-simulator',
      port: 5002,
    },
    create: {
      instrumentId: instrument.id,
      host: 'analyzer-simulator',
      port: 5002,
      encoding: 'ASCII',
      timeoutMs: 10000,
      retryLimit: 3,
      ackEnabled: true,
    },
  });

  const cobasTestMappings = [
    { code: 'TSH',    unit: 'mUI/L'  },
    { code: 'FT4',    unit: 'pmol/L' },
    { code: 'FT3',    unit: 'pmol/L' },
    { code: 'LH',     unit: 'mUI/mL' },
    { code: 'FSH',    unit: 'mUI/mL' },
    { code: 'PRL',    unit: 'µg/L'   },
    { code: 'E2',     unit: 'pmol/L' },
    { code: 'TESTO',  unit: 'nmol/L' },
    { code: 'PROG',   unit: 'nmol/L' },
    { code: 'HCG',    unit: 'mUI/mL' },
    { code: 'INSU',   unit: 'mUI/L'  },
    { code: 'CPP',    unit: 'nmol/L' },
    { code: 'CRT',    unit: 'nmol/L' },
    { code: 'DHEAS',  unit: 'µmol/L' },
    { code: 'PTH',    unit: 'pmol/L' },
    { code: 'VIT_D',  unit: 'nmol/L' },
    { code: 'B12',    unit: 'pmol/L' },
    { code: 'FOLAT',  unit: 'nmol/L' },
    { code: 'FERR',   unit: 'ng/mL'  },
    { code: 'PSA',    unit: 'µg/L'   },
    { code: 'AFP',    unit: 'µg/L'   },
    { code: 'CEA',    unit: 'µg/L'   },
    { code: 'CA125',  unit: 'kUI/L'  },
    { code: 'CA199',  unit: 'kUI/L'  },
    { code: 'TROPP',  unit: 'ng/L'   },
    { code: 'NT_BNP', unit: 'ng/L'   },
    { code: 'CRP_HS', unit: 'mg/L'   },
    { code: 'HBS_AG', unit: ''       },
    { code: 'AC_HBS', unit: 'mUI/mL' },
    { code: 'AC_HBC', unit: ''       },
    { code: 'AC_VIH', unit: ''       },
    { code: 'AC_VHC', unit: ''       },
  ];

  for (const m of cobasTestMappings) {
    const existing = await prisma.instrumentTestMapping.findFirst({
      where: { instrumentId: instrument.id, internalTestCode: m.code },
    });
    if (!existing) {
      await prisma.instrumentTestMapping.create({
        data: {
          instrumentId: instrument.id,
          internalTestCode: m.code,
          instrumentTestCode: m.code,
          sampleType: 'SERUM',
          unit: m.unit,
          isActive: true,
        },
      });
    }
  }

  await prisma.instrumentSimulatorConfig.upsert({
    where: { instrumentId: instrument.id },
    update: {},
    create: {
      instrumentId: instrument.id,
      rackCount: 2,
      slotsPerRack: 20,
      statSlots: 3,
      throughputPerHour: 200,
      processingTimeMinMs: 5000,
      processingTimeMaxMs: 18000,
      abnormalRate: 0.15,
      errorRate: 0.02,
      calibrationIntervalMs: 3600000,
    },
  });

  console.log(`  ✓ Cobas e 411 seeded with ${cobasTestMappings.length} test mappings`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding MLMS database...\n');

  await clearDatabase();
  await seedUsers();
  await seedTestDefinitions();
  await seedReferenceValues();
  await seedStorageLocations();
  await seedReagents();
  await seedPatients();
  await seedPractitioners();
  await seedQCMaterials();
  await seedQCSchedules();
  await seedQCResults();
  await seedPricingTiers();
  await seedSamples();
  await seedSampleInventoryLines();
  await seedInstrumentCatalog();
  await seedCobasC311();
  await seedCobasE411();

  console.log('\n✅ Seed complete.');
  console.log('\nDefault credentials:');
  console.log('  admin@mlms.local       / Admin1234!');
  console.log('  reception@mlms.local   / Reception1234!');
  console.log('  technician@mlms.local  / Tech1234!');
  console.log('  physician@mlms.local   / Doctor1234!');
  console.log('  biologiste@mlms.local  / Bio1234!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
