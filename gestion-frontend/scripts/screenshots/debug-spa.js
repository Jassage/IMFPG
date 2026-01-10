// scripts/screenshots/capture-complete.js
import puppeteer from "puppeteer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration IMFP
const IMFP_CONFIG = {
  baseUrl: "http://localhost:3000", // Ton URL locale
  credentials: {
    admin: { email: "jslnoccius@gmail.com", password: "admin@123" },
    secretaire: { email: "secretary@imfp.edu", password: "secret123" },
    professeur: { email: "prof@imfp.edu", password: "prof123" },
    directeur: { email: "directeur@imfp.edu", password: "directeur123" },
  },
  viewport: { width: 1920, height: 1080 },
  screenshotDir: path.join(__dirname, "../../public/help-assets/screenshots"),

  // Pages critiques pour un système scolaire
  workflows: {
    admin: [
      { name: "dashboard", path: "/dashboard", waitFor: ".dashboard-grid" },
      { name: "students-list", path: "/students", waitFor: "table" },
      { name: "student-add", path: "/students/new", waitFor: "form" },
      {
        name: "grades-management",
        path: "/grades",
        waitFor: ".grades-container",
      },
      {
        name: "announcements-create",
        path: "/announcements/new",
        waitFor: "form",
      },
      {
        name: "reports-generate",
        path: "/reports",
        waitFor: ".report-builder",
      },
    ],
    secretaire: [
      {
        name: "enrollment-process",
        path: "/enrollments",
        waitFor: ".enrollment-steps",
      },
      {
        name: "student-registration",
        path: "/students/register",
        waitFor: "form",
      },
      {
        name: "documents-print",
        path: "/documents",
        waitFor: ".document-list",
      },
    ],
    professeur: [
      { name: "grade-entry", path: "/grades/enter", waitFor: ".grade-form" },
      {
        name: "attendance-mark",
        path: "/attendance",
        waitFor: ".attendance-sheet",
      },
      { name: "schedule-view", path: "/schedule", waitFor: ".calendar-view" },
    ],
    directeur: [
      {
        name: "analytics-dashboard",
        path: "/analytics",
        waitFor: ".charts-container",
      },
      { name: "approvals", path: "/approvals", waitFor: ".approval-list" },
      {
        name: "financial-overview",
        path: "/financial",
        waitFor: ".financial-summary",
      },
    ],
  },
};

class IMFP_ScreenshotGenerator {
  constructor() {
    this.browser = null;
    this.page = null;
    this.spinner = ora("Initialisation du générateur de captures IMFP").start();
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport(IMFP_CONFIG.viewport);
    this.spinner.succeed("Générateur initialisé");
  }

  async login(role) {
    this.spinner.start(`Connexion en tant que ${role}`);

    const creds = IMFP_CONFIG.credentials[role.toLowerCase()];
    if (!creds) {
      this.spinner.fail(`Identifiants non définis pour ${role}`);
      return false;
    }

    try {
      await this.page.goto(`${IMFP_CONFIG.baseUrl}/login`, {
        waitUntil: "networkidle0",
      });

      // Remplir le formulaire de connexion
      await this.page.type('input[name="email"]', creds.email);
      await this.page.type('input[name="password"]', creds.password);
      await this.page.click('button[type="submit"]');

      // Attendre la redirection
      await this.page.waitForNavigation({ waitUntil: "networkidle0" });

      this.spinner.succeed(`Connecté en tant que ${role}`);
      return true;
    } catch (error) {
      this.spinner.fail(`Échec connexion ${role}: ${error.message}`);
      return false;
    }
  }

  async captureWorkflow(role, workflow) {
    const roleDir = path.join(IMFP_CONFIG.screenshotDir, role);
    await fs.ensureDir(roleDir);

    for (const step of workflow) {
      this.spinner.start(`Capture: ${step.name}`);

      try {
        await this.page.goto(`${IMFP_CONFIG.baseUrl}${step.path}`, {
          waitUntil: "networkidle0",
        });

        if (step.waitFor) {
          await this.page.waitForSelector(step.waitFor, { timeout: 10000 });
        }

        // Attendre que les animations se terminent
        await this.page.waitForTimeout(1000);

        // Capture
        const screenshotPath = path.join(roleDir, `${step.name}.png`);
        await this.page.screenshot({
          path: screenshotPath,
          fullPage: true,
          optimizeForSpeed: true,
        });

        this.spinner.succeed(`Capture réussie: ${step.name}`);

        // Capture supplémentaire des formulaires (si applicable)
        if (
          step.name.includes("form") ||
          step.name.includes("add") ||
          step.name.includes("create")
        ) {
          await this.captureFormSteps(step.name, roleDir);
        }
      } catch (error) {
        this.spinner.fail(`Erreur capture ${step.name}: ${error.message}`);
      }
    }
  }

  async captureFormSteps(formName, outputDir) {
    // Captures spécifiques pour les formulaires
    const formDir = path.join(outputDir, "forms");
    await fs.ensureDir(formDir);

    const steps = [
      { action: "empty", desc: "Formulaire vide" },
      { action: "filled", desc: "Formulaire rempli" },
      { action: "validation", desc: "Messages de validation" },
      { action: "success", desc: "Message de succès" },
    ];

    for (const step of steps) {
      try {
        // Simuler différentes étapes du formulaire
        switch (step.action) {
          case "filled":
            // Remplir quelques champs
            await this.page.type("input:first-of-type", "Exemple de texte");
            break;
          case "validation":
            // Soumettre pour voir les erreurs
            await this.page.click('button[type="submit"]');
            await this.page.waitForTimeout(500);
            break;
        }

        const screenshotPath = path.join(
          formDir,
          `${formName}-${step.action}.png`
        );
        await this.page.screenshot({
          path: screenshotPath,
          fullPage: false, // Juste le formulaire
        });
      } catch (error) {
        // Continuer même en cas d'erreur
      }
    }
  }

  async generateAll() {
    await this.initialize();

    try {
      for (const [role, workflows] of Object.entries(IMFP_CONFIG.workflows)) {
        this.spinner.start(`Traitement du rôle: ${role}`);

        if (await this.login(role)) {
          await this.captureWorkflow(role, workflows);

          // Retour à l'accueil pour la prochaine session
          await this.page.goto(`${IMFP_CONFIG.baseUrl}/logout`);
          await this.page.waitForTimeout(1000);
        }
      }

      this.spinner.succeed("✅ Toutes les captures sont terminées !");

      // Générer un index HTML pour visualiser
      await this.generateIndex();
    } catch (error) {
      this.spinner.fail(`Erreur globale: ${error.message}`);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async generateIndex() {
    const indexPath = path.join(IMFP_CONFIG.screenshotDir, "index.html");

    let html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Captures IMFP - Centre d'Aide</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1400px; margin: 0 auto; }
        header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 2rem; border-radius: 10px; margin-bottom: 2rem; }
        h1 { margin: 0; font-size: 2.5rem; }
        .subtitle { opacity: 0.9; margin-top: 0.5rem; }
        .role-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .role-card { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .role-header { background: #3b82f6; color: white; padding: 1rem; font-weight: bold; }
        .screenshot-list { padding: 1rem; }
        .screenshot-item { margin-bottom: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .screenshot-item img { width: 100%; height: 200px; object-fit: cover; }
        .screenshot-info { padding: 0.75rem; background: #f9fafb; }
        .badge { display: inline-block; padding: 0.25rem 0.75rem; background: #10b981; color: white; border-radius: 20px; font-size: 0.875rem; margin-right: 0.5rem; }
        .timestamp { color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📸 Captures d'écran SYSG-IMFP</h1>
            <p class="subtitle">Centre d'Aide - Manuel d'Utilisation</p>
            <p>Généré le ${new Date().toLocaleDateString("fr-FR")}</p>
        </header>
        
        <div class="role-grid">`;

    const roles = ["admin", "secretaire", "professeur", "directeur"];

    for (const role of roles) {
      const roleDir = path.join(IMFP_CONFIG.screenshotDir, role);
      if (!(await fs.pathExists(roleDir))) continue;

      const screenshots = await fs.readdir(roleDir);
      const pngFiles = screenshots.filter((f) => f.endsWith(".png"));

      html += `
            <div class="role-card">
                <div class="role-header">
                    ${role.toUpperCase()} (${pngFiles.length} captures)
                </div>
                <div class="screenshot-list">`;

      for (const file of pngFiles.slice(0, 5)) {
        // Limiter à 5 par rôle
        const filePath = `${role}/${file}`;
        const stats = await fs.stat(path.join(roleDir, file));

        html += `
                    <div class="screenshot-item">
                        <img src="${filePath}" alt="${file}" loading="lazy">
                        <div class="screenshot-info">
                            <div class="badge">${
                              path.extname(file) === ".png" ? "PNG" : "JPG"
                            }</div>
                            <strong>${file
                              .replace(".png", "")
                              .replace(/-/g, " ")}</strong>
                            <div class="timestamp">
                                ${
                                  stats.size > 1024
                                    ? `${(stats.size / 1024).toFixed(1)} KB`
                                    : `${stats.size} B`
                                }
                            </div>
                        </div>
                    </div>`;
      }

      html += `
                </div>
            </div>`;
    }

    html += `
        </div>
    </div>
</body>
</html>`;

    await fs.writeFile(indexPath, html);
    console.log(`📄 Index généré: ${indexPath}`);
  }
}

// Exécution
const generator = new IMFP_ScreenshotGenerator();
await generator.generateAll();
