-- Rétablit la relation Parent -> User (clé étrangère supprimée par erreur
-- dans la migration 20260115134618_init). Nécessaire pour que les comptes
-- parents puissent exposer leur User (portail parent, affichage des tuteurs).
ALTER TABLE `parents` ADD CONSTRAINT `parents_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
