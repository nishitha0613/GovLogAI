import type { LogEntry } from '../types/log';

/**
 * Cryptographic Hash-Chaining Engine for Tamper-Proof Audit Trails
 * Generates SHA-256 audit signatures where hash[i] = SHA256(prevHash[i] + "|" + id + "|" + timestamp + "|" + message)
 */

export const INITIAL_GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

// Synchronous 256-bit SHA-256 implementation
export function sha256Sync(str: string): string {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef4a3f7, 0xc67178f2
  ];

  let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  const len = bytes.length;
  const bitLen = len * 8;

  const paddedLen = ((len + 9 + 63) >> 6) << 6;
  const padded = new Uint8Array(paddedLen);
  padded.set(bytes);
  padded[len] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 4, bitLen, false);

  const W = new Uint32Array(64);

  for (let i = 0; i < paddedLen; i += 64) {
    for (let j = 0; j < 16; j++) {
      W[j] = view.getUint32(i + j * 4, false);
    }
    for (let j = 16; j < 64; j++) {
      const s0 = (W[j - 15] >>> 7 | W[j - 15] << 25) ^ (W[j - 15] >>> 18 | W[j - 15] << 14) ^ (W[j - 15] >>> 3);
      const s1 = (W[j - 2] >>> 17 | W[j - 2] << 15) ^ (W[j - 2] >>> 19 | W[j - 2] << 13) ^ (W[j - 2] >>> 10);
      W[j] = (W[j - 16] + s0 + W[j - 7] + s1) | 0;
    }

    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

    for (let j = 0; j < 64; j++) {
      const S1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[j] + W[j]) | 0;
      const S0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0;
    H[5] = (H[5] + f) | 0;
    H[6] = (H[6] + g) | 0;
    H[7] = (H[7] + h) | 0;
  }

  return H.map(val => (val >>> 0).toString(16).padStart(8, '0')).join('');
}

export interface AuditHashBlock {
  logId: string;
  prevHash: string;
  hash: string;
}

export function computeLogHashChain(logMessages: Array<{ id: string; raw: string; timestamp: string }>): AuditHashBlock[] {
  let prevHash = INITIAL_GENESIS_HASH;
  const blocks: AuditHashBlock[] = [];

  logMessages.forEach((item) => {
    const payload = `${prevHash}|${item.id}|${item.timestamp}|${item.raw}`;
    const hash = sha256Sync(payload);
    blocks.push({
      logId: item.id,
      prevHash,
      hash,
    });
    prevHash = hash;
  });

  return blocks;
}

export interface ChainVerificationResult {
  isChainValid: boolean;
  totalLogs: number;
  verifiedCount: number;
  tamperedCount: number;
  tamperedLogIds: string[];
  verifiedLogs: LogEntry[];
}

export function verifyLogHashChain(logs: LogEntry[]): ChainVerificationResult {
  if (!logs || logs.length === 0) {
    return {
      isChainValid: true,
      totalLogs: 0,
      verifiedCount: 0,
      tamperedCount: 0,
      tamperedLogIds: [],
      verifiedLogs: [],
    };
  }

  let expectedPrevHash = INITIAL_GENESIS_HASH;
  const tamperedLogIds: string[] = [];
  let isChainBrokenByAncestor = false;

  const verifiedLogs: LogEntry[] = logs.map((log, index) => {
    const prevHash = index === 0 ? INITIAL_GENESIS_HASH : expectedPrevHash;
    const payload = `${prevHash}|${log.id}|${log.timestamp}|${log.message}`;
    const expectedHash = sha256Sync(payload);

    let isTampered = false;
    let tamperReason: string | undefined = undefined;

    if (isChainBrokenByAncestor) {
      isTampered = true;
      tamperReason = 'Broken audit chain link due to upstream log alteration';
    } else if (log.prevHash && log.prevHash !== prevHash) {
      isTampered = true;
      tamperReason = 'Previous block hash mismatch (Chain link severed)';
      isChainBrokenByAncestor = true;
    } else if (log.hash && log.hash !== expectedHash) {
      isTampered = true;
      tamperReason = 'Cryptographic signature mismatch: Log message modified after hash signing';
      isChainBrokenByAncestor = true;
    } else if (!log.hash) {
      isTampered = true;
      tamperReason = 'Missing cryptographic audit signature';
    }

    if (isTampered) {
      tamperedLogIds.push(log.id);
    } else {
      expectedPrevHash = expectedHash;
    }

    return {
      ...log,
      hash: log.hash || expectedHash,
      prevHash,
      isTampered,
      tamperReason,
    };
  });

  const tamperedCount = tamperedLogIds.length;
  const verifiedCount = logs.length - tamperedCount;

  return {
    isChainValid: tamperedCount === 0,
    totalLogs: logs.length,
    verifiedCount,
    tamperedCount,
    tamperedLogIds,
    verifiedLogs,
  };
}
