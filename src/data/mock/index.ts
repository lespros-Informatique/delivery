// Données mock pour le développement - Woli Delivery
// Ces données simulent les réponses de la base de données

import { 
  User, Role, Permission, UserRole, Restaurant, Categorie, Produit, Client,
  Commande, LigneCommande, Livreur, Livraison, Paiement, Analytics,
  Ville, ZoneLivraison, Promotion, Notification, Evaluation,
  Panier, LignePanier, WalletLivreur, WalletTransaction, Gain
} from 'src/types';

// ============================================
// UTILITAIRES
// ============================================

const generateCode = (prefix: string, id: number) => 
  `${prefix}_${id.toString().padStart(4, '0')}`;

const randomDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// ============================================
// DONNÉES USERS & ROLES
// ============================================

export const mockUsers: User[] = [
  {
    id_user: 1,
    code_user: 'USR_0001',
    nom_user: 'Admin Woli',
    email_user: 'admin@woli.com',
    telephone_user: '+225 07 00 00 00 01',
    mot_de_passe: '$2b$10$xxx', // hashed
    etat_users: 1,
    created_at_user: '2025-12-01 10:00:00',
    updated_at_user: '2025-12-01 10:00:00'
  },
  {
    id_user: 2,
    code_user: 'USR_0002',
    nom_user: 'Jean Kouadio',
    email_user: 'jean@restaurant.com',
    telephone_user: '+225 07 00 00 00 02',
    mot_de_passe: '$2b$10$xxx',
    etat_users: 1,
    created_at_user: '2025-12-15 10:00:00',
    updated_at_user: '2025-12-15 10:00:00'
  }
];

export const mockRoles: Role[] = [
  { id_role: 1, code_role: 'admin', libelle_role: 'Administrateur Woli', description_role: 'Accès total', etat_role: 1, created_at_role: '2025-12-20 15:01:15' },
  { id_role: 2, code_role: 'restaurant_owner', libelle_role: 'Propriétaire Restaurant', description_role: 'Gestion restaurant', etat_role: 1, created_at_role: '2025-12-20 15:01:15' },
  { id_role: 3, code_role: 'livreur', libelle_role: 'Livreur', description_role: 'Livraisons', etat_role: 1, created_at_role: '2025-12-20 15:01:15' },
  { id_role: 4, code_role: 'manager', libelle_role: 'Gestionnaire', description_role: 'Gestion quotidienne', etat_role: 1, created_at_role: '2025-12-20 15:01:15' },
  { id_role: 5, code_role: 'client', libelle_role: 'Client', description_role: 'Commande', etat_role: 1, created_at_role: '2025-12-20 15:01:15' }
];

export const mockPermissions: Permission[] = [
  { id_permission: 1, code_permission: 'user.view', description_permission: 'Voir les utilisateurs', created_at_permission: '2025-12-20 15:01:15', etat_permission: 1 },
  { id_permission: 14, code_permission: 'order.view', description_permission: 'Voir les commandes', created_at_permission: '2025-12-20 15:01:15', etat_permission: 1 },
  { id_permission: 15, code_permission: 'order.update_status', description_permission: 'Changer le statut', created_at_permission: '2025-12-20 15:01:15', etat_permission: 1 },
];

export const mockUserRoles: UserRole[] = [
  { id_user_role: 1, user_code: 'USR_0001', role_code: 'admin', etat_user_role: 1 },
  { id_user_role: 2, user_code: 'USR_0002', role_code: 'restaurant_owner', etat_user_role: 1 },
];

// ============================================
// DONNÉES VILLES & ZONES
// ============================================

export const mockVilles: Ville[] = [
  { id_ville: 1, code_ville: 'ABIDJAN', nom_ville: 'Abidjan', pays: "Côte d'Ivoire", latitude: 5.36, longitude: -4.0, frais_livraison_defaut: 500, statut_ville: 1 },
  { id_ville: 2, code_ville: 'YAMOUSSOUKRO', nom_ville: 'Yamoussoukro', pays: "Côte d'Ivoire", latitude: 6.85, longitude: -5.27, frais_livraison_defaut: 1000, statut_ville: 1 },
  { id_ville: 3, code_ville: 'BOUAKE', nom_ville: 'Bouaké', pays: "Côte d'Ivoire", latitude: 7.69, longitude: -5.03, frais_livraison_defaut: 800, statut_ville: 1 },
];

export const mockZones: ZoneLivraison[] = [
  { id_zone: 1, code_zone: 'ABJ_COCODY', ville_code: 'ABIDJAN', nom_zone: 'Cocody', frais_livraison: 300, delai_minutes: 20, statut_zone: 1 },
  { id_zone: 2, code_zone: 'ABJ_MARCORY', ville_code: 'ABIDJAN', nom_zone: 'Marcory', frais_livraison: 300, delai_minutes: 20, statut_zone: 1 },
  { id_zone: 3, code_zone: 'ABJ_TREICHVILLE', ville_code: 'ABIDJAN', nom_zone: 'Treichville', frais_livraison: 400, delai_minutes: 25, statut_zone: 1 },
  { id_zone: 4, code_zone: 'ABJ_PLANTEUR', ville_code: 'ABIDJAN', nom_zone: 'Le Plateau', frais_livraison: 200, delai_minutes: 15, statut_zone: 1 },
];

// ============================================
// DONNÉES RESTAURANTS & PRODUITS
// ============================================

export const mockRestaurants: Restaurant[] = [
  {
    id_restaurant: 1,
    code_restaurant: 'REST_0001',
    user_code: 'USR_0002',
    libelle_restaurant: 'Le Délice Africain',
    description_restaurant: 'Spécialités culinaires africaines',
    adresse_restaurant: 'Cocody, Abidjan',
    ville_code: 'ABIDJAN',
    logo_restaurant: '/assets/products/product-1.png',
    etat_restaurant: 1,
    created_at_restaurant: '2025-12-15 10:00:00',
    updated_at_restaurant: '2025-12-15 10:00:00',
    latitude_restaurant: 5.36,
    longitude_restaurant: -4.0,
    famille_code: 'AFRICAIN'
  }
];

export const mockCategories: Categorie[] = [
  { id_categorie: 1, code_categorie: 'CAT_0001', restaurant_code: 'REST_0001', libelle_categorie: 'Entrées', statut_categorie: 1, updated_at_categorie: '2025-12-15 10:00:00' },
  { id_categorie: 2, code_categorie: 'CAT_0002', restaurant_code: 'REST_0001', libelle_categorie: 'Plats principaux', statut_categorie: 1, updated_at_categorie: '2025-12-15 10:00:00' },
  { id_categorie: 3, code_categorie: 'CAT_0003', restaurant_code: 'REST_0001', libelle_categorie: 'Boissons', statut_categorie: 1, updated_at_categorie: '2025-12-15 10:00:00' },
  { id_categorie: 4, code_categorie: 'CAT_0004', restaurant_code: 'REST_0001', libelle_categorie: 'Desserts', statut_categorie: 1, updated_at_categorie: '2025-12-15 10:00:00' },
];

export const mockProduits: Produit[] = [
  { id_produit: 1, code_produit: 'PROD_0001', restaurant_code: 'REST_0001', categorie_code: 'CAT_0001', libelle_produit: 'Attieké细小', description_produit: 'Attieké细小球配香辣鱼', prix_produit: 1500, image_produit: '/assets/products/product-1.png', disponible_produit: 1, etat_produit: 1, created_at_produit: '2025-12-15 10:00:00', updated_at_produit: '2025-12-15 10:00:00' },
  { id_produit: 2, code_produit: 'PROD_0002', restaurant_code: 'REST_0001', categorie_code: 'CAT_0002', libelle_produit: 'Poulet DG', description_produit: 'Poulet braisé aux légumes', prix_produit: 3500, image_produit: '/assets/products/product-2.png', disponible_produit: 1, etat_produit: 1, created_at_produit: '2025-12-15 10:00:00', updated_at_produit: '2025-12-15 10:00:00' },
  { id_produit: 3, code_produit: 'PROD_0003', restaurant_code: 'REST_0001', categorie_code: 'CAT_0002', libelle_produit: 'Kedjenou', description_produit: 'Poulet mijoté', prix_produit: 3000, image_produit: '/assets/products/product-3.png', disponible_produit: 1, etat_produit: 1, created_at_produit: '2025-12-15 10:00:00', updated_at_produit: '2025-12-15 10:00:00' },
  { id_produit: 4, code_produit: 'PROD_0004', restaurant_code: 'REST_0001', categorie_code: 'CAT_0003', libelle_produit: 'Bissap', description_produit: 'Boisson au hibiscus', prix_produit: 500, image_produit: '/assets/products/product-4.png', disponible_produit: 1, etat_produit: 1, created_at_produit: '2025-12-15 10:00:00', updated_at_produit: '2025-12-15 10:00:00' },
  { id_produit: 5, code_produit: 'PROD_0005', restaurant_code: 'REST_0001', categorie_code: 'CAT_0004', libelle_produit: 'Gâteau au pistache', description_produit: 'Gâteau traditionnel', prix_produit: 1000, image_produit: '/assets/products/product-5.png', disponible_produit: 1, etat_produit: 1, created_at_produit: '2025-12-15 10:00:00', updated_at_produit: '2025-12-15 10:00:00' },
];

// ============================================
// DONNÉES CLIENTS
// ============================================

export const mockClients: Client[] = [
  { id_client: 1, code_client: 'CLT_0001', restaurant_code: 'REST_0001', nom_client: 'Marie Kouassi', telephone_client: '+225 07 00 00 10 01', email_client: 'marie@email.com', statut_client: 1, created_at_client: '2026-01-01 10:00:00', updated_at_client: '2026-01-01 10:00:00' },
  { id_client: 2, code_client: 'CLT_0002', restaurant_code: 'REST_0001', nom_client: 'Paul Boat', telephone_client: '+225 07 00 00 10 02', email_client: 'paul@email.com', statut_client: 1, created_at_client: '2026-01-05 10:00:00', updated_at_client: '2026-01-05 10:00:00' },
  { id_client: 3, code_client: 'CLT_0003', restaurant_code: 'REST_0001', nom_client: 'Sophie Ben', telephone_client: '+225 07 00 00 10 03', email_client: 'sophie@email.com', statut_client: 1, created_at_client: '2026-01-10 10:00:00', updated_at_client: '2026-01-10 10:00:00' },
];

// ============================================
// DONNÉES COMMANDES
// ============================================

export const mockCommandes: Commande[] = [
  { id_commande: 1, code_commande: 'CMD_0001', restaurant_code: 'REST_0001', client_code: 'CLT_0001', total_commande: 5000, statut_commande: 'livree', created_at_commande: '2026-03-22 12:30:00', updated_at_commande: '2026-03-22 13:00:00' },
  { id_commande: 2, code_commande: 'CMD_0002', restaurant_code: 'REST_0001', client_code: 'CLT_0002', total_commande: 3500, statut_commande: 'en_preparation', created_at_commande: '2026-03-22 13:15:00', updated_at_commande: '2026-03-22 13:15:00' },
  { id_commande: 3, code_commande: 'CMD_0003', restaurant_code: 'REST_0001', client_code: 'CLT_0003', total_commande: 7000, statut_commande: 'en_attente', created_at_commande: '2026-03-22 14:00:00', updated_at_commande: '2026-03-22 14:00:00' },
  { id_commande: 4, code_commande: 'CMD_0004', restaurant_code: 'REST_0001', client_code: 'CLT_0001', total_commande: 2000, statut_commande: 'payee', created_at_commande: '2026-03-21 18:00:00', updated_at_commande: '2026-03-21 18:30:00' },
  { id_commande: 5, code_commande: 'CMD_0005', restaurant_code: 'REST_0001', client_code: 'CLT_0002', total_commande: 4500, statut_commande: 'annulee', created_at_commande: '2026-03-20 19:00:00', updated_at_commande: '2026-03-20 19:15:00' },
];

export const mockLignesCommandes: LigneCommande[] = [
  { id_commande_ligne: 1, code_commande_ligne: 'LIGN_0001', commande_code: 'CMD_0001', produit_code: 'PROD_0001', quantite_ligne_commande: 2, prix_unitaire_ligne_commande: 1500, total_ligne_commande: 3000, etat_ligne_commande: 1 },
  { id_commande_ligne: 2, code_commande_ligne: 'LIGN_0002', commande_code: 'CMD_0001', produit_code: 'PROD_0002', quantite_ligne_commande: 1, prix_unitaire_ligne_commande: 3500, total_ligne_commande: 3500, etat_ligne_commande: 1 },
  { id_commande_ligne: 3, code_commande_ligne: 'LIGN_0003', commande_code: 'CMD_0001', produit_code: 'PROD_0004', quantite_ligne_commande: 2, prix_unitaire_ligne_commande: 500, total_ligne_commande: 1000, etat_ligne_commande: 1 },
];

// ============================================
// DONNÉES LIVREURS
// ============================================

export const mockLivreurs: Livreur[] = [
  { id_livreur: 1, code_livreur: 'LIV_0001', restaurant_code: null, nom_livreur: 'Kouadio Blaise', telephone_livreur: '+225 07 00 00 20 01', statut_livreurs: 1, created_at_livreur: '2026-01-01 10:00:00' },
  { id_livreur: 2, code_livreur: 'LIV_0002', restaurant_code: null, nom_livreur: 'Amani Jean', telephone_livreur: '+225 07 00 00 20 02', statut_livreurs: 1, created_at_livreur: '2026-01-05 10:00:00' },
  { id_livreur: 3, code_livreur: 'LIV_0003', restaurant_code: 'REST_0001', nom_livreur: 'Yao Michel', telephone_livreur: '+225 07 00 00 20 03', statut_livreurs: 1, created_at_livreur: '2026-01-10 10:00:00' },
];

export const mockLivraisons: Livraison[] = [
  { id_livraison: 1, code_livraison: 'LIVR_0001', commande_code: 'CMD_0001', livreur_code: 'LIV_0001', statut_livraison: 'livree', created_at_livraison: '2026-03-22 12:30:00', updated_at_livraison: '2026-03-22 13:00:00' },
  { id_livraison: 2, code_livraison: 'LIVR_0002', commande_code: 'CMD_0002', livreur_code: 'LIV_0003', statut_livraison: 'en_cours', created_at_livraison: '2026-03-22 13:15:00', updated_at_livraison: '2026-03-22 13:30:00' },
];

// ============================================
// DONNÉES PROMOTIONS
// ============================================

export const mockPromotions: Promotion[] = [
  { id_promotion: 1, code_promotion: 'PROMO_0001', restaurant_code: null, type_promotion: 'pourcentage', valeur: 10, code_reduction: 'BIENVENUE10', date_debut: '2026-01-01', date_fin: '2026-12-31', utilisations_max: 100, utilisations_actuelles: 45, statut_promotion: 'active' },
  { id_promotion: 2, code_promotion: 'PROMO_0002', restaurant_code: 'REST_0001', type_promotion: 'montant_fixe', valeur: 1500, code_reduction: 'REDUCTION1500', date_debut: '2026-03-01', date_fin: '2026-03-31', utilisations_max: 50, utilisations_actuelles: 12, statut_promotion: 'active' },
  { id_promotion: 3, code_promotion: 'PROMO_0003', restaurant_code: null, type_promotion: 'Livraison_gratuite', valeur: 0, code_reduction: 'LIVRAISON_OFFERTE', date_debut: '2026-02-15', date_fin: '2026-03-15', utilisations_max: 200, utilisations_actuelles: 89, statut_promotion: 'expiree' },
  { id_promotion: 4, code_promotion: 'PROMO_0004', restaurant_code: 'REST_0001', type_promotion: 'pourcentage', valeur: 20, code_reduction: 'VENDREDI20', date_debut: '2026-03-20', date_fin: '2026-04-20', utilisations_max: null, utilisations_actuelles: 0, statut_promotion: 'active' },
];

// ============================================
// DONNÉES PAIEMENTS
// ============================================

export const mockPaiements: Paiement[] = [
  { id_paiement: 1, code_paiement: 'PAIE_0001', commande_code: 'CMD_0001', methode_paiement: 'mobile_money', montant_paiement: 5000, reference_externe: 'MOMO-123456', statut_paiement: 'valide', created_at_paiement: '2026-03-22 12:35:00' },
  { id_paiement: 2, code_paiement: 'PAIE_0002', commande_code: 'CMD_0002', methode_paiement: 'espèces', montant_paiement: 3500, reference_externe: null, statut_paiement: 'valide', created_at_paiement: '2026-03-22 13:20:00' },
  { id_paiement: 3, code_paiement: 'PAIE_0003', commande_code: 'CMD_0003', methode_paiement: 'carte_bancaire', montant_paiement: 7000, reference_externe: 'CB-789012', statut_paiement: 'en_attente', created_at_paiement: '2026-03-22 14:05:00' },
];

// ============================================
// DONNÉES ANALYTICS
// ============================================

export const mockAnalytics: Analytics[] = [
  { id_analytics: 1, date_analytics: '2026-03-22', restaurant_code: 'REST_0001', type_analytics: 'commandes', valeur: 15, montant: 0 },
  { id_analytics: 2, date_analytics: '2026-03-22', restaurant_code: 'REST_0001', type_analytics: 'revenus', valeur: 0, montant: 85000 },
  { id_analytics: 3, date_analytics: '2026-03-22', restaurant_code: 'REST_0001', type_analytics: 'livraisons', valeur: 12, montant: 0 },
  { id_analytics: 4, date_analytics: '2026-03-21', restaurant_code: 'REST_0001', type_analytics: 'commandes', valeur: 22, montant: 0 },
  { id_analytics: 5, date_analytics: '2026-03-21', restaurant_code: 'REST_0001', type_analytics: 'revenus', valeur: 0, montant: 125000 },
];

// ============================================
// DONNÉES NOTIFICATIONS
// ============================================

export const mockNotifications: Notification[] = [
  { id_notification: 1, code_notification: 'NOTIF_0001', user_code: 'USR_0002', livreur_code: null, client_code: null, type_notification: 'commande', titre: 'Nouvelle commande', message: 'Une nouvelle commande CMD_0003 a été passée', lu: 0, created_at_notification: '2026-03-22 14:00:00' },
  { id_notification: 2, code_notification: 'NOTIF_0002', user_code: null, livreur_code: 'LIV_0001', client_code: null, type_notification: 'livraison', titre: 'Livraison assignée', message: 'La livraison LIVR_0001 vous a été assignée', lu: 1, created_at_notification: '2026-03-22 12:35:00' },
];

// ============================================
// DONNÉES PANIER
// ============================================

export const mockPaniers: Panier[] = [
  { id_panier: 1, code_panier: 'PAN_0001', client_code: 'CLT_0001', restaurant_code: 'REST_0001', total_panier: 6500, statut_panier: 'en_cours', created_at: '2026-03-22 15:00:00' },
];

export const mockLignesPanier: LignePanier[] = [
  { id_ligne_panier: 1, code_ligne_panier: 'LPAN_0001', panier_code: 'PAN_0001', produit_code: 'PROD_0001', quantite_ligne_panier: 2, prix_unitaire_ligne__panier: 1500, total_ligne_panier: 3000, etat_ligne_panier: 1 },
  { id_ligne_panier: 2, code_ligne_panier: 'LPAN_0002', panier_code: 'PAN_0001', produit_code: 'PROD_0002', quantite_ligne_panier: 1, prix_unitaire_ligne__panier: 3500, total_ligne_panier: 3500, etat_ligne_panier: 1 },
];

// ============================================
// DONNÉES ÉVALUATIONS
// ============================================

export const mockEvaluations: Evaluation[] = [
  { id_evaluation: 1, code_evaluation: 'EVAL_0001', commande_code: 'CMD_0001', client_code: 'CLT_0001', restaurant_code: 'REST_0001', note: 4, commentaire: 'Très bon plat, livraison rapide', note_livraison: 5, commentaire_livraison: 'Livreur très aimable', created_at_evaluation: '2026-03-22 13:30:00' },
  { id_evaluation: 2, code_evaluation: 'EVAL_0002', commande_code: 'CMD_0004', client_code: 'CLT_0001', restaurant_code: 'REST_0001', note: 3, commentaire: 'Correct', note_livraison: 4, commentaire_livraison: null, created_at_evaluation: '2026-03-21 19:00:00' },
];

// ============================================
// DONNÉES WALLET & GAINS
// ============================================

export const mockWalletLivreurs: WalletLivreur[] = [
  { id_wallet: 1, code_wallet: 'WAL_0001', livreur_code: 'LIV_0001', solde: 25000, total_retire: 10000, statut_wallet: 'actif', created_at_wallet: '2026-01-01 10:00:00' },
  { id_wallet: 2, code_wallet: 'WAL_0002', livreur_code: 'LIV_0002', solde: 15000, total_retire: 5000, statut_wallet: 'actif', created_at_wallet: '2026-01-05 10:00:00' },
  { id_wallet: 3, code_wallet: 'WAL_0003', livreur_code: 'LIV_0003', solde: 5000, total_retire: 0, statut_wallet: 'actif', created_at_wallet: '2026-01-10 10:00:00' },
];

export const mockGains: Gain[] = [
  { id_gain: 1, code_gain: 'GAIN_0001', restaurant_code: 'REST_0001', commande_code: 'CMD_0001', montant_restaurant: 4500, montant_delivery: 500, statut_gain: 'verse', created_at_gain: '2026-03-22 13:00:00' },
  { id_gain: 2, code_gain: 'GAIN_0002', restaurant_code: 'REST_0001', commande_code: 'CMD_0002', montant_restaurant: 3150, montant_delivery: 350, statut_gain: 'en_attente', created_at_gain: '2026-03-22 13:15:00' },
];

export const mockWalletTransactions: WalletTransaction[] = [
  { id_transaction: 1, code_transaction: 'TXN_0001', wallet_code: 'WAL_0001', type_transaction: 'commission', montant: 500, reference: 'CMD_0001', description: 'Commission livraison CMD_0001', statut_transaction: 'valide', created_at_transaction: '2026-03-22 13:00:00' },
  { id_transaction: 2, code_transaction: 'TXN_0002', wallet_code: 'WAL_0001', type_transaction: 'retrait', montant: 5000, reference: 'RET_001', description: 'Retrait Mobile Money', statut_transaction: 'valide', created_at_transaction: '2026-03-21 10:00:00' },
  { id_transaction: 3, code_transaction: 'TXN_0003', wallet_code: 'WAL_0001', type_transaction: 'bonus', montant: 1000, reference: 'BONUS_001', description: 'Bonus performance', statut_transaction: 'valide', created_at_transaction: '2026-03-20 10:00:00' },
];

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/** Obtenir les commandes par statut */
export const getCommandesByStatut = (statut: string): Commande[] => 
  mockCommandes.filter(c => c.statut_commande === statut);

/** Obtenir les produits par catégorie */
export const getProduitsByCategorie = (categorieCode: string): Produit[] => 
  mockProduits.filter(p => p.categorie_code === categorieCode);

/** Obtenir les analytics par date */
export const getAnalyticsByDate = (date: string): Analytics[] => 
  mockAnalytics.filter(a => a.date_analytics === date);

/** Obtenir les notifications non lues */
export const getUnreadNotifications = (): Notification[] => 
  mockNotifications.filter(n => n.lu === 0);

/** Calculer le total des revenus */
export const calculateTotalRevenus = (): number => 
  mockCommandes
    .filter(c => c.statut_commande !== 'annulee')
    .reduce((sum, c) => sum + c.total_commande, 0);

/** Obtenir le nombre de commandes aujourd'hui */
export const getTodayCommandesCount = (): number => {
  const today = new Date().toISOString().split('T')[0];
  return mockCommandes.filter(c => c.created_at_commande.startsWith(today)).length;
};
