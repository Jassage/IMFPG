// scripts/annotations/annotate-imfp.js
import sharp from "sharp";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration d'annotation spécifique IMFP
const IMFP_ANNOTATIONS = {
  // Annotation pour le tableau de bord
  "admin/dashboard.png": [
    {
      type: "rectangle",
      label: "KPI Principaux",
      color: "#10B981",
      position: { x: 50, y: 120, width: 400, height: 150 },
    },
    {
      type: "arrow",
      label: "Menu de navigation",
      color: "#3B82F6",
      from: { x: 20, y: 50 },
      to: { x: 20, y: 200 },
    },
    {
      type: "circle",
      label: "Notifications",
      color: "#EF4444",
      position: { x: 1800, y: 80, radius: 25 },
    },
  ],

  // Annotation pour le formulaire élève
  "admin/students-add.png": [
    {
      type: "rectangle",
      label: "Informations personnelles",
      color: "#3B82F6",
      position: { x: 50, y: 150, width: 500, height: 300 },
    },
    {
      type: "rectangle",
      label: "Champs obligatoires (*)",
      color: "#EF4444",
      position: { x: 50, y: 180, width: 250, height: 40 },
    },
    {
      type: "arrow",
      label: "Sauvegarder",
      color: "#10B981",
      from: { x: 600, y: 700 },
      to: { x: 700, y: 750 },
    },
    {
      type: "highlight",
      label: "Numéro de matricule auto-généré",
      color: "#8B5CF6",
      position: { x: 50, y: 220, width: 300, height: 50 },
    },
  ],

  // Annotation pour la saisie des notes
  "professeur/grade-entry.png": [
    {
      type: "rectangle",
      label: "Liste des élèves",
      color: "#3B82F6",
      position: { x: 50, y: 200, width: 600, height: 400 },
    },
    {
      type: "rectangle",
      label: "Grille de saisie",
      color: "#10B981",
      position: { x: 700, y: 200, width: 800, height: 400 },
    },
    {
      type: "arrow",
      label: "Calcul automatique des moyennes",
      color: "#F59E0B",
      from: { x: 1200, y: 650 },
      to: { x: 1300, y: 620 },
    },
  ],

  // Annotation pour les réinscriptions
  "secretaire/enrollment-process.png": [
    {
      type: "rectangle",
      label: "Élèves à réinscrire",
      color: "#3B82F6",
      position: { x: 50, y: 150, width: 500, height: 300 },
    },
    {
      type: "rectangle",
      label: "Documents requis",
      color: "#F59E0B",
      position: { x: 600, y: 150, width: 400, height: 200 },
    },
    {
      type: "arrow",
      label: "Processus en 3 étapes",
      color: "#10B981",
      from: { x: 1100, y: 180 },
      to: { x: 1300, y: 180 },
    },
  ],
};

class IMFP_Annotator {
  constructor() {
    this.inputDir = path.join(
      __dirname,
      "../../public/help-assets/screenshots"
    );
    this.outputDir = path.join(__dirname, "../../public/help-assets/annotated");
    this.styles = {
      colors: {
        primary: "#3B82F6", // Bleu - Actions principales
        success: "#10B981", // Vert - Validation
        warning: "#F59E0B", // Orange - Important
        danger: "#EF4444", // Rouge - Erreur/Obligatoire
        info: "#6B7280", // Gris - Information
        highlight: "#8B5CF6", // Violet - Mise en évidence
        academic: "#EC4899", // Rose - Académique
        financial: "#F97316", // Orange foncé - Financier
      },
      font: {
        family: "Arial, sans-serif",
        sizes: {
          small: 14,
          medium: 16,
          large: 18,
        },
      },
    };
  }

  async generateAnnotationSVG(annotation, index) {
    const { type, label, color = "primary", position } = annotation;
    const hexColor = this.styles.colors[color] || color;
    const uniqueId = `imfp-${Date.now()}-${index}`;

    let svg = "";

    switch (type) {
      case "rectangle":
        svg = `
          <rect id="${uniqueId}"
                x="${position.x}" y="${position.y}"
                width="${position.width}" height="${position.height}"
                stroke="${hexColor}" stroke-width="3"
                fill="none" rx="6"
                stroke-dasharray="6,4"/>
          <text x="${position.x + position.width / 2}" y="${position.y - 10}"
                text-anchor="middle" font-family="${this.styles.font.family}"
                font-size="${this.styles.font.sizes.medium}" font-weight="bold"
                fill="${hexColor}">
            ${label}
          </text>
        `;
        break;

      case "arrow":
        svg = `
          <defs>
            <marker id="arrowhead-${uniqueId}"
                    markerWidth="10" markerHeight="7"
                    refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="${hexColor}"/>
            </marker>
          </defs>
          <line x1="${position.from.x}" y1="${position.from.y}"
                x2="${position.to.x}" y2="${position.to.y}"
                stroke="${hexColor}" stroke-width="3"
                marker-end="url(#arrowhead-${uniqueId})"/>
          <text x="${(position.from.x + position.to.x) / 2}" y="${
          Math.min(position.from.y, position.to.y) - 15
        }"
                text-anchor="middle" font-family="${this.styles.font.family}"
                font-size="${this.styles.font.sizes.small}" font-weight="bold"
                fill="${hexColor}">
            ${label}
          </text>
        `;
        break;

      case "circle":
        svg = `
          <circle id="${uniqueId}"
                  cx="${position.x}" cy="${position.y}"
                  r="${position.radius}"
                  stroke="${hexColor}" stroke-width="3"
                  fill="none" stroke-dasharray="5,3"/>
          <text x="${position.x}" y="${position.y - position.radius - 10}"
                text-anchor="middle" font-family="${this.styles.font.family}"
                font-size="${this.styles.font.sizes.small}" font-weight="bold"
                fill="${hexColor}">
            ${label}
          </text>
        `;
        break;

      case "highlight":
        svg = `
          <rect id="${uniqueId}"
                x="${position.x}" y="${position.y}"
                width="${position.width}" height="${position.height}"
                fill="${hexColor}" fill-opacity="0.2"
                stroke="${hexColor}" stroke-width="2" rx="4"/>
          <text x="${position.x + position.width / 2}" y="${position.y - 10}"
                text-anchor="middle" font-family="${this.styles.font.family}"
                font-size="${this.styles.font.sizes.small}" font-weight="bold"
                fill="${hexColor}">
            ${label}
          </text>
        `;
        break;
    }

    // Ajouter un fond pour le texte pour meilleure lisibilité
    svg = `
      <rect x="${position.x}" y="${position.y - 30}"
            width="${label.length * 8}" height="25"
            fill="white" fill-opacity="0.9" rx="4"/>
      ${svg}
    `;

    return svg;
  }

  async annotateAll() {
    console.log(chalk.blue.bold("🎨 Démarrage des annotations IMFP..."));
    console.log(chalk.gray("=".repeat(50)));

    await fs.ensureDir(this.outputDir);

    let totalProcessed = 0;
    let totalSucceeded = 0;

    for (const [imagePath, annotations] of Object.entries(IMFP_ANNOTATIONS)) {
      const inputPath = path.join(this.inputDir, imagePath);
      const outputPath = path.join(
        this.outputDir,
        imagePath.replace(".png", "-annotated.png")
      );

      // Créer les sous-dossiers si nécessaire
      await fs.ensureDir(path.dirname(outputPath));

      if (!(await fs.pathExists(inputPath))) {
        console.log(chalk.yellow(`⚠️  Image non trouvée: ${imagePath}`));
        continue;
      }

      totalProcessed++;
      console.log(chalk.cyan(`  Annoter: ${imagePath}`));

      try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // Générer toutes les annotations
        const svgAnnotations = await Promise.all(
          annotations.map((ann, idx) => this.generateAnnotationSVG(ann, idx))
        );

        const svgBuffer = Buffer.from(`
          <svg width="${metadata.width}" height="${metadata.height}"
               xmlns="http://www.w3.org/2000/svg">
            ${svgAnnotations.join("\n")}
            
            <!-- Légende -->
            <rect x="20" y="${metadata.height - 120}" width="350" height="100"
                  fill="white" fill-opacity="0.9" rx="8" stroke="#e5e7eb" stroke-width="1"/>
            
            <text x="40" y="${metadata.height - 90}"
                  font-family="${this.styles.font.family}"
                  font-size="16" font-weight="bold"
                  fill="#1f2937">Légende IMFP:</text>
            
            ${Object.entries(this.styles.colors)
              .map(
                ([name, color], idx) => `
              <circle cx="50" cy="${
                metadata.height - 60 + idx * 20
              }" r="6" fill="${color}"/>
              <text x="70" y="${metadata.height - 60 + idx * 20 + 5}"
                    font-family="${this.styles.font.family}"
                    font-size="12" fill="#4b5563">
                ${name.charAt(0).toUpperCase() + name.slice(1)}
              </text>
            `
              )
              .join("\n")}
            
            <!-- Watermark -->
            <text x="${metadata.width - 150}" y="${metadata.height - 20}"
                  font-family="${this.styles.font.family}"
                  font-size="10" fill="#9ca3af" text-anchor="end">
              SYSG-IMFP © ${new Date().getFullYear()}
            </text>
          </svg>
        `);

        await image
          .composite([{ input: svgBuffer, blend: "over" }])
          .toFile(outputPath);

        totalSucceeded++;
        console.log(chalk.green(`    ✅ Annoté: ${path.basename(outputPath)}`));
      } catch (error) {
        console.log(chalk.red(`    ❌ Erreur: ${error.message}`));
      }
    }

    console.log(chalk.gray("=".repeat(50)));
    console.log(chalk.bold("📊 Résultat:"));
    console.log(chalk.cyan(`   Total traité: ${totalProcessed}`));
    console.log(chalk.green(`   Réussis: ${totalSucceeded}`));
    console.log(chalk.red(`   Échecs: ${totalProcessed - totalSucceeded}`));
    console.log(chalk.blue(`   Dossier: ${this.outputDir}`));

    // Générer un index pour toutes les images annotées
    await this.generateAnnotatedIndex();
  }

  async generateAnnotatedIndex() {
    const files = await fs.readdir(this.outputDir, { recursive: true });
    const imageFiles = files.filter((f) => f.endsWith(".png"));

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Captures Annotées - SYSG-IMFP</title>
    <style>
        :root {
            --imfp-blue: #1e3a8a;
            --imfp-light-blue: #3b82f6;
            --imfp-green: #10b981;
            --imfp-red: #ef4444;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1600px;
            margin: 0 auto;
        }
        
        header {
            background: linear-gradient(135deg, var(--imfp-blue), var(--imfp-light-blue));
            color: white;
            padding: 2.5rem;
            border-radius: 16px;
            margin-bottom: 2.5rem;
            box-shadow: 0 10px 25px rgba(30, 58, 138, 0.2);
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 1rem;
        }
        
        .logo-icon {
            font-size: 2.5rem;
            background: rgba(255, 255, 255, 0.2);
            padding: 15px;
            border-radius: 12px;
        }
        
        h1 {
            font-size: 2.8rem;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin-bottom: 0.5rem;
        }
        
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 1.5rem;
        }
        
        .stats {
            display: flex;
            gap: 30px;
            margin-top: 1.5rem;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.15);
            padding: 15px 25px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            display: block;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .filters {
            display: flex;
            gap: 15px;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            padding: 10px 25px;
            border: none;
            border-radius: 50px;
            background: white;
            color: var(--imfp-blue);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .filter-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .filter-btn.active {
            background: var(--imfp-blue);
            color: white;
        }
        
        .role-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-right: 10px;
        }
        
        .badge-admin { background: #10b981; color: white; }
        .badge-prof { background: #8b5cf6; color: white; }
        .badge-sec { background: #f59e0b; color: white; }
        .badge-dir { background: #ec4899; color: white; }
        
        .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
            gap: 25px;
            margin-bottom: 3rem;
        }
        
        .image-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
        }
        
        .image-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        
        .image-card img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .image-info {
            padding: 20px;
        }
        
        .image-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .image-desc {
            color: #6b7280;
            font-size: 0.95rem;
            line-height: 1.5;
            margin-bottom: 15px;
        }
        
        .image-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #f3f4f6;
        }
        
        .image-actions {
            display: flex;
            gap: 10px;
        }
        
        .btn {
            padding: 8px 16px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.2s;
        }
        
        .btn-view {
            background: var(--imfp-light-blue);
            color: white;
        }
        
        .btn-download {
            background: #f3f4f6;
            color: #4b5563;
        }
        
        .btn:hover {
            opacity: 0.9;
        }
        
        .legend {
            background: white;
            padding: 25px;
            border-radius: 16px;
            margin-top: 2rem;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }
        
        .legend-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1f2937;
        }
        
        .legend-items {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 4px;
        }
        
        footer {
            text-align: center;
            margin-top: 3rem;
            padding: 2rem;
            color: #6b7280;
            font-size: 0.9rem;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">
                <div class="logo-icon">🎓</div>
                <div>
                    <h1>SYSG-IMFP</h1>
                    <p class="subtitle">Manuel d'Utilisation - Captures Annotées</p>
                </div>
            </div>
            
            <p>Guide visuel complet pour tous les rôles utilisateurs</p>
            
            <div class="stats">
                <div class="stat-card">
                    <span class="stat-value">${imageFiles.length}</span>
                    <span class="stat-label">Captures annotées</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">4</span>
                    <span class="stat-label">Rôles utilisateurs</span>
                </div>
                <div class="stat-card">
                    <span class="stat-value">${new Date().toLocaleDateString(
                      "fr-FR"
                    )}</span>
                    <span class="stat-label">Dernière mise à jour</span>
                </div>
            </div>
        </header>
        
        <div class="filters">
            <button class="filter-btn active" data-role="all">Toutes</button>
            <button class="filter-btn" data-role="admin">Administrateur</button>
            <button class="filter-btn" data-role="secretaire">Secrétaire</button>
            <button class="filter-btn" data-role="professeur">Professeur</button>
            <button class="filter-btn" data-role="directeur">Directeur</button>
        </div>
        
        <div class="image-grid" id="imageGrid">
            ${imageFiles
              .map((file, index) => {
                const role = file.split("/")[0];
                const name = path
                  .basename(file, "-annotated.png")
                  .replace(/-/g, " ");
                const badgeClass = `badge-${role}`;

                return `
                <div class="image-card" data-role="${role}">
                    <img src="${file}" alt="${name}" loading="lazy">
                    <div class="image-info">
                        <div class="role-badge ${badgeClass}">
                            ${role.charAt(0).toUpperCase() + role.slice(1)}
                        </div>
                        <h3 class="image-title">${name}</h3>
                        <p class="image-desc">
                            Capture annotée pour la fonctionnalité "${name}"
                        </p>
                        <div class="image-meta">
                            <div class="image-actions">
                                <a href="${file}" class="btn btn-view" target="_blank">Agrandir</a>
                                <a href="${file}" class="btn btn-download" download>Télécharger</a>
                            </div>
                        </div>
                    </div>
                </div>
              `;
              })
              .join("")}
        </div>
        
        <div class="legend">
            <h3 class="legend-title">Légende des couleurs</h3>
            <div class="legend-items">
                ${Object.entries(this.styles.colors)
                  .map(
                    ([name, color]) => `
                    <div class="legend-item">
                        <div class="legend-color" style="background: ${color};"></div>
                        <span>${
                          name.charAt(0).toUpperCase() + name.slice(1)
                        }</span>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
        
        <footer>
            <p>Centre d'Aide SYSG-IMFP • Système de Gestion Scolaire • © ${new Date().getFullYear()}</p>
            <p style="margin-top: 10px; font-size: 0.8rem; opacity: 0.7;">
                Généré automatiquement • Dernière mise à jour: ${new Date().toLocaleString(
                  "fr-FR"
                )}
            </p>
        </footer>
    </div>
    
    <script>
        // Filtrage par rôle
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Retirer la classe active de tous les boutons
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');
                
                const role = this.dataset.role;
                const cards = document.querySelectorAll('.image-card');
                
                cards.forEach(card => {
                    if (role === 'all' || card.dataset.role === role) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        
        // Animation au chargement
        document.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('.image-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.5s, transform 0.5s';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
        
        // Recherche rapide (optionnel)
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Rechercher une capture...';
        searchInput.style.cssText = \`
            padding: 12px 20px;
            border: 2px solid #e5e7eb;
            border-radius: 50px;
            width: 300px;
            margin-bottom: 20px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s;
        \`;
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.image-card');
            
            cards.forEach(card => {
                const title = card.querySelector('.image-title').textContent.toLowerCase();
                const desc = card.querySelector('.image-desc').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
        
        document.querySelector('.filters').parentNode.insertBefore(searchInput, document.querySelector('.filters'));
    </script>
</body>
</html>`;

    const indexPath = path.join(this.outputDir, "index.html");
    await fs.writeFile(indexPath, html);
    console.log(chalk.blue(`📄 Index annoté généré: ${indexPath}`));
  }
}

// Exécution
const annotator = new IMFP_Annotator();
await annotator.annotateAll();
