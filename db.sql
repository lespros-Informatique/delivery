-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : dim. 22 mars 2026 à 21:15
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `db_resto`
--

-- --------------------------------------------------------

--
-- Structure de la table `analytics`
--

DROP TABLE IF EXISTS `analytics`;
CREATE TABLE IF NOT EXISTS `analytics` (
  `id_analytics` int NOT NULL AUTO_INCREMENT,
  `date_analytics` date NOT NULL,
  `restaurant_code` varchar(50) DEFAULT NULL,
  `type_analytics` enum('commandes','revenus','livraisons','clients') NOT NULL,
  `valeur` int NOT NULL,
  `montant` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id_analytics`),
  UNIQUE KEY `date_analytics` (`date_analytics`,`restaurant_code`,`type_analytics`),
  KEY `restaurant_code` (`restaurant_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id_categorie` int NOT NULL AUTO_INCREMENT,
  `code_categorie` varchar(50) NOT NULL,
  `restaurant_code` varchar(50) NOT NULL,
  `libelle_categorie` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `statut_categorie` tinyint DEFAULT '1',
  `updated_at_categorie` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_categorie`),
  UNIQUE KEY `code_categorie` (`code_categorie`),
  KEY `restaurant_code` (`restaurant_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `id_client` int NOT NULL AUTO_INCREMENT,
  `code_client` varchar(50) NOT NULL,
  `restaurant_code` varchar(50) NOT NULL,
  `nom_client` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `telephone_client` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email_client` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `statut_client` tinyint DEFAULT '1',
  `created_at_client` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at_client` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_client`),
  UNIQUE KEY `code_client` (`code_client`),
  KEY `restaurant_code` (`restaurant_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

DROP TABLE IF EXISTS `commandes`;
CREATE TABLE IF NOT EXISTS `commandes` (
  `id_commande` int NOT NULL AUTO_INCREMENT,
  `code_commande` varchar(50) NOT NULL,
  `restaurant_code` varchar(50) NOT NULL,
  `client_code` varchar(50) NOT NULL,
  `total_commande` decimal(10,2) NOT NULL,
  `statut_commande` enum('en_attente','payee','en_preparation','livree','annulee') DEFAULT 'en_attente',
  `created_at_commande` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at_commande` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_commande`),
  UNIQUE KEY `code_commande` (`code_commande`),
  KEY `restaurant_code` (`restaurant_code`),
  KEY `client_code` (`client_code`),
  KEY `idx_statut` (`statut_commande`),
  KEY `idx_created` (`created_at_commande`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commissions`
--

DROP TABLE IF EXISTS `commissions`;
CREATE TABLE IF NOT EXISTS `commissions` (
  `id_commission` int NOT NULL AUTO_INCREMENT,
  `code_commission` varchar(50) NOT NULL,
  `commande_code` varchar(50) NOT NULL,
  `type_commission` enum('pourcentage','fixe') NOT NULL,
  `valeur_commission` decimal(10,2) NOT NULL,
  `montant_commission` decimal(10,2) NOT NULL,
  `created_at_commission` datetime DEFAULT CURRENT_TIMESTAMP,
  `etat_commission` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_commission`),
  UNIQUE KEY `code_commission` (`code_commission`),
  KEY `commande_code` (`commande_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commission_configs`
--

DROP TABLE IF EXISTS `commission_configs`;
CREATE TABLE IF NOT EXISTS `commission_configs` (
  `id_config` int NOT NULL AUTO_INCREMENT,
  `code_config` varchar(50) NOT NULL,
  `restaurant_code` varchar(50) DEFAULT NULL,
  `type_commission` enum('pourcentage','fixe') DEFAULT 'pourcentage',
  `taux_commission` decimal(5,2) DEFAULT '10.00',
  `montant_fixe` decimal(10,2) DEFAULT NULL,
  `statut_config` tinyint DEFAULT '1',
  `created_at_config` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_config`),
  UNIQUE KEY `code_config` (`code_config`),
  UNIQUE KEY `restaurant_code` (`restaurant_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `commission_configs`
--

INSERT INTO `commission_configs` (`id_config`, `code_config`, `restaurant_code`, `type_commission`, `taux_commission`, `montant_fixe`, `statut_config`, `created_at_config`) VALUES
(1, 'COMM_DEF', NULL, 'pourcentage', 10.00, NULL, 1, '2026-03-22 21:11:31');

-- --------------------------------------------------------

--
-- Structure de la table `evaluations`
--

DROP TABLE IF EXISTS `evaluations`;
CREATE TABLE IF NOT EXISTS `evaluations` (
  `id_evaluation` int NOT NULL AUTO_INCREMENT,
  `code_evaluation` varchar(50) NOT NULL,
  `commande_code` varchar(50) NOT NULL,
  `client_code` varchar(50) NOT NULL,
  `restaurant_code` varchar(50) NOT NULL,
  `note` tinyint NOT NULL,
  `commentaire` text,
  `note_livraison` tinyint DEFAULT NULL,
  `commentaire_livraison` text,
  `created_at_evaluation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_evaluation`),
  UNIQUE KEY `code_evaluation` (`code_evaluation`),
  KEY `commande_code` (`commande_code`),
  KEY `restaurant_code` (`restaurant_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `familles`
--

DROP TABLE IF EXISTS `familles`;
CREATE TABLE IF NOT EXISTS `familles` (
  `id_famille` int NOT NULL AUTO_INCREMENT,
  `code_famille` varchar(50) NOT NULL,
  `libelle_famille` varchar(150) NOT NULL,
  `statut_famille` tinyint DEFAULT '1',
  PRIMARY KEY (`id_famille`),
  UNIQUE KEY `code_famille` (`code_famille`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `familles`
--

INSERT INTO `familles` (`id_famille`, `code_famille`, `libelle_famille`, `statut_famille`) VALUES
(1, 'AFRICAIN', 'Cuisine Africaine', 1),
(2, 'EUROPEEN', 'Cuisine Européenne', 1),
(3, 'ASIE', 'Cuisine Asiatique', 1);

-- --------------------------------------------------------

--
-- Structure de la table `gains`
--

DROP TABLE IF EXISTS `gains`;
CREATE TABLE IF NOT EXISTS `gains` (
  `id_gain` int NOT NULL AUTO_INCREMENT,
  `code_gain` varchar(50) NOT NULL,
  `restaurant_code` varchar(50) NOT NULL,
  `commande_code` varchar(50) NOT NULL,
  `montant_restaurant` decimal(10,2) NOT NULL,
  `montant_delivery` decimal(10,2) NOT NULL,
  `statut_gain` enum('en_attente','verse','annule') DEFAULT 'en_attente',
  `created_at_gain` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_gain`),
  UNIQUE KEY `code_gain` (`code_gain`),
  KEY `restaurant_code` (`restaurant_code`),
  KEY `commande_code` (`commande_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ligne_commandes`
--

DROP TABLE IF EXISTS `ligne_commandes`;
CREATE TABLE IF NOT EXISTS `ligne_commandes` (
  `id_commande_ligne` int NOT NULL AUTO_INCREMENT,
  `code_commande_ligne` varchar(50) NOT NULL,
  `commande_code` varchar(50) NOT NULL,
  `produit_code` varchar(50) NOT NULL,
  `quantite_ligne_commande` int NOT NULL,
  `prix_unitaire_ligne_commande` decimal(10,2) NOT NULL,
  `total_ligne_commande` decimal(10,2) NOT NULL,
  `etat_ligne_commande` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_commande_ligne`),
  UNIQUE KEY `code_commande_ligne` (`code_commande_ligne`),
  KEY `commande_code` (`commande_code`),
  KEY `produit_code` (`produit_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `livraisons`
--

DROP TABLE IF EXISTS `livraisons`;
CREATE TABLE IF NOT EXISTS `livraisons` (
  `id_livraison` int NOT NULL AUTO_INCREMENT,
  `code_livraison` varchar(50) NOT NULL,
  `commande_code` varchar(50) NOT NULL,
  `livreur_code` varchar(50) NOT NULL,
  `statut_livraison` enum('en_attente','assignee','en_cours','livree','annulee') DEFAULT 'en_attente',
  `created_at_livraison` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at_livraison` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_livraison`),
  UNIQUE KEY `code_livraison` (`code_livraison`),
  KEY `commande_code` (`commande_code`),
  KEY `livreur_code` (`livreur_code`),
  KEY `idx_statut_liv` (`statut_livraison`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `livraison_positions`
--

DROP TABLE IF EXISTS `livraison_positions`;
CREATE TABLE IF NOT EXISTS `livraison_positions` (
  `id_position` int NOT NULL AUTO_INCREMENT,
  `livraison_code` varchar(50) NOT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `created_at_position` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_position`),
  KEY `livraison_code` (`livraison_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `livreurs`
--

DROP TABLE IF EXISTS `livreurs`;
CREATE TABLE IF NOT EXISTS `livreurs` (
  `id_livreur` int NOT NULL AUTO_INCREMENT,
  `code_livreur` varchar(50) NOT NULL,
  `restaurant_code` varchar(50) NULL DEFAULT NULL,
  `nom_livreur` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `telephone_livreur` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `statut_livreurs` tinyint DEFAULT '1',
  `created_at_livreur` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_livreur`),
  UNIQUE KEY `code_livreur` (`code_livreur`),
  KEY `restaurant_code` (`restaurant_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `logs_activite`
--

DROP TABLE IF EXISTS `logs_activite`;
CREATE TABLE IF NOT EXISTS `logs_activite` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `user_code` varchar(50) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `table_concernee` varchar(100) DEFAULT NULL,
  `reference` varchar(150) DEFAULT NULL,
  `details` text,
  `adresse_ip` varchar(45) DEFAULT NULL,
  `created_at_log` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_log`),
  KEY `user_code` (`user_code`),
  KEY `created_at_log` (`created_at_log`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id_notification` int NOT NULL AUTO_INCREMENT,
  `code_notification` varchar(50) NOT NULL,
  `user_code` varchar(50) DEFAULT NULL,
  `livreur_code` varchar(50) DEFAULT NULL,
  `client_code` varchar(50) DEFAULT NULL,
  `type_notification` enum('commande','livraison','paiement','promotion','system') NOT NULL,
  `titre` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `lu` tinyint DEFAULT '0',
  `created_at_notification` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_notification`),
  UNIQUE KEY `code_notification` (`code_notification`),
  KEY `user_code` (`user_code`),
  KEY `livreur_code` (`livreur_code`),
  KEY `client_code` (`client_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `paiements`
--

DROP TABLE IF EXISTS `paiements`;
CREATE TABLE IF NOT EXISTS `paiements` (
  `id_paiement` int NOT NULL AUTO_INCREMENT,
  `code_paiement` varchar(50) NOT NULL,
  `commande_code` varchar(50) NOT NULL,
  `methode_paiement` enum('espèces','mobile_money','carte_bancaire','paypal','autre') DEFAULT NULL,
  `montant_paiement` decimal(10,2) NOT NULL,
  `reference_externe` varchar(150) DEFAULT NULL,
  `statut_paiement` enum('en_attente','valide','echoue') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'en_attente',
  `created_at_paiement` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_paiement`),
  UNIQUE KEY `code_paiement` (`code_paiement`),
  KEY `commande_code` (`commande_code`),
  KEY `idx_statut_paie` (`statut_paiement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `panier`
--

DROP TABLE IF EXISTS `panier`;
CREATE TABLE IF NOT EXISTS `panier` (
  `id_panier` int NOT NULL AUTO_INCREMENT,
  `code_panier` varchar(50) NOT NULL,
  `client_code` varchar(50) NOT NULL,
  `restaurant_code` varchar(50) NOT NULL,
  `total_panier` decimal(10,2) DEFAULT '0.00',
  `statut_panier` enum('en_cours','valide','annule') DEFAULT 'en_cours',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_panier`),
  UNIQUE KEY `code_panier` (`code_panier`),
  KEY `client_code` (`client_code`),
  KEY `restaurant_code` (`restaurant_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `panier_lignes`
--

DROP TABLE IF EXISTS `panier_lignes`;
CREATE TABLE IF NOT EXISTS `panier_lignes` (
  `id_ligne_panier` int NOT NULL AUTO_INCREMENT,
  `code_ligne_panier` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `panier_code` varchar(50) NOT NULL,
  `produit_code` varchar(50) NOT NULL,
  `quantite_ligne_panier` int NOT NULL DEFAULT '1',
  `prix_unitaire_ligne__panier` decimal(10,2) NOT NULL,
  `total_ligne_panier` decimal(10,2) NOT NULL,
  `etat_ligne_panier` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_ligne_panier`),
  UNIQUE KEY `code_ligne` (`code_ligne_panier`),
  KEY `panier_code` (`panier_code`),
  KEY `produit_code` (`produit_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id_permission` int NOT NULL AUTO_INCREMENT,
  `code_permission` varchar(100) NOT NULL,
  `description_permission` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_at_permission` datetime DEFAULT CURRENT_TIMESTAMP,
  `etat_permission` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_permission`),
  UNIQUE KEY `code_permission` (`code_permission`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `permissions`
--

INSERT INTO `permissions` (`id_permission`, `code_permission`, `description_permission`, `created_at_permission`, `etat_permission`) VALUES
(1, 'user.view', 'Voir les utilisateurs', '2025-12-20 15:01:15', 1),
(2, 'user.create', 'Créer un utilisateur', '2025-12-20 15:01:15', 1),
(3, 'user.update', 'Modifier un utilisateur', '2025-12-20 15:01:15', 1),
(4, 'user.delete', 'Supprimer un utilisateur', '2025-12-20 15:01:15', 1),
(5, 'role.view', 'Voir les rôles', '2025-12-20 15:01:15', 1),
(6, 'role.assign', 'Attribuer des rôles', '2025-12-20 15:01:15', 1),
(7, 'restaurant.view', 'Voir les restaurants', '2025-12-20 15:01:15', 1),
(8, 'restaurant.create', 'Créer un restaurant', '2025-12-20 15:01:15', 1),
(9, 'restaurant.update', 'Modifier un restaurant', '2025-12-20 15:01:15', 1),
(10, 'restaurant.delete', 'Supprimer un restaurant', '2025-12-20 15:01:15', 1),
(11, 'restaurant.settings', 'Gérer les paramètres du restaurant', '2025-12-20 15:01:15', 1),
(12, 'category.manage', 'Gérer les catégories', '2025-12-20 15:01:15', 1),
(13, 'product.manage', 'Gérer les produits', '2025-12-20 15:01:15', 1),
(14, 'order.view', 'Voir les commandes', '2025-12-20 15:01:15', 1),
(15, 'order.update_status', 'Changer le statut des commandes', '2025-12-20 15:01:15', 1),
(16, 'delivery.manage', 'Gérer les livraisons', '2025-12-20 15:01:15', 1),
(17, 'delivery.track', 'Suivre la livraison', '2025-12-20 15:01:15', 1),
(18, 'driver.manage', 'Gérer les livreurs', '2025-12-20 15:01:15', 1),
(19, 'payment.view', 'Voir les paiements', '2025-12-20 15:01:15', 1),
(20, 'commission.manage', 'Gérer les commissions', '2025-12-20 15:01:15', 1),
(21, 'gain.view', 'Voir les gains', '2025-12-20 15:01:15', 1),
(22, 'platform.settings', 'Gérer les paramètres globaux', '2025-12-20 15:01:15', 1),
(23, 'report.view', 'Voir les rapports globaux', '2025-12-20 15:01:15', 1),
(24, 'order.create', 'Créer une commande', '2025-12-20 15:01:15', 1);

-- --------------------------------------------------------

--
-- Structure de la table `produits`
--

DROP TABLE IF EXISTS `produits`;
CREATE TABLE IF NOT EXISTS `produits` (
  `id_produit` int NOT NULL AUTO_INCREMENT,
  `code_produit` varchar(50) NOT NULL,
  `restaurant_code` varchar(50) NOT NULL,
  `categorie_code` varchar(50) DEFAULT NULL,
  `libelle_produit` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description_produit` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `prix_produit` decimal(10,2) NOT NULL,
  `image_produit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `disponible_produit` tinyint DEFAULT '1',
  `etat_produit` tinyint DEFAULT '1',
  `created_at_produit` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at_produit` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_produit`),
  UNIQUE KEY `code_produit` (`code_produit`),
  KEY `restaurant_code` (`restaurant_code`),
  KEY `categorie_code` (`categorie_code`),
  KEY `idx_disponible` (`disponible_produit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
CREATE TABLE IF NOT EXISTS `promotions` (
  `id_promotion` int NOT NULL AUTO_INCREMENT,
  `code_promotion` varchar(50) NOT NULL,
  `restaurant_code` varchar(50) DEFAULT NULL,
  `type_promotion` enum('pourcentage','montant_fixe','Livraison_gratuite') NOT NULL,
  `valeur` decimal(10,2) NOT NULL,
  `code_reduction` varchar(20) DEFAULT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `utilisations_max` int DEFAULT NULL,
  `utilisations_actuelles` int DEFAULT '0',
  `statut_promotion` enum('active','desactive','expiree') DEFAULT 'active',
  PRIMARY KEY (`id_promotion`),
  UNIQUE KEY `code_promotion` (`code_promotion`),
  KEY `restaurant_code` (`restaurant_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
CREATE TABLE IF NOT EXISTS `restaurants` (
  `id_restaurant` int NOT NULL AUTO_INCREMENT,
  `code_restaurant` varchar(50) NOT NULL,
  `user_code` varchar(50) NOT NULL,
  `libelle_restaurant` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description_restaurant` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `adresse_restaurant` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ville_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `logo_restaurant` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `etat_restaurant` tinyint DEFAULT '1',
  `created_at_restaurant` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at_restaurant` datetime DEFAULT CURRENT_TIMESTAMP,
  `latitude_restaurant` decimal(10,7) DEFAULT NULL,
  `longitude_restaurant` decimal(10,7) DEFAULT NULL,
  `famille_code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_restaurant`),
  UNIQUE KEY `code_restaurant` (`code_restaurant`),
  KEY `user_code` (`user_code`),
  KEY `fk_restaurants_famille` (`famille_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `restaurant_fermetures`
--

DROP TABLE IF EXISTS `restaurant_fermetures`;
CREATE TABLE IF NOT EXISTS `restaurant_fermetures` (
  `id_fermeture` int NOT NULL AUTO_INCREMENT,
  `restaurant_code` varchar(50) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `motif` varchar(255) DEFAULT NULL,
  `created_at_fermeture` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_fermeture`),
  KEY `restaurant_code` (`restaurant_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `restaurant_horaires`
--

DROP TABLE IF EXISTS `restaurant_horaires`;
CREATE TABLE IF NOT EXISTS `restaurant_horaires` (
  `id_horaire` int NOT NULL AUTO_INCREMENT,
  `restaurant_code` varchar(50) NOT NULL,
  `jour` enum('lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche') NOT NULL,
  `heure_ouverture` time NOT NULL,
  `heure_fermeture` time NOT NULL,
  `statut_horaire` tinyint DEFAULT '1',
  PRIMARY KEY (`id_horaire`),
  UNIQUE KEY `restaurant_code` (`restaurant_code`,`jour`),
  KEY `restaurant_code_2` (`restaurant_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `code_role` varchar(50) NOT NULL,
  `libelle_role` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description_role` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `etat_role` tinyint DEFAULT '1',
  `created_at_role` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `code_role` (`code_role`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id_role`, `code_role`, `libelle_role`, `description_role`, `etat_role`, `created_at_role`) VALUES
(1, 'admin', 'Administrateur Woli', 'Accès total à la plateforme Woli', 1, '2025-12-20 15:01:15'),
(2, 'restaurant_owner', 'Propriétaire Restaurant', 'Gestion complète de son restaurant', 1, '2025-12-20 15:01:15'),
(3, 'livreur', 'Livreur', 'Gestion des livraisons et du wallet', 1, '2025-12-20 15:01:15'),
(4, 'manager', 'Gestionnaire', 'Gestion quotidienne du restaurant', 1, '2025-12-20 15:01:15'),
(5, 'client', 'Client', 'Commande et suivi des livraisons', 1, '2025-12-20 15:01:15');

-- --------------------------------------------------------

--
-- Structure de la table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id_role_permission` int NOT NULL AUTO_INCREMENT,
  `role_code` varchar(50) NOT NULL,
  `permission_code` varchar(100) NOT NULL,
  `etat_role_permission` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_role_permission`),
  UNIQUE KEY `role_code` (`role_code`,`permission_code`),
  KEY `role_code_2` (`role_code`),
  KEY `permission_code` (`permission_code`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `role_permissions`
--

INSERT INTO `role_permissions` (`id_role_permission`, `role_code`, `permission_code`, `etat_role_permission`) VALUES
(1, 'admin', 'category.manage', 1),
(2, 'admin', 'commission.manage', 1),
(3, 'admin', 'delivery.manage', 1),
(4, 'admin', 'delivery.track', 1),
(5, 'admin', 'driver.manage', 1),
(6, 'admin', 'gain.view', 1),
(7, 'admin', 'order.update_status', 1),
(8, 'admin', 'order.view', 1),
(9, 'admin', 'payment.view', 1),
(10, 'admin', 'platform.settings', 1),
(11, 'admin', 'product.manage', 1),
(12, 'admin', 'report.view', 1),
(13, 'admin', 'restaurant.create', 1),
(14, 'admin', 'restaurant.delete', 1),
(15, 'admin', 'restaurant.settings', 1),
(16, 'admin', 'restaurant.update', 1),
(17, 'admin', 'restaurant.view', 1),
(18, 'admin', 'role.assign', 1),
(19, 'admin', 'role.view', 1),
(20, 'admin', 'user.create', 1),
(21, 'admin', 'user.delete', 1),
(22, 'admin', 'user.update', 1),
(23, 'admin', 'user.view', 1),
(32, 'restaurant_owner', 'restaurant.view', 1),
(33, 'restaurant_owner', 'restaurant.update', 1),
(34, 'restaurant_owner', 'restaurant.settings', 1),
(35, 'restaurant_owner', 'category.manage', 1),
(36, 'restaurant_owner', 'product.manage', 1),
(37, 'restaurant_owner', 'order.view', 1),
(38, 'restaurant_owner', 'order.update_status', 1),
(39, 'restaurant_owner', 'delivery.manage', 1),
(40, 'restaurant_owner', 'delivery.track', 1),
(41, 'restaurant_owner', 'driver.manage', 1),
(42, 'restaurant_owner', 'payment.view', 1),
(43, 'restaurant_owner', 'gain.view', 1),
(44, 'livreur', 'delivery.manage', 1),
(45, 'livreur', 'delivery.track', 1),
(46, 'livreur', 'order.view', 1),
(47, 'livreur', 'gain.view', 1),
(48, 'manager', 'restaurant.view', 1),
(49, 'manager', 'category.manage', 1),
(50, 'manager', 'product.manage', 1),
(51, 'manager', 'order.view', 1),
(52, 'manager', 'order.update_status', 1),
(53, 'manager', 'delivery.manage', 1),
(54, 'manager', 'delivery.track', 1),
(55, 'manager', 'payment.view', 1),
(56, 'client', 'order.view', 1),
(57, 'client', 'order.create', 1);

-- --------------------------------------------------------

--
-- Structure de la table `settings_platform`
--

DROP TABLE IF EXISTS `settings_platform`;
CREATE TABLE IF NOT EXISTS `settings_platform` (
  `id_setting` int NOT NULL AUTO_INCREMENT,
  `code_setting` varchar(100) NOT NULL,
  `valeur` varchar(255) DEFAULT NULL,
  `created_at_setting` datetime DEFAULT CURRENT_TIMESTAMP,
  `etat_settings_platform` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_setting`),
  UNIQUE KEY `code_setting` (`code_setting`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `settings_restaurants`
--

DROP TABLE IF EXISTS `settings_restaurants`;
CREATE TABLE IF NOT EXISTS `settings_restaurants` (
  `id_setting` int NOT NULL AUTO_INCREMENT,
  `restaurant_code` varchar(50) NOT NULL,
  `code_setting` varchar(100) NOT NULL,
  `valeur_settings_restaurant` varchar(100) NOT NULL DEFAULT '',
  `created_at_settings_restaurant` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at_settings_restaurant` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_setting`),
  UNIQUE KEY `restaurant_code` (`restaurant_code`,`code_setting`),
  KEY `restaurant_code_2` (`restaurant_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `code_user` varchar(50) NOT NULL,
  `nom_user` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email_user` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `telephone_user` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `etat_users` tinyint DEFAULT '1',
  `created_at_user` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at_user` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `code_user` (`code_user`),
  UNIQUE KEY `email` (`email_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE IF NOT EXISTS `user_roles` (
  `id_user_role` int NOT NULL AUTO_INCREMENT,
  `user_code` varchar(50) NOT NULL,
  `role_code` varchar(50) NOT NULL,
  `etat_user_role` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_user_role`),
  UNIQUE KEY `user_code` (`user_code`,`role_code`),
  KEY `user_code_2` (`user_code`),
  KEY `role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `villes`
--

DROP TABLE IF EXISTS `villes`;
CREATE TABLE IF NOT EXISTS `villes` (
  `id_ville` int NOT NULL AUTO_INCREMENT,
  `code_ville` varchar(50) NOT NULL,
  `nom_ville` varchar(150) NOT NULL,
  `pays` varchar(100) DEFAULT 'Côte d''Ivoire',
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `frais_livraison_defaut` decimal(10,2) DEFAULT '500.00',
  `statut_ville` tinyint DEFAULT '1',
  PRIMARY KEY (`id_ville`),
  UNIQUE KEY `code_ville` (`code_ville`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `villes`
--

INSERT INTO `villes` (`id_ville`, `code_ville`, `nom_ville`, `pays`, `latitude`, `longitude`, `frais_livraison_defaut`, `statut_ville`) VALUES
(1, 'ABIDJAN', 'Abidjan', 'Côte d\'Ivoire', 5.3600000, -4.0000000, 500.00, 1),
(2, 'YAMOUSSOUKRO', 'Yamoussoukro', 'Côte d\'Ivoire', 6.8500000, -5.2700000, 1000.00, 1),
(3, 'BOUAKE', 'Bouaké', 'Côte d\'Ivoire', 7.6900000, -5.0300000, 800.00, 1),
(4, 'KORHOGO', 'Korhogo', 'Côte d\'Ivoire', 9.4600000, -5.6300000, 800.00, 1),
(5, 'MAN', 'Man', 'Côte d\'Ivoire', 7.3900000, -7.5500000, 700.00, 1);

-- --------------------------------------------------------

--
-- Structure de la table `wallet_livreurs`
--

DROP TABLE IF EXISTS `wallet_livreurs`;
CREATE TABLE IF NOT EXISTS `wallet_livreurs` (
  `id_wallet` int NOT NULL AUTO_INCREMENT,
  `code_wallet` varchar(50) NOT NULL,
  `livreur_code` varchar(50) NOT NULL,
  `solde` decimal(10,2) DEFAULT '0.00',
  `total_retire` decimal(10,2) DEFAULT '0.00',
  `statut_wallet` enum('actif','bloqué','inactif') DEFAULT 'actif',
  `created_at_wallet` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_wallet`),
  UNIQUE KEY `code_wallet` (`code_wallet`),
  UNIQUE KEY `livreur_code` (`livreur_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `wallet_transactions`
--

DROP TABLE IF EXISTS `wallet_transactions`;
CREATE TABLE IF NOT EXISTS `wallet_transactions` (
  `id_transaction` int NOT NULL AUTO_INCREMENT,
  `code_transaction` varchar(50) NOT NULL,
  `wallet_code` varchar(50) NOT NULL,
  `type_transaction` enum('commission','retrait','bonus','penalite') NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `reference` varchar(150) DEFAULT NULL,
  `description` text,
  `statut_transaction` enum('en_attente','valide','echoue') DEFAULT 'valide',
  `created_at_transaction` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_transaction`),
  UNIQUE KEY `code_transaction` (`code_transaction`),
  KEY `wallet_code` (`wallet_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `zones_livraison`
--

DROP TABLE IF EXISTS `zones_livraison`;
CREATE TABLE IF NOT EXISTS `zones_livraison` (
  `id_zone` int NOT NULL AUTO_INCREMENT,
  `code_zone` varchar(50) NOT NULL,
  `ville_code` varchar(50) NOT NULL,
  `nom_zone` varchar(150) NOT NULL,
  `frais_livraison` decimal(10,2) NOT NULL,
  `delai_minutes` int DEFAULT '30',
  `statut_zone` tinyint DEFAULT '1',
  PRIMARY KEY (`id_zone`),
  UNIQUE KEY `code_zone` (`code_zone`),
  KEY `ville_code` (`ville_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `zones_livraison`
--

INSERT INTO `zones_livraison` (`id_zone`, `code_zone`, `ville_code`, `nom_zone`, `frais_livraison`, `delai_minutes`, `statut_zone`) VALUES
(1, 'ABJ_COCODY', 'ABIDJAN', 'Cocody', 300.00, 20, 1),
(2, 'ABJ_MARCORY', 'ABIDJAN', 'Marcory', 300.00, 20, 1),
(3, 'ABJ_TREICHVILLE', 'ABIDJAN', 'Treichville', 400.00, 25, 1),
(4, 'ABJ_PLANTEUR', 'ABIDJAN', 'Le Plateau', 200.00, 15, 1),
(5, 'ABJ_YOPOUGON', 'ABIDJAN', 'Yopougon', 500.00, 35, 1),
(6, 'ABJ_ABOBO', 'ABIDJAN', 'Abobo', 600.00, 40, 1),
(7, 'ABJ_KOUASSI', 'ABIDJAN', 'Kouassi-Doukouré', 400.00, 25, 1);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_categories_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `fk_clients_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `fk_commandes_client` FOREIGN KEY (`client_code`) REFERENCES `clients` (`code_client`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_commandes_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `commissions`
--
ALTER TABLE `commissions`
  ADD CONSTRAINT `fk_commissions_commande` FOREIGN KEY (`commande_code`) REFERENCES `commandes` (`code_commande`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `commission_configs`
--
ALTER TABLE `commission_configs`
  ADD CONSTRAINT `fk_commission_configs_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `evaluations`
--
ALTER TABLE `evaluations`
  ADD CONSTRAINT `fk_evaluations_commande` FOREIGN KEY (`commande_code`) REFERENCES `commandes` (`code_commande`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_evaluations_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `gains`
--
ALTER TABLE `gains`
  ADD CONSTRAINT `fk_gains_commande` FOREIGN KEY (`commande_code`) REFERENCES `commandes` (`code_commande`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_gains_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ligne_commandes`
--
ALTER TABLE `ligne_commandes`
  ADD CONSTRAINT `fk_lignes_commande` FOREIGN KEY (`commande_code`) REFERENCES `commandes` (`code_commande`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lignes_produit` FOREIGN KEY (`produit_code`) REFERENCES `produits` (`code_produit`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `livraisons`
--
ALTER TABLE `livraisons`
  ADD CONSTRAINT `fk_livraisons_commande` FOREIGN KEY (`commande_code`) REFERENCES `commandes` (`code_commande`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_livraisons_livreur` FOREIGN KEY (`livreur_code`) REFERENCES `livreurs` (`code_livreur`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `livraison_positions`
--
ALTER TABLE `livraison_positions`
  ADD CONSTRAINT `fk_positions_livraison` FOREIGN KEY (`livraison_code`) REFERENCES `livraisons` (`code_livraison`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `livreurs`
--
ALTER TABLE `livreurs`
  ADD CONSTRAINT `fk_livreurs_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_client` FOREIGN KEY (`client_code`) REFERENCES `clients` (`code_client`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notifications_livreur` FOREIGN KEY (`livreur_code`) REFERENCES `livreurs` (`code_livreur`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_code`) REFERENCES `users` (`code_user`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `paiements`
--
ALTER TABLE `paiements`
  ADD CONSTRAINT `fk_paiements_commande` FOREIGN KEY (`commande_code`) REFERENCES `commandes` (`code_commande`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `panier`
--
ALTER TABLE `panier`
  ADD CONSTRAINT `fk_panier_client` FOREIGN KEY (`client_code`) REFERENCES `clients` (`code_client`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_panier_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `panier_lignes`
--
ALTER TABLE `panier_lignes`
  ADD CONSTRAINT `fk_lignes_panier` FOREIGN KEY (`panier_code`) REFERENCES `panier` (`code_panier`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_lignes_produit_panier` FOREIGN KEY (`produit_code`) REFERENCES `produits` (`code_produit`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `produits`
--
ALTER TABLE `produits`
  ADD CONSTRAINT `fk_produits_categorie` FOREIGN KEY (`categorie_code`) REFERENCES `categories` (`code_categorie`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_produits_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `promotions`
--
ALTER TABLE `promotions`
  ADD CONSTRAINT `fk_promotions_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `restaurants`
--
ALTER TABLE `restaurants`
  ADD CONSTRAINT `fk_restaurants_famille` FOREIGN KEY (`famille_code`) REFERENCES `familles` (`code_famille`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_restaurants_user` FOREIGN KEY (`user_code`) REFERENCES `users` (`code_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `restaurant_fermetures`
--
ALTER TABLE `restaurant_fermetures`
  ADD CONSTRAINT `fk_fermetures_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `restaurant_horaires`
--
ALTER TABLE `restaurant_horaires`
  ADD CONSTRAINT `fk_horaires_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `fk_role_permissions_permission` FOREIGN KEY (`permission_code`) REFERENCES `permissions` (`code_permission`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_role_permissions_role` FOREIGN KEY (`role_code`) REFERENCES `roles` (`code_role`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `settings_restaurants`
--
ALTER TABLE `settings_restaurants`
  ADD CONSTRAINT `fk_settings_restaurant` FOREIGN KEY (`restaurant_code`) REFERENCES `restaurants` (`code_restaurant`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_code`) REFERENCES `roles` (`code_role`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_code`) REFERENCES `users` (`code_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `wallet_livreurs`
--
ALTER TABLE `wallet_livreurs`
  ADD CONSTRAINT `fk_wallet_livreur` FOREIGN KEY (`livreur_code`) REFERENCES `livreurs` (`code_livreur`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `wallet_transactions`
--
ALTER TABLE `wallet_transactions`
  ADD CONSTRAINT `fk_transactions_wallet` FOREIGN KEY (`wallet_code`) REFERENCES `wallet_livreurs` (`code_wallet`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `zones_livraison`
--
ALTER TABLE `zones_livraison`
  ADD CONSTRAINT `fk_zones_ville` FOREIGN KEY (`ville_code`) REFERENCES `villes` (`code_ville`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
