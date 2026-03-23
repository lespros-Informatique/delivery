// Types pour la base de données Woli Delivery
// Correspondant aux tables de db.sql

// ============================================
// TYPES UTILITAIRES COMMUNS
// ============================================

/** Statut générique pour les entités */
export type Statut = 'actif' | 'inactif' | 'bloqué' | 'en_attente';

/** Type de commission */
export type TypeCommission = 'pourcentage' | 'fixe';

/** Statut commande */
export type StatutCommande = 'en_attente' | 'payee' | 'en_preparation' | 'livree' | 'annulee';

/** Statut livraison */
export type StatutLivraison = 'en_attente' | 'assignee' | 'en_cours' | 'livree' | 'annulee';

/** Méthode de paiement */
export type MethodePaiement = 'espèces' | 'mobile_money' | 'carte_bancaire' | 'paypal' | 'autre';

/** Statut paiement */
export type StatutPaiement = 'en_attente' | 'valide' | 'echoue';

/** Type de promotion */
export type TypePromotion = 'pourcentage' | 'montant_fixe' | 'Livraison_gratuite';

/** Type analytics */
export type TypeAnalytics = 'commandes' | 'revenus' | 'livraisons' | 'clients';

/** Type transaction wallet */
export type TypeTransaction = 'commission' | 'retrait' | 'bonus' | 'penalite';

/** Jours de la semaine */
export type JourSemaine = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi' | 'samedi' | 'dimanche';

/** Famille de restaurant */
export type FamilleRestaurant = 'AFRICAIN' | 'EUROPEEN' | 'ASIE';

// ============================================
// TYPES USERS & AUTHENTIFICATION
// ============================================

export interface User {
  id_user: number;
  code_user: string;
  nom_user: string;
  email_user: string;
  telephone_user: string | null;
  mot_de_passe: string;
  etat_users: number;
  created_at_user: string;
  updated_at_user: string;
}

export interface Role {
  id_role: number;
  code_role: string;
  libelle_role: string;
  description_role: string | null;
  etat_role: number;
  created_at_role: string;
}

export interface Permission {
  id_permission: number;
  code_permission: string;
  description_permission: string | null;
  created_at_permission: string;
  etat_permission: number;
}

export interface UserRole {
  id_user_role: number;
  user_code: string;
  role_code: string;
  etat_user_role: number;
}

export interface RolePermission {
  id_role_permission: number;
  role_code: string;
  permission_code: string;
  etat_role_permission: number;
}

// ============================================
// TYPES RESTAURANT
// ============================================

export interface Restaurant {
  id_restaurant: number;
  code_restaurant: string;
  user_code: string;
  libelle_restaurant: string;
  description_restaurant: string | null;
  adresse_restaurant: string | null;
  ville_code: string | null;
  logo_restaurant: string | null;
  etat_restaurant: number;
  created_at_restaurant: string;
  updated_at_restaurant: string;
  latitude_restaurant: number | null;
  longitude_restaurant: number | null;
  famille_code: string | null;
}

export interface Categorie {
  id_categorie: number;
  code_categorie: string;
  restaurant_code: string;
  libelle_categorie: string;
  statut_categorie: number;
  updated_at_categorie: string;
}

export interface Produit {
  id_produit: number;
  code_produit: string;
  restaurant_code: string;
  categorie_code: string | null;
  libelle_produit: string;
  description_produit: string | null;
  prix_produit: number;
  image_produit: string | null;
  disponible_produit: number;
  etat_produit: number;
  created_at_produit: string;
  updated_at_produit: string;
}

export interface Famille {
  id_famille: number;
  code_famille: string;
  libelle_famille: string;
  statut_famille: number;
}

export interface Ville {
  id_ville: number;
  code_ville: string;
  nom_ville: string;
  pays: string;
  latitude: number | null;
  longitude: number | null;
  frais_livraison_defaut: number;
  statut_ville: number;
}

export interface ZoneLivraison {
  id_zone: number;
  code_zone: string;
  ville_code: string;
  nom_zone: string;
  frais_livraison: number;
  delai_minutes: number;
  statut_zone: number;
}

export interface RestaurantHoraire {
  id_horaire: number;
  restaurant_code: string;
  jour: JourSemaine;
  heure_ouverture: string;
  heure_fermeture: string;
  statut_horaire: number;
}

export interface RestaurantFermeture {
  id_fermeture: number;
  restaurant_code: string;
  date_debut: string;
  date_fin: string;
  motif: string | null;
  created_at_fermeture: string;
}

// ============================================
// TYPES COMMANDES & PANIER
// ============================================

export interface Commande {
  id_commande: number;
  code_commande: string;
  restaurant_code: string;
  client_code: string;
  total_commande: number;
  statut_commande: StatutCommande;
  created_at_commande: string;
  updated_at_commande: string;
}

export interface LigneCommande {
  id_commande_ligne: number;
  code_commande_ligne: string;
  commande_code: string;
  produit_code: string;
  quantite_ligne_commande: number;
  prix_unitaire_ligne_commande: number;
  total_ligne_commande: number;
  etat_ligne_commande: number;
}

export interface Panier {
  id_panier: number;
  code_panier: string;
  client_code: string;
  restaurant_code: string;
  total_panier: number;
  statut_panier: 'en_cours' | 'valide' | 'annule';
  created_at: string;
}

export interface LignePanier {
  id_ligne_panier: number;
  code_ligne_panier: string;
  panier_code: string;
  produit_code: string;
  quantite_ligne_panier: number;
  prix_unitaire_ligne__panier: number;
  total_ligne_panier: number;
  etat_ligne_panier: number;
}

// ============================================
// TYPES LIVRAISONS
// ============================================

export interface Livraison {
  id_livraison: number;
  code_livraison: string;
  commande_code: string;
  livreur_code: string;
  statut_livraison: StatutLivraison;
  created_at_livraison: string;
  updated_at_livraison: string;
}

export interface Livreur {
  id_livreur: number;
  code_livreur: string;
  restaurant_code: string | null;
  nom_livreur: string;
  telephone_livreur: string | null;
  statut_livreurs: number;
  created_at_livreur: string;
}

export interface LivraisonPosition {
  id_position: number;
  livraison_code: string;
  latitude: number;
  longitude: number;
  created_at_position: string;
}

// ============================================
// TYPES CLIENTS
// ============================================

export interface Client {
  id_client: number;
  code_client: string;
  restaurant_code: string;
  nom_client: string;
  telephone_client: string | null;
  email_client: string | null;
  statut_client: number;
  created_at_client: string;
  updated_at_client: string;
}

export interface Evaluation {
  id_evaluation: number;
  code_evaluation: string;
  commande_code: string;
  client_code: string;
  restaurant_code: string;
  note: number;
  commentaire: string | null;
  note_livraison: number | null;
  commentaire_livraison: string | null;
  created_at_evaluation: string;
}

// ============================================
// TYPES PAIEMENTS & WALLETS
// ============================================

export interface Paiement {
  id_paiement: number;
  code_paiement: string;
  commande_code: string;
  methode_paiement: MethodePaiement | null;
  montant_paiement: number;
  reference_externe: string | null;
  statut_paiement: StatutPaiement;
  created_at_paiement: string;
}

export interface WalletLivreur {
  id_wallet: number;
  code_wallet: string;
  livreur_code: string;
  solde: number;
  total_retire: number;
  statut_wallet: 'actif' | 'bloqué' | 'inactif';
  created_at_wallet: string;
}

export interface WalletTransaction {
  id_transaction: number;
  code_transaction: string;
  wallet_code: string;
  type_transaction: TypeTransaction;
  montant: number;
  reference: string | null;
  description: string | null;
  statut_transaction: StatutPaiement;
  created_at_transaction: string;
}

// ============================================
// TYPES COMMISSIONS & GAINS
// ============================================

export interface Commission {
  id_commission: number;
  code_commission: string;
  commande_code: string;
  type_commission: TypeCommission;
  valeur_commission: number;
  montant_commission: number;
  created_at_commission: string;
  etat_commission: number;
}

export interface CommissionConfig {
  id_config: number;
  code_config: string;
  restaurant_code: string | null;
  type_commission: TypeCommission;
  taux_commission: number;
  montant_fixe: number | null;
  statut_config: number;
  created_at_config: string;
}

export interface Gain {
  id_gain: number;
  code_gain: string;
  restaurant_code: string;
  commande_code: string;
  montant_restaurant: number;
  montant_delivery: number;
  statut_gain: 'en_attente' | 'verse' | 'annule';
  created_at_gain: string;
}

// ============================================
// TYPES ANALYTICS & RAPPORTS
// ============================================

export interface Analytics {
  id_analytics: number;
  date_analytics: string;
  restaurant_code: string | null;
  type_analytics: TypeAnalytics;
  valeur: number;
  montant: number;
}

export interface Promotion {
  id_promotion: number;
  code_promotion: string;
  restaurant_code: string | null;
  type_promotion: TypePromotion;
  valeur: number;
  code_reduction: string | null;
  date_debut: string;
  date_fin: string;
  utilisations_max: number | null;
  utilisations_actuelles: number;
  statut_promotion: 'active' | 'desactive' | 'expiree';
}

// ============================================
// TYPES NOTIFICATIONS & LOGS
// ============================================

export interface Notification {
  id_notification: number;
  code_notification: string;
  user_code: string | null;
  livreur_code: string | null;
  client_code: string | null;
  type_notification: 'commande' | 'livraison' | 'paiement' | 'promotion' | 'system';
  titre: string;
  message: string;
  lu: number;
  created_at_notification: string;
}

export interface LogActivite {
  id_log: number;
  user_code: string | null;
  action: string;
  table_concernee: string | null;
  reference: string | null;
  details: string | null;
  adresse_ip: string | null;
  created_at_log: string;
}

// ============================================
// TYPES PARAMÈTRES
// ============================================

export interface SettingsPlatform {
  id_setting: number;
  code_setting: string;
  valeur: string | null;
  created_at_setting: string;
  etat_settings_platform: number;
}

export interface SettingsRestaurant {
  id_setting: number;
  restaurant_code: string;
  code_setting: string;
  valeur_settings_restaurant: string;
  created_at_settings_restaurant: string;
  updated_at_settings_restaurant: string;
}
