import { STX, ETX, EOT, ENQ, ACK, NAK } from './AstmConstants';

export interface AstmHeader {
  sendingFacility: string;
  processingId: string;
  versionNumber: string;
  timestamp: string;
}

export interface AstmPatient {
  sequenceNumber: string;
  patientId: string;
  name: string;
  birthDate: string;
  sex: string;
}

export interface AstmOrder {
  sequenceNumber: string;
  sampleId: string;
  accessionNumber: string;
  tests: string[];
  priority: string;
  specimenCode: string;
  collectedAt: string;
}

export interface AstmResult {
  sequenceNumber: string;
  testCode: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: string;
  resultStatus: string;
  measuredAt: string;
}

export interface AstmTerminator {
  terminationCode: string;
}

export interface ParsedAstmMessage {
  header: AstmHeader;
  patient?: AstmPatient;
  orders: AstmOrder[];
  results: AstmResult[];
  terminator?: AstmTerminator;
}

export function calculateChecksum(data: string): string {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data.charCodeAt(i);
  }
  return (sum % 256).toString(16).toUpperCase().padStart(2, '0');
}

export function validateChecksum(frame: string): boolean {
  // frame: frameNumber + records + ETX + checksum
  const etxIdx = frame.indexOf(String.fromCharCode(ETX));
  if (etxIdx === -1) return true; // can't validate, assume ok
  const data = frame.substring(0, etxIdx + 1);
  const expected = frame.substring(etxIdx + 1, etxIdx + 3);
  return calculateChecksum(data) === expected.toUpperCase();
}

export function extractFrameContent(frame: string): string {
  const stxIdx = frame.indexOf(String.fromCharCode(STX));
  const etxIdx = frame.indexOf(String.fromCharCode(ETX));
  if (stxIdx === -1 || etxIdx === -1) return frame;
  return frame.substring(stxIdx + 2, etxIdx); // skip STX and frame number
}

export function parseRecord(line: string): string[] {
  return line.split('|');
}

export function parseTestCodes(field: string): string[] {
  return field.split('\\').map(t => {
    const parts = t.split('^');
    return parts[3] || parts[0] || t;
  }).filter(Boolean);
}

export function parseAstmMessage(raw: string): ParsedAstmMessage | null {
  const lines = raw.split(/\r\n|\r|\n/).filter(l => l.trim());
  const msg: ParsedAstmMessage = {
    header: { sendingFacility: '', processingId: '', versionNumber: '', timestamp: '' },
    orders: [],
    results: [],
  };

  for (const line of lines) {
    const raw2 = line.replace(/[\x02\x03\x04\x05\x06\x15]/g, '').trim();
    if (!raw2) continue;
    // Strip leading ASTM frame number digit (0-7) prefixing first record in each frame
    const clean = raw2.replace(/^[0-7](?=[A-Z]\|)/, '');
    const fields = parseRecord(clean);
    const recordType = fields[0]?.[0];

    switch (recordType) {
      case 'H':
        msg.header = {
          sendingFacility: fields[4] || '',
          processingId: fields[11] || '',
          versionNumber: fields[12] || '',
          timestamp: fields[13] || '',
        };
        break;
      case 'P':
        msg.patient = {
          sequenceNumber: fields[1] || '',
          patientId: fields[2] || '',
          name: fields[5] || '',
          birthDate: fields[7] || '',
          sex: fields[8] || '',
        };
        break;
      case 'O':
        msg.orders.push({
          sequenceNumber: fields[1] || '',
          sampleId: fields[2] || '',
          accessionNumber: fields[3] || '',
          tests: parseTestCodes(fields[4] || ''),
          priority: fields[5] || 'R',
          specimenCode: fields[15] || '',
          collectedAt: fields[7] || '',
        });
        break;
      case 'R':
        msg.results.push({
          sequenceNumber: fields[1] || '',
          testCode: parseTestCodes(fields[2] || '')[0] || '',
          value: fields[3] || '',
          unit: fields[4] || '',
          referenceRange: fields[5] || '',
          flag: fields[6] || '',
          resultStatus: fields[8] || '',
          measuredAt: fields[12] || '',
        });
        break;
      case 'L':
        msg.terminator = { terminationCode: fields[2] || 'N' };
        break;
    }
  }

  return msg;
}
