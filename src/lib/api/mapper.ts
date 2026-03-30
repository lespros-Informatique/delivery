/**
 * Database to API Mapper
 * ===========================================
 * Utility to map database field names (snake_case) to API field names (camelCase)
 * Ensures consistency across the frontend
 * 
 * Based on tables.ts constants from backend
 */

// Field mapping configuration - maps database column names to API response names
export const FIELD_MAPPING = {
  // Users table
  'id_user': 'id',
  'code_user': 'codeUser',
  'nom_user': 'nomUser',
  'email_user': 'emailUser',
  'telephone_user': 'telephoneUser',
  'mot_de_passe': 'motDePasse',
  'etat_users': 'etatUsers',
  'created_at_user': 'createdAtUser',
  'updated_at_user': 'updatedAtUser',
  
  // Clients table
  'id_client': 'id',
  'code_client': 'codeClient',
  'nom_client': 'nomClient',
  'email_client': 'emailClient',
  'telephone_client': 'telephoneClient',
  'statut_client': 'statutClient',
  'created_at_client': 'createdAtClient',
  'updated_at_client': 'updatedAtClient',
  
  // Restaurants table
  'id_restaurant': 'id',
  'code_restaurant': 'codeRestaurant',
  'libelle_restaurant': 'nomRestaurant',
  'description_restaurant': 'descriptionRestaurant',
  'adresse_restaurant': 'addressRestaurant',
  'ville_code': 'villeCode',
  'logo_restaurant': 'imageRestaurant',
  'etat_restaurant': 'etatRestaurant',
  'created_at_restaurant': 'createdAtRestaurant',
  'updated_at_restaurant': 'updatedAtRestaurant',
  'latitude_restaurant': 'latitude',
  'longitude_restaurant': 'longitude',
  'famille_code': 'familleCode',
  
  // Categories table
  'id_categorie': 'id',
  'code_categorie': 'codeCategorie',
  'libelle_categorie': 'libelleCategorie',
  'statut_categorie': 'statutCategorie',
  'updated_at_categorie': 'updatedAtCategorie',
  
  // Products table
  'id_produit': 'id',
  'code_produit': 'codeProduit',
  'categorie_code': 'categorieCode',
  'libelle_produit': 'libelleProduit',
  'description_produit': 'descriptionProduit',
  'prix_produit': 'prixProduit',
  'image_produit': 'imageProduit',
  'disponible_produit': 'disponible',
  'etat_produit': 'etatProduit',
  'created_at_produit': 'createdAtProduit',
  'updated_at_produit': 'updatedAtProduit',
  
  // Livreurs table
  'id_livreur': 'id',
  'code_livreur': 'codeLivreur',
  'nom_livreur': 'nomLivreur',
  'telephone_livreur': 'telephoneLivreur',
  'statut_livreurs': 'statutLivreurs',
  'created_at_livreur': 'createdAtLivreur',
  
  // Commandes table
  'id_commande': 'id',
  'code_commande': 'codeCommande',
  'restaurant_code': 'restaurantCode',
  'client_code': 'clientCode',
  'total_commande': 'totalCommande',
  'statut_commande': 'statutCommande',
  'created_at_commande': 'createdAtCommande',
  'updated_at_commande': 'updatedAtCommande',
  
  // Livraisons table
  'id_livraison': 'id',
  'code_livraison': 'codeLivraison',
  'commande_code': 'commandeCode',
  'livreur_code': 'livreurCode',
  'statut_livraison': 'statutLivraison',
  'created_at_livraison': 'createdAtLivraison',
  'updated_at_livraison': 'updatedAtLivraison',
  
  // Paiements table
  'id_paiement': 'id',
  'code_paiement': 'codePaiement',
  'methode_paiement': 'methodePaiement',
  'montant_paiement': 'montantPaiement',
  'reference_externe': 'referenceExterne',
  'statut_paiement': 'statutPaiement',
  'created_at_paiement': 'createdAtPaiement',
  
  // Villes table
  'id_ville': 'id',
  'code_ville': 'codeVille',
  'nom_ville': 'nomVille',
  'frais_livraison_defaut': 'fraisLivraisonDefaut',
  'statut_ville': 'statutVille',
  
  // Zones livraison table
  'id_zone': 'id',
  'code_zone': 'codeZone',
  'nom_zone': 'nomZone',
  'frais_livraison': 'fraisLivraison',
  'delai_minutes': 'delaiMinutes',
  'statut_zone': 'statutZone',
} as const;

/**
 * Map a single object from snake_case to camelCase
 * @param obj - Object with snake_case keys from database/API
 * @returns Object with camelCase keys
 */
export function mapToCamelCase<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Record<string, unknown> = {};
  
  for (const key in obj) {
    const mappedKey = FIELD_MAPPING[key as keyof typeof FIELD_MAPPING] || key;
    result[mappedKey] = obj[key];
  }
  
  return result as Partial<T>;
}

/**
 * Map an array of objects from snake_case to camelCase
 * @param arr - Array of objects with snake_case keys
 * @returns Array of objects with camelCase keys
 */
export function mapArrayToCamelCase<T extends Record<string, unknown>>(arr: T[]): Partial<T>[] {
  return arr.map(item => mapToCamelCase(item));
}

/**
 * Map API response to frontend format
 * Handles both single objects and arrays with pagination
 */
export function mapApiResponse<T extends Record<string, unknown>>(
  response: unknown,
  isPaginated: boolean = false
): T | T[] | { data: T[]; pagination?: unknown } {
  // Handle paginated response
  if (isPaginated && response && typeof response === 'object' && 'data' in response) {
    const resp = response as { data: T[]; pagination?: unknown };
    return {
      data: mapArrayToCamelCase(resp.data),
      pagination: resp.pagination,
    };
  }
  
  // Handle array response
  if (Array.isArray(response)) {
    return mapArrayToCamelCase(response) as T[];
  }
  
  // Handle single object
  if (response && typeof response === 'object') {
    return mapToCamelCase(response as T) as T;
  }
  
  return response as T;
}

/**
 * Convert camelCase to snake_case for API requests
 */
export function toSnakeCase<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const key in obj) {
    // Find reverse mapping
    const reverseEntry = Object.entries(FIELD_MAPPING).find(([, value]) => value === key);
    const snakeKey = reverseEntry ? reverseEntry[0] : key;
    result[snakeKey] = obj[key];
  }
  
  return result;
}

// Default export
export default {
  FIELD_MAPPING,
  mapToCamelCase,
  mapArrayToCamelCase,
  mapApiResponse,
  toSnakeCase,
};