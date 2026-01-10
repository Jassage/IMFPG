// scripts/screenshots/capture-complete.js
import puppeteer from "puppeteer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fonction wait personnalisée
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// CONFIGURATION
const CONFIG = {
  FRONTEND_URL: "http://localhost:3000",

  CREDENTIALS: {
    email: "jslnoccius@gmail.com",
    password: "Admin@123",
  },

  ROLES: {
    Admin: [
      {
        id: "dashboard",
        name: "Tableau de bord",
        selector: '[data-testid="dashboard"]',
        hasForms: false,
      },
      {
        id: "students",
        name: "Élèves",
        selector: '[data-testid="students"]',
        hasForms: true,
        addButtonText: ["Nouvel élève", "Créer un élève", "Ajouter"],
      },
      {
        id: "professeurs",
        name: "Professeurs",
        selector: '[data-testid="professeurs"]',
        hasForms: true,
        addButtonText: [
          "Ajouter un professeur",
          "Nouveau professeur",
          "Créer un professeur",
          "Ajouter",
        ],
      },
      {
        id: "grades",
        name: "Notes",
        selector: '[data-testid="grades"]',
        hasForms: true,
        addButtonText: [
          "Ajouter une note",
          "Nouvelle note",
          "Créer une note",
          "Ajouter",
        ],
      },
      {
        id: "subject",
        name: "Matières",
        selector: '[data-testid="subject"]',
        hasForms: true,
        addButtonText: [
          "Ajouter une matière",
          "Nouvelle matière",
          "Créer une matière",
          "Ajouter",
        ],
      },
      {
        id: "classes",
        name: "Classes",
        selector: '[data-testid="classes"]',
        hasForms: true,
        addButtonText: [
          "Ajouter une classe",
          "Nouvelle classe",
          "Créer une classe",
          "Ajouter",
        ],
      },
      {
        id: "enrollments",
        name: "Inscriptions",
        selector: '[data-testid="enrollments"]',
        hasForms: true,
        addButtonText: [
          "Reinscrire",
          "Ajouter une inscription",
          "Créer une inscription",
          "Ajouter",
        ],
      },
      {
        id: "fees",
        name: "Frais",
        selector: '[data-testid="fees"]',
        hasForms: true,
        addButtonText: [
          "Nouvelle Structure",
          "Nouveaux frais",
          "Créer des frais",
          "Ajouter",
        ],
      },
      {
        id: "payments",
        name: "Paiements",
        selector: '[data-testid="payments"]',
        hasForms: true,
        addButtonText: [
          "Nouveau paiement",
          "Ajouter un paiement",
          "Créer un paiement",
          "Ajouter",
        ],
      },
      {
        id: "users",
        name: "Utilisateurs",
        selector: '[data-testid="users"]',
        hasForms: true,
        addButtonText: [
          "Ajouter un utilisateur",
          "Nouvel utilisateur",
          "Créer un utilisateur",
          "Ajouter",
        ],
      },
      {
        id: "announcements",
        name: "Annonces",
        selector: '[data-testid="announcements"]',
        hasForms: true,
        addButtonText: [
          "Nouvelle annonce",
          "Ajouter une annonce",
          "Créer une annonce",
          "Ajouter",
        ],
      },
      {
        id: "events",
        name: "Événements",
        selector: '[data-testid="events"]',
        hasForms: true,
        addButtonText: [
          "Nouvel événement",
          "Ajouter un événement",
          "Créer un événement",
          "Ajouter",
        ],
      },
      {
        id: "schedule",
        name: "Emploi du temps",
        selector: '[data-testid="schedule"]',
        hasForms: true,
        addButtonText: [
          "Ajouter un cours",
          "Nouveau cours",
          "Créer un cours",
          "Ajouter",
        ],
      },
      {
        id: "transcripts",
        name: "Bulletins",
        selector: '[data-testid="transcripts"]',
        hasForms: false,
      },
      {
        id: "audit-logs",
        name: "Journal d'audit",
        selector: '[data-testid="audit-logs"]',
        hasForms: false,
      },
    ],
  },

  OUTPUT_DIR: path.join(__dirname, "../../public/help-screenshots"),
};

async function captureSPA() {
  console.log("🚀 Démarrage de la capture complète...");

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--start-maximized",
    ],
    slowMo: 30,
  });

  const page = await browser.newPage();

  // Créer les dossiers de sortie
  await fs.ensureDir(CONFIG.OUTPUT_DIR);
  await fs.ensureDir(path.join(CONFIG.OUTPUT_DIR, "errors"));
  await fs.ensureDir(path.join(CONFIG.OUTPUT_DIR, "forms"));

  try {
    // 1. CONNEXION
    console.log("🔐 Connexion...");

    await page.goto(`${CONFIG.FRONTEND_URL}/login`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    console.log("✅ Page de login chargée");
    await wait(3000);

    // 2. Remplir le formulaire
    console.log("📝 Remplissage du formulaire...");

    const inputs = await page.$$("input");
    console.log(`📝 Nombre d'inputs trouvés: ${inputs.length}`);

    if (inputs.length >= 2) {
      // Remplir email
      await inputs[0].click({ clickCount: 3 });
      await inputs[0].type(CONFIG.CREDENTIALS.email, { delay: 50 });
      console.log("✅ Email rempli");

      await wait(1000);

      // Remplir mot de passe
      await inputs[1].click({ clickCount: 3 });
      await inputs[1].type(CONFIG.CREDENTIALS.password, { delay: 50 });
      console.log("✅ Mot de passe rempli");

      await wait(1000);

      // Trouver et cliquer sur le bouton de connexion
      const buttons = await page.$$("button");
      console.log(`🔘 Nombre de boutons trouvés: ${buttons.length}`);

      let clicked = false;
      for (let i = 0; i < buttons.length; i++) {
        try {
          const buttonText = await page.evaluate(
            (btn) => btn.textContent?.trim().toLowerCase() || "",
            buttons[i]
          );
          console.log(`  Bouton ${i}: "${buttonText.substring(0, 30)}..."`);

          if (
            buttonText.includes("connect") ||
            buttonText.includes("connexion") ||
            buttonText.includes("login") ||
            buttonText.includes("se connecter")
          ) {
            await buttons[i].click();
            console.log(
              `✅ Bouton cliqué: "${buttonText.substring(0, 20)}..."`
            );
            clicked = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (clicked) {
        console.log("⏳ Attente de la connexion...");
        await wait(5000);
      }
    }

    // Vérifier la connexion
    const currentUrl = page.url();
    console.log(`\n🌐 URL: ${currentUrl}`);

    if (currentUrl.includes("/login")) {
      console.log("❌ Connexion échouée");
      return;
    }

    console.log("✅✅ CONNECTÉ AVEC SUCCÈS !");

    // 3. CAPTURE DES ONGLETS ET FORMULAIRES
    const role =
      process.argv.find((arg) => arg.includes("--role="))?.split("=")[1] ||
      "Admin";
    const tabs = CONFIG.ROLES[role] || CONFIG.ROLES.Admin;

    console.log(`\n🎯 Capture des onglets pour: ${role}`);
    console.log(`📊 Nombre d'onglets: ${tabs.length}`);

    // Attendre que le dashboard se charge
    await wait(3000);

    const results = [];

    for (const [index, tab] of tabs.entries()) {
      console.log(`\n[${index + 1}/${tabs.length}] 📸 ${tab.name}`);

      let found = false;
      let method = "";

      // Naviguer vers l'onglet
      if (tab.selector) {
        try {
          const element = await page.$(tab.selector);
          if (element) {
            await element.click();
            method = `data-testid: ${tab.selector}`;
            found = true;
          }
        } catch (e) {
          // Continuer
        }
      }

      // Fallback: chercher par texte
      if (!found) {
        const elements = await page.$$('button, a, [role="button"], div');

        for (const element of elements) {
          try {
            const text = await page.evaluate(
              (el) => el.textContent?.trim().toLowerCase() || "",
              element
            );
            if (
              text.includes(tab.name.toLowerCase()) ||
              (tab.id === "dashboard" && text.includes("tableau"))
            ) {
              await element.click();
              method = `texte: "${text.substring(0, 20)}..."`;
              found = true;
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }

      if (found) {
        console.log(`✅ Navigué vers ${tab.name} (${method})`);

        // Attendre le chargement de la page
        await wait(4000);

        // Faire défiler en haut
        await page.evaluate(() => window.scrollTo(0, 0));
        await wait(1000);

        // Créer le dossier principal
        const tabDir = path.join(CONFIG.OUTPUT_DIR, tab.id);
        await fs.ensureDir(tabDir);

        // CAPTURE 1: Page principale
        console.log("   📸 Capture de la page principale...");
        try {
          const mainScreenshotPath = path.join(tabDir, "page.png");
          await page.screenshot({
            path: mainScreenshotPath,
            fullPage: true,
            type: "png",
          });
          console.log("   ✅ Page principale capturée");
        } catch (e) {
          console.log("   ❌ Erreur capture page principale:", e.message);
        }

        // CAPTURE 2: Formulaire d'ajout (si applicable)
        if (tab.hasForms && tab.addButtonText) {
          console.log("   🔍 Recherche du bouton d'ajout...");

          const addButtonFound = await findAndClickAddButton(page, tab);

          if (addButtonFound) {
            // Attendre l'ouverture du formulaire/modal
            await wait(3000);

            // Créer le dossier pour les formulaires
            const formsDir = path.join(tabDir, "forms");
            await fs.ensureDir(formsDir);

            // CAPTURE 3: Formulaire d'ajout
            console.log("   📸 Capture du formulaire d'ajout...");
            try {
              const formScreenshotPath = path.join(formsDir, "add-form.png");
              await page.screenshot({
                path: formScreenshotPath,
                fullPage: true,
                type: "png",
              });
              console.log("   ✅ Formulaire d'ajout capturé");

              // Fermer le formulaire si possible
              await closeFormIfOpen(page);
            } catch (e) {
              console.log("   ❌ Erreur capture formulaire:", e.message);
            }
          } else {
            console.log("   ⚠️  Bouton d'ajout non trouvé");
          }
        }

        // CAPTURE 4: Capture viewport aussi
        try {
          const viewportPath = path.join(tabDir, "viewport.png");
          await page.screenshot({
            path: viewportPath,
            fullPage: false,
            type: "png",
          });
        } catch (e) {
          // Ignorer les erreurs mineures
        }

        results.push({
          tab: tab.name,
          success: true,
          mainPage: path.join(tab.id, "page.png"),
          hasForm: tab.hasForms,
        });
      } else {
        console.log(`❌ Onglet non trouvé: ${tab.name}`);
        results.push({ tab: tab.name, success: false });

        // Sauvegarder pour debug
        await page.screenshot({
          path: path.join(
            CONFIG.OUTPUT_DIR,
            "errors",
            `${tab.id}-not-found.png`
          ),
          fullPage: false,
        });
      }

      // Pause entre les captures
      if (index < tabs.length - 1) {
        await wait(2000);
      }
    }

    // 4. GÉNÉRER LES RAPPORTS
    await generateReports(results);

    console.log("\n✨✨ CAPTURE COMPLÈTE TERMINÉE !");
  } catch (error) {
    console.error("\n💥 ERREUR:", error.message);
    console.error("Stack:", error.stack);
  } finally {
    console.log("\n👋 Fermeture du navigateur...");
    await browser.close();
    console.log("✅ Terminé");
  }
}

// Fonction pour trouver et cliquer sur le bouton d'ajout
async function findAndClickAddButton(page, tab) {
  try {
    // Chercher par texte
    const buttons = await page.$$('button, a, [role="button"]');

    for (const button of buttons) {
      try {
        const buttonText = await page.evaluate(
          (el) => el.textContent?.trim().toLowerCase() || "",
          button
        );

        // Vérifier si le texte du bouton correspond à un des textes recherchés
        for (const searchText of tab.addButtonText) {
          if (buttonText.includes(searchText.toLowerCase())) {
            console.log(`   ✅ Bouton trouvé: "${buttonText}"`);

            // Vérifier si le bouton est visible et cliquable
            const isVisible = await page.evaluate((el) => {
              const rect = el.getBoundingClientRect();
              const style = window.getComputedStyle(el);
              return (
                rect.width > 0 &&
                rect.height > 0 &&
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                !el.disabled
              );
            }, button);

            if (isVisible) {
              await button.click();
              console.log(`   ✅ Bouton cliqué: "${buttonText}"`);
              return true;
            }
          }
        }

        // Chercher aussi par icône "+"
        const buttonHTML = await page.evaluate(
          (el) => el.innerHTML?.toLowerCase() || "",
          button
        );
        if (
          buttonHTML.includes("+") ||
          buttonHTML.includes("add") ||
          buttonHTML.includes("plus")
        ) {
          if (
            buttonText.includes("ajouter") ||
            buttonText.includes("nouveau") ||
            buttonText.includes("créer")
          ) {
            await button.click();
            console.log(`   ✅ Bouton "+" cliqué: "${buttonText}"`);
            return true;
          }
        }
      } catch (e) {
        continue;
      }
    }

    // Chercher par data-testid
    const addButtonsByTestId = [
      `[data-testid="add-${tab.id}"]`,
      `[data-testid="${tab.id}-add"]`,
      `[data-testid="create-${tab.id}"]`,
      `[data-testid="${tab.id}-create"]`,
      `[data-testid="new-${tab.id}"]`,
      `[data-testid="${tab.id}-new"]`,
    ];

    for (const selector of addButtonsByTestId) {
      try {
        const element = await page.$(selector);
        if (element) {
          await element.click();
          console.log(`   ✅ Bouton trouvé par data-testid: ${selector}`);
          return true;
        }
      } catch (e) {
        continue;
      }
    }

    // Chercher par classes communes
    const addButtonClasses = [
      ".MuiButton-containedPrimary",
      ".bg-primary",
      ".btn-primary",
      ".btn-success",
      '[class*="add"]',
      '[class*="create"]',
      '[class*="new"]',
    ];

    for (const selector of addButtonClasses) {
      try {
        const elements = await page.$$(selector);
        for (const element of elements) {
          const text = await page.evaluate(
            (el) => el.textContent?.trim() || "",
            element
          );
          if (text && text.length > 0) {
            await element.click();
            console.log(
              `   ✅ Bouton trouvé par classe: ${selector} - "${text}"`
            );
            return true;
          }
        }
      } catch (e) {
        continue;
      }
    }

    return false;
  } catch (error) {
    console.log(`   ❌ Erreur recherche bouton: ${error.message}`);
    return false;
  }
}

// Fonction pour fermer un formulaire si ouvert
async function closeFormIfOpen(page) {
  try {
    // Chercher des boutons de fermeture
    const closeSelectors = [
      'button[aria-label="Close"]',
      'button:contains("Fermer")',
      'button:contains("Annuler")',
      'button:contains("Cancel")',
      ".MuiIconButton-root",
      '[data-testid="close-button"]',
      ".modal-close",
      ".close-button",
    ];

    for (const selector of closeSelectors) {
      try {
        if (selector.includes("contains")) {
          // Pour les sélecteurs par texte, on cherche manuellement
          const buttons = await page.$$("button");
          for (const button of buttons) {
            const text = await page.evaluate(
              (el) => el.textContent?.trim().toLowerCase() || "",
              button
            );
            const searchText = selector
              .replace('button:contains("', "")
              .replace('")', "")
              .toLowerCase();
            if (text.includes(searchText)) {
              await button.click();
              console.log(`   ✅ Formulaire fermé avec: "${text}"`);
              await wait(1000);
              return;
            }
          }
        } else {
          const element = await page.$(selector);
          if (element) {
            await element.click();
            console.log(`   ✅ Formulaire fermé avec: ${selector}`);
            await wait(1000);
            return;
          }
        }
      } catch (e) {
        continue;
      }
    }

    // Fallback: appuyer sur Escape
    await page.keyboard.press("Escape");
    await wait(1000);
  } catch (error) {
    // Ignorer les erreurs de fermeture
  }
}

// Fonction pour générer les rapports
async function generateReports(results) {
  console.log("\n" + "=".repeat(50));
  console.log("📊 RAPPORT DE CAPTURE");
  console.log("=".repeat(50));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  const withForms = results.filter((r) => r.success && r.hasForm).length;

  console.log(`📈 Total onglets: ${results.length}`);
  console.log(`✅ Pages capturées: ${successful}`);
  console.log(`📝 Formulaires capturés: ${withForms}`);
  console.log(`❌ Échecs: ${failed}`);

  if (successful > 0) {
    console.log("\n🎉 Captures réussies:");
    results
      .filter((r) => r.success)
      .forEach((r, i) => {
        console.log(
          `  ${i + 1}. ${r.tab}${r.hasForm ? " (avec formulaire)" : ""}`
        );
      });
  }

  if (failed > 0) {
    console.log("\n⚠️  Échecs:");
    results
      .filter((r) => !r.success)
      .forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.tab}`);
      });
  }

  // Générer un fichier manifeste JSON
  const manifest = {
    generated: new Date().toISOString(),
    frontendUrl: CONFIG.FRONTEND_URL,
    totalPages: results.length,
    successfulPages: successful,
    failedPages: failed,
    pagesWithForms: withForms,
    pages: results.map((r) => ({
      name: r.tab,
      success: r.success,
      hasForm: r.hasForm || false,
      mainScreenshot: r.mainPage || null,
    })),
  };

  const manifestPath = path.join(CONFIG.OUTPUT_DIR, "capture-manifest.json");
  await fs.writeJson(manifestPath, manifest, { spaces: 2 });
  console.log(`\n📄 Manifeste JSON: ${manifestPath}`);

  // Générer un index HTML
  await generateIndexHTML(results);

  console.log(`\n📁 Dossier principal: ${CONFIG.OUTPUT_DIR}`);
}

// Fonction pour générer un index HTML
async function generateIndexHTML(results) {
  const indexPath = path.join(CONFIG.OUTPUT_DIR, "index.html");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Captures d'écran - IMFP</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }
        h1 {
            margin: 0;
            font-size: 2.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .subtitle {
            color: #666;
            font-size: 1.1rem;
            margin-top: 10px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            display: block;
            margin-bottom: 10px;
        }
        .stat-number.success { color: #10b981; }
        .stat-number.failed { color: #ef4444; }
        .stat-number.info { color: #3b82f6; }
        .stat-label {
            color: #6b7280;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .pages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 25px;
        }
        .page-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border: 1px solid #e5e7eb;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .page-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }
        .page-card.success { border-top: 4px solid #10b981; }
        .page-card.failed { border-top: 4px solid #ef4444; }
        .page-header {
            padding: 20px;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .page-title {
            font-weight: 600;
            font-size: 1.1rem;
            color: #111827;
        }
        .page-status {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        .status-success { background: #d1fae5; color: #065f46; }
        .status-failed { background: #fee2e2; color: #991b1b; }
        .page-content {
            padding: 20px;
        }
        .page-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 15px;
            border: 1px solid #e5e7eb;
        }
        .page-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        .btn-primary {
            background: #3b82f6;
            color: white;
        }
        .btn-success {
            background: #10b981;
            color: white;
        }
        .btn-secondary {
            background: #6b7280;
            color: white;
        }
        .btn-icon {
            margin-right: 5px;
        }
        .form-indicator {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 10px;
            background: #e0f2fe;
            color: #0369a1;
            border-radius: 12px;
            font-size: 0.8rem;
            margin-top: 10px;
        }
        footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 0.9rem;
        }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            margin-left: 5px;
        }
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-info { background: #dbeafe; color: #1e40af; }
        .no-image {
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f9fafb;
            border-radius: 8px;
            color: #9ca3af;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📸 Captures d'écran IMFP</h1>
            <p class="subtitle">Système de Gestion Scolaire - Captures automatiques</p>
        </header>
        
        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-number">${results.length}</span>
                <span class="stat-label">Total Pages</span>
            </div>
            <div class="stat-card">
                <span class="stat-number success">${
                  results.filter((r) => r.success).length
                }</span>
                <span class="stat-label">Réussies</span>
            </div>
            <div class="stat-card">
                <span class="stat-number info">${
                  results.filter((r) => r.success && r.hasForm).length
                }</span>
                <span class="stat-label">Avec Formulaires</span>
            </div>
            <div class="stat-card">
                <span class="stat-number failed">${
                  results.filter((r) => !r.success).length
                }</span>
                <span class="stat-label">Échecs</span>
            </div>
        </div>
        
        <div class="pages-grid">
            ${results
              .map(
                (r, index) => `
            <div class="page-card ${r.success ? "success" : "failed"}">
                <div class="page-header">
                    <div class="page-title">
                        ${r.tab}
                        ${
                          r.hasForm
                            ? '<span class="badge badge-info">+ formulaire</span>'
                            : ""
                        }
                    </div>
                    <div class="page-status ${
                      r.success ? "status-success" : "status-failed"
                    }">
                        ${r.success ? "✅ Réussie" : "❌ Échouée"}
                    </div>
                </div>
                <div class="page-content">
                    ${
                      r.success && r.mainPage
                        ? `
                    <img src="${r.mainPage.replace(/\\/g, "/")}" 
                         alt="${r.tab}" 
                         class="page-image"
                         onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\"no-image\">Image non disponible</div>'">
                    `
                        : `
                    <div class="no-image">
                        ${r.success ? "Capture disponible" : "Capture échouée"}
                    </div>
                    `
                    }
                    
                    ${
                      r.success
                        ? `
                    <div class="page-actions">
                        <a href="${
                          r.mainPage ? r.mainPage.replace(/\\/g, "/") : "#"
                        }" 
                           class="btn btn-primary" 
                           target="_blank">
                            <span class="btn-icon">👁️</span>
                            Voir la page
                        </a>
                        
                        ${
                          r.hasForm
                            ? `
                        <a href="${
                          r.mainPage
                            ? r.mainPage
                                .replace(/\\/g, "/")
                                .replace("page.png", "forms/add-form.png")
                            : "#"
                        }" 
                           class="btn btn-success" 
                           target="_blank">
                            <span class="btn-icon">📝</span>
                            Voir formulaire
                        </a>
                        `
                            : ""
                        }
                    </div>
                    `
                        : `
                    <div style="text-align: center; padding: 10px; color: #ef4444;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">❌</div>
                        <p>Cette page n'a pas pu être capturée.</p>
                        <a href="errors/${r.tab
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "-")}-not-found.png" 
                           class="btn btn-secondary" 
                           target="_blank">
                            Voir l'erreur
                        </a>
                    </div>
                    `
                    }
                    
                    ${
                      r.success && r.hasForm
                        ? `
                    <div class="form-indicator">
                        <span>📝</span>
                        Formulaire d'ajout capturé
                    </div>
                    `
                        : ""
                    }
                </div>
            </div>
            `
              )
              .join("")}
        </div>
        
        <footer>
            <p>Généré automatiquement le ${new Date().toLocaleString(
              "fr-FR"
            )}</p>
            <p style="margin-top: 10px; font-size: 0.8rem; color: #9ca3af;">
                Institution Mixte Faustin 1er • Système de capture SPA
            </p>
        </footer>
    </div>
    
    <script>
        // Ajouter un effet de chargement pour les images
        document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('.page-image');
            images.forEach(img => {
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                });
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s';
            });
            
            // Mettre à jour l'heure
            function updateTime() {
                const timeElement = document.querySelector('footer p:first-child');
                if (timeElement) {
                    timeElement.textContent = 'Généré le ' + new Date().toLocaleString('fr-FR');
                }
            }
            
            // Mettre à jour toutes les heures
            setInterval(updateTime, 3600000);
        });
    </script>
</body>
</html>`;

  await fs.writeFile(indexPath, html);
  console.log(`📄 Index HTML généré: ${indexPath}`);
  console.log(
    `👉 Ouvrez: file://${path.resolve(indexPath)} dans votre navigateur`
  );
}

// Fonction pour parser les arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = { role: "Admin" };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--role" && args[i + 1]) {
      options.role = args[i + 1];
      i++;
    } else if (args[i] === "--url" && args[i + 1]) {
      CONFIG.FRONTEND_URL = args[i + 1];
      i++;
    } else if (args[i] === "--forms-only" || args[i] === "-f") {
      options.formsOnly = true;
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(`
Usage: node capture-complete.js [options]

Options:
  --role <role>        Rôle à capturer (Admin, etc.)
  --url <url>          URL du frontend
  --forms-only, -f     Capturer uniquement les formulaires
  --help, -h           Afficher cette aide

Exemples:
  node capture-complete.js --role=Admin
  node capture-complete.js --role=Admin --forms-only
      `);
      process.exit(0);
    }
  }

  return options;
}

// Démarrer la capture
const options = parseArgs();
console.log(`🎯 Rôle: ${options.role}`);
console.log(`🌐 URL: ${CONFIG.FRONTEND_URL}`);
console.log(
  `📝 Mode: ${
    options.formsOnly
      ? "Formulaires seulement"
      : "Complet (pages + formulaires)"
  }`
);

captureSPA();
