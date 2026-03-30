/**
 * Database Tables & Columns Constants
 * ===========================================
 * Constants for table and column names from db.sql
 * Use these to maintain consistency across the codebase
 */

export const TABLES = {
  // Tables principales
  USERS: 'users',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  USER_ROLES: 'user_roles',
  ROLE_PERMISSIONS: 'role_permissions',

  // Restaurants & Gestion
  RESTAURANTS: 'restaurants',
  FAMILLES: 'familles',
  CATEGORIES: 'categories',
  PRODUITS: 'produits',

  // Commandes & Clients
  CLIENTS: 'clients',
  COMMANDES: 'commandes',
  LIGNE_COMMANDES: 'ligne_commandes',

  // Livraisons
  LIVREURS: 'livreurs',
  LIVRAISONS: 'livraisons',
  LIVRAISON_POSITIONS: 'livraison_positions',

  // Paiements & Finance
  PAIEMENTS: 'paiements',
  COMMISSIONS: 'commissions',
  COMMISSION_CONFIGS: 'commission_configs',
  GAINS: 'gains',

  // Wallets
  WALLET_LIVREURS: 'wallet_livreurs',
  WALLET_TRANSACTIONS: 'wallet_transactions',

  // Promotions
  PROMOTIONS: 'promotions',

  // Localisation
  VILLES: 'villes',
  ZONES_LIVRAISON: 'zones_livraison',

  // Panier
  PANIER: 'panier',
  PANIER_LIGNES: 'panier_lignes',

  // Paramètres
  RESTAURANT_FERMETURES: 'restaurant_fermetures',
  RESTAURANT_HORAIRES: 'restaurant_horaires',
  SETTINGS_PLATFORM: 'settings_platform',
  SETTINGS_RESTAURANTS: 'settings_restaurants',

  // Notifications & Logs
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics',
  LOGS_ACTIVITE: 'logs_activite',
  EVALUATIONS: 'evaluations',
} as const;

// Export des noms de tables pour utilisation simple
export type TableName = typeof TABLES[keyof typeof TABLES];

/**
 * Colonnes communes (utilisées dans plusieurs tables)
 */
export const COLUMNS = {
  // Colonnes d'ID
  ID: 'id',

  // Colonnes de code
  CODE: 'code',
  CODE_USER: 'code_user',
  CODE_CLIENT: 'code_client',
  CODE_LIVREUR: 'code_livreur',
  CODE_RESTAURANT: 'code_restaurant',
  CODE_COMMANDE: 'code_commande',
  CODE_PRODUIT: 'code_produit',
  CODE_CATEGORIE: 'code_categorie',
  CODE_ROLE: 'code_role',
  CODE_PERMISSION: 'code_permission',
  CODE_VILLE: 'code_ville',

  // Colonnes de nom
  NOM: 'nom',
  NOM_USER: 'nom_user',
  NOM_CLIENT: 'nom_client',
  NOM_LIVREUR: 'nom_livreur',
  NOM_VILLE: 'nom_ville',
  LIBELLE: 'libelle',
  LIBELLE_CATEGORIE: 'libelle_categorie',
  LIBELLE_PRODUIT: 'libelle_produit',
  LIBELLE_ROLE: 'libelle_role',
  LIBELLE_RESTAURANT: 'libelle_restaurant',

  // Colonnes d'email
  EMAIL: 'email',
  EMAIL_USER: 'email_user',
  EMAIL_CLIENT: 'email_client',

  // Colonnes de téléphone
  TELEPHONE: 'telephone',
  TELEPHONE_USER: 'telephone_user',
  TELEPHONE_CLIENT: 'telephone_client',
  TELEPHONE_LIVREUR: 'telephone_livreur',

  // Colonnes de mot de passe
  MOT_DE_PASSE: 'mot_de_passe',

  // Colonnes d'état
  ETAT: 'etat',
  ETAT_USERS: 'etat_users',
  ETAT_CLIENT: 'statut_client',
  ETAT_LIVREURS: 'statut_livreurs',
  ETAT_RESTAURANT: 'etat_restaurant',
  ETAT_PRODUIT: 'etat_produit',
  ETAT_CATEGORIE: 'statut_categorie',
  ETAT_ROLE: 'etat_role',
  ETAT_PERMISSION: 'etat_permission',

  // Colonnes de statut
  STATUT: 'statut',
  STATUT_COMMANDE: 'statut_commande',
  STATUT_LIVRAISON: 'statut_livraison',
  STATUT_PAIEMENT: 'statut_paiement',
  STATUT_PANIER: 'statut_panier',
  STATUT_GAIN: 'statut_gain',
  STATUT_PROMOTION: 'statut_promotion',
  STATUT_ZONE: 'statut_zone',
  STATUT_VILLE: 'statut_ville',

  // Colonnes de relations
  USER_CODE: 'user_code',
  ROLE_CODE: 'role_code',
  RESTAURANT_CODE: 'restaurant_code',
  CLIENT_CODE: 'client_code',
  COMMANDE_CODE: 'commande_code',
  LIVREUR_CODE: 'livreur_code',
  PRODUIT_CODE: 'produit_code',
  CATEGORIE_CODE: 'categorie_code',
  VILLE_CODE: 'code_ville',
  PANIER_CODE: 'panier_code',
  LIVRAISON_CODE: 'livraison_code',
  WALLET_CODE: 'wallet_code',
  PERMISSION_CODE: 'permission_code',
  FAMILLE_CODE: 'famille_code',

  // Colonnes de dates
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  CREATED_AT_USER: 'created_at_user',
  UPDATED_AT_USER: 'updated_at_user',
  CREATED_AT_CLIENT: 'created_at_client',
  UPDATED_AT_CLIENT: 'updated_at_client',
  CREATED_AT_COMMANDE: 'created_at_commande',
  UPDATED_AT_COMMANDE: 'updated_at_commande',
  CREATED_AT_LIVRAISON: 'created_at_livraison',
  UPDATED_AT_LIVRAISON: 'updated_at_livraison',

  // Colonnes de prix/montant
  PRIX: 'prix',
  PRIX_PRODUIT: 'prix_produit',
  TOTAL: 'total',
  TOTAL_COMMANDE: 'total_commande',
  TOTAL_PANIER: 'total_panier',
  MONTANT: 'montant',
  MONTANT_PAIEMENT: 'montant_paiement',
  MONTANT_COMMISION: 'montant_commission',
  MONTANT_RESTAURANT: 'montant_restaurant',
  MONTANT_DELIVERY: 'montant_delivery',
  FRAIS_LIVRAISON: 'frais_livraison',
  FRAIS_LIVRAISON_DEFAUT: 'frais_livraison_defaut',

  // Colonnes de description
  DESCRIPTION: 'description',
  DESCRIPTION_RESTAURANT: 'description_restaurant',
  DESCRIPTION_PRODUIT: 'description_produit',
  DESCRIPTION_ROLE: 'description_role',

  // Colonnes d'adresse
  ADRESSE: 'adresse',
  ADRESSE_RESTAURANT: 'adresse_restaurant',

  // Colonnes diverses
  LATITUDE: 'latitude',
  LONGITUDE: 'longitude',
  LATITUDE_RESTAURANT: 'latitude_restaurant',
  LONGITUDE_RESTAURANT: 'longitude_restaurant',
  IMAGE: 'image',
  IMAGE_PRODUIT: 'image_produit',
  LOGO: 'logo',
  LOGO_RESTAURANT: 'logo_restaurant',
  PAYS: 'pays',
  DISPONIBLE: 'disponible_produit',

  // Colonnes de quantité
  QUANTITE: 'quantite',
  QUANTITE_LIGNE_COMMANDE: 'quantite_ligne_commande',
  PRIX_UNITAIRE: 'prix_unitaire',
  PRIX_UNITAIRE_LIGNE_COMMANDE: 'prix_unitaire_ligne_commande',
  TOTAL_LIGNE_COMMANDE: 'total_ligne_commande',
} as const;

/**
 * Statuts des commandes
 */
export const STATUT_COMMANDE = {
  EN_ATTENTE: 'en_attente',
  PAYEE: 'payee',
  EN_PREPARATION: 'en_preparation',
  LIVREE: 'livree',
  ANNULEE: 'annulee',
} as const;

/**
 * Statuts des livraisons
 */
export const STATUT_LIVRAISON = {
  EN_ATTENTE: 'en_attente',
  ASSIGNEE: 'assignee',
  EN_COURS: 'en_cours',
  LIVREE: 'livree',
  ANNULEE: 'annulee',
} as const;

/**
 * Statuts des paiements
 */
export const STATUT_PAIEMENT = {
  EN_ATTENTE: 'en_attente',
  VALIDE: 'valide',
  ECHOUEE: 'echoue',
} as const;

/**
 * Méthodes de paiement
 */
export const METHODE_PAIEMENT = {
  ESPECES: 'espèces',
  MOBILE_MONEY: 'mobile_money',
  CARTE_BANCAIRE: 'carte_bancaire',
  PAYPAL: 'paypal',
  AUTRE: 'autre',
} as const;

/**
 * Types de transactions wallet
 */
export const TYPE_TRANSACTION = {
  COMMISSION: 'commission',
  RETRAIT: 'retrait',
  BONUS: 'bonus',
  PENALITE: 'penalite',
} as const;

/**
 * Types de promotions
 */
export const TYPE_PROMOTION = {
  POURCENTAGE: 'pourcentage',
  MONTANT_FIXE: 'montant_fixe',
  LIVRAISON_GRATUITE: 'Livraison_gratuite',
} as const;

/**
 * Types de commission
 */
export const TYPE_COMMISSION = {
  POURCENTAGE: 'pourcentage',
  FIXE: 'fixe',
} as const;
/**
 * defaut etats
 */
export const ETAT_DEFAUT = {
  ACTIF: 1,
  INACTIF: 0,
} as const;

// Export par défaut
export default {
  TABLES,
  COLUMNS,
  STATUT_COMMANDE,
  STATUT_LIVRAISON,
  STATUT_PAIEMENT,
  METHODE_PAIEMENT,
  TYPE_TRANSACTION,
  TYPE_PROMOTION,
  TYPE_COMMISSION,
  ETAT_DEFAUT,
};