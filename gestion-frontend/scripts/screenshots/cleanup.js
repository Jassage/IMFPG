// scripts/screenshots/cleanup.js
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONFIG = {
  SCREENSHOTS_DIR: path.join(__dirname, "../../public/help-screenshots"),
  ANNOTATED_DIR: path.join(__dirname, "../../public/help-annotated"),
  BACKUP_DIR: path.join(__dirname, "../../public/screenshots-backup"),
};

async function cleanup() {
  console.log("🧹 Nettoyage des captures d'écran...");

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupName = `screenshots-backup-${timestamp}`;
    const backupPath = path.join(CONFIG.BACKUP_DIR, backupName);

    // Créer le dossier de backup
    await fs.ensureDir(CONFIG.BACKUP_DIR);

    // 1. Sauvegarder les captures existantes
    console.log("💾 Sauvegarde des captures existantes...");

    if (await fs.pathExists(CONFIG.SCREENSHOTS_DIR)) {
      await fs.copy(CONFIG.SCREENSHOTS_DIR, backupPath);
      console.log(`✅ Sauvegardé dans: ${backupPath}`);
    }

    // 2. Sauvegarder les annotations existantes
    if (await fs.pathExists(CONFIG.ANNOTATED_DIR)) {
      const annotatedBackupPath = path.join(backupPath, "annotated");
      await fs.copy(CONFIG.ANNOTATED_DIR, annotatedBackupPath);
      console.log(`✅ Annotations sauvegardées`);
    }

    // 3. Nettoyer les dossiers
    console.log("🧽 Nettoyage des dossiers...");

    if (await fs.pathExists(CONFIG.SCREENSHOTS_DIR)) {
      await fs.emptyDir(CONFIG.SCREENSHOTS_DIR);
      console.log(`✅ ${CONFIG.SCREENSHOTS_DIR} nettoyé`);
    }

    if (await fs.pathExists(CONFIG.ANNOTATED_DIR)) {
      await fs.emptyDir(CONFIG.ANNOTATED_DIR);
      console.log(`✅ ${CONFIG.ANNOTATED_DIR} nettoyé`);
    }

    // 4. Recréer la structure de base
    console.log("📁 Recréation de la structure...");

    await fs.ensureDir(CONFIG.SCREENSHOTS_DIR);
    await fs.ensureDir(CONFIG.ANNOTATED_DIR);
    await fs.ensureDir(path.join(CONFIG.SCREENSHOTS_DIR, "errors"));

    // Créer un fichier README
    const readmeContent = `# Captures d'écran IMFP

Ce dossier contient les captures d'écran automatiques du système de gestion scolaire.

## Structure
- \`screenshots/\` : Captures originales
- \`annotated/\` : Captures avec annotations
- \`errors/\` : Captures d'erreur

## Génération
Les captures sont générées automatiquement avec le script:
\`\`\`bash
npm run screenshots:all
\`\`\`

## Dernier nettoyage: ${new Date().toLocaleString("fr-FR")}
`;

    await fs.writeFile(
      path.join(CONFIG.SCREENSHOTS_DIR, "README.md"),
      readmeContent
    );
    await fs.writeFile(
      path.join(CONFIG.ANNOTATED_DIR, "README.md"),
      readmeContent
    );

    console.log("\n✨✨ NETTOYAGE TERMINÉ !");
    console.log(`📁 Backups: ${CONFIG.BACKUP_DIR}`);
    console.log(`📁 Captures: ${CONFIG.SCREENSHOTS_DIR}`);
    console.log(`📁 Annotations: ${CONFIG.ANNOTATED_DIR}`);
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error.message);
    process.exit(1);
  }
}

// Exécuter
cleanup();
