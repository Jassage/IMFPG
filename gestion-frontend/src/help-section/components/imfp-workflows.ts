// src/data/help/workflows/imfp-workflows.ts
export const IMFP_WORKFLOWS = {
  // ========== INSCRIPTION & ADMISSION ==========
  studentEnrollment: {
    id: "student-enrollment",
    title: "Inscription d'un nouvel élève",
    description:
      "Processus complet d'inscription et d'admission d'un nouvel élève",
    category: "Admission",
    roles: ["admin", "secretaire"],
    difficulty: "medium",
    estimatedTime: "15-20 minutes",
    prerequisites: [
      "Documents d'identité de l'élève (certificat de naissance)",
      "Certificat médical scolaire",
      "Dernier bulletin scolaire",
      "2 photos d'identité",
      "Fiche de renseignements remplie",
    ],
    icon: "👨‍🎓",
    steps: [
      {
        id: "enrollment-step-1",
        step: 1,
        title: "Accéder au module d'inscription",
        description:
          'Ouvrir la section "Élèves" puis cliquer sur "Nouvelle inscription"',
        actions: [
          "Navigation: Menu principal → Élèves",
          'Action: Cliquer sur "Ajouter un élève"',
        ],
        image: "admin/students-add.png",
        imageCaption: "Formulaire d'ajout d'un nouvel élève",
        role: "admin",
        tips: [
          "Vérifier que vous avez les droits d'administration",
          'Le bouton est vert avec une icône "+"',
        ],
      },
      {
        id: "enrollment-step-2",
        step: 2,
        title: "Remplir les informations personnelles",
        description: "Compléter toutes les sections obligatoires du formulaire",
        actions: [
          "Saisir: Nom, prénom, date de naissance",
          "Saisir: Lieu de naissance, nationalité",
          "Uploader: Photo d'identité",
        ],
        image: "admin/student-form-filled.png",
        imageCaption: "Section informations personnelles remplie",
        role: "admin",
        warnings: [
          "Les champs marqués d'un astérisque (*) sont obligatoires",
          "Vérifier l'orthographe des noms",
        ],
      },
      {
        id: "enrollment-step-3",
        step: 3,
        title: "Ajouter les responsables légaux",
        description: "Ajouter au moins un parent ou tuteur légal",
        actions: [
          'Cliquer: "Ajouter un parent"',
          "Remplir: Coordonnées du parent",
          "Définir: Responsable principal (oui/non)",
        ],
        image: "admin/add-guardian-form.png",
        imageCaption: "Formulaire d'ajout d'un parent",
        role: "admin",
        tips: [
          "Privilégier l'email pour les communications",
          "Ajouter un deuxième contact en cas d'urgence",
          "Définir qui reçoit les notifications",
        ],
      },
      {
        id: "enrollment-step-4",
        step: 4,
        title: "Sélectionner la classe",
        description: "Affecter l'élève à une classe et un niveau",
        actions: [
          "Sélectionner: Année scolaire",
          "Choisir: Niveau (6ème, 5ème, etc.)",
          "Sélectionner: Classe spécifique",
        ],
        image: "admin/class-selection.png",
        imageCaption: "Sélection de la classe et du niveau",
        role: "admin",
        warnings: [
          "Vérifier la capacité maximale de la classe",
          "Respecter les critères d'âge par niveau",
        ],
      },
      {
        id: "enrollment-step-5",
        step: 5,
        title: "Calculer les frais de scolarité",
        description: "Le système calcule automatiquement les frais applicables",
        actions: [
          "Vérifier: Montants des frais de scolarité",
          "Ajouter: Frais de cantine (optionnel)",
          "Appliquer: Réductions éventuelles",
        ],
        image: "admin/fees-calculation.png",
        imageCaption: "Calcul automatique des frais",
        role: "admin",
        tips: [
          "Les frais varient selon le niveau",
          "Les bourses peuvent être appliquées ultérieurement",
          "Générer une facture proforma pour les parents",
        ],
      },
      {
        id: "enrollment-step-6",
        step: 6,
        title: "Générer la fiche d'inscription",
        description: "Créer et imprimer les documents officiels",
        actions: [
          'Cliquer: "Générer la fiche"',
          "Vérifier: Toutes les informations",
          "Imprimer: 2 copies",
        ],
        image: "admin/enrollment-form-preview.png",
        imageCaption: "Aperçu de la fiche d'inscription",
        role: "admin",
        warnings: [
          "Vérifier toutes les informations avant impression",
          "Signer les deux copies",
          "Archiver une copie numérique",
        ],
      },
      {
        id: "enrollment-step-7",
        step: 7,
        title: "Finaliser l'inscription",
        description: "Valider et terminer le processus",
        actions: [
          'Cliquer: "Valider l\'inscription"',
          "Confirmer: La boîte de dialogue",
          "Notifier: Les parents par email",
        ],
        image: "admin/enrollment-confirmation.png",
        imageCaption: "Message de confirmation d'inscription",
        role: "admin",
        tips: [
          "Une notification est envoyée automatiquement aux parents",
          "L'élève apparaît maintenant dans la liste des élèves",
          "Le numéro de matricule est généré automatiquement",
        ],
      },
    ],
    commonIssues: [
      {
        id: "enrollment-issue-1",
        problem: "Le formulaire ne se soumet pas",
        solution:
          "Vérifier les champs obligatoires et les erreurs de validation",
        fixSteps: [
          'Cliquer sur "Vérifier les erreurs"',
          "Corriger les champs marqués en rouge",
          "Vérifier les formats des dates",
          "Réessayer la soumission",
        ],
        preventTips: [
          "Utiliser le format JJ/MM/AAAA pour les dates",
          "Vérifier les emails avant soumission",
          "S'assurer que la photo respecte les critères",
        ],
      },
      {
        id: "enrollment-issue-2",
        problem: "La photo ne s'upload pas",
        solution: "Vérifier le format, la taille et les dimensions de l'image",
        fixSteps: [
          "Format acceptés: JPG, PNG, JPEG",
          "Taille maximale: 2MB",
          "Dimensions recommandées: 300x400 pixels",
          "Réduire la taille si nécessaire",
        ],
      },
      {
        id: "enrollment-issue-3",
        problem: "La classe sélectionnée est pleine",
        solution: "Choisir une autre classe ou contacter l'administration",
        fixSteps: [
          "Vérifier les autres classes du même niveau",
          "Contacter le responsable des inscriptions",
          "Ajouter l'élève en liste d'attente",
        ],
      },
    ],
    successTips: [
      "Garder une copie numérique de tous les documents",
      "Programmer un rappel pour le premier jour de classe",
      "Ajouter l'élève aux groupes de classe sur la plateforme",
    ],
  },

  // ========== SAISIE DES NOTES ==========
  gradeEntry: {
    id: "grade-entry",
    title: "Saisie des notes",
    description:
      "Processus de saisie et validation des notes par les professeurs",
    category: "Académique",
    roles: ["professeur"],
    difficulty: "easy",
    estimatedTime: "30-45 minutes par classe",
    prerequisites: [
      "Grille d'évaluation remplie",
      "Liste des élèves à jour",
      "Barème de notation validé",
      "Dates des évaluations",
    ],
    icon: "📝",
    steps: [
      // ... steps détaillés pour la saisie des notes
    ],
  },

  // ========== GÉNÉRATION DES BULLETINS ==========
  transcriptGeneration: {
    id: "transcript-generation",
    title: "Génération des bulletins",
    description: "Création, validation et impression des bulletins scolaires",
    category: "Documents",
    roles: ["admin", "directeur"],
    difficulty: "hard",
    estimatedTime: "2-3 heures (toutes classes)",
    prerequisites: [
      "Toutes les notes saisies et validées",
      "Commentaires des professeurs",
      "Template de bulletin validé",
      "Dates de conseil de classe",
    ],
    icon: "📊",
    steps: [
      // ... steps détaillés pour les bulletins
    ],
  },

  // ========== GESTION DES PAIEMENTS ==========
  paymentManagement: {
    id: "payment-management",
    title: "Gestion des paiements",
    description: "Enregistrement et suivi des paiements des frais de scolarité",
    category: "Financier",
    roles: ["admin", "secretaire"],
    difficulty: "medium",
    estimatedTime: "10-15 minutes par paiement",
    prerequisites: [
      "Factures générées",
      "Relevés bancaires",
      "Reçus de paiement",
      "Coordonnées bancaires",
    ],
    icon: "💰",
    steps: [
      // ... steps détaillés pour les paiements
    ],
  },

  // ========== PLANNING DES COURS ==========
  scheduleManagement: {
    id: "schedule-management",
    title: "Gestion des emplois du temps",
    description: "Création et modification des emplois du temps",
    category: "Organisation",
    roles: ["admin", "directeur"],
    difficulty: "hard",
    estimatedTime: "1-2 jours (toutes classes)",
    prerequisites: [
      "Liste des professeurs",
      "Liste des salles disponibles",
      "Contraintes horaires",
      "Programmes par niveau",
    ],
    icon: "📅",
    steps: [
      // ... steps détaillés pour les emplois du temps
    ],
  },
};

// Helper pour obtenir les workflows par rôle
export const getWorkflowsByRole = (role: string) => {
  return Object.values(IMFP_WORKFLOWS).filter((workflow) =>
    workflow.roles.includes(role.toLowerCase() as any)
  );
};

// Helper pour obtenir les workflows par catégorie
export const getWorkflowsByCategory = (category: string) => {
  return Object.values(IMFP_WORKFLOWS).filter(
    (workflow) => workflow.category === category
  );
};
