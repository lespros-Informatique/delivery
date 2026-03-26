/**
 * Zod Validation Schemas - Backend
 * ===========================================
 * Shared validation schemas for API requests
 * Uses constants from tables.ts for field names
 */

import { z } from 'zod';
import { COLUMNS } from '../shared/constants/tables.js';

// ===========================================
// Common validation patterns
// ===========================================

// Code pattern (e.g., RESTO_0001, CLI_0001)
const codePattern = /^[A-Z]+_\d{4}$/;

// Phone number pattern ( Côte d'Ivoire: +225XXXXXXXX)
const phonePattern = /^\+225\d{10}$|^\d{10}$/;

// ===========================================
// User schemas
// ===========================================

export const createUserSchema = z.object({
  [COLUMNS.EMAIL_USER]: z.string().email('Email invalide'),
  [COLUMNS.NOM_USER]: z.string().min(1, 'Le nom est requis').max(100),
  [COLUMNS.TELEPHONE_USER]: z.string().optional(),
  motDePasse: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const updateUserSchema = z.object({
  [COLUMNS.NOM_USER]: z.string().min(1).max(100).optional(),
  [COLUMNS.TELEPHONE_USER]: z.string().optional(),
  etatUsers: z.boolean().optional(),
});

// ===========================================
// Restaurant schemas
// ===========================================

export const createRestaurantSchema = z.object({
  [COLUMNS.LIBELLE_RESTAURANT]: z.string().min(1, 'Le nom du restaurant est requis').max(150),
  [COLUMNS.DESCRIPTION_RESTAURANT]: z.string().optional(),
  [COLUMNS.ADRESSE_RESTAURANT]: z.string().optional(),
  user_code: z.string().optional(),
  ville_code: z.string().optional(),
  famille_code: z.string().optional(),
});

export const updateRestaurantSchema = z.object({
  [COLUMNS.LIBELLE_RESTAURANT]: z.string().min(1).max(150).optional(),
  [COLUMNS.DESCRIPTION_RESTAURANT]: z.string().optional(),
  [COLUMNS.ADRESSE_RESTAURANT]: z.string().optional(),
  etat_restaurant: z.number().int().min(0).max(1).optional(),
});

// ===========================================
// Category schemas
// ===========================================

export const createCategorySchema = z.object({
  [COLUMNS.LIBELLE_CATEGORIE]: z.string().min(1, 'Le nom de la catégorie est requis').max(150),
  restaurant_code: z.string().min(1, 'Le code restaurant est requis'),
});

export const updateCategorySchema = z.object({
  [COLUMNS.LIBELLE_CATEGORIE]: z.string().min(1).max(150).optional(),
  statut_categorie: z.number().int().min(0).max(1).optional(),
});

// ===========================================
// Product schemas
// ===========================================

export const createProductSchema = z.object({
  [COLUMNS.LIBELLE_PRODUIT]: z.string().min(1, 'Le nom du produit est requis').max(150),
  [COLUMNS.DESCRIPTION_PRODUIT]: z.string().optional(),
  [COLUMNS.PRIX_PRODUIT]: z.number().positive('Le prix doit être positif'),
  restaurant_code: z.string().min(1, 'Le code restaurant est requis'),
  categorie_code: z.string().optional(),
  image_produit: z.string().url().optional(),
  disponible_produit: z.number().int().min(0).max(1).default(1),
});

export const updateProductSchema = z.object({
  [COLUMNS.LIBELLE_PRODUIT]: z.string().min(1).max(150).optional(),
  [COLUMNS.DESCRIPTION_PRODUIT]: z.string().optional(),
  [COLUMNS.PRIX_PRODUIT]: z.number().positive().optional(),
  disponible_produit: z.number().int().min(0).max(1).optional(),
  etat_produit: z.number().int().min(0).max(1).optional(),
});

// ===========================================
// Client schemas
// ===========================================

export const createClientSchema = z.object({
  [COLUMNS.NOM_CLIENT]: z.string().min(1, 'Le nom du client est requis').max(150),
  [COLUMNS.EMAIL_CLIENT]: z.string().email('Email invalide').optional(),
  [COLUMNS.TELEPHONE_CLIENT]: z.string().min(1, 'Le téléphone est requis'),
  restaurant_code: z.string().min(1, 'Le code restaurant est requis'),
});

export const updateClientSchema = z.object({
  [COLUMNS.NOM_CLIENT]: z.string().min(1).max(150).optional(),
  [COLUMNS.EMAIL_CLIENT]: z.string().email().optional(),
  [COLUMNS.TELEPHONE_CLIENT]: z.string().optional(),
  statut_client: z.number().int().min(0).max(1).optional(),
});

// ===========================================
// Livreur schemas
// ===========================================

export const createLivreurSchema = z.object({
  [COLUMNS.NOM_LIVREUR]: z.string().min(1, 'Le nom du livreur est requis').max(150),
  [COLUMNS.TELEPHONE_LIVREUR]: z.string().min(1, 'Le téléphone est requis'),
  restaurant_code: z.string().optional(),
});

export const updateLivreurSchema = z.object({
  [COLUMNS.NOM_LIVREUR]: z.string().min(1).max(150).optional(),
  [COLUMNS.TELEPHONE_LIVREUR]: z.string().optional(),
  statut_livreurs: z.number().int().min(0).max(1).optional(),
});

// ===========================================
// Commande schemas
// ===========================================

export const createCommandeSchema = z.object({
  restaurant_code: z.string().min(1, 'Le code restaurant est requis'),
  client_code: z.string().min(1, 'Le code client est requis'),
  total_commande: z.number().positive('Le total doit être positif'),
});

export const updateCommandeSchema = z.object({
  statut_commande: z.enum(['en_attente', 'payee', 'en_preparation', 'livree', 'annulee']).optional(),
});

// ===========================================
// Livraison schemas
// ===========================================

export const createLivraisonSchema = z.object({
  commande_code: z.string().min(1, 'Le code commande est requis'),
  livreur_code: z.string().min(1, 'Le code livreur est requis'),
});

export const updateLivraisonSchema = z.object({
  statut_livraison: z.enum(['en_attente', 'assignee', 'en_cours', 'livree', 'annulee']).optional(),
});

// ===========================================
// Paiement schemas
// ===========================================

export const createPaiementSchema = z.object({
  commande_code: z.string().min(1, 'Le code commande est requis'),
  montant_paiement: z.number().positive('Le montant doit être positif'),
  methode_paiement: z.enum(['espèces', 'mobile_money', 'carte_bancaire', 'paypal', 'autre']).optional(),
});

export const updatePaiementSchema = z.object({
  statut_paiement: z.enum(['en_attente', 'valide', 'echoue']).optional(),
});

// ===========================================
// Ville schemas
// ===========================================

export const createVilleSchema = z.object({
  [COLUMNS.NOM_VILLE]: z.string().min(1, 'Le nom de la ville est requis').max(150),
  pays: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  frais_livraison_defaut: z.number().positive().optional(),
});

export const updateVilleSchema = z.object({
  [COLUMNS.NOM_VILLE]: z.string().min(1).max(150).optional(),
  frais_livraison_defaut: z.number().positive().optional(),
  statut_ville: z.number().int().min(0).max(1).optional(),
});

// ===========================================
// Zone schemas
// ===========================================

export const createZoneSchema = z.object({
  [COLUMNS.NOM]: z.string().min(1, 'Le nom de la zone est requis').max(150),
  ville_code: z.string().min(1, 'Le code ville est requis'),
  frais_livraison: z.number().positive('Les frais de livraison doivent être positifs'),
  delai_minutes: z.number().int().positive().optional(),
});

export const updateZoneSchema = z.object({
  [COLUMNS.NOM]: z.string().min(1).max(150).optional(),
  frais_livraison: z.number().positive().optional(),
  delai_minutes: z.number().int().positive().optional(),
  statut_zone: z.number().int().min(0).max(1).optional(),
});

// ===========================================
// Pagination query schema
// ===========================================

export const paginationQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).default('10'),
  search: z.string().optional(),
});

// ===========================================
// Type exports
// ===========================================

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CreateLivreurInput = z.infer<typeof createLivreurSchema>;
export type UpdateLivreurInput = z.infer<typeof updateLivreurSchema>;
export type CreateCommandeInput = z.infer<typeof createCommandeSchema>;
export type UpdateCommandeInput = z.infer<typeof updateCommandeSchema>;
export type CreateLivraisonInput = z.infer<typeof createLivraisonSchema>;
export type UpdateLivraisonInput = z.infer<typeof updateLivraisonSchema>;
export type CreatePaiementInput = z.infer<typeof createPaiementSchema>;
export type UpdatePaiementInput = z.infer<typeof updatePaiementSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;