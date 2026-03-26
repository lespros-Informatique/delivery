/**
 * Code Generator Utility
 * ===========================================
 * Generate unique codes for entities
 * Uses a combination of prefix + timestamp + random for uniqueness
 */

/**
 * Generate a unique code with format PREFIX_TIMESTAMP_RANDOM
 * This avoids race conditions that occur with count-based codes
 * 
 * @param prefix - The prefix for the code (e.g., 'USER', 'RESTO', 'CLI')
 * @returns A unique code string
 */
export function generateCode(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}_${timestamp}${random}`;
}

/**
 * Generate a code with traditional format PREFIX_NNNN
 * Warning: This can have race conditions with parallel requests
 * Use only when combined with database constraints
 * 
 * @param prefix - The prefix for the code
 * @param count - The current count value
 * @returns A formatted code string
 */
export function generateSequentialCode(prefix: string, count: number): string {
  return `${prefix}_${(count + 1).toString().padStart(4, '0')}`;
}

/**
 * Generate a short UUID-like code
 * Useful for situations where short codes are preferred
 * 
 * @param prefix - Optional prefix
 * @returns A short unique code
 */
export function generateShortCode(prefix?: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix}${result}` : result;
}

// Pre-defined code generators for each entity type
export const codeGenerators = {
  users: (count: number) => generateSequentialCode('USER', count),
  restaurants: (count: number) => generateSequentialCode('RESTO', count),
  categories: (count: number) => generateSequentialCode('CAT', count),
  produits: (count: number) => generateSequentialCode('PROD', count),
  clients: (count: number) => generateSequentialCode('CLI', count),
  livreurs: (count: number) => generateSequentialCode('LIV', count),
  commandes: (count: number) => generateSequentialCode('CMD', count),
  livraisons: (count: number) => generateSequentialCode('LIVR', count),
  paiements: (count: number) => generateSequentialCode('PAIE', count),
  villes: (count: number) => generateSequentialCode('VILLE', count),
  zones: (count: number) => generateSequentialCode('ZONE', count),
  promotions: (count: number) => generateSequentialCode('PROMO', count),
};

// Default export
export default {
  generateCode,
  generateSequentialCode,
  generateShortCode,
  codeGenerators,
};