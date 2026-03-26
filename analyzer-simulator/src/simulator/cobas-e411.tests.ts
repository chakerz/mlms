export interface CobasTestDefinition {
  code: string;
  name: string;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  category: 'NUMERIC' | 'QUALITATIVE';
}

// Typische Immunoassay-Tests des Cobas e 411
export const CobasE411Tests: CobasTestDefinition[] = [
  { code: 'TSH',    name: 'TSH',                   unit: 'mUI/L',  referenceMin: 0.27, referenceMax: 4.20,   category: 'NUMERIC'     },
  { code: 'FT4',    name: 'T4 Libre',              unit: 'pmol/L', referenceMin: 12,   referenceMax: 22,     category: 'NUMERIC'     },
  { code: 'FT3',    name: 'T3 Libre',              unit: 'pmol/L', referenceMin: 3.1,  referenceMax: 6.8,    category: 'NUMERIC'     },
  { code: 'LH',     name: 'LH',                    unit: 'mUI/mL', referenceMin: 1.7,  referenceMax: 8.6,    category: 'NUMERIC'     },
  { code: 'FSH',    name: 'FSH',                   unit: 'mUI/mL', referenceMin: 1.5,  referenceMax: 12.4,   category: 'NUMERIC'     },
  { code: 'PRL',    name: 'Prolactine',            unit: 'µg/L',   referenceMin: 4.0,  referenceMax: 15.2,   category: 'NUMERIC'     },
  { code: 'E2',     name: 'Oestradiol',            unit: 'pmol/L', referenceMin: 73,   referenceMax: 550,    category: 'NUMERIC'     },
  { code: 'TESTO',  name: 'Testostérone',          unit: 'nmol/L', referenceMin: 9.9,  referenceMax: 27.8,   category: 'NUMERIC'     },
  { code: 'PROG',   name: 'Progestérone',          unit: 'nmol/L', referenceMin: 0.6,  referenceMax: 4.7,    category: 'NUMERIC'     },
  { code: 'HCG',    name: 'βHCG',                 unit: 'mUI/mL', referenceMin: 0,    referenceMax: 5,      category: 'NUMERIC'     },
  { code: 'INSU',   name: 'Insuline',              unit: 'mUI/L',  referenceMin: 2.6,  referenceMax: 24.9,   category: 'NUMERIC'     },
  { code: 'CPP',    name: 'Peptide C',             unit: 'nmol/L', referenceMin: 0.37, referenceMax: 1.47,   category: 'NUMERIC'     },
  { code: 'CRT',    name: 'Cortisol',              unit: 'nmol/L', referenceMin: 171,  referenceMax: 536,    category: 'NUMERIC'     },
  { code: 'DHEAS',  name: 'DHEA-S',                unit: 'µmol/L', referenceMin: 4.3,  referenceMax: 12.2,   category: 'NUMERIC'     },
  { code: 'PTH',    name: 'PTH intacte',           unit: 'pmol/L', referenceMin: 1.6,  referenceMax: 6.9,    category: 'NUMERIC'     },
  { code: 'VIT_D',  name: 'Vitamine D',            unit: 'nmol/L', referenceMin: 75,   referenceMax: 250,    category: 'NUMERIC'     },
  { code: 'B12',    name: 'Vitamine B12',          unit: 'pmol/L', referenceMin: 150,  referenceMax: 700,    category: 'NUMERIC'     },
  { code: 'FOLAT',  name: 'Folate',                unit: 'nmol/L', referenceMin: 10,   referenceMax: 42,     category: 'NUMERIC'     },
  { code: 'FERR',   name: 'Ferritine',             unit: 'ng/mL',  referenceMin: 20,   referenceMax: 200,    category: 'NUMERIC'     },
  { code: 'PSA',    name: 'PSA total',             unit: 'µg/L',   referenceMin: 0,    referenceMax: 4,      category: 'NUMERIC'     },
  { code: 'AFP',    name: 'Alpha-fœtoprotéine',    unit: 'µg/L',   referenceMin: 0,    referenceMax: 7,      category: 'NUMERIC'     },
  { code: 'CEA',    name: 'ACE',                   unit: 'µg/L',   referenceMin: 0,    referenceMax: 5,      category: 'NUMERIC'     },
  { code: 'CA125',  name: 'CA 125',                unit: 'kUI/L',  referenceMin: 0,    referenceMax: 35,     category: 'NUMERIC'     },
  { code: 'CA199',  name: 'CA 19-9',               unit: 'kUI/L',  referenceMin: 0,    referenceMax: 37,     category: 'NUMERIC'     },
  { code: 'TROPP',  name: 'Troponine P',           unit: 'ng/L',   referenceMin: 0,    referenceMax: 14,     category: 'NUMERIC'     },
  { code: 'NT_BNP', name: 'NT-proBNP',             unit: 'ng/L',   referenceMin: 0,    referenceMax: 125,    category: 'NUMERIC'     },
  { code: 'CRP_HS', name: 'CRP Haute Sens',        unit: 'mg/L',   referenceMin: 0,    referenceMax: 1,      category: 'NUMERIC'     },
  { code: 'HBS_AG', name: 'Ag HBs',                unit: '',       referenceMin: 0,    referenceMax: 0,      category: 'QUALITATIVE' },
  { code: 'AC_HBS', name: 'Ac anti-HBs',           unit: 'mUI/mL', referenceMin: 10,   referenceMax: 1000,   category: 'NUMERIC'     },
  { code: 'AC_HBC', name: 'Ac anti-HBc Total',     unit: '',       referenceMin: 0,    referenceMax: 0,      category: 'QUALITATIVE' },
  { code: 'AC_VIH', name: 'HIV Ag/Ac',             unit: '',       referenceMin: 0,    referenceMax: 0,      category: 'QUALITATIVE' },
  { code: 'AC_VHC', name: 'Ac anti-HCV',           unit: '',       referenceMin: 0,    referenceMax: 0,      category: 'QUALITATIVE' },
];

export const COBAS_E411_TEST_CODES = CobasE411Tests.map(t => t.code);
