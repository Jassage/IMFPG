// scripts/screenshots/config.js
const path = require("path");

module.exports = {
  // Configuration de l'application
  APP_URL: "http://localhost:3000",
  APP_PORT: 3000,

  // Credentials de test (À MODIFIER AVANT UTILISATION)
  TEST_CREDENTIALS: {
    admin: {
      email: "admin@example.com",
      password: "admin123",
    },
    secretary: {
      email: "secretary@example.com",
      password: "secretary123",
    },
    professor: {
      email: "professor@example.com",
      password: "professor123",
    },
    director: {
      email: "director@example.com",
      password: "director123",
    },
  },

  // Configuration des captures par rôle
  CAPTURE_CONFIG: {
    // ========== ADMIN ==========
    admin: [
      {
        id: "dashboard-admin",
        name: "Tableau de bord Admin",
        path: "/admin/dashboard",
        waitFor: ".dashboard-stats",
        priority: 1,
        annotations: [
          {
            selector: ".stats-card:first-child",
            label: "Statistiques principales",
          },
          { selector: ".quick-actions", label: "Actions rapides" },
        ],
      },
      {
        id: "students-list",
        name: "Liste des élèves",
        path: "/admin/students",
        waitFor: ".students-table",
        priority: 1,
        annotations: [
          { selector: 'button:contains("Ajouter")', label: "Ajouter un élève" },
          { selector: ".filter-section", label: "Filtres de recherche" },
        ],
      },
      {
        id: "student-add-form",
        name: "Formulaire ajout élève",
        path: "/admin/students/add",
        waitFor: "form",
        priority: 1,
        formData: {
          firstName: "Jean",
          lastName: "Dupont",
          birthDate: "2010-05-15",
          email: "jean.dupont@example.com",
        },
        annotations: [
          { selector: 'input[name="firstName"]', label: "Prénom" },
          { selector: 'input[name="lastName"]', label: "Nom" },
          { selector: 'button[type="submit"]', label: "Sauvegarder" },
        ],
      },
      {
        id: "enrollments-process",
        name: "Processus inscriptions",
        path: "/admin/enrollments",
        waitFor: ".enrollments-list",
        priority: 2,
        annotations: [
          { selector: ".status-badge", label: "Statut inscription" },
          { selector: ".action-buttons", label: "Actions disponibles" },
        ],
      },
      {
        id: "grades-management",
        name: "Gestion des notes",
        path: "/admin/grades",
        waitFor: ".grades-container",
        priority: 1,
        annotations: [
          { selector: ".grade-input:first-child", label: "Saisie note" },
          { selector: ".calculate-btn", label: "Calculer moyenne" },
        ],
      },
      {
        id: "payments-overview",
        name: "Vue des paiements",
        path: "/admin/payments",
        waitFor: ".payments-table",
        priority: 2,
        annotations: [
          { selector: ".payment-status", label: "Statut paiement" },
          { selector: ".export-button", label: "Exporter en Excel" },
        ],
      },
      {
        id: "professors-management",
        name: "Gestion professeurs",
        path: "/admin/professeurs",
        waitFor: ".professors-table",
        priority: 2,
        annotations: [
          { selector: ".assign-class", label: "Assigner classe" },
          { selector: ".schedule-link", label: "Voir emploi du temps" },
        ],
      },
      {
        id: "subjects-catalog",
        name: "Catalogue matières",
        path: "/admin/subject",
        waitFor: ".subjects-list",
        priority: 3,
      },
      {
        id: "schedule-management",
        name: "Gestion emploi du temps",
        path: "/admin/schedule",
        waitFor: ".schedule-calendar",
        priority: 2,
      },
      {
        id: "transcripts-generation",
        name: "Génération bulletins",
        path: "/admin/transcripts",
        waitFor: ".transcript-builder",
        priority: 2,
      },
      {
        id: "users-management",
        name: "Gestion utilisateurs",
        path: "/admin/users",
        waitFor: ".users-table",
        priority: 2,
      },
      {
        id: "classes-management",
        name: "Gestion classes/niveaux",
        path: "/admin/classes",
        waitFor: ".classes-list",
        priority: 3,
      },
      {
        id: "fees-management",
        name: "Gestion frais scolaires",
        path: "/admin/fees",
        waitFor: ".fees-table",
        priority: 2,
      },
      {
        id: "events-management",
        name: "Gestion événements",
        path: "/admin/events",
        waitFor: ".events-calendar",
        priority: 3,
      },
      {
        id: "announcements-management",
        name: "Gestion annonces",
        path: "/admin/announcements",
        waitFor: ".announcements-list",
        priority: 3,
      },
      {
        id: "audit-logs",
        name: "Journal d'audit",
        path: "/admin/audit-logs",
        waitFor: ".audit-table",
        priority: 3,
      },
    ],

    // ========== SECRETAIRE ==========
    secretary: [
      {
        id: "dashboard-secretary",
        name: "Tableau de bord Secrétaire",
        path: "/secretary/dashboard",
        waitFor: ".quick-stats",
        priority: 1,
      },
      {
        id: "enrollments-processing",
        name: "Traitement inscriptions",
        path: "/secretary/enrollments",
        waitFor: ".pending-enrollments",
        priority: 1,
      },
    ],

    // ========== PROFESSEUR ==========
    professor: [
      {
        id: "dashboard-professor",
        name: "Tableau de bord Professeur",
        path: "/professor/dashboard",
        waitFor: ".my-classes",
        priority: 1,
      },
      {
        id: "grades-input",
        name: "Saisie des notes",
        path: "/professor/grades",
        waitFor: ".gradebook",
        priority: 1,
      },
    ],

    // ========== DIRECTEUR ==========
    director: [
      {
        id: "dashboard-director",
        name: "Tableau de bord Directeur",
        path: "/director/dashboard",
        waitFor: ".analytics",
        priority: 1,
      },
    ],
  },

  // Configuration Puppeteer
  PUPPETEER_CONFIG: {
    headless: "new",
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2, // Pour des captures HD
    },
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
  },

  // Dossiers de sortie
  OUTPUT_DIRS: {
    base: path.join(__dirname, "../../public/help-assets"),
    screenshots: path.join(__dirname, "../../public/help-assets/screenshots"),
    thumbnails: path.join(__dirname, "../../public/help-assets/thumbnails"),
    annotated: path.join(__dirname, "../../public/help-assets/annotated"),
  },

  // Format des images
  IMAGE_SETTINGS: {
    quality: 90,
    type: "png",
    fullPage: false,
    omitBackground: true,
  },
};
