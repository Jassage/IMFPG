-- AlterTable
ALTER TABLE `system_settings`
    MODIFY `currency` VARCHAR(191) NOT NULL DEFAULT 'HTG',
    MODIFY `currencySymbol` VARCHAR(191) NOT NULL DEFAULT 'HTG';

-- Corriger les enregistrements existants utilisant les anciennes valeurs par defaut
UPDATE `system_settings` SET `currency` = 'HTG' WHERE `currency` = 'XOF';
UPDATE `system_settings` SET `currencySymbol` = 'HTG' WHERE `currencySymbol` = 'FCFA';
