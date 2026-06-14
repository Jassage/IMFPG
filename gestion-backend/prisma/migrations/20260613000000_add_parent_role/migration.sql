-- Réintroduit la valeur `Parent` dans l'enum du rôle utilisateur,
-- nécessaire pour le portail parent (compte parent rattaché aux élèves via Guardian).
ALTER TABLE `users` MODIFY `role` ENUM('Admin', 'Professeur', 'Secretaire', 'Directeur', 'Comptable', 'Student', 'Parent') NOT NULL;
