import { TestDefinition, ProcessedResult } from '../types';
import { CobasE411Tests, CobasTestDefinition } from './cobas-e411.tests';

const BUILTIN_TEST_DB: TestDefinition[] = [
  { code: 'GLU',   name: 'Glucose',            unit: 'g/L',       refLow: 0.70,  refHigh: 1.10,  criticalLow: 0.40,  criticalHigh: 4.50,  decimals: 2 },
  { code: 'CREA',  name: 'Créatinine',          unit: 'mg/L',      refLow: 7.0,   refHigh: 13.0,  criticalLow: 2.0,   criticalHigh: 30.0,  decimals: 1 },
  { code: 'UREE',  name: 'Urée',                unit: 'g/L',       refLow: 0.15,  refHigh: 0.45,  criticalLow: 0.05,  criticalHigh: 2.0,   decimals: 2 },
  { code: 'ALT',   name: 'ALT/SGPT',            unit: 'U/L',       refLow: 7,     refHigh: 56,    criticalLow: 0,     criticalHigh: 500,   decimals: 0 },
  { code: 'AST',   name: 'AST/SGOT',            unit: 'U/L',       refLow: 10,    refHigh: 40,    criticalLow: 0,     criticalHigh: 500,   decimals: 0 },
  { code: 'TBIL',  name: 'Bilirubine totale',   unit: 'µmol/L',    refLow: 3,     refHigh: 17,    criticalLow: 0,     criticalHigh: 200,   decimals: 1 },
  { code: 'TP',    name: 'Protéines totales',   unit: 'g/L',       refLow: 64,    refHigh: 83,    criticalLow: 30,    criticalHigh: 100,   decimals: 0 },
  { code: 'ALB',   name: 'Albumine',            unit: 'g/L',       refLow: 35,    refHigh: 50,    criticalLow: 15,    criticalHigh: 60,    decimals: 0 },
  { code: 'CHOL',  name: 'Cholestérol total',   unit: 'g/L',       refLow: 1.50,  refHigh: 2.00,  criticalLow: 0.50,  criticalHigh: 5.00,  decimals: 2 },
  { code: 'TG',    name: 'Triglycérides',       unit: 'g/L',       refLow: 0.50,  refHigh: 1.50,  criticalLow: 0.10,  criticalHigh: 10.0,  decimals: 2 },
  { code: 'HDL',   name: 'HDL-Cholestérol',     unit: 'g/L',       refLow: 0.40,  refHigh: 0.60,  decimals: 2 },
  { code: 'LDL',   name: 'LDL-Cholestérol',     unit: 'g/L',       refLow: 0.50,  refHigh: 1.30,  decimals: 2 },
  { code: 'HBA1C', name: 'HbA1c',               unit: '%',         refLow: 4.0,   refHigh: 5.6,   criticalLow: 2.0,   criticalHigh: 15.0,  decimals: 1 },
  { code: 'TSH',   name: 'TSH',                 unit: 'mUI/L',     refLow: 0.27,  refHigh: 4.20,  criticalLow: 0.01,  criticalHigh: 100,   decimals: 2 },
  { code: 'FT4',   name: 'T4 Libre',            unit: 'pmol/L',    refLow: 12,    refHigh: 22,    criticalLow: 5,     criticalHigh: 50,    decimals: 1 },
  { code: 'HGB',   name: 'Hémoglobine',         unit: 'g/dL',      refLow: 12,    refHigh: 17,    criticalLow: 5,     criticalHigh: 25,    decimals: 1 },
  { code: 'WBC',   name: 'Leucocytes',          unit: 'x10³/µL',   refLow: 4.0,   refHigh: 10.0,  criticalLow: 1.0,   criticalHigh: 50.0,  decimals: 1 },
  { code: 'PLT',   name: 'Plaquettes',          unit: 'x10³/µL',   refLow: 150,   refHigh: 400,   criticalLow: 20,    criticalHigh: 1500,  decimals: 0 },
  { code: 'RBC',   name: 'Érythrocytes',        unit: 'x10⁶/µL',   refLow: 4.2,   refHigh: 5.4,   criticalLow: 2.0,   criticalHigh: 8.0,   decimals: 2 },
  { code: 'CRP',   name: 'CRP',                 unit: 'mg/L',      refLow: 0,     refHigh: 5,     criticalLow: 0,     criticalHigh: 200,   decimals: 1 },
  { code: 'FERR',  name: 'Ferritine',           unit: 'ng/mL',     refLow: 20,    refHigh: 200,   criticalLow: 5,     criticalHigh: 2000,  decimals: 0 },
  { code: 'VIT_D', name: 'Vitamine D',          unit: 'nmol/L',    refLow: 75,    refHigh: 150,   criticalLow: 20,    criticalHigh: 400,   decimals: 0 },
];

// Convert CobasE411Tests to the internal TestDefinition format for the generator
const COBAS_TEST_DB: TestDefinition[] = CobasE411Tests
  .filter(t => t.category === 'NUMERIC')
  .map(t => ({
    code: t.code,
    name: t.name,
    unit: t.unit,
    refLow: t.referenceMin,
    refHigh: t.referenceMax,
    decimals: t.referenceMax < 10 ? 2 : (t.referenceMax < 100 ? 1 : 0),
  }));

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export class ResultGenerator {
  private testMap: Map<string, TestDefinition>;
  private cobasTestMap: Map<string, CobasTestDefinition>;

  constructor(
    private abnormalRate: number,
    private errorRate: number,
    extraTests?: TestDefinition[],
  ) {
    const combined = [...BUILTIN_TEST_DB, ...COBAS_TEST_DB, ...(extraTests ?? [])];
    this.testMap = new Map(combined.map(t => [t.code, t]));
    this.cobasTestMap = new Map(CobasE411Tests.map(t => [t.code, t]));
  }

  updateRates(abnormalRate: number, errorRate: number): void {
    this.abnormalRate = abnormalRate;
    this.errorRate = errorRate;
  }

  getTestDefinition(code: string): TestDefinition | undefined {
    return this.testMap.get(code);
  }

  generateResult(testCode: string): ProcessedResult {
    if (Math.random() < this.errorRate) {
      const def = this.testMap.get(testCode);
      return { testCode, value: 'ERR', unit: def?.unit ?? '', flag: 'ERROR' };
    }

    // Handle qualitative Cobas tests
    const cobasDef = this.cobasTestMap.get(testCode);
    if (cobasDef?.category === 'QUALITATIVE') {
      const positive = Math.random() < this.abnormalRate;
      return {
        testCode,
        value: positive ? 'POSITIF' : 'NEGATIF',
        unit: '',
        flag: positive ? 'HIGH' : 'NORMAL',
      };
    }

    const def = this.testMap.get(testCode);
    if (!def) {
      return { testCode, value: 'ERROR', unit: '', flag: 'ERROR' };
    }

    let value: number;
    let flag: ProcessedResult['flag'];
    const range = def.refHigh - def.refLow;

    if (Math.random() < this.abnormalRate) {
      if (Math.random() < 0.5) {
        value = def.refHigh + rand(range * 0.1, range * 0.8);
        if (def.criticalHigh && value > def.criticalHigh) {
          value = def.criticalHigh * 0.95;
          flag = 'CRITICAL_HIGH';
        } else {
          flag = 'HIGH';
        }
      } else {
        value = def.refLow - rand(range * 0.05, range * 0.4);
        if (def.criticalLow !== undefined && value < def.criticalLow) {
          value = (def.criticalLow || 0) + (def.refLow - (def.criticalLow || 0)) * 0.1;
          flag = 'CRITICAL_LOW';
        } else {
          flag = 'LOW';
        }
        if (value < 0) value = 0;
      }
    } else {
      value = rand(def.refLow, def.refHigh);
      flag = 'NORMAL';
    }

    const factor = Math.pow(10, def.decimals);
    value = Math.round(value * factor) / factor;

    return {
      testCode,
      value: value.toFixed(def.decimals),
      unit: def.unit,
      flag,
    };
  }

  generateRefRange(testCode: string): string {
    const def = this.testMap.get(testCode);
    if (!def) return '';
    return `${def.refLow}^${def.refHigh}`;
  }
}
