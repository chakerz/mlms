export const STX = 0x02;
export const ETX = 0x03;
export const EOT = 0x04;
export const ENQ = 0x05;
export const ACK = 0x06;
export const NAK = 0x15;
export const CR = 0x0d;
export const LF = 0x0a;

export const STX_BUF = Buffer.from([STX]);
export const ETX_BUF = Buffer.from([ETX]);
export const EOT_BUF = Buffer.from([EOT]);
export const ENQ_BUF = Buffer.from([ENQ]);
export const ACK_BUF = Buffer.from([ACK]);
export const NAK_BUF = Buffer.from([NAK]);
export const CRLF_BUF = Buffer.from([CR, LF]);
