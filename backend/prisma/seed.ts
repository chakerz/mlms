import { PrismaClient, UserRole, Language, Gender, ReagentCategory } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// ─── Clear DB ─────────────────────────────────────────────────────────────────

async function clearDatabase() {
  await prisma.auditEntry.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.result.deleteMany({});
  await prisma.nonConformite.deleteMany({});
  await prisma.specimen.deleteMany({});
  await prisma.testOrder.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.reagentLot.deleteMany({});
  await prisma.reagent.deleteMany({});
  await prisma.storageLocation.deleteMany({});
  await prisma.testDefinition.deleteMany({});
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

// ─── Test Definitions — Catalogue bilingue ────────────────────────────────────
// Source: catalogue_exams_bilingual.csv (174 examens)
// Code généré par slugification du nom FR (ASCII, majuscules, max 50 chars)
// Catégories assignées par correspondance médicale (BIOCHEMISTRY par défaut)
// Upsert idempotent sur code (unique key)

async function seedTestDefinitions() {
  type CatalogueEntry = {
    code: string;
    category: string;
    nameFr: string;
    nameAr: string;
    synonymes: string | null;
    sampleTypeFr: string | null;
    sampleTypeAr: string | null;
    tubeFr: string | null;
    tubeAr: string | null;
    method: string | null;
    collectionConditionFr: string | null;
    collectionConditionAr: string | null;
    preAnalyticDelay: string | null;
    preAnalyticDelayAr?: string | null;
    turnaroundTime: string | null;
    turnaroundTimeAr?: string | null;
  };
  const delayTranslations: Record<string, string> = {
    '1 jour': 'يوم واحد',
    '2 h AMB / 1 jour (4°C)': 'ساعتان في درجة الغرفة / يوم واحد (4°C)',
    '2 h TA / 1 jour (4°C)': 'ساعتان في درجة الغرفة / يوم واحد (4°C)',
    '2 heures': 'ساعتان',
    '24 h TA / <5 jours réfrigéré': '24 ساعة في درجة الغرفة / أقل من 5 أيام مبردًا',
    '24 heures': '24 ساعة',
    '24 heures TA': '24 ساعة في درجة الغرفة',
    '4 heures': '4 ساعات',
    '48 h TA / <5 jours réfrigéré': '48 ساعة في درجة الغرفة / أقل من 5 أيام مبردًا',
    '6 h': '6 ساعات',
    '6 heures': '6 ساعات',
    '8 heures': '8 ساعات',
    '<12 h 2-8°C / <2 h TA': 'أقل من 12 ساعة (2-8°C) / أقل من ساعتين في درجة الغرفة',
    '<2 h TA': 'أقل من ساعتين في درجة الغرفة',
    '<24 h 2-8°C / <2 h TA': 'أقل من 24 ساعة (2-8°C) / أقل من ساعتين في درجة الغرفة',
    '<24 h à 2-8°C / <12 h TA / (<4 h TA si recherche formes végétatives)': 'أقل من 24 ساعة (2-8°C) / أقل من 12 ساعة في درجة الغرفة / (أقل من 4 ساعات عند البحث عن الأشكال الخضرية)',
    '<4 h TA': 'أقل من 4 ساعات في درجة الغرفة',
    '<4 h TA / <24 h 2-8°C': 'أقل من 4 ساعات في درجة الغرفة / أقل من 24 ساعة (2-8°C)',
    '<48 h TA': 'أقل من 48 ساعة في درجة الغرفة',
    '<6 semaines': 'أقل من 6 أسابيع',
    '<7 jours 2-8°C': 'أقل من 7 أيام (2-8°C)',
    '<72 h réfrigéré / <2 h TA': 'أقل من 72 ساعة مبردًا / أقل من ساعتين في درجة الغرفة',
    'Dès que possible / <12 h TA': 'في أقرب وقت ممكن / أقل من 12 ساعة في درجة الغرفة',
    'Dès que possible / <24h TA ou réfrigéré': 'في أقرب وقت ممكن / أقل من 24 ساعة في درجة الغرفة أو مبردًا',
    'Plusieurs jours': 'عدة أيام',
  };
  const tatTranslations: Record<string, string> = {
    '1 j': 'يوم واحد',
    '1 jour': 'يوم واحد',
    '1 jour (AVK) / 1 jour': 'يوم واحد (مضادات التخثر) / يوم واحد',
    '2 j': 'يومان',
    '2 jours': 'يومان',
    '28 jours': '28 يومًا',
    '3 h': '3 ساعات',
    '3 jours': '3 أيام',
    '4 h': '4 ساعات',
    '4 jours': '4 أيام',
    '5 jours': '5 أيام',
    '7 jours': '7 أيام',
  };
  const catalogue: CatalogueEntry[] = [
    { code: 'ACE_ANTIGENE_CARCINO_EMBRYONNAIRE', category: 'TUMOR_MARKERS', nameFr: 'ACE - Antigène Carcino-Embryonnaire', nameAr: 'ACE - المستضد السرطاني المضغي', synonymes: 'ACE', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'ACETONURIE', category: 'BIOCHEMISTRY', nameFr: 'Acétonurie', nameAr: 'أسيتون البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Colorimétrie manuelle', collectionConditionFr: 'Conserver réfrigéré', collectionConditionAr: 'يُحفظ مبردًا', preAnalyticDelay: '2 h TA / 1 jour (4°C)', turnaroundTime: '1 jour' },
    { code: 'ACIDE_URIQUE', category: 'BIOCHEMISTRY', nameFr: 'Acide urique', nameAr: 'حمض اليوريك', synonymes: 'Uricémie', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Colorimétrie enzymatique', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'ACIDE_URIQUE_URINAIRE', category: 'BIOCHEMISTRY', nameFr: 'Acide urique urinaire', nameAr: 'حمض اليوريك في البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Colorimétrie enzymatique', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'ACIDE_URIQUE_URINAIRE_DES_24_HEURES', category: 'BIOCHEMISTRY', nameFr: 'Acide urique urinaire des 24 heures', nameAr: 'حمض اليوريك في بول 24 ساعة', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines 24h', tubeAr: 'بول 24 ساعة', method: 'Colorimétrie enzymatique', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'ACIDE_VALPROIQUE', category: 'BIOCHEMISTRY', nameFr: 'Acide valproïque', nameAr: 'حمض الفالبرويك', synonymes: 'DEPAKINE / DEPAKOTE', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'ACTH_CORTICOTROPHINE', category: 'HORMONOLOGY', nameFr: 'ACTH - corticotrophine', nameAr: 'ACTH - الهرمون الموجه لقشر الكظر', synonymes: 'ACTH', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'PLASMA EDTA + APROTININE', tubeAr: 'بلازما EDTA + أبروتينين', method: null, collectionConditionFr: 'A prélever selon prescription; domicile déconseillé <2h TA', collectionConditionAr: 'يُسحب حسب الوصفة؛ السحب المنزلي غير مستحسن؛ أقل من ساعتين بحرارة الغرفة', preAnalyticDelay: '2 heures', turnaroundTime: '1 jour' },
    { code: 'ALAT', category: 'BIOCHEMISTRY', nameFr: 'ALAT', nameAr: 'ALAT', synonymes: 'Transaminases / SGPT', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'ALBUMINE_SERIQUE', category: 'BIOCHEMISTRY', nameFr: 'Albumine sérique', nameAr: 'ألبومين المصل', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'ALPHA_FOETOPROTEINE', category: 'TUMOR_MARKERS', nameFr: 'Alpha-foetoprotéine', nameAr: 'ألفا فيتو بروتين', synonymes: 'AFP', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '2 jours' },
    { code: 'ANTICORPS_ANTI_THYROGLOBULINE', category: 'IMMUNOLOGY', nameFr: 'Anticorps anti-thyroglobuline', nameAr: 'الأجسام المضادة للثيروغلوبولين', synonymes: 'ATHY, ATG', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'ANTICORPS_ANTI_THYROPEROXYDASE', category: 'IMMUNOLOGY', nameFr: 'Anticorps anti-thyroperoxydase', nameAr: 'الأجسام المضادة لثيروبيروكسيداز', synonymes: 'ATPO', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'ANTICORPS_ANTI_PEPTIDES_CYCLIQUES_CITRULLINES_CCP_', category: 'IMMUNOLOGY', nameFr: 'Anticorps anti-peptides cycliques citrullinés (CCP-2)', nameAr: 'الأجسام المضادة للببتيدات الحلقية السيترولينية (CCP-2)', synonymes: 'ACCP, ACPA', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'APO_A1', category: 'BIOCHEMISTRY', nameFr: 'Apo A1', nameAr: 'أبوليبوبروتين A1', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Immunoturbidimétrie', collectionConditionFr: 'A jeun', collectionConditionAr: 'صائم', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'APO_B', category: 'BIOCHEMISTRY', nameFr: 'Apo B', nameAr: 'أبوليبوبروتين B', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: 'A jeun', collectionConditionAr: 'صائم', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'ASAT', category: 'BIOCHEMISTRY', nameFr: 'ASAT', nameAr: 'ASAT', synonymes: 'Transaminases / SGOT', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'BETA_HCG_SERIQUE', category: 'HORMONOLOGY', nameFr: 'Béta-HCG sérique', nameAr: 'بيتا HCG في المصل', synonymes: 'BHCG, HCG', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: 'Sans ordonnance 18€', collectionConditionAr: 'من دون وصفة: 18 يورو', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'BILIRUBINE_CONJUGUEE', category: 'BIOCHEMISTRY', nameFr: 'Bilirubine conjuguée', nameAr: 'البيليروبين المباشر', synonymes: 'Directe', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '8 heures', turnaroundTime: '1 jour' },
    { code: 'BILIRUBINE_TOTALE', category: 'BIOCHEMISTRY', nameFr: 'Bilirubine totale', nameAr: 'البيليروبين الكلي', synonymes: 'Conjuguée + libre', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '8 heures', turnaroundTime: '1 jour' },
    { code: 'CA_125', category: 'TUMOR_MARKERS', nameFr: 'CA 125', nameAr: 'CA 125', synonymes: 'CA125', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '2 jours' },
    { code: 'CA_15_3', category: 'TUMOR_MARKERS', nameFr: 'CA 15.3', nameAr: 'CA 15.3', synonymes: 'CA153', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '2 jours' },
    { code: 'CA_19_9', category: 'TUMOR_MARKERS', nameFr: 'CA 19.9', nameAr: 'CA 19.9', synonymes: 'CA199', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '2 jours' },
    { code: 'CALCITONINE', category: 'HORMONOLOGY', nameFr: 'Calcitonine', nameAr: 'الكالسيتونين', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: null, collectionConditionFr: 'A jeun; à congeler dans les 4h', collectionConditionAr: 'صائم؛ يُجمّد خلال 4 ساعات', preAnalyticDelay: '4 heures', turnaroundTime: '3 jours' },
    { code: 'CALCIUM', category: 'BIOCHEMISTRY', nameFr: 'Calcium', nameAr: 'الكالسيوم', synonymes: 'Calcémie', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CALCIUM_CORRIGE', category: 'BIOCHEMISTRY', nameFr: 'Calcium corrigé', nameAr: 'الكالسيوم المصحح', synonymes: 'CACOR', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CALCIURIE', category: 'BIOCHEMISTRY', nameFr: 'Calciurie', nameAr: 'الكالسيوم في البول', synonymes: 'Calcium dans les urines', sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CALCIURIE_DES_24_HEURES', category: 'BIOCHEMISTRY', nameFr: 'Calciurie des 24 heures', nameAr: 'الكالسيوم في بول 24 ساعة', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines 24h', tubeAr: 'بول 24 ساعة', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CDT', category: 'BIOCHEMISTRY', nameFr: 'CDT', nameAr: 'CDT', synonymes: 'Transferrine carboxy déficiente', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Électrophorèse capillaire en veine liquide', collectionConditionFr: 'Non remboursé si bilan préfecture 33€', collectionConditionAr: 'غير مُعوَّض إذا كان لفحص المحافظة: 33 يورو', preAnalyticDelay: '1 jour', turnaroundTime: '3 jours' },
    { code: 'CHLORE', category: 'BIOCHEMISTRY', nameFr: 'Chlore', nameAr: 'الكلوريد', synonymes: 'Cl, iono', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Potentiométrie indirecte', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CHLORE_URINAIRE', category: 'BIOCHEMISTRY', nameFr: 'Chlore urinaire', nameAr: 'الكلوريد في البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Potentiométrie indirecte', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CHLORE_URINAIRE_DES_24_HEURES', category: 'BIOCHEMISTRY', nameFr: 'Chlore urinaire des 24 heures', nameAr: 'الكلوريد في بول 24 ساعة', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines 24h', tubeAr: 'بول 24 ساعة', method: 'Potentiométrie indirecte', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CHOLESTEROL_HDL', category: 'BIOCHEMISTRY', nameFr: 'Cholestérol HDL', nameAr: 'كوليسترول HDL', synonymes: 'HDL, EAL', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: 'A jeun', collectionConditionAr: 'صائم', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CHOLESTEROL_LDL', category: 'BIOCHEMISTRY', nameFr: 'Cholestérol LDL', nameAr: 'كوليسترول LDL', synonymes: 'LDL, EAL', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Calcul', collectionConditionFr: 'A jeun', collectionConditionAr: 'صائم', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CHOLESTEROL_TOTAL', category: 'BIOCHEMISTRY', nameFr: 'Cholestérol total', nameAr: 'الكوليسترول الكلي', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: 'A jeun', collectionConditionAr: 'صائم', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CLAIRANCE_CALCULEE_SELON_CKD_EPI', category: 'BIOCHEMISTRY', nameFr: 'Clairance calculée selon CKD-EPI', nameAr: 'التصفية المحسوبة حسب CKD-EPI', synonymes: null, sampleTypeFr: 'Sang / Urines', sampleTypeAr: 'دم / بول', tubeFr: 'Urines échantillon + T SEC', tubeAr: 'عينة بول + أنبوب جاف', method: 'Calcul', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CLOZAPINE', category: 'BIOCHEMISTRY', nameFr: 'Clozapine', nameAr: 'كلوزابين', synonymes: 'LEPONEX / NORCLOZAPINE', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC SANS GEL', tubeAr: 'أنبوب جاف بدون جل', method: null, collectionConditionFr: 'Prélèvement toujours à la même heure avant une nouvelle prise (fiche médicaments à renseigner)', collectionConditionAr: 'يُسحب دائمًا في نفس الوقت قبل الجرعة التالية (يجب تعبئة استمارة الأدوية)', preAnalyticDelay: '1 jour', turnaroundTime: '7 jours' },
    { code: 'COEFFICIENT_DE_SATURATION_DE_LA_TRANSFERRINE', category: 'BIOCHEMISTRY', nameFr: 'Coefficient de saturation de la transferrine', nameAr: 'معامل تشبع الترانسفيرين', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Calcul', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'COMPTE_DADDIS_HLM', category: 'HEMATOLOGY', nameFr: 'Compte d’Addis (HLM)', nameAr: 'عدّ أديس (HLM)', synonymes: 'HLM', sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines 3h', tubeAr: 'بول 3 ساعات', method: null, collectionConditionFr: 'Voir onglet spécifique', collectionConditionAr: 'انظر القسم المخصص', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'COPROCULTURE', category: 'MICROBIOLOGY', nameFr: 'Coproculture', nameAr: 'زرع البراز', synonymes: null, sampleTypeFr: 'Selles', sampleTypeAr: 'براز', tubeFr: 'SELLES', tubeAr: 'وعاء براز', method: 'PCR + bactériologie', collectionConditionFr: 'RC +++ voyage à l\'étranger, fièvre, diarrhées, prise récente d\'antibiotiques', collectionConditionAr: 'معلومات سريرية مهمة جدًا: سفر للخارج، حمى، إسهال، تناول حديث لمضادات حيوية', preAnalyticDelay: '24 h TA / <5 jours réfrigéré', turnaroundTime: '2 j' },
    { code: 'CORTISOL', category: 'HORMONOLOGY', nameFr: 'Cortisol', nameAr: 'كورتيزول', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence', collectionConditionFr: 'A prélever selon prescription', collectionConditionAr: 'يُسحب حسب الوصفة', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'COTININE', category: 'BIOCHEMISTRY', nameFr: 'Cotinine', nameAr: 'كوتينين', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'I', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '2 j' },
    { code: 'CPK', category: 'BIOCHEMISTRY', nameFr: 'CPK', nameAr: 'CPK', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CREATININE', category: 'BIOCHEMISTRY', nameFr: 'Créatinine', nameAr: 'كرياتينين', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CREATININURIE', category: 'BIOCHEMISTRY', nameFr: 'Créatininurie', nameAr: 'الكرياتينين في البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CREATININURIE_DES_24_HEURES', category: 'BIOCHEMISTRY', nameFr: 'Créatininurie des 24 heures', nameAr: 'الكرياتينين في بول 24 ساعة', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines 24h', tubeAr: 'بول 24 ساعة', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CROSS_LAPS', category: 'BIOCHEMISTRY', nameFr: 'CROSS-LAPS', nameAr: 'CROSS-LAPS', synonymes: 'CTX', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: null, collectionConditionFr: 'A jeun avant 9h si possible', collectionConditionAr: 'صائم قبل الساعة 9 صباحًا إن أمكن', preAnalyticDelay: '8 heures', turnaroundTime: null },
    { code: 'CRP', category: 'BIOCHEMISTRY', nameFr: 'CRP', nameAr: 'CRP', synonymes: 'Protéine C réactive', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Immunoturbidimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'CUIVRE', category: 'BIOCHEMISTRY', nameFr: 'Cuivre', nameAr: 'النحاس', synonymes: 'Cu, cupracémie', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC SANS GEL', tubeAr: 'أنبوب جاف بدون جل', method: null, collectionConditionFr: 'Tube sec sans gel', collectionConditionAr: 'أنبوب جاف بدون جل', preAnalyticDelay: '4 heures', turnaroundTime: null },
    { code: 'CYTOLOGIE_URINAIRE', category: 'HEMATOLOGY', nameFr: 'Cytologie urinaire', nameAr: 'الخلويات البولية', synonymes: 'culot urinaire', sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Cytologie', collectionConditionFr: 'Voir onglet spécifique', collectionConditionAr: 'انظر القسم المخصص', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'D_DIMERES', category: 'HEMOSTASIS', nameFr: 'D-DIMÈRES', nameAr: 'D-دايمر', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'CITRATE', tubeAr: 'سيترات', method: 'Chronométrie', collectionConditionFr: 'Examen urgent', collectionConditionAr: 'فحص مستعجل', preAnalyticDelay: '8 heures', turnaroundTime: '4 h' },
    { code: 'DENSITE_URINAIRE', category: 'BIOCHEMISTRY', nameFr: 'Densité urinaire', nameAr: 'الكثافة البولية', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '2 h AMB / 1 jour (4°C)', turnaroundTime: '1 jour' },
    { code: 'DEPISTAGE_DE_DROGUES_URINAIRES', category: 'BIOCHEMISTRY', nameFr: 'Dépistage de drogues urinaires', nameAr: 'تحري المخدرات في البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Colorimétrie', collectionConditionFr: 'Bilan préfecture déconseillé hors labo et non remboursé', collectionConditionAr: 'فحص المحافظة غير مستحسن خارج المختبر وغير مُعوَّض', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'DEPISTAGE_URINAIRE_DU_CANNABIS_THC', category: 'BIOCHEMISTRY', nameFr: 'Dépistage urinaire du Cannabis (THC)', nameAr: 'تحري القنب (THC) في البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Colorimétrie', collectionConditionFr: 'Bilan préfecture déconseillé hors labo et non remboursé', collectionConditionAr: 'فحص المحافظة غير مستحسن خارج المختبر وغير مُعوَّض', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'DISPOSITIF_INTRA_VASCULAIRE', category: 'MICROBIOLOGY', nameFr: 'Dispositif intra vasculaire', nameAr: 'جهاز داخل وعائي', synonymes: 'Cathéter, KT', sampleTypeFr: 'Divers', sampleTypeAr: 'متنوع', tubeFr: 'Flacon stérile', tubeAr: 'قارورة معقمة', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '<4 h TA / <24 h 2-8°C', turnaroundTime: '5 jours' },
    { code: 'ECBU_SUR_BORATE', category: 'MICROBIOLOGY', nameFr: 'ECBU sur borate', nameAr: 'فحص بول جرثومي خلوي على بورات', synonymes: 'Examen cytobactériologique des urines', sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urine échantillon (borate)', tubeAr: 'عينة بول (بورات)', method: null, collectionConditionFr: 'Toilette locale; milieu de jet; RC +++', collectionConditionAr: 'تنظيف موضعي؛ عينة من منتصف التبول؛ معلومات سريرية مهمة جدًا', preAnalyticDelay: '<48 h TA', turnaroundTime: '2 jours' },
    { code: 'ECBU_SANS_BORATE', category: 'MICROBIOLOGY', nameFr: 'ECBU sans borate', nameAr: 'فحص بول جرثومي خلوي بدون بورات', synonymes: 'Examen cytobactériologique des urines', sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: null, collectionConditionFr: 'Toilette locale; milieu de jet; RC +++', collectionConditionAr: 'تنظيف موضعي؛ عينة من منتصف التبول؛ معلومات سريرية مهمة جدًا', preAnalyticDelay: '<12 h 2-8°C / <2 h TA', turnaroundTime: '2 jours' },
    { code: 'ELECTROPHORESE_DES_PROTEINES_SERIQUES', category: 'BIOCHEMISTRY', nameFr: 'Électrophorèse des protéines sériques', nameAr: 'الرحلان الكهربائي لبروتينات المصل', synonymes: 'ELPR, EDP, EPR, EPS', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Électrophorèse capillaire en veine liquide', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '2 jours' },
    { code: 'ESTRADIOL', category: 'HORMONOLOGY', nameFr: 'Estradiol', nameAr: 'إستراديول', synonymes: 'ostradiol', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'EXPECTORATION', category: 'MICROBIOLOGY', nameFr: 'Expectoration', nameAr: 'بلغم', synonymes: 'ECBC', sampleTypeFr: 'Crachat', sampleTypeAr: 'قشع', tubeFr: 'Flacon stérile', tubeAr: 'قارورة معقمة', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '<4 h TA / <24 h 2-8°C', turnaroundTime: '5 jours' },
    { code: 'FER_SERIQUE', category: 'BIOCHEMISTRY', nameFr: 'Fer sérique', nameAr: 'حديد المصل', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'FERRITINE', category: 'BIOCHEMISTRY', nameFr: 'Ferritine', nameAr: 'فيريتين', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'FIBRINOGENE', category: 'HEMOSTASIS', nameFr: 'Fibrinogène', nameAr: 'فيبرينوجين', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'CITRATE', tubeAr: 'سيترات', method: 'Chronométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'FOLATES_SERIQUES_B9', category: 'BIOCHEMISTRY', nameFr: 'Folates sériques - B9', nameAr: 'فولات المصل - B9', synonymes: 'Vitamine B9', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: 'Éviter l\'hémolyse, à l\'abri de la lumière', collectionConditionAr: 'تجنب الانحلال الدموي ويُحفظ بعيدًا عن الضوء', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'FORMULE_SANGUINE', category: 'HEMATOLOGY', nameFr: 'Formule sanguine', nameAr: 'الصيغة الدموية', synonymes: 'NFS', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: 'Cytométrie de flux - Impédance', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '8 heures', turnaroundTime: '1 jour' },
    { code: 'FSH', category: 'HORMONOLOGY', nameFr: 'FSH', nameAr: 'FSH', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'GAMMA_G_T', category: 'BIOCHEMISTRY', nameFr: 'Gamma G.T.', nameAr: 'جاما GT', synonymes: 'GGT', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: 'Déconseillé hors labo si commission permis de conduire (identité)', collectionConditionAr: 'غير مستحسن خارج المختبر إذا كان لفحص رخصة القيادة (الهوية)', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'GLYCEMIE_SERIQUE_A_JEUN', category: 'BIOCHEMISTRY', nameFr: 'Glycémie sérique à jeun', nameAr: 'سكر الدم صائمًا', synonymes: 'GAJ', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'FLUORÉ', tubeAr: 'أنبوب فلورايد', method: 'Spectrophotométrie', collectionConditionFr: 'A jeun', collectionConditionAr: 'صائم', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'GLYCOSURIE', category: 'BIOCHEMISTRY', nameFr: 'Glycosurie', nameAr: 'سكر البول', synonymes: 'Sucre', sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Spectrophotométrie', collectionConditionFr: '1re urine du matin; à jeun', collectionConditionAr: 'أول بول صباحي؛ صائم', preAnalyticDelay: '2 heures', turnaroundTime: '1 jour' },
    { code: 'GROUPE_SANGUIN', category: 'HEMATOLOGY', nameFr: 'Groupe sanguin', nameAr: 'فصيلة الدم', synonymes: 'GS', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: 'Méthode immunologique d\'hémagglutination', collectionConditionFr: 'Nom de naissance impératif; 2 déterminations = 2 gestes', collectionConditionAr: 'اسم الولادة إلزامي؛ تحديدان = سحبان منفصلان', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'HAPTOGLOBINE', category: 'BIOCHEMISTRY', nameFr: 'Haptoglobine', nameAr: 'هابتوغلوبين', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Immunoturbidimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'HEMOCULTURE', category: 'MICROBIOLOGY', nameFr: 'Hémoculture', nameAr: 'زرع الدم', synonymes: 'Hemoc', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: '2 flacons', tubeAr: 'قارورتان', method: null, collectionConditionFr: 'RC++; protocole spécifique; dès que possible; <12 h TA', collectionConditionAr: 'معلومات سريرية مهمة؛ بروتوكول خاص؛ بأسرع ما يمكن؛ أقل من 12 ساعة بحرارة الغرفة', preAnalyticDelay: 'Dès que possible / <12 h TA', turnaroundTime: null },
    { code: 'HEMOGLOBINE_GLYQUEE', category: 'BIOCHEMISTRY', nameFr: 'Hémoglobine glyquée', nameAr: 'الهيموغلوبين السكري', synonymes: 'A1c, Hba1c', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'HEPATITE_A_IGG', category: 'SEROLOGY', nameFr: 'Hépatite A - IgG', nameAr: 'التهاب الكبد A - IgG', synonymes: 'VHA', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '3 jours' },
    { code: 'HEPATITE_A_IGM', category: 'SEROLOGY', nameFr: 'Hépatite A - IgM', nameAr: 'التهاب الكبد A - IgM', synonymes: 'VHA', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '3 jours' },
    { code: 'HEPATITE_B_ANTICORPS_ANTI_HBC', category: 'SEROLOGY', nameFr: 'Hépatite B - anticorps anti-HBc', nameAr: 'التهاب الكبد B - أضداد Anti-HBc', synonymes: 'Hépatite B, IST', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: 'Dépistage IST sans avance de frais au labo si moins de 26 ans', collectionConditionAr: 'تحري الأمراض المنقولة جنسيًا بدون دفع مسبق بالمختبر إذا كان العمر أقل من 26 سنة', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'HEPATITE_B_ANTICORPS_ANTI_HBS', category: 'SEROLOGY', nameFr: 'Hépatite B - anticorps anti-HBs', nameAr: 'التهاب الكبد B - أضداد Anti-HBs', synonymes: 'Hépatite B, IST', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: 'Dépistage IST sans avance de frais au labo si moins de 26 ans', collectionConditionAr: 'تحري الأمراض المنقولة جنسيًا بدون دفع مسبق بالمختبر إذا كان العمر أقل من 26 سنة', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'HEPATITE_B_ANTIGENE_HBS', category: 'SEROLOGY', nameFr: 'Hépatite B - antigène HBs', nameAr: 'التهاب الكبد B - المستضد HBs', synonymes: 'Hépatite B, IST', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: 'Dépistage IST sans avance de frais au labo si moins de 26 ans', collectionConditionAr: 'تحري الأمراض المنقولة جنسيًا بدون دفع مسبق بالمختبر إذا كان العمر أقل من 26 سنة', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'HEPATITE_C_DEPISTAGE', category: 'SEROLOGY', nameFr: 'Hépatite C - dépistage', nameAr: 'التهاب الكبد C - تحري', synonymes: 'VHC', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'HIV', category: 'SEROLOGY', nameFr: 'HIV', nameAr: 'فيروس HIV', synonymes: 'VIH', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'HLA_B27', category: 'IMMUNOLOGY', nameFr: 'HLA B27', nameAr: 'HLA B27', synonymes: 'TYPAGE HLA B27 ANTIGENE HLAB27', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: null, collectionConditionFr: 'Attestation consentement obligatoire (du lundi au jeudi matin)', collectionConditionAr: 'إثبات موافقة إلزامي (من الاثنين إلى صباح الخميس)', preAnalyticDelay: '1 jour', turnaroundTime: '4 jours' },
    { code: 'HPV_PAPILLOMAVIRUS_HUMAIN_DETECTION_QUALITATIVE', category: 'MICROBIOLOGY', nameFr: 'HPV Papillomavirus humain - détection qualitative', nameAr: 'فيروس الورم الحليمي البشري - كشف نوعي', synonymes: 'HPV, IST', sampleTypeFr: 'Muqueuse', sampleTypeAr: 'مخاطية', tubeFr: 'Écouvillon avec milieu de transport', tubeAr: 'مسحة مع وسط نقل', method: 'PCR', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '<6 semaines', turnaroundTime: '2 jours' },
    { code: 'HYPERGLYCEMIE_PROVOQUEE_PAR_VOIE_ORALE_HGPO', category: 'BIOCHEMISTRY', nameFr: 'Hyperglycémie provoquée par voie orale - HGPO', nameAr: 'اختبار تحمل الغلوكوز الفموي - HGPO', synonymes: 'HGPO', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'FLUORÉ', tubeAr: 'أنبوب فلورايد', method: 'Spectrophotométrie', collectionConditionFr: 'Protocole hyperglycémie: grossesse (3 prélèvements T0, 1h, 2h); hors grossesse (2 prélèvements T0, 2h)', collectionConditionAr: 'بروتوكول فرط سكر الدم: في الحمل 3 سحبات (T0 و1س و2س)، وخارج الحمل سحبتان (T0 و2س)', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'IMMUNOFIXATION', category: 'IMMUNOLOGY', nameFr: 'Immunofixation', nameAr: 'التثبيت المناعي', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Électrophorèse capillaire en veine liquide', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '2 jours' },
    { code: 'IMMUNOGLOBULINES_A', category: 'IMMUNOLOGY', nameFr: 'Immunoglobulines A', nameAr: 'الغلوبولينات المناعية A', synonymes: 'IGA', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Immunoturbidimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 j' },
    { code: 'IMMUNOGLOBULINES_E', category: 'ALLERGOLOGY', nameFr: 'Immunoglobulines E', nameAr: 'الغلوبولينات المناعية E', synonymes: 'IGE', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Immunoturbidimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '3 jours' },
    { code: 'IMMUNOGLOBULINES_G', category: 'IMMUNOLOGY', nameFr: 'Immunoglobulines G', nameAr: 'الغلوبولينات المناعية G', synonymes: 'IGG', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Immunoturbidimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 j' },
    { code: 'IMMUNOGLOBULINES_M', category: 'IMMUNOLOGY', nameFr: 'Immunoglobulines M', nameAr: 'الغلوبولينات المناعية M', synonymes: 'IGM', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Immunoturbidimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 j' },
    { code: 'IMMUNOPHENOTYPAGE_CD19_CD20', category: 'IMMUNOLOGY', nameFr: 'Immunophénotypage CD19 CD20', nameAr: 'التنميط المناعي CD19 CD20', synonymes: 'CD19CD20', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: null, collectionConditionFr: 'Du lundi au vendredi matin', collectionConditionAr: 'من الاثنين إلى صباح الجمعة', preAnalyticDelay: '1 jour', turnaroundTime: '2 jours' },
    { code: 'IMMUNOPHENOTYPAGE_CD3_CD4', category: 'IMMUNOLOGY', nameFr: 'Immunophénotypage CD3 CD4', nameAr: 'التنميط المناعي CD3 CD4', synonymes: 'CD4CD8', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: null, collectionConditionFr: 'Du lundi au vendredi matin', collectionConditionAr: 'من الاثنين إلى صباح الجمعة', preAnalyticDelay: '1 jour', turnaroundTime: '2 jours' },
    { code: 'IMMUNOPHENOTYPAGE_LYMPHOCYTAIRE', category: 'IMMUNOLOGY', nameFr: 'Immunophénotypage lymphocytaire', nameAr: 'التنميط المناعي اللمفاوي', synonymes: 'IPHEN', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: null, collectionConditionFr: 'Du lundi au vendredi matin', collectionConditionAr: 'من الاثنين إلى صباح الجمعة', preAnalyticDelay: '1 jour', turnaroundTime: '2 jours' },
    { code: 'IST_CHLAM_GONO_M_GENITALIUM_DANS_LES_URINES', category: 'MICROBIOLOGY', nameFr: 'IST : Chlam./Gono./M.génitalium dans les urines', nameAr: 'الأمراض المنقولة جنسيًا: كلاميديا/غونو/ميكوبلازما تناسلية في البول', synonymes: 'IST', sampleTypeFr: 'Urines', sampleTypeAr: 'بول', tubeFr: 'URINESECH', tubeAr: 'عينة بول جافة', method: 'PCR', collectionConditionFr: 'Dépistage IST sans avance de frais au labo si moins de 26 ans', collectionConditionAr: 'تحري الأمراض المنقولة جنسيًا بدون دفع مسبق بالمختبر إذا كان العمر أقل من 26 سنة', preAnalyticDelay: '<7 jours 2-8°C', turnaroundTime: '2 jours' },
    { code: 'IST_CHLAM_GONO_M_GENITALIUM_PV_PRELEVEMENT_URETRAL', category: 'MICROBIOLOGY', nameFr: 'IST : Chlam./Gono./M.génitalium (PV, prélèvement urétral...)', nameAr: 'الأمراض المنقولة جنسيًا: كلاميديا/غونو/ميكوبلازما تناسلية (مسحة مهبلية أو إحليلية...)', synonymes: 'IST', sampleTypeFr: 'PV / PU', sampleTypeAr: 'مهبلي / إحليلي', tubeFr: 'Écouvillon avec milieu de transport', tubeAr: 'مسحة مع وسط نقل', method: 'PCR', collectionConditionFr: 'Dépistage IST sans avance de frais au labo si moins de 26 ans', collectionConditionAr: 'تحري الأمراض المنقولة جنسيًا بدون دفع مسبق بالمختبر إذا كان العمر أقل من 26 سنة', preAnalyticDelay: '<7 jours 2-8°C', turnaroundTime: '2 jours' },
    { code: 'LDH', category: 'BIOCHEMISTRY', nameFr: 'LDH', nameAr: 'LDH', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '2 heures', turnaroundTime: '1 jour' },
    { code: 'LH', category: 'HORMONOLOGY', nameFr: 'LH', nameAr: 'LH', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'LIPASE', category: 'BIOCHEMISTRY', nameFr: 'Lipase', nameAr: 'ليباز', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'LIQUIDE_DE_PONCTION', category: 'BIOCHEMISTRY', nameFr: 'Liquide de ponction', nameAr: 'سائل بزل', synonymes: 'liquide articulaire, ascite, pleural', sampleTypeFr: 'Liquide de ponction', sampleTypeAr: 'سائل بزل', tubeFr: 'Flacon stérile + 1 EDTA', tubeAr: 'قارورة معقمة + EDTA', method: null, collectionConditionFr: 'Prélever 1 tube EDTA ou héparine en complément', collectionConditionAr: 'يؤخذ أنبوب EDTA أو هيبارين إضافي', preAnalyticDelay: 'Dès que possible / <24h TA ou réfrigéré', turnaroundTime: '5 jours' },
    { code: 'LITHIUM', category: 'BIOCHEMISTRY', nameFr: 'Lithium', nameAr: 'ليثيوم', synonymes: 'Théralité', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: null, collectionConditionFr: 'Le matin 12h après la prise et avant toute nouvelle prise (fiche médicaments à renseigner)', collectionConditionAr: 'صباحًا بعد 12 ساعة من الجرعة وقبل أي جرعة جديدة (يجب تعبئة استمارة الأدوية)', preAnalyticDelay: '1 jour', turnaroundTime: '2 jours' },
    { code: 'LITHIUM_ERYTHROCYTAIRE', category: 'BIOCHEMISTRY', nameFr: 'Lithium érythrocytaire', nameAr: 'ليثيوم داخل الكريات الحمراء', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: null, collectionConditionFr: 'Le matin 12h après la prise et avant toute nouvelle prise (fiche médicaments à renseigner)', collectionConditionAr: 'صباحًا بعد 12 ساعة من الجرعة وقبل أي جرعة جديدة (يجب تعبئة استمارة الأدوية)', preAnalyticDelay: '1 jour', turnaroundTime: '4 jours' },
    { code: 'MAGNESIUM', category: 'BIOCHEMISTRY', nameFr: 'Magnésium', nameAr: 'مغنيسيوم', synonymes: 'Mg', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'MAGNESIUM_URINAIRE', category: 'BIOCHEMISTRY', nameFr: 'Magnésium urinaire', nameAr: 'المغنيسيوم في البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'MAGNESIUM_URINAIRE_DES_24H', category: 'BIOCHEMISTRY', nameFr: 'Magnésium urinaire des 24h', nameAr: 'المغنيسيوم في بول 24 ساعة', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines 24h', tubeAr: 'بول 24 ساعة', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'MICROALBUMINURIE', category: 'BIOCHEMISTRY', nameFr: 'Microalbuminurie', nameAr: 'الميكروألبومين في البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Immunoturbidimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'MICROALBUMINURIE_24H', category: 'BIOCHEMISTRY', nameFr: 'Microalbuminurie (24h)', nameAr: 'الميكروألبومين في بول 24 ساعة', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines 24h', tubeAr: 'بول 24 ساعة', method: 'Immunoturbidimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'NITRITES_URINAIRES', category: 'BIOCHEMISTRY', nameFr: 'Nitrites urinaires', nameAr: 'نتريت البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '2 h AMB / 1 jour (4°C)', turnaroundTime: '1 jour' },
    { code: 'NT_PROBNP', category: 'BIOCHEMISTRY', nameFr: 'NT-proBNP', nameAr: 'NT-proBNP', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'NUMERATION_SANGUINE', category: 'HEMATOLOGY', nameFr: 'Numération sanguine', nameAr: 'تعداد دم', synonymes: 'NFS', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: 'Cytométrie de flux - Impédance', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '8 heures', turnaroundTime: '1 jour' },
    { code: 'IMMUNOGLOBULINES_E_IGE_TOTALES', category: 'ALLERGOLOGY', nameFr: 'Immunoglobulines E - IGE totales', nameAr: 'الغلوبولينات المناعية E الكلية', synonymes: 'IGE', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Immunoturbidimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '3 jours' },
    { code: 'PALUDISME', category: 'MICROBIOLOGY', nameFr: 'Paludisme', nameAr: 'الملاريا', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: 'Méthode manuelle qualitative et quantitative par examen microscopique de frottis colorés au MGG', collectionConditionFr: 'Prélèvement urgent – renseignements cliniques +++', collectionConditionAr: 'سحب مستعجل – معلومات سريرية مهمة جدًا', preAnalyticDelay: '1 jour', turnaroundTime: '4 h' },
    { code: 'PARASITOLOGIE_DES_SELLES', category: 'MICROBIOLOGY', nameFr: 'Parasitologie des selles', nameAr: 'طفيليات البراز', synonymes: 'PARA', sampleTypeFr: 'Selles', sampleTypeAr: 'براز', tubeFr: 'SELLES', tubeAr: 'وعاء براز', method: null, collectionConditionFr: 'Renseignements cliniques +++', collectionConditionAr: 'معلومات سريرية مهمة جدًا', preAnalyticDelay: '<24 h à 2-8°C / <12 h TA / (<4 h TA si recherche formes végétatives)', turnaroundTime: '3 jours' },
    { code: 'PARATHORMONE', category: 'HORMONOLOGY', nameFr: 'Parathormone', nameAr: 'هرمون جار الدرق', synonymes: 'PTH', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '6 heures', turnaroundTime: '1 jour' },
    { code: 'PH_URINAIRE', category: 'BIOCHEMISTRY', nameFr: 'pH urinaire', nameAr: 'درجة حموضة البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '2 h AMB / 1 jour (4°C)', turnaroundTime: '1 jour' },
    { code: 'PHOSPHATASE_ALCALINE', category: 'BIOCHEMISTRY', nameFr: 'Phosphatase alcaline', nameAr: 'الفوسفاتاز القلوية', synonymes: 'PAL', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PHOSPHATE_URINAIRE', category: 'BIOCHEMISTRY', nameFr: 'Phosphate urinaire', nameAr: 'الفوسفات في البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PHOSPHATE_URINAIRE_24H', category: 'BIOCHEMISTRY', nameFr: 'Phosphate urinaire 24h', nameAr: 'الفوسفات في بول 24 ساعة', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines 24h', tubeAr: 'بول 24 ساعة', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PHOSPHOREMIE', category: 'BIOCHEMISTRY', nameFr: 'Phosphorémie', nameAr: 'فوسفور الدم', synonymes: 'P', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '4 heures', turnaroundTime: '1 jour' },
    { code: 'PLAQUETTES', category: 'HEMATOLOGY', nameFr: 'Plaquettes', nameAr: 'الصفائح الدموية', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: 'Impédance', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PLAQUETTES_AGREGATS_CITRATE', category: 'HEMOSTASIS', nameFr: 'Plaquettes - agrégats (citrate)', nameAr: 'الصفائح - تكتلات (سيترات)', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'CITRATE', tubeAr: 'سيترات', method: 'Impédance', collectionConditionFr: 'À réaliser au laboratoire', collectionConditionAr: 'يُجرى في المختبر', preAnalyticDelay: '2 heures', turnaroundTime: '1 jour' },
    { code: 'PLAQUETTES_AGREGATS_S_MONOVETTE', category: 'HEMOSTASIS', nameFr: 'Plaquettes - agrégats (S-MONOVETTE)', nameAr: 'الصفائح - تكتلات (S-MONOVETTE)', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'S-MONOVETTE', tubeAr: 'S-MONOVETTE', method: 'Impédance - Automate SYSMEX XN', collectionConditionFr: 'Si contrôle demandé : EDTA + Monov', collectionConditionAr: 'عند طلب إعادة التحقق: EDTA + Monov', preAnalyticDelay: '8 heures', turnaroundTime: '1 jour' },
    { code: 'POTASSIUM', category: 'BIOCHEMISTRY', nameFr: 'Potassium', nameAr: 'بوتاسيوم', synonymes: 'K, iono', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Potentiométrie indirecte', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '6 heures', turnaroundTime: '1 jour' },
    { code: 'POTASSIUM_URINAIRE', category: 'BIOCHEMISTRY', nameFr: 'Potassium urinaire', nameAr: 'البوتاسيوم في البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Potentiométrie indirecte', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'POTASSIUM_URINAIRE_DES_24_HEURES', category: 'BIOCHEMISTRY', nameFr: 'Potassium urinaire des 24 heures', nameAr: 'البوتاسيوم في بول 24 ساعة', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines 24h', tubeAr: 'بول 24 ساعة', method: 'Potentiométrie indirecte', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PREALBUMINE', category: 'BIOCHEMISTRY', nameFr: 'Préalbumine', nameAr: 'بري ألبومين', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Immunoturbidimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PRELEVEMENTS_MYCOLOGIQUES_DERMATOPHYTES_LEVURES', category: 'MICROBIOLOGY', nameFr: 'Prélèvements mycologiques (dermatophytes, levures)', nameAr: 'عينات فطرية (فطور جلدية وخمائر)', synonymes: 'Myco / squames / cheveux / ongles', sampleTypeFr: null, sampleTypeAr: null, tubeFr: 'Flacon stérile', tubeAr: 'قارورة معقمة', method: null, collectionConditionFr: 'Arrêt crème 15 jours; vernis/solution filmogène 3 mois; antifongique oral 3 mois (sauf urgence ou contexte particulier)', collectionConditionAr: 'إيقاف الكريم 15 يومًا؛ الورنيش/المحلول الغشائي 3 أشهر؛ مضاد الفطريات الفموي 3 أشهر (إلا في الطوارئ أو ظروف خاصة)', preAnalyticDelay: 'Plusieurs jours', turnaroundTime: '28 jours' },
    { code: 'PROCALCITONINE', category: 'BIOCHEMISTRY', nameFr: 'Procalcitonine', nameAr: 'بروكالسيتونين', synonymes: 'PCT', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PROGESTERONE', category: 'HORMONOLOGY', nameFr: 'Progestérone', nameAr: 'بروجستيرون', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PROLACTINE', category: 'HORMONOLOGY', nameFr: 'Prolactine', nameAr: 'برولاكتين', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: 'À jeun, à 8h, 20 min de repos', collectionConditionAr: 'صائم، الساعة 8 صباحًا، مع 20 دقيقة راحة', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PROTEINES', category: 'BIOCHEMISTRY', nameFr: 'Protéines', nameAr: 'البروتينات', synonymes: 'Protides totaux', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PROTEINURIE', category: 'BIOCHEMISTRY', nameFr: 'Protéinurie', nameAr: 'البروتين في البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PROTEINURIE_DES_24H', category: 'BIOCHEMISTRY', nameFr: 'Protéinurie des 24h', nameAr: 'البروتين في بول 24 ساعة', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines 24h', tubeAr: 'بول 24 ساعة', method: 'Colorimétrie', collectionConditionFr: 'Voir onglet spécifique', collectionConditionAr: 'انظر القسم المخصص', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PSA_LIBRE', category: 'TUMOR_MARKERS', nameFr: 'PSA libre', nameAr: 'PSA الحر', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PSA_TOTAL', category: 'TUMOR_MARKERS', nameFr: 'PSA total', nameAr: 'PSA الكلي', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'PUS_PROFOND', category: 'MICROBIOLOGY', nameFr: 'Pus profond', nameAr: 'قيح عميق', synonymes: 'Examen cytobactériologique d\'un pus profond', sampleTypeFr: 'Liquide', sampleTypeAr: 'سائل', tubeFr: 'Flacon stérile', tubeAr: 'قارورة معقمة', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '<24 h 2-8°C / <2 h TA', turnaroundTime: '5 jours' },
    { code: 'PUS_SUPERFICIEL_DORIGINE_CUTANEE_OU_MUQUEUSE', category: 'MICROBIOLOGY', nameFr: 'Pus superficiel d’origine cutanée ou muqueuse', nameAr: 'قيح سطحي جلدي أو مخاطي', synonymes: 'strepto B, plaie, pus superficiel, ORL, oculaire...', sampleTypeFr: 'Cutané-muqueuse', sampleTypeAr: 'جلدي-مخاطي', tubeFr: 'Écouvillon avec milieu de transport', tubeAr: 'مسحة مع وسط نقل', method: null, collectionConditionFr: 'Délai recommandé après arrêt d\'antibiotiques: au moins 3 jours (sauf urgence ou contexte particulier)', collectionConditionAr: 'الفاصل الموصى به بعد إيقاف المضاد الحيوي: 3 أيام على الأقل (إلا في الطوارئ أو ظروف خاصة)', preAnalyticDelay: '24 heures TA', turnaroundTime: '5 jours' },
    { code: 'PV_PU', category: 'MICROBIOLOGY', nameFr: 'PV / PU', nameAr: 'مسحة مهبلية / إحليلية', synonymes: 'Examen cytobactériologique prélèvement vaginal/urétral', sampleTypeFr: 'Muqueuse', sampleTypeAr: 'مخاطية', tubeFr: 'Écouvillon avec milieu de transport', tubeAr: 'مسحة مع وسط نقل', method: null, collectionConditionFr: 'Ovule: arrêt 1 semaine; crème/gel local: 48 h; antibiotiques pour germes banals: 1 semaine; contrôle IST: délai 5 semaines', collectionConditionAr: 'التحاميل: إيقاف أسبوع؛ الكريم/الجل الموضعي: 48 ساعة؛ المضادات الحيوية للجراثيم الشائعة: أسبوع؛ إعادة فحص IST بعد 5 أسابيع', preAnalyticDelay: '24 heures', turnaroundTime: '5 jours' },
    { code: 'RECHERCHE_AGGLUTININES_IRREGULIERES', category: 'HEMATOLOGY', nameFr: 'Recherche agglutinines irrégulières', nameAr: 'البحث عن الأجسام المضادة غير المنتظمة', synonymes: 'RAI', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: 'Méthode immunologique d\'hémagglutination', collectionConditionFr: 'Renseignements cliniques: transfusion, injection d\'AntiD; nom de naissance impératif', collectionConditionAr: 'معلومات سريرية: نقل دم أو حقن AntiD؛ اسم الولادة إلزامي', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'RECHERCHE_DE_CLOSTRIDIUM_DIFFICILE_GDH_TOXINES_A_E', category: 'MICROBIOLOGY', nameFr: 'Recherche de Clostridium difficile (GDH + toxines A et B)', nameAr: 'البحث عن المطثية العسيرة (GDH + الذيفانان A وB)', synonymes: 'CLODIFF', sampleTypeFr: 'Selles', sampleTypeAr: 'براز', tubeFr: 'SELLES', tubeAr: 'وعاء براز', method: null, collectionConditionFr: 'RC+++ prise récente d\'antibiotiques', collectionConditionAr: 'معلومات سريرية مهمة جدًا: تناول حديث لمضادات حيوية', preAnalyticDelay: '<72 h réfrigéré / <2 h TA', turnaroundTime: '2 jours' },
    { code: 'RECHERCHE_DE_SCHIZOCYTES', category: 'HEMATOLOGY', nameFr: 'Recherche de schizocytes', nameAr: 'البحث عن الشظايا الكرية', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'RECHERCHE_DE_VIRUS_PAR_PCR_DANS_LES_SELLES', category: 'MICROBIOLOGY', nameFr: 'Recherche de virus par PCR dans les selles', nameAr: 'البحث عن الفيروسات في البراز بواسطة PCR', synonymes: 'Rotavirus, Adénovirus, viro des selles', sampleTypeFr: 'Selles', sampleTypeAr: 'براز', tubeFr: 'SELLES', tubeAr: 'وعاء براز', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '48 h TA / <5 jours réfrigéré', turnaroundTime: '2 jours' },
    { code: 'RESERVE_ALCALINE', category: 'BIOCHEMISTRY', nameFr: 'Réserve alcaline', nameAr: 'الاحتياطي القلوي', synonymes: 'CO2 - Bicarbonates', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '4 heures', turnaroundTime: '1 jour' },
    { code: 'RETICULOCYTES', category: 'HEMATOLOGY', nameFr: 'Réticulocytes', nameAr: 'الخلايا الشبكية', synonymes: 'RETIC, RET', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: 'Cytométrie de flux - Impédance', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'SCORE_DE_FIBROSE_HEPATIQUE_FIB_4', category: 'BIOCHEMISTRY', nameFr: 'Score de fibrose hépatique (FIB-4)', nameAr: 'مؤشر تليف الكبد (FIB-4)', synonymes: 'FIB-4', sampleTypeFr: null, sampleTypeAr: null, tubeFr: '1 EDTA + 1 SEC', tubeAr: '1 EDTA + 1 أنبوب جاف', method: 'Calcul', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'SEROLOGIE_COVID_19_IGG', category: 'SEROLOGY', nameFr: 'Sérologie Covid-19 IgG', nameAr: 'سيرولوجيا كوفيد-19 IgG', synonymes: 'SARS COV2 IgG', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'SEROLOGIE_CYTOMEGALOVIRUS', category: 'SEROLOGY', nameFr: 'Sérologie Cytomégalovirus', nameAr: 'سيرولوجيا CMV', synonymes: 'CMV', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'SEROLOGIE_EBV', category: 'SEROLOGY', nameFr: 'Sérologie EBV', nameAr: 'سيرولوجيا EBV', synonymes: 'MNI', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'SEROLOGIE_RUBEOLE_IGG', category: 'SEROLOGY', nameFr: 'Sérologie Rubéole IgG', nameAr: 'سيرولوجيا الحصبة الألمانية IgG', synonymes: 'Rub', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'SODIUM', category: 'BIOCHEMISTRY', nameFr: 'Sodium', nameAr: 'صوديوم', synonymes: 'Na, iono', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Potentiométrie indirecte', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'SODIUM_URINAIRE', category: 'BIOCHEMISTRY', nameFr: 'Sodium urinaire', nameAr: 'الصوديوم في البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Potentiométrie indirecte', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'SODIUM_URINAIRE_DES_24_HEURES', category: 'BIOCHEMISTRY', nameFr: 'Sodium urinaire des 24 heures', nameAr: 'الصوديوم في بول 24 ساعة', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines 24h', tubeAr: 'بول 24 ساعة', method: 'Potentiométrie indirecte', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'SPERMOCULTURE', category: 'MICROBIOLOGY', nameFr: 'Spermoculture', nameAr: 'زرع السائل المنوي', synonymes: null, sampleTypeFr: 'Sperme', sampleTypeAr: 'مني', tubeFr: 'Flacon stérile', tubeAr: 'قارورة معقمة', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '<2 h TA', turnaroundTime: '5 jours' },
    { code: 'STERILET', category: 'MICROBIOLOGY', nameFr: 'Stérilet', nameAr: 'لولب رحمي', synonymes: 'DIUT', sampleTypeFr: null, sampleTypeAr: null, tubeFr: 'Flacon stérile', tubeAr: 'قارورة معقمة', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '<4 h TA', turnaroundTime: '5 jours' },
    { code: 'SEROLOGIE_SYPHILIS_TREPONEMATOSES', category: 'SEROLOGY', nameFr: 'Sérologie Syphilis - Tréponematoses', nameAr: 'سيرولوجيا الزهري - اللولبيات', synonymes: 'TPHA BW IST', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: 'Dépistage IST sans avance de frais au labo si moins de 26 ans', collectionConditionAr: 'تحري الأمراض المنقولة جنسيًا بدون دفع مسبق بالمختبر إذا كان العمر أقل من 26 سنة', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'T3_LIBRE', category: 'HORMONOLOGY', nameFr: 'T3 libre', nameAr: 'T3 الحر', synonymes: 'T3L', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'T4_LIBRE', category: 'HORMONOLOGY', nameFr: 'T4 libre', nameAr: 'T4 الحر', synonymes: 'T4L', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'TAUX_DE_REABSORPTION_TUBULAIRE_DU_PHOSPHORE', category: 'BIOCHEMISTRY', nameFr: 'Taux de réabsorption tubulaire du phosphore', nameAr: 'معدل إعادة الامتصاص الأنبوبي للفوسفور', synonymes: 'TRP', sampleTypeFr: 'Urines et sérum', sampleTypeAr: 'بول ومصل', tubeFr: null, tubeAr: null, method: 'Calcul', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'TCK_TEMPS_CEPHALINE_KAOLIN', category: 'HEMOSTASIS', nameFr: 'TCK (Temps céphaline kaolin)', nameAr: 'TCK (زمن السيفالين كاولين)', synonymes: 'TCK', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'CITRATE', tubeAr: 'سيترات', method: 'Chronométrie automatisée STA R-max (Stago)', collectionConditionFr: 'Tube rempli', collectionConditionAr: 'يجب أن يكون الأنبوب ممتلئًا', preAnalyticDelay: '6 heures', turnaroundTime: '1 jour' },
    { code: 'TEST_AU_SYNACTHENE', category: 'HORMONOLOGY', nameFr: 'Test au Synacthène', nameAr: 'اختبار السيناكتين', synonymes: 'SYN30, SYN60', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: 'Protocole spécifique – à jeun', collectionConditionAr: 'بروتوكول خاص – صائم', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'TESTOSTERONE', category: 'HORMONOLOGY', nameFr: 'Testostérone', nameAr: 'تستوستيرون', synonymes: 'TEST', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '2 jours' },
    { code: 'TOXOPLASMOSE', category: 'SEROLOGY', nameFr: 'Toxoplasmose', nameAr: 'داء المقوسات', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'TP_INR', category: 'HEMOSTASIS', nameFr: 'TP / INR', nameAr: 'TP / INR', synonymes: 'INR', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'CITRATE', tubeAr: 'سيترات', method: 'Chronométrie automatisée', collectionConditionFr: 'Tube rempli; traitement + cible thérapeutique', collectionConditionAr: 'يجب أن يكون الأنبوب ممتلئًا؛ يُذكر العلاج والهدف العلاجي', preAnalyticDelay: '8 heures', turnaroundTime: '1 jour (AVK) / 1 jour' },
    { code: 'TRANSFERRINE', category: 'BIOCHEMISTRY', nameFr: 'Transferrine', nameAr: 'ترانسفيرين', synonymes: 'Sidérophiline', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Immunoturbidimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'TRIGLYCERIDES', category: 'BIOCHEMISTRY', nameFr: 'Triglycérides', nameAr: 'الدهون الثلاثية', synonymes: 'TG', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Colorimétrie', collectionConditionFr: 'A jeun', collectionConditionAr: 'صائم', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'TROPONINE_I_HYPERSENSIBLE', category: 'BIOCHEMISTRY', nameFr: 'Troponine I hypersensible', nameAr: 'تروبونين I عالي الحساسية', synonymes: 'Tropo', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: 'Paramètre d\'urgence', collectionConditionAr: 'مؤشر إسعافي', preAnalyticDelay: '8 heures', turnaroundTime: '3 h' },
    { code: 'TSH', category: 'HORMONOLOGY', nameFr: 'TSH', nameAr: 'TSH', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: 'Prélever toujours dans les mêmes conditions (prise de médicament)', collectionConditionAr: 'يُسحب دائمًا في الظروف نفسها (بالنسبة لتناول الدواء)', preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'UREE', category: 'BIOCHEMISTRY', nameFr: 'Urée', nameAr: 'يوريا', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'UREE_URINAIRE', category: 'BIOCHEMISTRY', nameFr: 'Urée urinaire', nameAr: 'اليوريا في البول', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'UREE_URINAIRE_24H', category: 'BIOCHEMISTRY', nameFr: 'Urée urinaire (24h)', nameAr: 'اليوريا في بول 24 ساعة', synonymes: null, sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines 24h', tubeAr: 'بول 24 ساعة', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'UROBILINOGENE', category: 'BIOCHEMISTRY', nameFr: 'Urobilinogène', nameAr: 'يوروبيلينوجين', synonymes: 'Sels et pigments biliaires urinaires', sampleTypeFr: 'Urine', sampleTypeAr: 'بول', tubeFr: 'Urines échantillon', tubeAr: 'عينة بول', method: 'Colorimétrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '2 h AMB / 1 jour (4°C)', turnaroundTime: '1 jour' },
    { code: 'VITAMINE_A', category: 'BIOCHEMISTRY', nameFr: 'Vitamine A', nameAr: 'فيتامين A', synonymes: 'Rétinol', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC SANS GEL', tubeAr: 'أنبوب جاف بدون جل', method: null, collectionConditionFr: 'Congélation dans les 6h; tubes à l\'abri de la lumière (ne pas emballer le tube)', collectionConditionAr: 'يُجمّد خلال 6 ساعات؛ تُحمى الأنابيب من الضوء (من دون لف الأنبوب)', preAnalyticDelay: '6 h', turnaroundTime: '4 jours' },
    { code: 'VITAMINE_B1', category: 'BIOCHEMISTRY', nameFr: 'Vitamine B1', nameAr: 'فيتامين B1', synonymes: 'THIAMINE VB1ST', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'EDTA', tubeAr: 'EDTA', method: null, collectionConditionFr: '46 euros HN; congélation dans les 6h; tubes à l\'abri de la lumière (ne pas emballer le tube)', collectionConditionAr: '46 يورو خارج التعرفة؛ يُجمّد خلال 6 ساعات؛ تُحمى الأنابيب من الضوء (من دون لف الأنبوب)', preAnalyticDelay: '6 h', turnaroundTime: '7 jours' },
    { code: 'VITAMINE_B12', category: 'BIOCHEMISTRY', nameFr: 'Vitamine B12', nameAr: 'فيتامين B12', synonymes: null, sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Spectrophotométrie', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'VITAMINE_B6', category: 'BIOCHEMISTRY', nameFr: 'Vitamine B6', nameAr: 'فيتامين B6', synonymes: 'VB6ST', sampleTypeFr: null, sampleTypeAr: null, tubeFr: 'EDTA', tubeAr: 'EDTA', method: null, collectionConditionFr: 'Congélation dans les 6h; tubes à l\'abri de la lumière (ne pas emballer le tube)', collectionConditionAr: 'يُجمّد خلال 6 ساعات؛ تُحمى الأنابيب من الضوء (من دون لف الأنبوب)', preAnalyticDelay: '6 h', turnaroundTime: '7 jours' },
    { code: 'VITAMINE_D_25_OH', category: 'BIOCHEMISTRY', nameFr: 'Vitamine D 25-OH', nameAr: 'فيتامين D 25-OH', synonymes: 'Vitamine D', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC', tubeAr: 'أنبوب جاف', method: 'Chimiluminescence (CMIA)', collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '1 jour' },
    { code: 'VITAMINE_E', category: 'BIOCHEMISTRY', nameFr: 'Vitamine E', nameAr: 'فيتامين E', synonymes: 'Tocophérol', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC SANS GEL', tubeAr: 'أنبوب جاف بدون جل', method: null, collectionConditionFr: 'Congélation dans les 6h; tubes à l\'abri de la lumière (ne pas emballer le tube)', collectionConditionAr: 'يُجمّد خلال 6 ساعات؛ تُحمى الأنابيب من الضوء (من دون لف الأنبوب)', preAnalyticDelay: '6 h', turnaroundTime: '7 jours' },
    { code: 'ZINC', category: 'BIOCHEMISTRY', nameFr: 'Zinc', nameAr: 'زنك', synonymes: 'Zn', sampleTypeFr: 'Sang', sampleTypeAr: 'دم', tubeFr: 'SEC SANS GEL', tubeAr: 'أنبوب جاف بدون جل', method: null, collectionConditionFr: null, collectionConditionAr: null, preAnalyticDelay: '1 jour', turnaroundTime: '4 jours' },
  ];

  // Enrich catalogue entries with Arabic translations
  const enrichedCatalogue = catalogue.map((entry) => ({
    ...entry,
    preAnalyticDelayAr: entry.preAnalyticDelay ? (delayTranslations[entry.preAnalyticDelay] ?? null) : null,
    turnaroundTimeAr: entry.turnaroundTime ? (tatTranslations[entry.turnaroundTime] ?? null) : null,
  }));

  let upserted = 0;
  for (const entry of enrichedCatalogue) {
    await prisma.testDefinition.upsert({
      where: { code: entry.code },
      update: {
        nameFr: entry.nameFr,
        nameAr: entry.nameAr,
        synonymes: entry.synonymes,
        sampleTypeFr: entry.sampleTypeFr,
        sampleTypeAr: entry.sampleTypeAr,
        tubeFr: entry.tubeFr,
        tubeAr: entry.tubeAr,
        method: entry.method,
        collectionConditionFr: entry.collectionConditionFr,
        collectionConditionAr: entry.collectionConditionAr,
        preAnalyticDelay: entry.preAnalyticDelay,
        preAnalyticDelayAr: entry.preAnalyticDelayAr,
        turnaroundTime: entry.turnaroundTime,
        turnaroundTimeAr: entry.turnaroundTimeAr,
      },
      create: {
        code: entry.code,
        nameFr: entry.nameFr,
        nameAr: entry.nameAr,
        category: entry.category,
        isActive: true,
        subcontracted: false,
        fastingRequired: false,
        lightSensitive: false,
        synonymes: entry.synonymes,
        sampleTypeFr: entry.sampleTypeFr,
        sampleTypeAr: entry.sampleTypeAr,
        tubeFr: entry.tubeFr,
        tubeAr: entry.tubeAr,
        method: entry.method,
        collectionConditionFr: entry.collectionConditionFr,
        collectionConditionAr: entry.collectionConditionAr,
        preAnalyticDelay: entry.preAnalyticDelay,
        preAnalyticDelayAr: entry.preAnalyticDelayAr,
        turnaroundTime: entry.turnaroundTime,
        turnaroundTimeAr: entry.turnaroundTimeAr,
      },
    });
    upserted++;
  }

  console.log(`  ✓ ${upserted} test definitions upserted from catalogue`);
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

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding MLMS database...\n');

  await clearDatabase();
  await seedUsers();
  await seedTestDefinitions();
  await seedStorageLocations();
  await seedReagents();
  await seedPatients();

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
