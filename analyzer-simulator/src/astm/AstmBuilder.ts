import { STX_BUF, ETX_BUF, EOT_BUF, ENQ_BUF, ACK_BUF, NAK_BUF, CRLF_BUF, CR, LF } from './AstmConstants';
import { calculateChecksum } from './AstmParser';

export function buildFrame(frameNumber: number, records: string[]): Buffer {
  const content = records.join('\r');
  const frameNumStr = String(frameNumber % 8);
  const dataForChecksum = frameNumStr + content + String.fromCharCode(0x03);
  const checksum = calculateChecksum(dataForChecksum);
  const frame = Buffer.from(frameNumStr + content);
  return Buffer.concat([
    STX_BUF,
    frame,
    ETX_BUF,
    Buffer.from(checksum),
    CRLF_BUF,
  ]);
}

export function buildEnq(): Buffer { return ENQ_BUF; }
export function buildAck(): Buffer { return ACK_BUF; }
export function buildNak(): Buffer { return NAK_BUF; }
export function buildEot(): Buffer { return EOT_BUF; }

export function formatTimestamp(d = new Date()): string {
  return d.toISOString().replace(/[-:T]/g, '').substring(0, 14);
}

export function buildHeaderRecord(sendingFacility: string): string {
  const ts = formatTimestamp();
  return `H|\\^&|||${sendingFacility}^1.0|||||||P|LIS2-A2|${ts}`;
}

export function buildPatientRecord(seq: number, patientId: string, name: string, dob: string, sex: string): string {
  return `P|${seq}||${patientId}|||${name}||${dob}|${sex}`;
}

export function buildOrderRecord(seq: number, sampleId: string, accession: string, tests: string[]): string {
  const testStr = tests.map(t => `^^^${t}`).join('\\');
  return `O|${seq}|${sampleId}|${accession}|${testStr}|R|||||||N`;
}

export function buildResultRecord(seq: number, testCode: string, value: string, unit: string, refRange: string, flag: string): string {
  const ts = formatTimestamp();
  const flagCode = flag === 'NORMAL' ? 'N' : flag === 'HIGH' ? 'H' : flag === 'LOW' ? 'L' : flag.startsWith('CRITICAL') ? 'C' : 'N';
  return `R|${seq}|^^^${testCode}|${value}|${unit}|${refRange}|${flagCode}||F|||${ts}`;
}

export function buildTerminatorRecord(): string {
  return 'L|1|N';
}

export function buildResultMessage(
  sendingFacility: string,
  sampleId: string,
  accession: string,
  results: Array<{ testCode: string; value: string; unit: string; refRange: string; flag: string }>,
): Buffer[] {
  const frames: Buffer[] = [];
  const allRecords: string[] = [];

  allRecords.push(buildHeaderRecord(sendingFacility));
  allRecords.push(buildPatientRecord(1, 'SIM_PAT', 'SIMULATOR^PATIENT', '19900101', 'U'));
  allRecords.push(buildOrderRecord(1, sampleId, accession, results.map(r => r.testCode)));

  results.forEach((r, i) => {
    allRecords.push(buildResultRecord(i + 1, r.testCode, r.value, r.unit, r.refRange, r.flag));
  });

  allRecords.push(buildTerminatorRecord());

  // Split into frames of max 240 chars each
  const FRAME_MAX = 240;
  let currentRecords: string[] = [];
  let currentLen = 0;
  let frameNum = 1;

  for (const record of allRecords) {
    if (currentLen + record.length > FRAME_MAX && currentRecords.length > 0) {
      frames.push(buildFrame(frameNum++, currentRecords));
      currentRecords = [];
      currentLen = 0;
    }
    currentRecords.push(record);
    currentLen += record.length + 1;
  }

  if (currentRecords.length > 0) {
    frames.push(buildFrame(frameNum, currentRecords));
  }

  return frames;
}
