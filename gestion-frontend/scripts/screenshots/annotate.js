// scripts/screenshots/annotate.js
import sharp from "sharp";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  SCREENSHOTS_DIR: path.join(__dirname, "../../public/help-screenshots"),
  ANNOTATED_DIR: path.join(__dirname, "../../public/help-annotated"),

  // Couleurs pour les annotations
  COLORS: {
    primary: "#3B82F6", // Bleu
    success: "#10B981", // Vert
    warning: "#F59E0B", // Orange
    danger: "#EF4444", // Rouge
    purple: "#8B5CF6", // Violet
    pink: "#EC4899", // Rose
  },

  // Annotations par défaut pour chaque type de page
  DEFAULT_ANNOTATIONS: {
    dashboard: [
      {
        type: "rectangle",
        label: "Tableau de bord",
        color: "primary",
        position: "top-left",
        size: { width: 200, height: 40 },
      },
    ],

    students: [
      {
        type: "arrow",
        label: "Ajouter un élève",
        color: "success",
        position: "top-right",
        size: { width: 180, height: 40 },
      },
      {
        type: "rectangle",
        label: "Liste des élèves",
        color: "primary",
        position: "center",
        size: { width: 300, height: 200 },
      },
    ],

    professeurs: [
      {
        type: "arrow",
        label: "Ajouter un professeur",
        color: "success",
        position: "top-right",
        size: { width: 200, height: 40 },
      },
      {
        type: "rectangle",
        label: "Liste des professeurs",
        color: "primary",
        position: "center",
        size: { width: 300, height: 200 },
      },
    ],

    grades: [
      {
        type: "arrow",
        label: "Ajouter une note",
        color: "success",
        position: "top-right",
        size: { width: 180, height: 40 },
      },
      {
        type: "rectangle",
        label: "Notes des élèves",
        color: "primary",
        position: "center",
        size: { width: 300, height: 200 },
      },
    ],

    // Ajoute d'autres pages selon tes besoins
  },
};

class ScreenshotAnnotator {
  constructor() {
    this.outputDir = CONFIG.ANNOTATED_DIR;
  }

  // Calculer les coordonnées basées sur la position
  calculateCoordinates(
    position,
    imageWidth,
    imageHeight,
    annotationWidth,
    annotationHeight
  ) {
    const margin = 20;

    switch (position) {
      case "top-left":
        return { x: margin, y: margin };

      case "top-center":
        return {
          x: (imageWidth - annotationWidth) / 2,
          y: margin,
        };

      case "top-right":
        return {
          x: imageWidth - annotationWidth - margin,
          y: margin,
        };

      case "center-left":
        return {
          x: margin,
          y: (imageHeight - annotationHeight) / 2,
        };

      case "center":
        return {
          x: (imageWidth - annotationWidth) / 2,
          y: (imageHeight - annotationHeight) / 2,
        };

      case "center-right":
        return {
          x: imageWidth - annotationWidth - margin,
          y: (imageHeight - annotationHeight) / 2,
        };

      case "bottom-left":
        return {
          x: margin,
          y: imageHeight - annotationHeight - margin,
        };

      case "bottom-center":
        return {
          x: (imageWidth - annotationWidth) / 2,
          y: imageHeight - annotationHeight - margin,
        };

      case "bottom-right":
        return {
          x: imageWidth - annotationWidth - margin,
          y: imageHeight - annotationHeight - margin,
        };

      default:
        return { x: 100, y: 100 };
    }
  }

  // Générer le SVG pour une annotation
  generateAnnotationSVG(annotation, imageWidth, imageHeight) {
    const {
      type,
      label,
      color = "primary",
      position = "top-left",
      size = { width: 150, height: 50 },
    } = annotation;

    const hexColor = CONFIG.COLORS[color] || CONFIG.COLORS.primary;
    const coords = this.calculateCoordinates(
      position,
      imageWidth,
      imageHeight,
      size.width,
      size.height
    );

    let svg = "";

    switch (type) {
      case "rectangle":
        svg = `
          <rect x="${coords.x}" y="${coords.y}" 
                width="${size.width}" height="${size.height}" 
                stroke="${hexColor}" stroke-width="3" 
                fill="none" rx="5" stroke-dasharray="5,5"/>
        `;
        break;

      case "circle":
        const radius = Math.min(size.width, size.height) / 2;
        svg = `
          <circle cx="${coords.x + size.width / 2}" cy="${
          coords.y + size.height / 2
        }" 
                  r="${radius}" 
                  stroke="${hexColor}" stroke-width="3" 
                  fill="none" stroke-dasharray="5,5"/>
        `;
        break;

      case "arrow":
        // Flèche pointant vers le bas-droite
        const arrowLength = Math.min(size.width, size.height);
        svg = `
          <defs>
            <marker id="arrowhead-${Date.now()}" 
                    markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="${hexColor}"/>
            </marker>
          </defs>
          <line x1="${coords.x}" y1="${coords.y}" 
                x2="${coords.x + arrowLength}" y2="${coords.y + arrowLength}" 
                stroke="${hexColor}" stroke-width="3" 
                marker-end="url(#arrowhead-${Date.now()})"/>
        `;
        break;

      case "highlight":
        svg = `
          <rect x="${coords.x}" y="${coords.y}" 
                width="${size.width}" height="${size.height}" 
                fill="${hexColor}" fill-opacity="0.2" 
                stroke="${hexColor}" stroke-width="2" rx="3"/>
        `;
        break;
    }

    // Ajouter le label
    if (label) {
      let labelX, labelY;

      switch (position) {
        case "top-left":
        case "center-left":
        case "bottom-left":
          labelX = coords.x;
          labelY = coords.y - 10;
          break;

        case "top-center":
        case "center":
        case "bottom-center":
          labelX = coords.x + size.width / 2;
          labelY = coords.y - 10;
          break;

        case "top-right":
        case "center-right":
        case "bottom-right":
          labelX = coords.x + size.width;
          labelY = coords.y - 10;
          break;

        default:
          labelX = coords.x + size.width / 2;
          labelY = coords.y - 10;
      }

      svg += `
        <text x="${labelX}" y="${labelY}" 
              text-anchor="${
                position.includes("right")
                  ? "end"
                  : position.includes("center")
                  ? "middle"
                  : "start"
              }" 
              font-family="Arial, sans-serif" 
              font-size="16" font-weight="bold" 
              fill="${hexColor}">
          ${label}
        </text>
      `;
    }

    return svg;
  }

  async annotateImage(inputPath, outputPath, annotations = []) {
    try {
      console.log(`🖍️  Annotation de: ${path.basename(inputPath)}`);

      // Lire l'image avec sharp
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      if (!metadata.width || !metadata.height) {
        throw new Error("Impossible de lire les dimensions de l'image");
      }

      // Générer toutes les annotations SVG
      const svgAnnotations = annotations
        .map((ann) =>
          this.generateAnnotationSVG(ann, metadata.width, metadata.height)
        )
        .join("\n");

      // Créer le SVG complet
      const svgBuffer = Buffer.from(`
        <svg width="${metadata.width}" height="${metadata.height}" 
             xmlns="http://www.w3.org/2000/svg">
          ${svgAnnotations}
        </svg>
      `);

      // Appliquer les annotations
      await image
        .composite([
          {
            input: svgBuffer,
            blend: "over",
            gravity: "northwest",
          },
        ])
        .toFile(outputPath);

      console.log(`✅ Annoté: ${path.basename(outputPath)}`);
      return true;
    } catch (error) {
      console.error(`❌ Erreur d'annotation pour ${inputPath}:`, error.message);
      return false;
    }
  }

  async getAnnotationsForPage(pageId) {
    // Récupérer les annotations par défaut pour cette page
    const defaultAnnotations = CONFIG.DEFAULT_ANNOTATIONS[pageId] || [];

    // Tu peux étendre cette fonction pour charger des annotations spécifiques
    // depuis un fichier JSON ou une base de données

    return defaultAnnotations;
  }

  async annotateAll() {
    console.log("🚀 Démarrage des annotations...");
    console.log(`📁 Source: ${CONFIG.SCREENSHOTS_DIR}`);
    console.log(`📁 Destination: ${this.outputDir}`);

    // Créer le dossier de sortie
    await fs.ensureDir(this.outputDir);

    try {
      // Lire le dossier des captures
      const items = await fs.readdir(CONFIG.SCREENSHOTS_DIR);

      let totalProcessed = 0;
      let totalSucceeded = 0;
      let totalFailed = 0;

      for (const item of items) {
        const itemPath = path.join(CONFIG.SCREENSHOTS_DIR, item);
        const stats = await fs.stat(itemPath);

        if (stats.isDirectory()) {
          // C'est un dossier de page (dashboard, students, etc.)
          const pageId = item;

          // Chercher le fichier page.png ou full.png
          const possibleFiles = ["page.png", "full.png", "viewport.png"];
          let inputFile = null;

          for (const filename of possibleFiles) {
            const filePath = path.join(itemPath, filename);
            if (await fs.pathExists(filePath)) {
              inputFile = filePath;
              break;
            }
          }

          if (inputFile) {
            totalProcessed++;

            // Récupérer les annotations pour cette page
            const annotations = await this.getAnnotationsForPage(pageId);

            // Chemin de sortie
            const outputFile = path.join(
              this.outputDir,
              `${pageId}-annotated.png`
            );

            // Annoter l'image
            const success = await this.annotateImage(
              inputFile,
              outputFile,
              annotations
            );

            if (success) {
              totalSucceeded++;
            } else {
              totalFailed++;

              // Copier l'original en cas d'échec
              await fs.copy(
                inputFile,
                outputFile.replace("-annotated.png", "-original.png")
              );
            }
          }

          // Vérifier aussi le dossier forms/
          const formsDir = path.join(itemPath, "forms");
          if (await fs.pathExists(formsDir)) {
            const formFiles = await fs.readdir(formsDir);

            for (const formFile of formFiles) {
              if (formFile.endsWith(".png")) {
                totalProcessed++;

                const formInputPath = path.join(formsDir, formFile);
                const formOutputPath = path.join(
                  this.outputDir,
                  `${pageId}-form-${path.basename(
                    formFile,
                    ".png"
                  )}-annotated.png`
                );

                // Annotations par défaut pour les formulaires
                const formAnnotations = [
                  {
                    type: "rectangle",
                    label: "Formulaire",
                    color: "success",
                    position: "top-center",
                    size: { width: 200, height: 40 },
                  },
                ];

                const success = await this.annotateImage(
                  formInputPath,
                  formOutputPath,
                  formAnnotations
                );

                if (success) {
                  totalSucceeded++;
                } else {
                  totalFailed++;
                }
              }
            }
          }
        } else if (stats.isFile() && item.endsWith(".png")) {
          // C'est un fichier PNG directement
          totalProcessed++;

          const inputFile = itemPath;
          const pageId = path.basename(item, ".png");
          const outputFile = path.join(
            this.outputDir,
            `${pageId}-annotated.png`
          );

          const annotations = await this.getAnnotationsForPage(pageId);
          const success = await this.annotateImage(
            inputFile,
            outputFile,
            annotations
          );

          if (success) {
            totalSucceeded++;
          } else {
            totalFailed++;
          }
        }
      }

      // Générer un index HTML pour les images annotées
      await this.generateIndexHTML();

      console.log("\n" + "=".repeat(50));
      console.log("📊 RAPPORT D'ANNOTATIONS");
      console.log("=".repeat(50));
      console.log(`📈 Total traité: ${totalProcessed}`);
      console.log(`✅ Réussies: ${totalSucceeded}`);
      console.log(`❌ Échecs: ${totalFailed}`);
      console.log(`📁 Dossier: ${this.outputDir}`);
      console.log("=".repeat(50));
      console.log("\n✨✨ ANNOTATIONS TERMINÉES !");
    } catch (error) {
      console.error("\n💥 ERREUR:", error.message);
      throw error;
    }
  }

  async generateIndexHTML() {
    const indexPath = path.join(this.outputDir, "index.html");

    try {
      const files = await fs.readdir(this.outputDir);
      const imageFiles = files.filter(
        (file) =>
          file.endsWith(".png") &&
          !file.endsWith("-original.png") &&
          file !== "index.html"
      );

      const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Captures annotées - IMFP</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eaeaea;
        }
        h1 {
            color: #333;
            margin: 0;
        }
        .subtitle {
            color: #666;
            margin-top: 10px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }
        .card {
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .card img {
            width: 100%;
            height: 200px;
            object-fit: contain;
            background: #f8f9fa;
            border-bottom: 1px solid #eaeaea;
        }
        .card-content {
            padding: 15px;
        }
        .card-title {
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #333;
        }
        .card-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        .btn {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .btn-primary {
            background: #3b82f6;
            color: white;
        }
        .btn-primary:hover {
            background: #2563eb;
        }
        .btn-secondary {
            background: #6b7280;
            color: white;
        }
        .btn-secondary:hover {
            background: #4b5563;
        }
        .legend {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .legend h3 {
            margin-top: 0;
        }
        .color-box {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 10px;
            border-radius: 3px;
            vertical-align: middle;
        }
        footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📝 Captures annotées</h1>
            <p class="subtitle">IMFP - Guide visuel du système</p>
        </header>
        
        <div class="grid">
            ${imageFiles
              .map((file) => {
                const pageName = file
                  .replace("-annotated.png", "")
                  .replace("-form-", " - Formulaire ")
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");

                return `
            <div class="card">
                <img src="${file}" alt="${pageName}" 
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Image+non+disponible'">
                <div class="card-content">
                    <h3 class="card-title">${pageName}</h3>
                    <div class="card-actions">
                        <a href="${file}" class="btn btn-primary" target="_blank">Voir</a>
                        <a href="${file}" class="btn btn-secondary" download>Télécharger</a>
                    </div>
                </div>
            </div>
            `;
              })
              .join("")}
        </div>
        
        <div class="legend">
            <h3>Légende des couleurs :</h3>
            <div>
                <span class="color-box" style="background: ${
                  CONFIG.COLORS.primary
                };"></span>
                <span>Éléments principaux</span>
            </div>
            <div>
                <span class="color-box" style="background: ${
                  CONFIG.COLORS.success
                };"></span>
                <span>Actions/Formulaires</span>
            </div>
            <div>
                <span class="color-box" style="background: ${
                  CONFIG.COLORS.warning
                };"></span>
                <span>Éléments importants</span>
            </div>
            <div>
                <span class="color-box" style="background: ${
                  CONFIG.COLORS.danger
                };"></span>
                <span>Attention/Erreurs</span>
            </div>
        </div>
        
        <footer>
            <p>Généré automatiquement le ${new Date().toLocaleString(
              "fr-FR"
            )}</p>
        </footer>
    </div>
    
    <script>
        // Ajouter un effet de chargement pour les images
        document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s';
                
                img.onload = function() {
                    this.style.opacity = '1';
                };
                
                // Si l'image est déjà chargée
                if (img.complete) {
                    img.style.opacity = '1';
                }
            });
        });
    </script>
</body>
</html>`;

      await fs.writeFile(indexPath, html);
      console.log(`📄 Index HTML généré: ${indexPath}`);
    } catch (error) {
      console.error("❌ Erreur génération index:", error.message);
    }
  }
}

// Point d'entrée principal
async function main() {
  try {
    console.log("🎨 ANNOTATION DES CAPTURES D'ÉCRAN");
    console.log("=".repeat(40));

    const annotator = new ScreenshotAnnotator();
    await annotator.annotateAll();
  } catch (error) {
    console.error("\n💥 ERREUR CRITIQUE:", error.message);
    process.exit(1);
  }
}

// Exécuter
main();
