// scripts/deploy-help-assets.js
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const { execSync } = require("child_process");

class HelpAssetsDeployer {
  constructor() {
    this.assetsDir = path.join(__dirname, "../public/help-assets");
    this.buildDir = path.join(__dirname, "../dist"); // ou votre dossier de build
  }

  async deploy() {
    console.log(chalk.blue.bold("\n🚀 Déploiement des assets d'aide\n"));

    // 1. Vérifier que le build existe
    if (!(await fs.pathExists(this.buildDir))) {
      console.log(chalk.yellow("⚠️  Dossier de build non trouvé"));
      console.log(chalk.gray("   Exécutez d'abord: npm run build"));
      return;
    }

    // 2. Copier les assets dans le build
    const targetDir = path.join(this.buildDir, "help-assets");

    await fs.copy(this.assetsDir, targetDir);
    console.log(chalk.green("✓ Assets copiés vers le build"));

    // 3. Générer un fichier de version
    const versionInfo = {
      deployedAt: new Date().toISOString(),
      version: require("../package.json").version,
      totalAssets: await this.countAssets(targetDir),
    };

    await fs.writeJson(path.join(targetDir, "version.json"), versionInfo, {
      spaces: 2,
    });

    // 4. Optimiser pour la production
    await this.optimizeForProduction(targetDir);

    console.log(chalk.green.bold("\n✅ Déploiement terminé !"));
    console.log(chalk.cyan(`📁 Assets disponibles dans: ${targetDir}`));
  }

  async countAssets(dir) {
    if (!(await fs.pathExists(dir))) return 0;

    let count = 0;
    const walk = async (currentDir) => {
      const items = await fs.readdir(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = await fs.stat(fullPath);

        if (stat.isFile() && !item.startsWith(".")) {
          count++;
        } else if (stat.isDirectory()) {
          await walk(fullPath);
        }
      }
    };

    await walk(dir);
    return count;
  }

  async optimizeForProduction(dir) {
    console.log(chalk.cyan("\n⚡ Optimisation pour la production"));

    // Convertir les PNG en WebP quand c'est possible
    const pngFiles = await this.findFiles(dir, ".png");

    for (const pngFile of pngFiles) {
      const webpFile = pngFile.replace(".png", ".webp");

      try {
        execSync(`cwebp -q 80 "${pngFile}" -o "${webpFile}"`);
        console.log(chalk.gray(`  Converti: ${path.basename(pngFile)} → WebP`));
      } catch (error) {
        console.log(
          chalk.yellow(
            `  ⚠️  WebP non disponible pour ${path.basename(pngFile)}`
          )
        );
      }
    }
  }

  async findFiles(dir, ext) {
    const files = [];

    const walk = async (currentDir) => {
      const items = await fs.readdir(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          await walk(fullPath);
        } else if (stat.isFile() && fullPath.toLowerCase().endsWith(ext)) {
          files.push(fullPath);
        }
      }
    };

    await walk(dir);
    return files;
  }
}

// Point d'entrée
(async () => {
  try {
    const deployer = new HelpAssetsDeployer();
    await deployer.deploy();
  } catch (error) {
    console.error(chalk.red.bold("\n❌ ERREUR:"), error.message);
    process.exit(1);
  }
})();
