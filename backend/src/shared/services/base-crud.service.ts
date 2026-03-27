/**
 * Base CRUD Service
 * ===========================================
 * Generic CRUD operations for all entities
 * Reduces code duplication across routes
 */

import { prisma } from '../../infrastructure/database/prisma.service.js';
import { COLUMNS } from '../constants/tables.js';
import { generateSequentialCode } from '../utils/code-generator.util.js';

/**
 * Interface for Prisma models used in BaseCRUDService
 */
interface PrismaModel<T> {
  name: string;
  findMany(args?: any): Promise<T[]>;
  findUnique(args: any): Promise<T | null>;
  count(args?: any): Promise<number>;
  create(args: any): Promise<T>;
  update(args: any): Promise<T>;
  delete(args: any): Promise<T>;
}

/**
 * Generic CRUD Service for any Prisma model
 */
export class BaseCRUDService<T> {
  private model: PrismaModel<T>;
  private codeColumn: string;
  private codePrefix: string;

  /**
   * 
   * @param model - Prisma model instance (e.g., prisma.users)
   * @param codeColumn - The column name for the code (e.g., 'code_restaurant')
   * @param codePrefix - The prefix for codes (e.g., 'RESTO', 'CLI')
   */
  constructor(model: any, codeColumn: string, codePrefix: string) {
    this.model = model;
    this.codeColumn = codeColumn;
    this.codePrefix = codePrefix;
  }

  /**
   * Get all records with optional pagination and filtering
   */
  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    searchFields?: string[];
    include?: any;
    where?: any;
    orderBy?: any;
  } = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      searchFields = [],
      include,
      where,
      orderBy = { created_at: 'desc' }
    } = options;

    // Build search condition
    let searchCondition = where || {};
    if (search && searchFields.length > 0) {
      searchCondition = {
        ...searchCondition,
        OR: searchFields.map(field => ({
          [field]: { contains: search }
        }))
      };
    }

    // Get total count
    const total = await this.model.count({ where: searchCondition });

    // Get paginated results
    const data = await this.model.findMany({
      where: searchCondition,
      skip: (page - 1) * limit,
      take: limit,
      include,
      orderBy,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Get a single record by code
   */
  async findByCode(code: string, include?: any) {
    return this.model.findUnique({
      where: { [this.codeColumn]: code },
      include,
    });
  }

  /**
   * Get a single record by ID
   */
  async findById(id: number, include?: any) {
    return this.model.findUnique({
      where: { id },
      include,
    });
  }

  /**
   * Create a new record
   * Generates a sequential code based on current count
   * Uses Prisma transaction to ensure atomicity
   */
  async create(data: any, additionalData: Record<string, any> = {}) {
    // Use transaction to ensure atomic code generation
    return await prisma.$transaction(async (tx) => {
      // Get current count within transaction
      const modelName = this.model.name.toLowerCase() as keyof typeof tx;
      // @ts-ignore - Dynamic access with lowercase name mapping for Prisma client
      const count = await tx[modelName].count();
      const code = generateSequentialCode(this.codePrefix, count);

      // @ts-ignore - Dynamic access with lowercase name mapping for Prisma client
      return await tx[modelName].create({
        data: {
          ...data,
          [this.codeColumn]: code,
          ...additionalData,
        },
      });
    });
  }

  /**
   * Create with custom code (for migrations/backwards compatibility)
   */
  async createWithCode(code: string, data: any, additionalData: Record<string, any> = {}) {
    return this.model.create({
      data: {
        ...data,
        [this.codeColumn]: code,
        ...additionalData,
      },
    });
  }

  /**
   * Update a record by code
   */
  async updateByCode(code: string, data: any) {
    return this.model.update({
      where: { [this.codeColumn]: code },
      data,
    });
  }

  /**
   * Update a record by ID
   */
  async updateById(id: number, data: any) {
    return this.model.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a record by code
   */
  async deleteByCode(code: string) {
    return this.model.delete({
      where: { [this.codeColumn]: code },
    });
  }

  /**
   * Delete a record by ID
   */
  async deleteById(id: number) {
    return this.model.delete({
      where: { id },
    });
  }

  /**
   * Check if a code exists
   */
  async codeExists(code: string): Promise<boolean> {
    const count = await this.model.count({
      where: { [this.codeColumn]: code },
    });
    return count > 0;
  }

  /**
   * Check if a field value exists (e.g., email uniqueness)
   */
  async fieldExists(field: string, value: any): Promise<boolean> {
    const count = await this.model.count({
      where: { [field]: value },
    });
    return count > 0;
  }
}

/**
 * Factory function to create CRUD services
 */
export function createCRUDService<T>(model: any, codeColumn: string, codePrefix: string) {
  return new BaseCRUDService<T>(model, codeColumn, codePrefix);
}

// Pre-configured services for common entities
export const userService = createCRUDService(prisma.users, COLUMNS.CODE_USER, 'USER');
export const restaurantService = createCRUDService(prisma.restaurants, COLUMNS.CODE_RESTAURANT, 'RESTO');
export const categoryService = createCRUDService(prisma.categories, COLUMNS.CODE_CATEGORIE, 'CAT');
export const productService = createCRUDService(prisma.produits, COLUMNS.CODE_PRODUIT, 'PROD');
export const clientService = createCRUDService(prisma.clients, COLUMNS.CODE_CLIENT, 'CLI');
export const livreurService = createCRUDService(prisma.livreurs, COLUMNS.CODE_LIVREUR, 'LIV');
export const commandeService = createCRUDService(prisma.commandes, COLUMNS.CODE_COMMANDE, 'CMD');
export const livraisonService = createCRUDService(prisma.livraisons, 'code_livraison', 'LIVR');
export const paiementService = createCRUDService(prisma.paiements, 'code_paiement', 'PAIE');
export const villeService = createCRUDService(prisma.villes, 'code_ville', 'VILLE');
export const zoneService = createCRUDService(prisma.zones_livraison, 'code_zone', 'ZONE');

export default {
  BaseCRUDService,
  createCRUDService,
  userService,
  restaurantService,
  categoryService,
  productService,
  clientService,
  livreurService,
  commandeService,
  livraisonService,
  paiementService,
  villeService,
  zoneService,
};