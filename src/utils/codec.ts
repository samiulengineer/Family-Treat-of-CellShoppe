/**
 * Encoding, decoding, and deterministic seeded randomization for CellShoppe.
 */

export interface GamePayload {
  members: string[];
  prizes: string[];
  title?: string;
  timestamp?: number;
}

export type DeviceCategory = 'smartphone' | 'laptop' | 'tablet' | 'smartwatch';

export interface AssignedDevice {
  id: string;
  member: string;
  prize: string;
  deviceType: DeviceCategory;
  modelName: string;
  serialNumber: string;
  batteryPct: number;
}

const DEVICE_MODELS: Record<DeviceCategory, string[]> = {
  smartphone: ['CellShoppe Titan X', 'Nexus Fold Neo', 'Aura Phone 16 Pro', 'Vortex Cyber 5G'],
  tablet: ['CellShoppe Slate Pro 13', 'Aura Tab Ultra M3', 'Matrix Pad Duo'],
  laptop: ['CellShoppe Book Precision', 'CyberDeck Stealth 16', 'Nova Carbon Studio'],
  smartwatch: ['CellShoppe Chrono Fit', 'Aura Pulse Ultra 3', 'Matrix Band Pro']
};

/**
 * Encodes payload into URL-safe Base64 string supporting UTF-8.
 */
export function encodeGameData(payload: GamePayload): string {
  try {
    const jsonString = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(jsonString);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    // Convert to URL-safe Base64
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (err) {
    console.error('Failed to encode game data', err);
    return '';
  }
}

/**
 * Decodes URL-safe Base64 string back into GamePayload.
 */
export function decodeGameData(base64Str: string): GamePayload | null {
  try {
    if (!base64Str) return null;
    // Restore standard Base64 padding and characters
    let base64 = base64Str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonString = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.members) && Array.isArray(parsed.prizes)) {
      return {
        members: parsed.members.filter((m: unknown) => typeof m === 'string' && m.trim().length > 0),
        prizes: parsed.prizes.filter((p: unknown) => typeof p === 'string' && p.trim().length > 0),
        title: parsed.title || 'Family Treat of CellShoppe',
        timestamp: parsed.timestamp || Date.now()
      };
    }
    return null;
  } catch (err) {
    console.error('Failed to decode game data', err);
    return null;
  }
}

/**
 * FNV-1a 32-bit hash of a string into an unsigned integer.
 */
export function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Mulberry32 seeded Pseudo-Random Number Generator.
 * Returns float in [0, 1).
 */
export function createSeededPRNG(seed: number): () => number {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministically shuffles and assigns prizes to members.
 * Uses seed derived from the URL gameData / seed string so all family devices get the exact same results!
 */
export function assignPrizes(
  members: string[],
  prizes: string[],
  seedKey: string
): AssignedDevice[] {
  if (!members.length) return [];

  const seed = hashString(seedKey || 'cellshoppe_family_seed');
  const prng = createSeededPRNG(seed);

  // If prizes are fewer than members, pad/cycle prizes so everyone gets a prize
  let workingPrizes = [...prizes];
  if (workingPrizes.length === 0) {
    workingPrizes = ['Mystery Gift Card', 'Delicious Dinner Treat', 'Tech Gadget', 'Sweet Surprise'];
  }

  while (workingPrizes.length < members.length) {
    workingPrizes = workingPrizes.concat(prizes.length ? prizes : ['Bonus Mystery Treat']);
  }

  // Fisher-Yates shuffle with seeded PRNG
  const shuffledPrizes = [...workingPrizes];
  for (let i = shuffledPrizes.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    const temp = shuffledPrizes[i];
    shuffledPrizes[i] = shuffledPrizes[j];
    shuffledPrizes[j] = temp;
  }

  const deviceTypes: DeviceCategory[] = ['smartphone', 'laptop', 'tablet', 'smartphone', 'smartwatch', 'tablet'];

  return members.map((member, index) => {
    const deviceType = deviceTypes[index % deviceTypes.length];
    const models = DEVICE_MODELS[deviceType];
    const modelIndex = Math.floor(prng() * models.length);
    const hexSerial = ((seed ^ (index * 9973)) >>> 0).toString(16).toUpperCase().padStart(8, '0');
    const batteryPct = 85 + Math.floor(prng() * 15);

    return {
      id: `dev-${index}-${member.toLowerCase().replace(/\s+/g, '_')}`,
      member,
      prize: shuffledPrizes[index],
      deviceType,
      modelName: models[modelIndex],
      serialNumber: `SN-CS-${hexSerial.slice(0, 4)}-${hexSerial.slice(4)}`,
      batteryPct
    };
  });
}
