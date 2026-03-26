// ASTM E1394 frame builder for the MLMS backend
// Control bytes
const STX = 0x02;
const ETX = 0x03;
const EOT = 0x04;
const ENQ = 0x05;
const ACK = 0x06;
const CR = 0x0d;
const LF = 0x0a;

export const ENQ_BUF = Buffer.from([ENQ]);
export const EOT_BUF = Buffer.from([EOT]);
export const ACK_BUF = Buffer.from([ACK]);

function calculateChecksum(data: string): string {
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data.charCodeAt(i);
  return (sum % 256).toString(16).toUpperCase().padStart(2, '0');
}

function buildFrame(frameNumber: number, records: string[]): Buffer {
  const content = records.join('\r');
  const frameNumStr = String(frameNumber % 8);
  const dataForChecksum = frameNumStr + content + String.fromCharCode(ETX);
  const checksum = calculateChecksum(dataForChecksum);
  return Buffer.concat([
    Buffer.from([STX]),
    Buffer.from(frameNumStr + content),
    Buffer.from([ETX]),
    Buffer.from(checksum),
    Buffer.from([CR, LF]),
  ]);
}

function formatTimestamp(d = new Date()): string {
  return d.toISOString().replace(/[-:T]/g, '').substring(0, 14);
}

export interface AstmOrderData {
  sampleId: string;
  accessionNumber: string;
  patientId?: string;
  patientName?: string;
  dob?: string;
  sex?: string;
  testCodes: string[];
  sendingFacility?: string;
}

export function buildAstmOrderMessage(order: AstmOrderData): Buffer[] {
  const facility = order.sendingFacility || 'MLMS';
  const ts = formatTimestamp();

  const records: string[] = [];
  records.push(`H|\\^&|||${facility}^1.0|||||||P|LIS2-A2|${ts}`);
  records.push(`P|1||${order.patientId || 'UNK'}|||${order.patientName || 'UNKNOWN'}||${order.dob || ''}|${order.sex || 'U'}`);
  const testStr = order.testCodes.map(t => `^^^${t}`).join('\\');
  records.push(`O|1|${order.sampleId}|${order.accessionNumber}|${testStr}|R|||||||N`);
  records.push('L|1|N');

  // Pack into frames (max 240 chars each)
  const FRAME_MAX = 240;
  const frames: Buffer[] = [];
  let currentRecords: string[] = [];
  let currentLen = 0;
  let frameNum = 1;

  for (const record of records) {
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

export function parseAstmResults(raw: string): Array<{ testCode: string; value: string; unit: string; flag: string }> {
  const results: Array<{ testCode: string; value: string; unit: string; flag: string }> = [];
  const lines = raw.split(/\r\n|\r|\n/);

  for (const line of lines) {
    // Remove control chars (STX, ETX, EOT, ENQ, ACK, NAK) and trim
    const clean = line.replace(/[\x02\x03\x04\x05\x06\x15]/g, '').trim();
    // Strip leading ASTM frame number digit (0-7) that prefixes the first record of each frame
    const record = clean.replace(/^[0-7](?=[A-Z]\|)/, '');
    if (!record.startsWith('R|')) continue;
    const fields = record.split('|');
    const testField = fields[2] || '';
    const testParts = testField.split('^');
    const testCode = testParts[3] || testParts[0] || '';
    const value = fields[3] || '';
    const unit = fields[4] || '';
    const flagRaw = fields[6] || 'N';
    const flag = flagRaw === 'H' ? 'HIGH' : flagRaw === 'L' ? 'LOW' : flagRaw === 'C' ? 'CRITICAL' : 'NORMAL';
    if (testCode) results.push({ testCode, value, unit, flag });
  }

  return results;
}
