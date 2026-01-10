// scripts/screenshots/utils.js
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  // Vérifier si le serveur est démarré
  async checkServer(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const check = async () => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            resolve(true);
          } else {
            throw new Error(`Status: ${response.status}`);
          }
        } catch (error) {
          if (Date.now() - startTime > timeout) {
            reject(new Error(`Serveur non disponible: ${url}`));
          } else {
            setTimeout(check, 1000);
          }
        }
      };

      check();
    });
  },

  // Générer un identifiant unique pour les captures
  generateId(role, screenName) {
    return `${role}-${screenName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
  },

  // Formater la taille d'un fichier
  formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Vérifier les crédentials
  validateCredentials(credentials) {
    const missing = [];

    for (const [role, creds] of Object.entries(credentials)) {
      if (!creds.email || !creds.password) {
        missing.push(role);
      }
    }

    if (missing.length > 0) {
      console.log(chalk.yellow("\n⚠️  ATTENTION: Credentials manquants pour:"));
      missing.forEach((role) => console.log(chalk.yellow(`   - ${role}`)));
      console.log(chalk.gray("\n   Modifiez scripts/screenshots/config.js"));
      console.log(chalk.gray("   avec vos credentials de test\n"));
      return false;
    }

    return true;
  },

  // Nettoyer les anciennes captures
  async cleanupOldCaptures(days = 30) {
    const screenshotsDir = path.join(
      __dirname,
      "../../public/help-assets/screenshots"
    );

    if (!(await fs.pathExists(screenshotsDir))) {
      return;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const roles = await fs.readdir(screenshotsDir);

    for (const role of roles) {
      const roleDir = path.join(screenshotsDir, role);
      const screens = await fs.readdir(roleDir);

      for (const screen of screens) {
        const screenDir = path.join(roleDir, screen);
        const stat = await fs.stat(screenDir);

        if (stat.mtime < cutoffDate) {
          await fs.remove(screenDir);
          console.log(chalk.gray(`🗑️  Supprimé: ${role}/${screen}`));
        }
      }
    }
  },
};
