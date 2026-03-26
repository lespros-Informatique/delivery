-- =====================================================
-- Amélioration de la table notifications - Woli Delivery
-- =====================================================
-- Ce fichier ajoute des fonctionnalités avancées pour les notifications

-- =====================================================
-- 1. Modifier la table notifications existante
-- =====================================================

ALTER TABLE `notifications` 
ADD COLUMN `canal` enum('push','email','sms','in_app','all') DEFAULT 'all' AFTER `message`,
ADD COLUMN `priorite` enum('basse','moyenne','haute','urgente') DEFAULT 'moyenne' AFTER `canal`,
ADD COLUMN `donnees_json` JSON NULL AFTER `priorite`,
ADD COLUMN `lien_action` VARCHAR(255) NULL AFTER `donnees_json`,
ADD COLUMN `lu_at` DATETIME NULL AFTER `lu`,
ADD COLUMN `statut_notification` enum('envoyee','echouee','planifiee') DEFAULT 'envoyee' AFTER `created_at_notification`,
ADD COLUMN `expediteur_type` enum('system','user','restaurant','livreur','client') DEFAULT 'system' AFTER `statut_notification`,
ADD COLUMN `expediteur_code` VARCHAR(50) NULL AFTER `expediteur_type`;

-- Index pour optimiser les requêtes
ALTER TABLE `notifications` 
ADD INDEX `idx_lu` (`lu`),
ADD INDEX `idx_user_lu` (`user_code`, `lu`),
ADD INDEX `idx_created` (`created_at_notification`),
ADD INDEX `idx_type` (`type_notification`);

-- =====================================================
-- 2. Table preferences_notifications (NOUVELLE)
-- Préférences de notification par utilisateur
-- =====================================================

CREATE TABLE IF NOT EXISTS `preferences_notifications` (
  `id_pref` INT NOT NULL AUTO_INCREMENT,
  `user_code` VARCHAR(50) NOT NULL,
  `canal` ENUM('email','sms','push','in_app') NOT NULL,
  `type_notification` VARCHAR(50) NOT NULL,
  `active` TINYINT DEFAULT 1,
  `horaire_debut` TIME DEFAULT '08:00:00',
  `horaire_fin` TIME DEFAULT '22:00:00',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pref`),
  UNIQUE KEY `user_canal_type` (`user_code`, `canal`, `type_notification`),
  KEY `user_code` (`user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 3. Table notification_lues (NOUVELLE)
-- Suivi détaillé des lectures
-- =====================================================

CREATE TABLE IF NOT EXISTS `notification_lues` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `notification_code` VARCHAR(50) NOT NULL,
  `user_code` VARCHAR(50) NOT NULL,
  `lu_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `appareil` VARCHAR(100) DEFAULT NULL,
  `adresse_ip` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `notif_user` (`notification_code`, `user_code`),
  KEY `user_code` (`user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- 4. Données de test (exemples)
-- =====================================================

INSERT INTO `notifications` (`code_notification`, `user_code`, `type_notification`, `titre`, `message`, `lu`, `canal`, `priorite`, `created_at_notification`, `expediteur_type`, `expediteur_code`) VALUES
('NOTIF_0001', 'USR002', 'commande', 'Nouvelle commande reçue', 'La commande CMD_0005 a été passée par le client Marie Kouassi', 0, 'all', 'haute', NOW(), 'client', 'CLT_0001'),
('NOTIF_0002', 'USR002', 'paiement', 'Paiement confirmé', 'Le paiement de 5,000 XOF pour la commande CMD_0004 a été validé', 0, 'push', 'moyenne', NOW(), 'system', NULL),
('NOTIF_0003', 'USR002', 'system', 'Bienvenue sur Woli', 'Votre compte a été créé avec succès. Commencez à gérer votre restaurant!', 1, 'email', 'basse', NOW(), 'system', NULL),
('NOTIF_0004', 'USR002', 'livraison', 'Livraison en cours', 'Le livreur est en route vers le client', 0, 'in_app', 'moyenne', NOW(), 'livreur', 'LIV_0001'),
('NOTIF_0005', 'USR002', 'promotion', 'Nouvelle promotion', 'Profitez de 20% de réduction ce vendredi!', 1, 'email', 'basse', NOW(), 'system', NULL);

INSERT INTO `preferences_notifications` (`user_code`, `canal`, `type_notification`, `active`, `horaire_debut`, `horaire_fin`) VALUES
('USR002', 'email', 'commande', 1, '08:00:00', '22:00:00'),
('USR002', 'push', 'commande', 1, '08:00:00', '22:00:00'),
('USR002', 'email', 'paiement', 1, '08:00:00', '22:00:00'),
('USR002', 'push', 'livraison', 1, '08:00:00', '22:00:00'),
('USR002', 'email', 'system', 0, '08:00:00', '22:00:00'),
('USR002', 'push', 'promotion', 1, '09:00:00', '20:00:00');

-- =====================================================
-- 5. Fonction utilitaire pour créer une notification
-- =====================================================

DELIMITER //

CREATE PROCEDURE `sp_creer_notification`(
    IN p_code_notification VARCHAR(50),
    IN p_user_code VARCHAR(50),
    IN p_type_notification VARCHAR(20),
    IN p_titre VARCHAR(200),
    IN p_message TEXT,
    IN p_canal VARCHAR(10),
    IN p_priorite VARCHAR(10)
)
BEGIN
    INSERT INTO notifications (
        code_notification,
        user_code,
        type_notification,
        titre,
        message,
        lu,
        canal,
        priorite,
        created_at_notification,
        statut_notification,
        expediteur_type
    )
    VALUES (
        p_code_notification,
        p_user_code,
        p_type_notification,
        p_titre,
        p_message,
        0,
        COALESCE(p_canal, 'all'),
        COALESCE(p_priorite, 'moyenne'),
        NOW(),
        'envoyee',
        'system'
    );
END //

DELIMITER ;

-- =====================================================
-- 6. Fonction pour marquer comme lu
-- =====================================================

DELIMITER //

CREATE PROCEDURE `sp_marquer_notification_lue`(
    IN p_code_notification VARCHAR(50),
    IN p_user_code VARCHAR(50),
    IN p_appareil VARCHAR(100),
    IN p_adresse_ip VARCHAR(45)
)
BEGIN
    -- Marquer la notification comme lue
    UPDATE notifications 
    SET lu = 1, lu_at = NOW() 
    WHERE code_notification = p_code_notification AND user_code = p_user_code;
    
    -- Enregistrer dans le suivi
    INSERT INTO notification_lues (notification_code, user_code, appareil, adresse_ip)
    VALUES (p_code_notification, p_user_code, p_appareil, p_adresse_ip)
    ON DUPLICATE KEY UPDATE lu_at = NOW();
END //

DELIMITER ;

-- =====================================================
-- 7. Vue pour les statistiques de notifications
-- =====================================================

CREATE OR REPLACE VIEW `v_notifications_stats` AS
SELECT 
    user_code,
    COUNT(*) as total,
    SUM(CASE WHEN lu = 0 THEN 1 ELSE 0 END) as non_lues,
    SUM(CASE WHEN lu = 1 THEN 1 ELSE 0 END) as lues,
    SUM(CASE WHEN type_notification = 'commande' THEN 1 ELSE 0 END) as commandes,
    SUM(CASE WHEN type_notification = 'paiement' THEN 1 ELSE 0 END) as paiements,
    SUM(CASE WHEN type_notification = 'livraison' THEN 1 ELSE 0 END) as livraisons,
    SUM(CASE WHEN type_notification = 'promotion' THEN 1 ELSE 0 END) as promotions,
    SUM(CASE WHEN type_notification = 'system' THEN 1 ELSE 0 END) as systeme
FROM notifications
GROUP BY user_code;