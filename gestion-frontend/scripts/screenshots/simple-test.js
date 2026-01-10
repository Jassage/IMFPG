// frontend/scripts/screenshots/simple-test.mjs
import puppeteer from "puppeteer";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🎬 Test de capture ES Module");

async function testCapture() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();

  try {
    console.log("1. 🌐 Chargement de la page de login...");
    await page.goto("http://localhost:3000/login", {
      waitUntil: "networkidle0",
    });

    // Analyser la page
    const title = await page.title();
    const inputs = await page.$$("input");
    const buttons = await page.$$("button");
    const forms = await page.$$("form");

    console.log(`📝 Titre: "${title}"`);
    console.log(
      `🔍 ${inputs.length} input(s), ${buttons.length} button(s), ${forms.length} form(s)`
    );

    // Afficher les détails des inputs
    console.log("\n🔧 Détails des inputs:");
    for (let i = 0; i < inputs.length; i++) {
      const type = await inputs[i].evaluate((el) => el.type || "text");
      const name = await inputs[i].evaluate((el) => el.name || "sans nom");
      const placeholder = await inputs[i].evaluate(
        (el) => el.placeholder || ""
      );
      console.log(
        `   Input ${i}: type="${type}", name="${name}", placeholder="${placeholder}"`
      );
    }

    // Afficher les détails des boutons
    console.log("\n🔧 Détails des boutons:");
    for (let i = 0; i < Math.min(buttons.length, 5); i++) {
      const text = await buttons[i].evaluate((el) => el.textContent.trim());
      const type = await buttons[i].evaluate((el) => el.type || "button");
      console.log(
        `   Button ${i}: "${text.substring(0, 30)}...", type="${type}"`
      );
    }

    // Prendre une capture
    await fs.ensureDir("public/help-screenshots");
    await page.screenshot({
      path: "public/help-screenshots/login-debug.png",
      fullPage: true,
    });

    console.log(
      "\n✅ Capture réussie: public/help-screenshots/login-debug.png"
    );

    // Attendre pour observation
    console.log("\n⏳ Le navigateur reste ouvert 20 secondes...");
    await new Promise((resolve) => setTimeout(resolve, 20000));
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await browser.close();
    console.log("👋 Navigateur fermé.");
  }
}

testCapture();
