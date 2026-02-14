import {
  HelpSection,
  FAQItem,
  VideoResource,
  QuickAction,
} from "@/types/help.types";
import { ActiveTab, UserRole, PERMISSIONS } from "@/types/navigation";

// ==================== VIDÉOS TUTORIELS ====================
export const tutorialVideos: VideoResource[] = [
  {
    id: "admin-dashboard",
    title: "Tableau de bord Administrateur",
    description: "Guide complet du tableau de bord",
    duration: "5:30",
    thumbnail: "/help-screenshots/dashboard/page.jpg",
    category: "admin",
    url: "https://youtube.com/watch?v=dashboard-admin",
  },
  {
    id: "student-registration",
    title: "Inscription d'un nouvel élève",
    description: "Processus complet d'inscription",
    duration: "8:15",
    thumbnail: "/help-screenshots/students/add.jpg",
    category: "students",
    url: "https://youtube.com/watch?v=student-registration",
  },
  {
    id: "grade-entry",
    title: "Saisie des notes",
    description: "Comment saisir et valider les notes",
    duration: "6:45",
    thumbnail: "/help-screenshots/grades/entry.jpg",
    category: "grades",
    url: "https://youtube.com/watch?v=grade-entry",
  },
  {
    id: "schedules",
    title: "Création d'emploi du temps",
    description: "Générer un emploi du temps automatique",
    duration: "10:20",
    thumbnail: "/help-screenshots/schedule/create.jpg",
    category: "schedule",
    url: "https://youtube.com/watch?v=schedules",
  },
  {
    id: "invoice-generation",
    title: "Génération de factures",
    description: "Créer et envoyer des factures",
    duration: "7:30",
    thumbnail: "/help-screenshots/payments/invoice.jpg",
    category: "payments",
    url: "https://youtube.com/watch?v=invoice-generation",
  },
  {
    id: "report-cards",
    title: "Édition des bulletins",
    description: "Générer et imprimer les bulletins",
    duration: "9:10",
    thumbnail: "/help-screenshots/transcripts/generate.jpg",
    category: "transcripts",
    url: "https://youtube.com/watch?v=report-cards",
  },
  {
    id: "users",
    title: "Gestion des utilisateurs",
    description: "Créer et gérer les comptes utilisateurs",
    duration: "6:25",
    thumbnail: "/help-screenshots/users/manage.jpg",
    category: "users",
    url: "https://youtube.com/watch?v=users",
  },
  {
    id: "data-export",
    title: "Export des données",
    description: "Exporter les données en différents formats",
    duration: "5:15",
    thumbnail: "/help-screenshots/dashboard/export.jpg",
    category: "admin",
    url: "https://youtube.com/watch?v=data-export",
  },
];

// ==================== FAQ GÉNÉRALES ====================
export const generalFAQs: FAQItem[] = [
  {
    id: "faq-assignment-001",
    question:
      "Comment vérifier les conflits d'emploi du temps avant assignation ?",
    answer:
      "Utilisez l'outil 'Vérifier conflits' dans le formulaire d'assignation. Le système montre les créneaux occupés par le professeur.",
    category: "class_assignment",
    tags: ["conflit", "emploi du temps", "vérification"],
    relatedTo: ["class_assignment"],
  },
  {
    id: "faq-assignment-002",
    question:
      "Puis-je assigner un même professeur à plusieurs matières dans la même classe ?",
    answer:
      "Oui, jusqu'à 3 matières maximum par classe, sauf restriction spécifique.",
    category: "class_assignment",
    tags: ["limite", "professeur", "matière"],
    relatedTo: ["class_assignment"],
  },
  {
    id: "faq-assignment-003",
    question: "Comment archiver une assignation terminée ?",
    answer:
      "Modifiez l'assignation > Changez le statut en 'Inactive'. L'assignation reste visible dans l'historique.",
    category: "class_assignment",
    tags: ["archiver", "terminé", "historique"],
    relatedTo: ["class_assignment"],
  },

  // FAQ Structures de frais

  {
    id: "faq-fee-002",
    question: "Comment gérer les frais optionnels vs obligatoires ?",
    answer:
      "Utilisez le préfixe '[OPT]' dans le nom pour les frais optionnels. Les obligatoires sont automatiquement attribués.",
    category: "fees",
    tags: ["optionnel", "obligatoire", "attribution"],
    relatedTo: ["fees"],
  },
  {
    id: "faq-fee-003",
    question: "Que faire si je me trompe dans le montant d'une structure ?",
    answer:
      "Modifiez la structure avant qu'elle ne soit attribuée à des étudiants. Si déjà attribuée, créez une nouvelle structure et archivez l'ancienne.",
    category: "fees",
    tags: ["erreur", "montant", "correction"],
    relatedTo: ["fees"],
  },

  // FAQ Inscriptions

  {
    id: "faq-enrollment-002",
    question: "Puis-je inscrire un élève à plusieurs classes simultanément ?",
    answer:
      "Non, un élève ne peut être inscrit qu'à une seule classe par année académique.",
    category: "enrollments",
    tags: ["multiple", "classe", "restriction"],
    relatedTo: ["enrollments"],
  },
  {
    id: "faq-enrollment-003",
    question: "Comment gérer les listes d'attente ?",
    answer:
      "Utilisez le statut 'En attente' et l'outil de gestion des capacités dans la vue classe.",
    category: "enrollments",
    tags: ["attente", "capacité", "liste"],
    relatedTo: ["enrollments"],
  },

  // FAQ Utilisateurs
  {
    id: "faq-user-001",
    question:
      "Comment révoquer l'accès temporairement sans supprimer le compte ?",
    answer:
      "Utilisez 'Suspendre' dans le menu changement de statut. L'utilisateur ne pourra plus se connecter mais garde ses données.",
    category: "users",
    tags: ["suspendre", "accès", "temporaire"],
    relatedTo: ["users"],
  },
  {
    id: "faq-user-002",
    question: "Puis-je voir l'historique des modifications d'un utilisateur ?",
    answer:
      "Oui, dans les logs d'audit (accessible uniquement par les administrateurs).",
    category: "users",
    tags: ["historique", "audit", "logs"],
    relatedTo: ["users"],
  },
  {
    id: "faq-user-003",
    question: "Comment fusionner deux comptes utilisateur ?",
    answer:
      "Contactez l'administrateur système. Cette opération nécessite des vérifications de sécurité.",
    category: "users",
    tags: ["fusionner", "compte", "administrateur"],
    relatedTo: ["users"],
  },
  {
    id: "faq-student-001",
    question: "Comment rechercher un élève spécifique ?",
    answer:
      "Utilisez la barre de recherche en haut de la page. Vous pouvez rechercher par : nom, prénom, code étudiant, email ou téléphone.",
    category: "students",
    tags: ["recherche", "élève", "filtre"],
    relatedTo: ["students"],
  },
  {
    id: "faq-student-002",
    question: "Comment archiver un élève diplômé ou parti ?",
    answer:
      "Modifiez l'élève > Onglet Inscription > Changez le statut en 'Diplômé' ou 'Inactif'. Pour archiver définitivement, contactez l'administrateur.",
    category: "students",
    tags: ["archiver", "diplômé", "statut"],
    relatedTo: ["students"],
  },
  {
    id: "faq-student-003",
    question: "Puis-je ajouter une photo d'élève ?",
    answer:
      "Oui, dans le formulaire d'édition > Section informations personnelles > Cliquez sur l'avatar pour télécharger une photo.",
    category: "students",
    tags: ["photo", "avatar", "profil"],
    relatedTo: ["students"],
  },
  {
    id: "faq-student-004",
    question: "Comment gérer les informations médicales sensibles ?",
    answer:
      "Ces informations sont cryptées et uniquement visibles par l'admin et le personnel médical autorisé.",
    category: "students",
    tags: ["médical", "confidentialité", "santé"],
    relatedTo: ["students"],
  },
  {
    id: "faq-student-005",
    question: "Puis-je dupliquer un élève pour un frère/soeur ?",
    answer:
      "Oui, utilisez 'Copier les informations' dans le menu actions. Seules les informations personnelles seront copiées.",
    category: "students",
    tags: ["dupliquer", "famille", "copie"],
    relatedTo: ["students"],
  },
  {
    id: "faq-student-006",
    question: "Comment imprimer la fiche complète d'un élève ?",
    answer:
      "Dans les détails de l'élève > Cliquez sur 'Imprimer' en haut à droite > Sélectionnez le format PDF ou Impression directe.",
    category: "students",
    tags: ["imprimer", "fiche", "pdf"],
    relatedTo: ["students"],
  },
  {
    id: "faq-student-007",
    question: "Comment importer plusieurs élèves depuis Excel ?",
    answer:
      "En bas de la liste > 'Importer' > Téléchargez le template Excel > Remplissez-le > Importez-le.",
    category: "students",
    tags: ["importer", "excel", "batch"],
    relatedTo: ["students"],
  },
  {
    id: "faq-student-008",
    question: "Les parents peuvent-ils modifier leurs informations ?",
    answer:
      "Non, seuls les administrateurs et secrétaires peuvent modifier. Les parents peuvent demander une mise à jour via leur portail.",
    category: "students",
    tags: ["parents", "modification", "portail"],
    relatedTo: ["students"],
  },
  {
    id: "faq-student-009",
    question: "Comment créer un compte utilisateur pour un élève ?",
    answer:
      "Dans le formulaire de création > Section Inscription > Cochez 'Créer un compte utilisateur'. Un email d'activation sera envoyé.",
    category: "students",
    tags: ["compte", "utilisateur", "connexion"],
    relatedTo: ["students"],
  },
  {
    id: "faq-student-010",
    question: "Que faire si je fais une erreur dans les informations ?",
    answer:
      "Vous pouvez modifier à tout moment. Allez dans les détails de l'élève > 'Modifier' > Corrigez > 'Enregistrer'. Un historique est conservé.",
    category: "students",
    tags: ["erreur", "correction", "historique"],
    relatedTo: ["students"],
  },
  {
    id: "faq-payment-001",
    question: "Comment savoir quels frais sont impayés pour un étudiant ?",
    answer:
      "Dans le formulaire de paiement, les frais apparaissent avec leur solde disponible. Les frais entièrement payés sont marqués '(Payé)'.",
    category: "payments",
    tags: ["frais", "impayés", "solde"],
    relatedTo: ["payments"],
  },
  {
    id: "faq-payment-002",
    question: "Puis-je annuler un paiement ?",
    answer:
      "Oui, dans les 7 jours via 'Supprimer'. Après 7 jours, contactez l'administrateur pour un remboursement manuel.",
    category: "payments",
    tags: ["annuler", "supprimer", "remboursement"],
    relatedTo: ["payments"],
  },
  {
    id: "faq-payment-003",
    question: "Comment générer un reçu de paiement ?",
    answer:
      "Dans l'historique des paiements, cliquez sur 'Imprimer' à côté du paiement. Un reçu PDF sera généré.",
    category: "payments",
    tags: ["reçu", "pdf", "imprimer"],
    relatedTo: ["payments"],
  },
  {
    id: "faq-payment-004",
    question: "Que faire en cas d'erreur de montant ?",
    answer:
      "Modifiez le paiement dans les 30 jours. Après 30 jours, créez un paiement complémentaire ou de remboursement.",
    category: "payments",
    tags: ["erreur", "montant", "correction"],
    relatedTo: ["payments"],
  },
  {
    id: "faq-payment-005",
    question: "Comment suivre les paiements en retard ?",
    answer:
      "Filtrez par statut 'En attente' et triez par date. Les paiements anciens apparaissent en haut.",
    category: "payments",
    tags: ["retard", "suivi", "impayés"],
    relatedTo: ["payments"],
  },
  {
    id: "faq-payment-006",
    question: "Puis-je voir les statistiques par mois ?",
    answer:
      "Oui, utilisez le filtre de période. Sélectionnez une plage de dates pour voir les totaux mensuels.",
    category: "payments",
    tags: ["statistiques", "mois", "rapport"],
    relatedTo: ["payments"],
  },
  {
    id: "faq-payment-007",
    question: "Comment gérer les paiements partiels ?",
    answer:
      "Enregistrez plusieurs paiements pour le même frais. Le système calcule automatiquement le solde restant.",
    category: "payments",
    tags: ["partiel", "multiple", "solde"],
    relatedTo: ["payments"],
  },
  {
    id: "faq-payment-008",
    question: "Les références de virement sont-elles obligatoires ?",
    answer:
      "Oui pour les virements, recommandées pour les chèques. Aident au suivi et à la réconciliation.",
    category: "payments",
    tags: ["référence", "virement", "suivi"],
    relatedTo: ["payments"],
  },
  {
    id: "faq-payment-009",
    question: "Comment exporter les données pour la comptabilité ?",
    answer:
      "Cliquez sur 'Exporter' en haut de la page. Format Excel avec toutes les colonnes nécessaires.",
    category: "payments",
    tags: ["export", "comptabilité", "excel"],
    relatedTo: ["payments"],
  },
  {
    id: "faq-payment-010",
    question: "Qui peut voir l'historique des paiements ?",
    answer:
      "Admin, Directeur et Comptable ont accès complet. Les secrétaires voient seulement les paiements qu'ils ont enregistrés.",
    category: "payments",
    tags: ["permissions", "accès", "historique"],
    relatedTo: ["payments"],
  },
  {
    id: "faq-class-001",
    question: "Quelle est la capacité maximale recommandée ?",
    answer:
      "30 élèves pour les classes standards, 25 pour les classes spécialisées. Maximum absolu : 50 élèves.",
    category: "classes",
    tags: ["capacité", "maximum", "recommandation"],
    relatedTo: ["classes"],
  },
  {
    id: "faq-class-002",
    question: "Puis-je archiver une classe ancienne ?",
    answer:
      "Oui, changez le statut en 'Inactive'. Pour supprimer définitivement, contactez l'administrateur.",
    category: "classes",
    tags: ["archiver", "inactive", "supprimer"],
    relatedTo: ["classes"],
  },
  {
    id: "faq-class-003",
    question: "Comment savoir combien de places disponibles ?",
    answer:
      "Regardez la barre de progression et le calcul : Capacité - Élèves inscrits = Places disponibles.",
    category: "classes",
    tags: ["places", "disponibles", "calcul"],
    relatedTo: ["classes"],
  },
  {
    id: "faq-class-004",
    question: "Puis-je dupliquer une classe ?",
    answer:
      "Non directement. Créez une nouvelle classe avec les mêmes paramètres. Les élèves ne sont pas copiés.",
    category: "classes",
    tags: ["dupliquer", "copier", "création"],
    relatedTo: ["classes"],
  },
  {
    id: "faq-class-005",
    question: "Que faire si une classe atteint sa capacité maximale ?",
    answer:
      "Créez une nouvelle section (ex: '6ème B'). Les nouvelles inscriptions seront dirigées vers la nouvelle classe.",
    category: "classes",
    tags: ["pleine", "capacité", "nouvelle-section"],
    relatedTo: ["classes"],
  },
  {
    id: "faq-class-006",
    question: "Comment renommer une classe ?",
    answer:
      "Modifiez la classe > Changez le nom > Sauvegardez. Les inscriptions existantes seront automatiquement mises à jour.",
    category: "classes",
    tags: ["renommer", "modifier", "nom"],
    relatedTo: ["classes"],
  },
  {
    id: "faq-class-007",
    question: "Les niveaux NS, c'est quoi ?",
    answer:
      "Niveaux Spéciaux I à IV : Classes préparatoires ou spécialisées, souvent pour des programmes particuliers.",
    category: "classes",
    tags: ["niveaux", "ns", "spécialisé"],
    relatedTo: ["classes"],
  },
  {
    id: "faq-class-008",
    question: "Comment filtrer par niveau scolaire ?",
    answer:
      "Utilisez le sélecteur 'Niveau' en haut de la page. Tous les niveaux de Sixième à NS IV sont disponibles.",
    category: "classes",
    tags: ["filtre", "niveau", "recherche"],
    relatedTo: ["classes"],
  },
  {
    id: "faq-class-009",
    question: "Puis-je voir la liste des élèves d'une classe ?",
    answer:
      "Oui, cliquez sur le nombre d'élèves dans la colonne 'Élèves'. Une fenêtre avec la liste s'ouvre.",
    category: "classes",
    tags: ["élèves", "liste", "détails"],
    relatedTo: ["classes", "students"],
  },
  {
    id: "faq-class-010",
    question: "Comment exporter la liste des classes ?",
    answer:
      "Cliquez sur 'Exporter' en haut de la page. Format Excel avec nom, niveau, capacité, occupation, statut.",
    category: "classes",
    tags: ["export", "excel", "liste"],
    relatedTo: ["classes"],
  },

  {
    id: "faq-subject-001",
    question: "Quelle note maximale choisir ?",
    answer:
      "20 points pour le système français standard, 100 points pour les pourcentages, 10 points pour les petits devoirs.",
    category: "subjects",
    tags: ["note", "maximale", "échelle"],
    relatedTo: ["subject"],
  },
  {
    id: "faq-subject-002",
    question: "Puis-je changer le coefficient en cours d'année ?",
    answer:
      "Oui, mais cela affectera toutes les notes existantes. À faire avec précaution et en début d'année.",
    category: "subjects",
    tags: ["coefficient", "modification", "impact"],
    relatedTo: ["subject"],
  },
  {
    id: "faq-subject-003",
    question: "Comment archiver une matière obsolète ?",
    answer:
      "Modifiez la matière > Changez le statut en 'Inactive'. Elle restera visible mais ne pourra être assignée.",
    category: "subjects",
    tags: ["archiver", "inactive", "obsolète"],
    relatedTo: ["subject"],
  },
  {
    id: "faq-subject-004",
    question: "Une matière peut-elle avoir plusieurs codes ?",
    answer:
      "Non, une matière = un code unique. Pour des variantes, créez des matières séparées (ex: 'Mathématiques Avancées').",
    category: "subjects",
    tags: ["code", "unique", "variante"],
    relatedTo: ["subject"],
  },
  {
    id: "faq-professor-001",
    question: "Comment générer un nouveau matricule ?",
    answer:
      "Le matricule est généré automatiquement. Pour regénérer, cliquez sur l'icône 'Nouveau' (✨) à côté du champ matricule.",
    category: "professeurs",
    tags: ["matricule", "génération", "code"],
    relatedTo: ["professeurs"],
  },
  {
    id: "faq-professor-002",
    question: "Un professeur peut-il enseigner plusieurs matières ?",
    answer:
      "Oui, maximum 10 matières. Définissez une matière principale et ajoutez les matières secondaires.",
    category: "professeurs",
    tags: ["matières", "enseignement", "spécialité"],
    relatedTo: ["professeurs"],
  },
  {
    id: "faq-professor-003",
    question: "Que se passe-t-il quand je désactive un professeur ?",
    answer:
      "Le professeur ne peut plus être assigné à de nouveaux cours, mais conserve ses assignations existantes.",
    category: "professeurs",
    tags: ["désactivation", "statut", "impact"],
    relatedTo: ["professeurs"],
  },
  {
    id: "faq-professor-004",
    question: "Comment réactiver un professeur désactivé ?",
    answer:
      "Trouvez le professeur dans la liste, ouvrez le menu actions (⋮) et cliquez sur 'Activer'.",
    category: "professeurs",
    tags: ["réactivation", "statut", "gestion"],
    relatedTo: ["professeurs"],
  },
  {
    id: "faq-professor-005",
    question: "Puis-je modifier le matricule d'un professeur ?",
    answer:
      "Oui, mais déconseillé. Le matricule est l'identifiant unique. Utilisez seulement si nécessaire.",
    category: "professeurs",
    tags: ["matricule", "modification", "identifiant"],
    relatedTo: ["professeurs"],
  },
  {
    id: "faq-professor-006",
    question: "Comment voir les cours assignés à un professeur ?",
    answer:
      "Cliquez sur 'Voir les détails' dans le menu actions, puis onglet 'Assignations'.",
    category: "professeurs",
    tags: ["cours", "assignations", "détails"],
    relatedTo: ["professeurs"],
  },
  {
    id: "faq-professor-007",
    question: "Que faire si un professeur change d'email ?",
    answer:
      "Modifiez le professeur > Changez l'email > Le système mettra à jour l'association avec le compte utilisateur.",
    category: "professeurs",
    tags: ["email", "modification", "compte"],
    relatedTo: ["professeurs"],
  },
  {
    id: "faq-professor-008",
    question: "Comment exporter la liste complète des professeurs ?",
    answer:
      "Cliquez sur 'Exporter' en haut de la page. Format Excel avec toutes les colonnes.",
    category: "professeurs",
    tags: ["export", "excel", "liste"],
    relatedTo: ["professeurs"],
  },
  {
    id: "faq-professor-009",
    question: "Puis-je filtrer par spécialité ?",
    answer:
      "Oui, utilisez le sélecteur 'Spécialité' dans la barre de filtres. Toutes les spécialités sont listées.",
    category: "professeurs",
    tags: ["filtre", "spécialité", "recherche"],
    relatedTo: ["professeurs"],
  },
  {
    id: "faq-professor-010",
    question: "Comment savoir si un professeur a un compte utilisateur ?",
    answer:
      "Regardez la colonne 'Statut & Compte' : badge vert = compte actif, badge gris = sans compte.",
    category: "professeurs",
    tags: ["compte", "statut", "badge"],
    relatedTo: ["professeurs"],
  },
  {
    id: "faq-grade-001",
    question:
      "Puis-je saisir des notes pour plusieurs matières en même temps ?",
    answer:
      "Non, le système fonctionne matière par matière. Vous devez changer de matière dans les filtres pour saisir les notes d'une autre matière.",
    category: "grades",
    tags: ["saisie", "matière", "multi"],
    relatedTo: ["grades"],
  },
  {
    id: "faq-grade-002",
    question: "Comment savoir si une note a été vue par l'étudiant ?",
    answer:
      "Les notes publiées sont visibles dans le portail étudiant. Le système ne montre pas qui a consulté, mais l'étudiant reçoit une notification.",
    category: "grades",
    tags: ["publication", "étudiant", "consultation"],
    relatedTo: ["grades"],
  },
  {
    id: "faq-grade-003",
    question: "Puis-je modifier une note après publication ?",
    answer:
      "Oui, mais cela crée une nouvelle version. L'admin doit re-publier la note modifiée. Un historique des modifications est conservé.",
    category: "grades",
    tags: ["modification", "historique", "version"],
    relatedTo: ["grades"],
  },
  {
    id: "faq-grade-004",
    question: "Comment gérer les notes de rattrapage ?",
    answer:
      "Créez un nouveau type de contrôle 'Rattrapage' et saisissez les notes dans cette catégorie. Le système calcule automatiquement la meilleure note.",
    category: "grades",
    tags: ["rattrapage", "contrôle", "calcul"],
    relatedTo: ["grades"],
  },
  {
    id: "faq-grade-005",
    question: "Les notes sont-elles définitives une fois publiées ?",
    answer:
      "Non, elles peuvent être modifiées jusqu'à la clôture de l'année académique. Après clôture, elles sont archivées en lecture seule.",
    category: "grades",
    tags: ["final", "archivage", "clôture"],
    relatedTo: ["grades"],
  },
  {
    id: "faq-grade-006",
    question: "Comment imprimer la liste des notes ?",
    answer:
      "Utilisez l'export Excel puis imprimez depuis Excel, ou utilisez la fonction 'Impression' dans le menu d'actions.",
    category: "grades",
    tags: ["imprimer", "export", "liste"],
    relatedTo: ["grades"],
  },
  {
    id: "faq-grade-007",
    question: "Puis-je voir l'historique des modifications d'une note ?",
    answer:
      "Oui, cliquez sur l'icône 'œil' pour voir les détails, l'historique des modifications est disponible pour les administrateurs.",
    category: "grades",
    tags: ["historique", "audit", "modifications"],
    relatedTo: ["grades"],
  },
  {
    id: "faq-grade-008",
    question: "Comment fonctionne le calcul de la moyenne ?",
    answer:
      "La moyenne est calculée sur la base des notes validées, avec prise en compte des coefficients des matières et des types de contrôle.",
    category: "grades",
    tags: ["moyenne", "calcul", "coefficient"],
    relatedTo: ["grades"],
  },
  {
    id: "faq-grade-009",
    question: "Que faire si je perds mes modifications en cours ?",
    answer:
      "Le système sauvegarde automatiquement les brouillons. Rechargez la page pour récupérer vos dernières modifications non soumises.",
    category: "grades",
    tags: ["perte", "sauvegarde", "brouillon"],
    relatedTo: ["grades"],
  },
  {
    id: "faq-grade-010",
    question: "Comment signaler un problème avec une note ?",
    answer:
      "Utilisez la fonction 'Rejeter' avec une raison explicite si vous êtes admin, ou contactez l'admin si vous êtes professeur/étudiant.",
    category: "grades",
    tags: ["problème", "signalement", "rejet"],
    relatedTo: ["grades"],
  },
];

// ==================== AIDE POUR ADMIN ====================
export const adminHelpSections: HelpSection[] = [
  {
    id: "dashboard",
    title: "Tableau de bord",
    description: "Vue d'ensemble et statistiques du système",
    icon: "Home",
    color: "bg-blue-100 text-blue-800",
    permissions: [PERMISSIONS.VIEW_DASHBOARD],
    content: [
      {
        id: "dashboard-overview",
        title: "Présentation du tableau de bord",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accueil",
            description:
              "Le tableau de bord affiche les KPIs principaux : nombre d'élèves, professeurs, paiements en attente.",
            image: "/help-screenshots/dashboard/page.png",
          },
          {
            step: 2,
            title: "Widgets personnalisables",
            description:
              "Cliquez sur l'icône ⚙️ pour ajouter/retirer des widgets selon vos besoins.",
            action: "Cliquer sur l'icône de configuration en haut à droite",
          },
          {
            step: 3,
            title: "Export des données",
            description:
              "Utilisez le bouton 'Exporter' pour télécharger les rapports en PDF ou Excel.",
            action: "Cliquer sur 'Exporter' dans la barre d'outils",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
    ],
    quickActions: [
      {
        id: "quick-refresh",
        label: "Actualiser les données",
        description: "Rafraîchir toutes les statistiques",
        icon: "RotateCcw",
        path: "#",
        shortcut: "F5",
      },
    ],
    commonIssues: [
      {
        id: "issue-dash-001",
        problem: "Les statistiques ne se mettent pas à jour",
        solution: "Forcer le rafraîchissement du cache",
        fixSteps: [
          "Cliquez sur l'icône 🔄 en haut à droite",
          "Patientez 10 secondes",
          "Si problème persiste, contactez le support",
        ],
        preventTips: [
          "Évitez de garder l'onglet ouvert trop longtemps",
          "Utilisez F5 pour rafraîchir régulièrement",
        ],
      },
    ],
  },
  {
    id: "students",
    title: "Gestion des Élèves",
    description: "Inscription, modification et suivi des élèves",
    icon: "Users",
    color: "bg-green-100 text-green-800",
    permissions: [PERMISSIONS.VIEW_STUDENTS, PERMISSIONS.MANAGE_STUDENTS],
    content: [
      {
        id: "student-list-overview",
        title: "Navigation dans la liste des élèves",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder à la liste",
            description:
              "Dans le menu principal, cliquez sur 'Élèves' pour accéder à la gestion",
            action: "Naviguer vers Élèves > Liste",
          },
          {
            step: 2,
            title: "Vue Tableau vs Cartes",
            description:
              "Basculez entre la vue tableau (ordinateur) et la vue cartes (mobile/tablette)",
            image: "/help-screenshots/students/list-view.jpg",
          },
          {
            step: 3,
            title: "Filtres avancés",
            description:
              "Utilisez les filtres par statut et classe pour affiner votre recherche",
            action: "Utiliser les sélecteurs en haut de la page",
          },
        ],
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "high",
      },
      {
        id: "add-new-student",
        title: "Ajouter un nouvel élève",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Cliquer sur 'Nouvel élève'",
            description: "Bouton bleu en haut à droite de l'interface",
            action: "Cliquer sur le bouton + Nouvel élève",
          },
          {
            step: 2,
            title: "Remplir les informations personnelles",
            description:
              "Onglet 'Informations élèves' - Tous les champs marqués d'une * sont obligatoires",
            image: "/help-screenshots/students/add-form-1.jpg",
          },
          {
            step: 3,
            title: "Ajouter les parents/tuteurs",
            description:
              "Onglet 'Parents/Tuteurs' - Au moins un parent principal est requis",
            action:
              "Cliquer sur 'Ajouter' pour ajouter un parent supplémentaire",
          },
          {
            step: 4,
            title: "Configurer l'inscription",
            description:
              "Onglet 'Inscription' - Sélectionner la classe et l'année académique",
            action: "Choisir dans les listes déroulantes",
          },
          {
            step: 5,
            title: "Sauvegarder",
            description:
              "Cliquez sur 'Créer l'élève' pour enregistrer la fiche",
            action: "Cliquer sur le bouton vert Enregistrer",
          },
        ],
        targetRole: ["Admin", "Secretaire"],
        importance: "high",
      },
      {
        id: "edit-student",
        title: "Modifier les informations d'un élève",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Trouver l'élève",
            description: "Utilisez la barre de recherche ou les filtres",
            action: "Entrer le nom ou code étudiant dans la recherche",
          },
          {
            step: 2,
            title: "Ouvrir le menu d'actions",
            description:
              "Cliquez sur les trois points verticaux (⋮) dans la ligne de l'élève",
            image: "/help-screenshots/students/actions-menu.jpg",
          },
          {
            step: 3,
            title: "Sélectionner 'Modifier'",
            description: "Dans le menu déroulant, choisissez l'option Modifier",
            action: "Cliquer sur 'Modifier'",
          },
          {
            step: 4,
            title: "Apporter les modifications",
            description: "Modifiez les champs nécessaires dans le formulaire",
            action: "Faire les changements et cliquer sur 'Enregistrer'",
          },
        ],
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "high",
      },
      {
        id: "view-student-details",
        title: "Consulter les détails complets d'un élève",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder aux détails",
            description:
              "Cliquez sur l'icône 'œil' ou 'Voir détails' dans le menu actions",
            action: "Cliquer sur l'icône 👁️",
          },
          {
            step: 2,
            title: "Navigation dans les onglets",
            description:
              "Explorez les différentes sections : Informations, Notes, Absences, Paiements",
            image: "/help-screenshots/students/details-view.jpg",
          },
          {
            step: 3,
            title: "Retour à la liste",
            description:
              "Utilisez le bouton 'Retour à la liste' pour revenir à la vue principale",
            action: "Cliquer sur '← Retour à la liste'",
          },
        ],
        targetRole: [
          "Admin",
          "Directeur",
          "Secretaire",
          "Professeur",
          "Comptable",
        ],
        importance: "medium",
      },
      {
        id: "bulk-actions",
        title: "Actions groupées sur plusieurs élèves",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Activer le mode sélection",
            description: "Cliquez sur le bouton 'Sélection' en haut de la page",
            action: "Cliquer sur l'icône ✓ Sélection",
          },
          {
            step: 2,
            title: "Sélectionner les élèves",
            description: "Cochez les cases à gauche de chaque élève",
            image: "/help-screenshots/students/bulk-select.jpg",
          },
          {
            step: 3,
            title: "Barre d'actions groupées",
            description: "Une barre d'actions apparaît avec plusieurs options",
            action: "Utiliser les boutons dans la barre bleue",
          },
          {
            step: 4,
            title: "Actions disponibles",
            description:
              "Modifier le statut, affecter à une classe, exporter, supprimer",
            action: "Choisir l'action souhaitée",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "medium",
      },
      {
        id: "export-students",
        title: "Exporter les données des élèves",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Export global",
            description:
              "Cliquez sur 'Exporter' pour télécharger tous les élèves",
            action: "Cliquer sur l'icône 📥 Exporter",
          },
          {
            step: 2,
            title: "Export sélectif",
            description:
              "Sélectionnez d'abord les élèves puis utilisez 'Exporter' dans la barre groupée",
            image: "/help-screenshots/students/export-options.jpg",
          },
          {
            step: 3,
            title: "Formats disponibles",
            description:
              "Excel (.xlsx) avec toutes les colonnes de la fiche élève",
            action: "Fichier téléchargé automatiquement",
          },
        ],
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "medium",
      },
      {
        id: "student-form-validation",
        title: "Validation du formulaire élève",
        type: "text",
        content: `
      **Champs obligatoires**
      Les champs marqués d'une * sont obligatoires : Prénom, Nom, Email, Date de naissance, Classe, Année académique
      
      **Format des dates**
      La date de naissance doit être au format JJ/MM/AAAA
      
      **Validation de l'email**
      Le système vérifie la disponibilité de l'email (icône verte ✅)
      
      **Validation du téléphone**
      Format Haïtien requis : +509XXXXXXXX
      
      **Âge requis**
      L'élève doit avoir entre 13 et 25 ans
               `,
        targetRole: ["Admin", "Secretaire"],
        importance: "high",
      },
      {
        id: "guardianss",
        title: "Gestion des parents/tuteurs",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Ajouter un parent",
            description: "Dans l'onglet Parents/Tuteurs, cliquez sur 'Ajouter'",
            action: "Cliquer sur le bouton + Ajouter",
          },
          {
            step: 2,
            title: "Définir le parent principal",
            description:
              "Cochez la case 'Principal' pour désigner le contact principal",
            image: "/help-screenshots/students/guardian-primary.jpg",
          },
          {
            step: 3,
            title: "Supprimer un parent",
            description:
              "Cliquez sur l'icône poubelle (sauf pour le parent principal)",
            action: "Cliquer sur l'icône 🗑️",
          },
          {
            step: 4,
            title: "Limite",
            description: "Maximum 5 parents/tuteurs par élève",
          },
        ],
        targetRole: ["Admin", "Secretaire"],
        importance: "medium",
      },
    ],
    quickActions: [
      {
        id: "quick-add-student",
        label: "Nouvel élève",
        description: "Ajouter un nouvel élève",
        icon: "UserPlus",
        path: "/students/add",
      },
      {
        id: "export-all-students",
        label: "Exporter tous",
        description: "Exporter tous les élèves",
        icon: "Download",
        path: "/students/export",
        shortcut: "Ctrl+E",
      },
      {
        id: "bulk-assign-class",
        label: "Affecter classe",
        description: "Affecter plusieurs élèves à une classe",
        icon: "Building",
        path: "/students/bulk-assign-class",
      },
    ],
    commonIssues: [
      {
        id: "issue-student-001",
        problem: "Impossible d'ajouter un élève - Email déjà utilisé",
        solution:
          "Vérifiez si l'email existe déjà ou utilisez un email différent",
        fixSteps: [
          "Cliquez sur l'icône 🔄 à côté du champ email",
          "Vérifiez l'icône de disponibilité (✅ = disponible, ❌ = utilisé)",
          "Si l'email est utilisé, modifiez-le légèrement (ajoutez un chiffre)",
        ],
        preventTips: [
          "Utilisez toujours l'email institutionnel si disponible",
          "Vérifiez la disponibilité avant de soumettre",
        ],
      },
      {
        id: "issue-student-002",
        problem: "Erreur de validation de la date de naissance",
        solution: "L'âge doit être entre 13 et 25 ans",
        fixSteps: [
          "Vérifiez l'année de naissance",
          "L'élève doit avoir au moins 13 ans",
          "L'élève ne doit pas avoir plus de 25 ans",
        ],
        preventTips: [
          "Utilisez le sélecteur de date au lieu de taper manuellement",
          "Vérifiez les documents officiels",
        ],
      },
      {
        id: "issue-student-003",
        problem: "Téléphone non valide",
        solution: "Format Haïtien requis : +509XXXXXXXX",
        fixSteps: [
          "Commencez toujours par +509",
          "Ajoutez 8 chiffres supplémentaires",
          "Exemple : +50944556677",
        ],
        preventTips: [
          "Le système formate automatiquement en +509 XX XX XX XX",
          "Copiez-collez depuis les documents officiels",
        ],
      },
      {
        id: "issue-student-004",
        problem: "Classe non disponible dans la liste",
        solution: "Vérifiez que la classe est active et existe",
        fixSteps: [
          "Aller dans Classes > Vérifier l'état de la classe",
          "Assurez-vous que la classe n'est pas archivée",
          "Contactez l'administrateur si nécessaire",
        ],
        preventTips: [
          "Créez les classes avant d'inscrire les élèves",
          "Vérifiez les classes actives régulièrement",
        ],
      },
    ],
  },
  {
    id: "enrollments",
    title: "Inscriptions et Réinscriptions",
    description: "Gestion des inscriptions académiques des élèves",
    icon: "UserPlus",
    color: "bg-indigo-100 text-indigo-800",
    permissions: [PERMISSIONS.VIEW_ENROLLMENTS, PERMISSIONS.MANAGE_ENROLLMENTS],
    content: [
      {
        id: "enrollment-overview",
        title: "Vue d'ensemble des inscriptions",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder aux inscriptions",
            description: "Menu principal → 'Élèves' → 'Inscriptions'",
            action: "Naviguer vers Élèves > Inscriptions",
          },
          {
            step: 2,
            title: "Statistiques en temps réel",
            description:
              "Cartes montrant les totaux, actifs, suspendus, terminés",
            image: "/help-screenshots/enrollments/stats.jpg",
          },
          {
            step: 3,
            title: "Navigation par onglets",
            description: "Tous, Inscrits, Non-inscrits",
            action: "Utiliser les onglets pour filtrer",
          },
        ],
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "high",
      },
      {
        id: "enroll-student",
        title: "Inscrire un nouvel élève",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Trouver l'élève",
            description: "Rechercher par nom ou code étudiant",
            action: "Utiliser la barre de recherche",
          },
          {
            step: 2,
            title: "Cliquer sur 'Inscrire'",
            description: "Bouton bleu dans la ligne de l'élève",
            image: "/help-screenshots/enrollments/enroll-button.jpg",
          },
          {
            step: 3,
            title: "Remplir le formulaire",
            description: "Classe, année académique, statut, date",
            action: "Sélectionner dans les listes déroulantes",
          },
          {
            step: 4,
            title: "Attribuer des frais",
            description: "Optionnel : sélectionner les structures de frais",
            action: "Cocher 'Attribuer des frais' et sélectionner",
          },
          {
            step: 5,
            title: "Sauvegarder",
            description: "Cliquez sur 'Créer l'inscription'",
            action: "Cliquer sur le bouton vert",
          },
        ],
        targetRole: ["Admin", "Secretaire"],
        importance: "high",
      },
      {
        id: "reenroll-student",
        title: "Réinscrire un élève",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Validation automatique",
            description: "Le système vérifie l'éligibilité avant réinscription",
            image: "/help-screenshots/enrollments/reenroll-validation.jpg",
          },
          {
            step: 2,
            title: "Cliquer sur 'Réinscrire'",
            description: "Bouton violet dans la ligne de l'élève",
            action: "Cliquer sur 'Réinscrire'",
          },
          {
            step: 3,
            title: "Sélectionner l'année précédente",
            description: "Choisir l'année académique de référence",
            action: "Sélectionner dans la liste",
          },
          {
            step: 4,
            title: "Choisir la nouvelle classe",
            description: "Classes disponibles selon le parcours académique",
            action: "Sélectionner la nouvelle classe",
          },
          {
            step: 5,
            title: "Confirmer",
            description: "Cliquez sur 'Confirmer la réinscription'",
            action: "Cliquer sur le bouton violet",
          },
        ],
        targetRole: ["Admin", "Secretaire"],
        importance: "high",
      },
      {
        id: "edit-enrollment",
        title: "Modifier une inscription",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Limite temporelle",
            description: "Seulement 24h après création pour les secrétaires",
            image: "/help-screenshots/enrollments/edit-time-limit.jpg",
          },
          {
            step: 2,
            title: "Développer l'élève",
            description: "Cliquer sur 'Voir les inscriptions'",
            action: "Cliquer sur la flèche",
          },
          {
            step: 3,
            title: "Modifier l'inscription",
            description: "Bouton 'Modifier' disponible selon permissions",
            action: "Cliquer sur 'Modifier'",
          },
          {
            step: 4,
            title: "Sauvegarder les modifications",
            description: "Apporter les changements nécessaires",
            action: "Cliquer sur 'Enregistrer'",
          },
        ],
        targetRole: ["Admin", "Secretaire"],
        importance: "medium",
      },
      {
        id: "enrollment-status",
        title: "Gérer les statuts d'inscription",
        type: "text",
        content: `**Actif**
      Élève actuellement inscrit et fréquentant les cours
      
      **Suspendu**
      Inscription temporairement interrompue
      
      **Terminé**
      Année académique achevée
      
      **Transitions autorisées**
      Actif ↔ Suspendu, Actif → Terminé`,
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "medium",
      },
      {
        id: "enrollment-validation",
        title: "Validation des réinscriptions",
        type: "text",
        content: `**Critères académiques**
      Moyenne minimum 50/100 pour le passage
      
      **Critères financiers**
      Pas de dette supérieure à 5,000 HTG
      
      **Parcours académique**
      Respect des transitions autorisées entre niveaux
      
      **Statut actuel**
      L'élève ne doit pas être actuellement inscrit
      
      **Disciplinaire**
      Pas de sanction majeure en cours`,
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "high",
      },
    ],
    quickActions: [
      {
        id: "quick-enroll",
        label: "Nouvelle inscription",
        description: "Inscrire un nouvel élève",
        icon: "UserPlus",
        path: "/enrollments/add",
      },
      {
        id: "view-not-enrolled",
        label: "Non-inscrits",
        description: "Afficher les élèves non inscrits",
        icon: "UserX",
        path: "#",
      },
      {
        id: "export-enrollments",
        label: "Exporter",
        description: "Exporter la liste des inscriptions",
        icon: "Download",
        path: "/enrollments/export",
        shortcut: "Ctrl+I",
      },
    ],
    commonIssues: [
      {
        id: "issue-enrollment-001",
        problem: "Élève non éligible à la réinscription",
        solution:
          "Vérifier les critères académiques, financiers et disciplinaires",
        fixSteps: [
          "Consulter les détails d'inéligibilité",
          "Régulariser la situation financière",
          "Contacter la direction pour dérogation",
        ],
        preventTips: [
          "Suivre régulièrement les résultats académiques",
          "Anticiper les paiements des frais",
          "Maintenir la discipline",
        ],
      },
      {
        id: "issue-enrollment-002",
        problem: "Classe complète",
        solution: "La capacité maximale est atteinte",
        fixSteps: [
          "Vérifier la capacité de la classe",
          "Choisir une autre classe du même niveau",
          "Contacter l'administration pour augmentation de capacité",
        ],
        preventTips: [
          "Planifier les capacités avant la rentrée",
          "Maintenir des listes d'attente",
        ],
      },
      {
        id: "issue-enrollment-003",
        problem: "Période d'inscription fermée",
        solution:
          "Les inscriptions ne sont ouvertes que pendant certaines périodes",
        fixSteps: [
          "Vérifier le calendrier académique",
          "Demander une dérogation exceptionnelle",
          "Inscrire pour l'année suivante",
        ],
        preventTips: [
          "Respecter les délais d'inscription",
          "Configurer les périodes d'inscription dans le système",
        ],
      },
    ],
  },
  {
    id: "professeurs",
    title: "Gestion des Professeurs",
    description: "Création, modification et gestion des professeurs",
    icon: "GraduationCap",
    color: "bg-purple-100 text-purple-800",
    permissions: [PERMISSIONS.VIEW_PROFESSEURS, PERMISSIONS.MANAGE_PROFESSEURS],
    content: [
      {
        id: "prof-list-overview",
        title: "Navigation dans la liste des professeurs",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder à la liste",
            description: "Dans le menu principal, cliquez sur 'Professeurs'",
            action: "Naviguer vers Professeurs > Gestion",
          },
          {
            step: 2,
            title: "Filtres disponibles",
            description:
              "Filtrez par statut (Actif/Inactif), spécialité ou recherche",
            action: "Utiliser les sélecteurs en haut de la page",
          },
          {
            step: 3,
            title: "Vue mobile vs desktop",
            description:
              "Sur mobile : cartes détaillées - Sur desktop : tableau complet",
            image: "/help-screenshots/professeurs/list-view.jpg",
          },
        ],
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "high",
      },
      {
        id: "add-new-professor",
        title: "Ajouter un nouveau professeur",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Cliquer sur 'Nouveau Professeur'",
            description: "Bouton violet en haut à droite",
            action: "Cliquer sur le bouton + Nouveau Professeur",
          },
          {
            step: 2,
            title: "Informations personnelles",
            description:
              "Remplissez prénom, nom, email (obligatoire), téléphone",
            image: "/help-screenshots/professeurs/add-form-1.jpg",
          },
          {
            step: 3,
            title: "Matricule automatique",
            description:
              "Le matricule est généré automatiquement - Cliquez sur 'Nouveau' pour regénérer",
            action: "Utiliser le bouton Sparkles à côté du champ matricule",
          },
          {
            step: 4,
            title: "Spécialité et matières",
            description:
              "Sélectionnez la spécialité principale et les matières enseignées",
            action: "Choisir dans les listes déroulantes",
          },
          {
            step: 5,
            title: "Création du compte utilisateur",
            description:
              "Cochez 'Créer un compte utilisateur' pour activer la connexion",
            action: "Cliquer sur la case à cocher",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "edit-professor",
        title: "Modifier un professeur",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Trouver le professeur",
            description: "Utilisez la recherche ou les filtres",
            action: "Entrer le nom dans la barre de recherche",
          },
          {
            step: 2,
            title: "Ouvrir le menu d'actions",
            description:
              "Cliquez sur les trois points (⋮) dans la ligne du professeur",
            image: "/help-screenshots/professeurs/actions-menu.jpg",
          },
          {
            step: 3,
            title: "Sélectionner 'Modifier'",
            description: "Dans le menu, choisissez l'option Modifier",
            action: "Cliquer sur 'Modifier'",
          },
          {
            step: 4,
            title: "Modifier les informations",
            description:
              "Modifiez les champs nécessaires dans le formulaire complet",
            action: "Faire les changements et cliquer sur 'Mettre à jour'",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "manage-professor-account",
        title: "Gestion du compte utilisateur",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Associer un compte existant",
            description:
              "Pour un professeur sans compte, utilisez 'Associer un compte'",
            action: "Cliquer sur 'Associer un compte' dans le menu actions",
          },
          {
            step: 2,
            title: "Rechercher un utilisateur",
            description:
              "Recherchez par email ou nom dans la liste des utilisateurs",
            image: "/help-screenshots/professeurs/attach-account.jpg",
          },
          {
            step: 3,
            title: "Créer un nouveau compte",
            description:
              "Si pas d'utilisateur existant, cochez 'Créer un nouveau compte'",
            action: "Cocher la case et saisir l'email",
          },
          {
            step: 4,
            title: "Détacher un compte",
            description:
              "Pour retirer l'association, utilisez 'Détacher le compte'",
            action: "Cliquer sur 'Détacher le compte' dans le menu actions",
          },
        ],
        targetRole: ["Admin"],
        importance: "medium",
      },
      {
        id: "professor-subjectss",
        title: "Gestion des matières enseignées",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder aux matières",
            description:
              "Dans le formulaire professeur, section 'Matières enseignées'",
            image: "/help-screenshots/professeurs/subjects-section.jpg",
          },
          {
            step: 2,
            title: "Ajouter une matière",
            description: "Sélectionnez dans la liste déroulante",
            action: "Choisir une matière dans la liste",
          },
          {
            step: 3,
            title: "Définir la matière principale",
            description:
              "Cochez 'Définir comme matière principale' sur la carte matière",
            action: "Cliquer sur la case à cocher",
          },
          {
            step: 4,
            title: "Spécifier l'expérience",
            description: "Ajoutez les années d'expérience pour chaque matière",
            action: "Saisir le nombre d'années",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "medium",
      },
      {
        id: "professor-statuss",
        title: "Gestion du statut des professeurs",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Activer/Désactiver",
            description:
              "Utilisez les options 'Activer' ou 'Désactiver' dans le menu actions",
            action: "Cliquer sur l'option dans le menu ⋮",
          },
          {
            step: 2,
            title: "Confirmation",
            description:
              "Une fenêtre de confirmation s'affiche pour confirmer l'action",
            image: "/help-screenshots/professeurs/status-confirm.jpg",
          },
          {
            step: 3,
            title: "Impact de la désactivation",
            description:
              "Un professeur désactivé ne peut plus être assigné à de nouveaux cours",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "professor-form-validation",
        title: "Validation du formulaire professeur",
        type: "steps",
        content: `Champs obligatoires : Prénom, Nom, Email, Statut.
       
       Format email : Doit être unique dans le système.
       
       Téléphone : Format Haïtien (+509XXXXXXXX) ou 8 chiffres.
       
       Matricule : Généré automatiquement, format : PRE-NOM-YYMMDD-XXX.
       
       Spécialité : Sélection parmi la liste prédéfinie.
       
       Matières : Maximum 10 matières par professeur.`,
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
    ],
    quickActions: [
      {
        id: "quick-add-professor",
        label: "Nouveau professeur",
        description: "Ajouter un nouveau professeur",
        icon: "UserPlus",
        path: "/professeurs/add",
      },
      {
        id: "view-inactive-professors",
        label: "Voir inactifs",
        description: "Afficher les professeurs inactifs",
        icon: "UserX",
        path: "#",
        shortcut: "Ctrl+I",
      },
      {
        id: "export-professors",
        label: "Exporter liste",
        description: "Exporter tous les professeurs",
        icon: "Download",
        path: "/professeurs/export",
      },
    ],
    commonIssues: [
      {
        id: "issue-professor-001",
        problem: "Email déjà utilisé par un autre professeur",
        solution: "Utilisez un email différent ou modifiez légèrement",
        fixSteps: [
          "Cliquez sur l'icône 🔄 pour vérifier la disponibilité",
          "Si rouge, l'email est déjà utilisé",
          "Ajoutez un chiffre ou un point dans l'email",
        ],
        preventTips: [
          "Utilisez toujours l'email institutionnel",
          "Vérifiez avant de soumettre le formulaire",
        ],
      },
      {
        id: "issue-professor-002",
        problem: "Matricule non généré automatiquement",
        solution: "Remplissez d'abord le prénom et le nom",
        fixSteps: [
          "Saisir le prénom (minimum 2 caractères)",
          "Saisir le nom (minimum 2 caractères)",
          "Cliquer sur le bouton 'Nouveau' à côté du champ matricule",
        ],
        preventTips: [
          "Toujours commencer par remplir le prénom et le nom",
          "Utiliser le bouton de génération si nécessaire",
        ],
      },
      {
        id: "issue-professor-003",
        problem: "Impossible d'assigner certaines matières",
        solution: "Les matières doivent être créées d'abord",
        fixSteps: [
          "Aller dans Matières > Créer les matières manquantes",
          "Retourner dans le formulaire professeur",
          "Actualiser la liste des matières",
        ],
        preventTips: [
          "Créer toutes les matières avant d'ajouter des professeurs",
          "Vérifier la disponibilité dans la liste déroulante",
        ],
      },
      {
        id: "issue-professor-004",
        problem: "Compte utilisateur non créé",
        solution: "Cocher l'option dans le formulaire",
        fixSteps: [
          "Modifier le professeur",
          "Cocher 'Créer un compte utilisateur'",
          "Sauvegarder les modifications",
        ],
        preventTips: [
          "Cocher systématiquement cette option pour les nouveaux professeurs",
          "Vérifier que l'email est correct",
        ],
      },
    ],
  },
  {
    id: "subject",
    title: "Gestion des Matières",
    description: "Création et gestion des matières académiques",
    icon: "BookOpen",
    color: "bg-indigo-100 text-indigo-800",
    permissions: [PERMISSIONS.VIEW_SUBJECTS, PERMISSIONS.MANAGE_SUBJECTS],
    content: [
      {
        id: "subjects-dashboard",
        title: "Tableau de bord des matières",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Vue d'ensemble",
            description:
              "4 cartes statistiques : Total matières, Moy. coefficient, Moy. note max, Utilisation",
            image: "/help-screenshots/subjects/dashboard.jpg",
          },
          {
            step: 2,
            title: "Liste complète",
            description:
              "Tableau avec code, nom, coefficient, note maximale, utilisation",
            action: "Naviguer dans le tableau principal",
          },
          {
            step: 3,
            title: "Recherche avancée",
            description: "Recherchez par nom, code ou description",
            action: "Utiliser la barre de recherche en haut",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "add-new-subject",
        title: "Ajouter une nouvelle matière",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Cliquer sur 'Nouvelle matière'",
            description: "Bouton indigo en haut à droite",
            action: "Cliquer sur le bouton + Nouvelle matière",
          },
          {
            step: 2,
            title: "Nom de la matière",
            description:
              "Nom complet (ex: 'Mathématiques', 'Sciences de la Vie et de la Terre')",
            image: "/help-screenshots/subjects/subject-name.jpg",
          },
          {
            step: 3,
            title: "Code automatique",
            description: "Le code est généré automatiquement à partir du nom",
            action: "Cliquer sur 'Générer' pour un nouveau code",
          },
          {
            step: 4,
            title: "Coefficient",
            description: "Multiple de 0.5, entre 0.5 et 10. Ex: 2.0, 3.5, 4.0",
            action: "Saisir un nombre avec .0 ou .5",
          },
          {
            step: 5,
            title: "Note maximale",
            description: "Sélectionner parmi 10, 20, 30, 40, 50, 100 points",
            action: "Choisir dans la liste déroulante",
          },
          {
            step: 6,
            title: "Sauvegarder",
            description: "La matière est créée avec statut 'Active'",
            action: "Cliquer sur 'Créer la matière'",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "subject-code-system",
        title: "Système de codification des matières",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Format du code",
            description: "3-8 caractères, lettres majuscules et chiffres",
            image: "/help-screenshots/subjects/code-format.jpg",
          },
          {
            step: 2,
            title: "Génération automatique",
            description: "Basé sur les 3 premières lettres du nom + 3 chiffres",
            action: "Ex: 'Mathématiques' → 'MAT123'",
          },
          {
            step: 3,
            title: "Unicité",
            description: "Chaque code doit être unique dans le système",
          },
          {
            step: 4,
            title: "Modification manuelle",
            description:
              "Vous pouvez modifier le code généré (restez en majuscules)",
            action: "Éditer le champ code manuellement",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "medium",
      },
      {
        id: "coefficients",
        title: "Gestion des coefficients",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Importance des coefficients",
            description:
              "Déterminent le poids de la matière dans la moyenne générale",
            image: "/help-screenshots/subjects/coefficients.jpg",
          },
          {
            step: 2,
            title: "Valeurs recommandées",
            description: `📊 Matières principales : 3.0 - 4.0
 📘 Matières secondaires : 2.0 - 2.5
 📗 Options : 1.0 - 1.5
 📕 Activités : 0.5 - 1.0`,
          },
          {
            step: 3,
            title: "Contraintes",
            description: "Multiple de 0.5, minimum 0.5, maximum 10.0",
          },
          {
            step: 4,
            title: "Impact sur les notes",
            description: "Note × coefficient = points contribués à la moyenne",
          },
        ],
        targetRole: ["Admin", "Directeur", "Professeur"],
        importance: "high",
      },
      {
        id: "grading-scales",
        title: "Échelles de notation",
        type: "steps",
        content: `Sélectionnez l'échelle appropriée :
       
       🔢 10 points : Échelle courte, souvent pour les devoirs
       
       🔢 20 points : Standard français (moyenne sur 20)
       
       🔢 30 points : Pour les examens complets
       
       🔢 40 points : Examens avec bonus
       
       🔢 50 points : Échelles spécialisées
       
       🔢 100 points : Pourcentage (100% = parfait)`,
        targetRole: ["Admin", "Directeur", "Professeur"],
        importance: "medium",
      },
      {
        id: "edit-subject",
        title: "Modifier une matière existante",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Trouver la matière",
            description: "Utilisez la recherche ou parcourez la liste",
            action: "Entrer le nom ou code dans la recherche",
          },
          {
            step: 2,
            title: "Menu d'actions",
            description: "Cliquez sur les icônes dans la colonne Actions",
            image: "/help-screenshots/subjects/subject-actions.jpg",
          },
          {
            step: 3,
            title: "Sélectionner 'Modifier'",
            description: "Icône crayon (✏️)",
            action: "Cliquer sur l'icône ✏️",
          },
          {
            step: 4,
            title: "Limitations",
            description:
              "Impossible de modifier si la matière a des assignations ou notes",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "subject-usage-tracking",
        title: "Suivi de l'utilisation des matières",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Colonne 'Utilisation'",
            description: "Affiche le nombre de classes et notes associées",
            image: "/help-screenshots/subjects/usage-column.jpg",
          },
          {
            step: 2,
            title: "Classes assignées",
            description: "Nombre de classes où la matière est enseignée",
            action: "Voir le badge 'Classes:'",
          },
          {
            step: 3,
            title: "Notes enregistrées",
            description: "Nombre total de notes pour cette matière",
            action: "Voir le badge 'Notes:'",
          },
          {
            step: 4,
            title: "Impact sur la suppression",
            description: "Une matière utilisée ne peut pas être supprimée",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "medium",
      },
      {
        id: "subject-validation",
        title: "Validation du formulaire matière",
        type: "steps",
        content: `Règles strictes :
       
       ✅ Code : 3-8 caractères, majuscules/chiffres, unique
       
       ✅ Nom : 2-100 caractères, pas de caractères spéciaux
       
       ✅ Coefficient : Multiple de 0.5, entre 0.5 et 10
       
       ✅ Note maximale : Sélection parmi les valeurs prédéfinies
       
       ✅ Description : Optionnelle, max 200 caractères
       
       ✅ Statut : Active/Inactive par défaut`,
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
    ],
    quickActions: [
      {
        id: "quick-add-subject",
        label: "Nouvelle matière",
        description: "Ajouter une nouvelle matière",
        icon: "BookOpen",
        path: "/matieres/ajouter",
      },
      {
        id: "view-unused-subjects",
        label: "Matières inutilisées",
        description: "Voir les matières non assignées",
        icon: "BookX",
        path: "#",
        shortcut: "Ctrl+U",
      },
      {
        id: "export-subjects",
        label: "Exporter liste",
        description: "Exporter toutes les matières",
        icon: "Download",
        path: "/matieres/export",
      },
    ],
    commonIssues: [
      {
        id: "issue-subject-001",
        problem: "Code déjà utilisé",
        solution: "Générer un nouveau code ou modifier légèrement",
        fixSteps: [
          "Cliquer sur 'Générer' pour un nouveau code",
          "Si persiste, modifier manuellement le code",
          "Ajouter un chiffre à la fin",
        ],
        preventTips: [
          "Laisser le système générer automatiquement",
          "Vérifier la disponibilité avant de soumettre",
        ],
      },
      {
        id: "issue-subject-002",
        problem: "Coefficient non accepté",
        solution: "Doit être un multiple de 0.5",
        fixSteps: [
          "Vérifier que le nombre se termine par .0 ou .5",
          "Exemples valides : 1.0, 2.5, 3.0, 4.5",
          "Éviter : 1.2, 2.3, 3.7",
        ],
        preventTips: [
          "Utiliser le sélecteur plutôt que taper manuellement",
          "Connaître les valeurs autorisées",
        ],
      },
      {
        id: "issue-subject-003",
        problem: "Impossible de supprimer une matière",
        solution: "La matière est utilisée dans des classes ou notes",
        fixSteps: [
          "Vérifier la colonne 'Utilisation'",
          "Si >0, la matière ne peut être supprimée",
          "Désassigner d'abord toutes les classes",
        ],
        preventTips: [
          "Créer les matières avec soin",
          "Vérifier l'usage avant tentative de suppression",
        ],
      },
      {
        id: "issue-subject-004",
        problem: "Matière n'apparaît pas dans les listes d'assignation",
        solution: "Vérifier le statut et la disponibilité",
        fixSteps: [
          "Vérifier que la matière est 'Active'",
          "Actualiser la page",
          "Contacter l'admin si nécessaire",
        ],
        preventTips: [
          "Toujours créer les matières comme 'Active'",
          "Vérifier régulièrement les statuts",
        ],
      },
    ],
  },
  {
    id: "grades",
    title: "Gestion des Notes Académiques",
    description: "Saisie, validation et publication des notes par matière",
    icon: "GraduationCap",
    color: "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800",
    permissions: [PERMISSIONS.VIEW_GRADES, PERMISSIONS.MANAGE_GRADES],
    content: [
      {
        id: "grade-manager-overview",
        title: "Interface de gestion des notes",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder au module notes",
            description: "Menu principal → 'Bulletins' → 'Gestion des Notes'",
            action: "Naviguer vers Bulletins > Gestion des Notes",
          },
          {
            step: 2,
            title: "Comprendre l'interface",
            description:
              "Deux modes disponibles : Professeur (soumission) et Administrateur (validation)",
            image: "/help-screenshots/grades/interface-overview.jpg",
          },
          {
            step: 3,
            title: "Vue par défaut",
            description:
              "Filtrage par année académique, niveau, matière et type de contrôle",
            action: "Utiliser les filtres en haut de page",
          },
        ],
        targetRole: ["Admin", "Professeur", "Directeur"],
        importance: "high",
      },
      {
        id: "grade-filters-explained",
        title: "Comprendre les filtres",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Année académique",
            description:
              "Sélectionnez l'année pour laquelle vous souhaitez gérer les notes",
          },
          {
            step: 2,
            title: "Niveau",
            description: "7ème A.F à Terminale (système haïtien)",
          },
          {
            step: 3,
            title: "Matière",
            description:
              "Filtrée selon vos affectations (professeur) ou toutes les matières (admin)",
          },
          {
            step: 4,
            title: "Type de contrôle",
            description: "Contrôle 1 à 4, Examen, Devoir - ou tous les types",
          },
          {
            step: 5,
            title: "Recherche",
            description:
              "Recherche rapide d'étudiant par nom, prénom ou matricule",
          },
        ],
        targetRole: ["Admin", "Professeur"],
        importance: "high",
      },
      {
        id: "teacher-grade-entry",
        title: "Saisie des notes (Mode Professeur)",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Configuration initiale",
            description:
              "Sélectionnez année, niveau et matière que vous enseignez",
            image: "/help-screenshots/grades/teacher-setup.jpg",
          },
          {
            step: 2,
            title: "Mode brouillon vs soumission",
            description:
              "Brouillon : sauvegarde locale / Soumission : envoi à l'admin",
            action: "Choisir dans le modal d'édition",
          },
          {
            step: 3,
            title: "Ajouter une note individuelle",
            description: "Cliquez sur l'icône 'Modifier' à côté d'un étudiant",
            action: "Cliquer sur l'icône ✏️",
          },
          {
            step: 4,
            title: "Remplir le formulaire",
            description:
              "Note (max selon matière), type contrôle, remarques optionnelles",
            image: "/help-screenshots/grades/grade-form.jpg",
          },
          {
            step: 5,
            title: "Sauvegarder",
            description:
              "Choisir 'Brouillon' (enregistrement local) ou 'Soumettre' (validation admin)",
            action: "Cliquer sur le bouton approprié",
          },
        ],
        targetRole: ["Professeur"],
        importance: "high",
      },
      {
        id: "bulk-grade-entry",
        title: "Saisie en masse des notes",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Activer le mode édition en masse",
            description: "Cliquez sur 'Édition en masse' en haut de la liste",
            action: "Cliquer sur 'Édition en masse'",
          },
          {
            step: 2,
            title: "Sélectionner les étudiants",
            description: "Cochez les cases ou 'Tout sélectionner'",
            image: "/help-screenshots/grades/bulk-select.jpg",
          },
          {
            step: 3,
            title: "Appliquer une note commune",
            description:
              "Entrez la note dans le champ dédié et cliquez sur 'Appliquer'",
            action: "Entrer la note et cliquer Appliquer",
          },
          {
            step: 4,
            title: "Ajustements individuels",
            description:
              "Modifiez les notes spécifiques directement dans les champs",
            image: "/help-screenshots/grades/bulk-adjust.jpg",
          },
          {
            step: 5,
            title: "Sauvegarder en masse",
            description:
              "Cliquez sur 'Sauvegarder' pour enregistrer toutes les modifications",
            action: "Cliquer sur Sauvegarder",
          },
        ],
        targetRole: ["Professeur"],
        importance: "medium",
      },
      {
        id: "admin-grade-validation",
        title: "Validation des notes (Mode Administrateur)",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder aux notes soumises",
            description:
              "Les notes soumises par les professeurs apparaissent automatiquement",
            image: "/help-screenshots/grades/pending-approval.jpg",
          },
          {
            step: 2,
            title: "Vérifier une note",
            description:
              "Cliquez sur l'icône 'œil' pour voir les détails complets",
            action: "Cliquer sur 👁️",
          },
          {
            step: 3,
            title: "Approuver une note",
            description:
              "Cliquez sur 'Approuver' (pouce vers le haut) si la note est correcte",
            action: "Cliquer sur 👍",
          },
          {
            step: 4,
            title: "Rejeter une note",
            description:
              "Cliquez sur 'Rejeter' (pouce vers le bas) et saisissez la raison",
            image: "/help-screenshots/grades/reject-reason.jpg",
          },
          {
            step: 5,
            title: "Publier aux étudiants",
            description:
              "Une fois validées, les notes sont automatiquement publiées",
            action: "Vérifier le statut 'Publié'",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "grade-workflow",
        title: "Workflow de validation des notes",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Étape 1 : Saisie",
            description:
              "Professeur saisit la note en mode brouillon ou soumission",
          },
          {
            step: 2,
            title: "Étape 2 : Soumission",
            description: "Note soumise à l'administrateur pour validation",
          },
          {
            step: 3,
            title: "Étape 3 : Validation",
            description: "Admin approuve ou rejette avec commentaires",
          },
          {
            step: 4,
            title: "Étape 4 : Publication",
            description: "Note validée visible par l'étudiant et les parents",
          },
          {
            step: 5,
            title: "Étape 5 : Archivage",
            description: "Notes archivées en fin d'année pour conservation",
          },
        ],
        targetRole: ["Admin", "Professeur", "Directeur"],
        importance: "medium",
      },
      {
        id: "grade-statuses",
        title: "Statuts des notes",
        type: "text",
        content: `**Brouillon** (🗒️)
      Note saisie mais non soumise - visible uniquement par le professeur
      
      **Soumis** (📤)
      Note envoyée à l'admin pour validation - en attente
      
      **Approuvé** (✅)
      Note validée par l'admin - prête pour publication
      
      **Publié** (🌐)
      Note visible par l'étudiant et les parents
      
      **Rejeté** (❌)
      Note refusée par l'admin - retour au professeur`,
        targetRole: ["Admin", "Professeur"],
        importance: "medium",
      },
      {
        id: "grade-import-export",
        title: "Import et Export des notes",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Exporter vers Excel",
            description:
              "Cliquez sur 'Exporter' pour télécharger toutes les notes",
            action: "Cliquer sur 📥 Exporter",
          },
          {
            step: 2,
            title: "Format d'export",
            description:
              "Fichier Excel avec colonnes : Étudiant, Matricule, Note, Statut, Type contrôle",
            image: "/help-screenshots/grades/export-format.jpg",
          },
          {
            step: 3,
            title: "Importer depuis Excel",
            description: "Préparer un fichier Excel selon le format template",
            action: "Télécharger le template d'import",
          },
          {
            step: 4,
            title: "Vérification des données",
            description:
              "Le système valide les matricules et les notes avant import",
            image: "/help-screenshots/grades/import-validation.jpg",
          },
          {
            step: 5,
            title: "Import en masse",
            description:
              "Utilisez l'import pour saisir rapidement de nombreuses notes",
            action: "Cliquer sur Importer et sélectionner le fichier",
          },
        ],
        targetRole: ["Admin", "Professeur"],
        importance: "medium",
      },
      {
        id: "grade-statistics",
        title: "Statistiques et indicateurs",
        type: "text",
        content: `**Moyenne générale**
      Moyenne de toutes les notes pour la matière sélectionnée
      
      **Taux de réussite**
      Pourcentage d'étudiants ayant validé la matière
      
      **Notes validées**
      Nombre de notes approuvées par l'administrateur
      
      **En attente**
      Notes soumises mais non encore validées
      
      **Étudiants sans note**
      Étudiants n'ayant pas encore de note pour cette matière`,
        targetRole: ["Admin", "Professeur", "Directeur"],
        importance: "medium",
      },
      {
        id: "grade-validation-rules",
        title: "Règles de validation des notes",
        type: "text",
        content: `**Note maximale**
      Définie par matière (généralement 20, 40 ou 100 points)
      
      **Seuil de validation**
      Note minimale requise pour valider (généralement 50%)
      
      **Format numérique**
      Les notes doivent être des nombres (décimaux acceptés)
      
      **Période de saisie**
      Les notes doivent être saisies dans les délais académiques
      
      **Contrôle des doublons**
      Un étudiant ne peut avoir qu'une note par type de contrôle et par matière`,
        targetRole: ["Admin", "Professeur"],
        importance: "high",
      },
    ],
    quickActions: [
      {
        id: "quick-bulk-edit",
        label: "Édition en masse",
        description: "Saisir des notes pour plusieurs étudiants",
        icon: "Edit",
        path: "#",
        shortcut: "Ctrl+E",
      },
      {
        id: "export-grades",
        label: "Exporter Excel",
        description: "Exporter toutes les notes",
        icon: "Download",
        path: "#",
        shortcut: "Ctrl+Shift+E",
      },
      {
        id: "view-pending",
        label: "Voir en attente",
        description: "Notes soumises à validation",
        icon: "Clock",
        path: "#",
        shortcut: "Ctrl+P",
      },
    ],
    commonIssues: [
      {
        id: "issue-grade-001",
        problem: "Note refusée par le système (trop élevée)",
        solution: "La note dépasse la note maximale définie pour la matière",
        fixSteps: [
          "Vérifier la note maximale dans les détails de la matière",
          "Adapter la note pour respecter la limite",
          "Contacter l'admin si la limite semble incorrecte",
        ],
        preventTips: [
          "Consulter les paramètres de la matière avant saisie",
          "Utiliser l'aperçu de note dans le formulaire",
        ],
      },
      {
        id: "issue-grade-002",
        problem: "Étudiant non visible dans la liste",
        solution:
          "L'étudiant n'est pas inscrit dans la classe ou le niveau sélectionné",
        fixSteps: [
          "Vérifier les filtres année académique et niveau",
          "Confirmer l'inscription de l'étudiant",
          "Vérifier que l'étudiant est actif (non désinscrit)",
        ],
        preventTips: [
          "Mettre à jour les inscriptions avant la saisie des notes",
          "Vérifier le statut des étudiants régulièrement",
        ],
      },
      {
        id: "issue-grade-003",
        problem: "Impossible de modifier une note soumise",
        solution:
          "Une fois soumise, seule l'admin peut modifier ou rejeter la note",
        fixSteps: [
          "Si vous êtes professeur, demander à l'admin de rejeter la note",
          "Si vous êtes admin, rejeter la note avec une raison",
          "Le professeur pourra alors la modifier et la resoumettre",
        ],
        preventTips: [
          "Utiliser le mode brouillon pour les saisies provisoires",
          "Vérifier attentivement avant soumission",
        ],
      },
      {
        id: "issue-grade-004",
        problem: "Type de contrôle verrouillé",
        solution: "Un filtre de type de contrôle est actif",
        fixSteps: [
          "Vérifier le filtre 'Type de contrôle' en haut de page",
          "Le changer en 'Tous les contrôles' pour déverrouiller",
          "Ou sélectionner un autre type de contrôle",
        ],
        preventTips: [
          "Faire attention aux filtres actifs",
          "Consulter l'indicateur de filtre actif",
        ],
      },
      {
        id: "issue-grade-005",
        problem: "Import Excel échoue",
        solution: "Format de fichier incorrect ou données invalides",
        fixSteps: [
          "Télécharger le template officiel",
          "Vérifier les colonnes obligatoires",
          "S'assurer que les matricules existent dans le système",
          "Vérifier les formats de notes numériques",
        ],
        preventTips: [
          "Toujours utiliser le template officiel",
          "Valider les données avant import",
          "Faire des imports de test sur un petit échantillon",
        ],
      },
    ],
  },
  {
    id: "schedule",
    title: "Emploi du temps",
    description: "Planning des cours",
    icon: "CalendarDays",
    color: "bg-pink-100 text-pink-800",
    permissions: [PERMISSIONS.VIEW_SCHEDULE],
    content: [
      {
        id: "create-schedule",
        title: "Créer un emploi du temps",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Sélectionner l'année",
            description: "Choisir l'année scolaire",
            action: "Sélectionner dans le menu déroulant",
          },
          {
            step: 2,
            title: "Générer automatiquement",
            description: "Le système propose un planning",
            action: "Cliquer sur 'Générer automatiquement'",
          },
          {
            step: 3,
            title: "Ajustements manuels",
            description: "Modifier les créneaux si nécessaire",
            image: "/help-screenshots/schedule/edit.png",
          },
          {
            step: 4,
            title: "Publier",
            description: "Rendre visible aux professeurs et élèves",
            action: "Cliquer sur 'Publier l'emploi du temps'",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "medium",
      },
    ],
  },
  {
    id: "class_assignment",
    title: "Gestion des Assignations",
    description: "Assignation des matières aux professeurs par classe",
    icon: "BookOpen",
    color: "bg-blue-100 text-blue-800",
    permissions: [PERMISSIONS.VIEW_SUBJECTS, PERMISSIONS.MANAGE_SUBJECTS],
    content: [
      {
        id: "assignment-list-overview",
        title: "Navigation dans la liste des assignations",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder aux assignations",
            description:
              "Menu principal → 'Assignations' ou via 'Élèves' > 'Inscriptions'",
            action: "Naviguer vers Assignations",
          },
          {
            step: 2,
            title: "Vue Tableau vs Grille",
            description:
              "Basculez entre les vues selon votre préférence (tableau pour ordinateur, grille pour mobile)",
            image: "/help-screenshots/assignments/view-toggle.jpg",
          },
          {
            step: 3,
            title: "Filtres avancés",
            description:
              "Filtrez par statut (Actif/Inactif), niveau de classe, matière ou professeur",
            action: "Utiliser les sélecteurs en haut de la page",
          },
        ],
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "high",
      },
      {
        id: "add-new-assignment",
        title: "Créer une nouvelle assignation",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Cliquer sur 'Nouvelle assignation'",
            description: "Bouton bleu en haut à droite de l'interface",
            action: "Cliquer sur + Nouvelle assignation",
          },
          {
            step: 2,
            title: "Sélectionner la matière",
            description:
              "Choisir la matière dans la liste déroulante (filtrable par code ou nom)",
            image: "/help-screenshots/assignments/select-subject.jpg",
          },
          {
            step: 3,
            title: "Sélectionner le professeur",
            description:
              "Choisir le professeur responsable (filtrable par nom ou matricule)",
            action: "Utiliser la recherche dans le sélecteur",
          },
          {
            step: 4,
            title: "Définir la classe et l'année",
            description:
              "Sélectionner le niveau de classe et l'année académique",
            action: "Choisir dans les listes déroulantes",
          },
          {
            step: 5,
            title: "Configurer le statut",
            description:
              "Définir l'assignation comme 'Active' ou 'Inactive' selon les besoins",
            action: "Activer/désactiver le switch",
          },
          {
            step: 6,
            title: "Sauvegarder",
            description: "Cliquez sur 'Créer l'assignation' pour enregistrer",
            action: "Cliquer sur le bouton vert Enregistrer",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "edit-assignment",
        title: "Modifier une assignation existante",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Trouver l'assignation",
            description: "Utilisez la barre de recherche ou les filtres",
            action: "Rechercher par matière, professeur ou classe",
          },
          {
            step: 2,
            title: "Ouvrir le menu d'actions",
            description:
              "Cliquez sur les trois points verticaux (⋮) dans la ligne de l'assignation",
            image: "/help-screenshots/assignments/actions-menu.jpg",
          },
          {
            step: 3,
            title: "Sélectionner 'Modifier'",
            description: "Dans le menu déroulant, choisissez l'option Modifier",
            action: "Cliquer sur 'Modifier'",
          },
          {
            step: 4,
            title: "Apporter les modifications",
            description: "Modifiez les champs nécessaires dans le formulaire",
            action: "Faire les changements et cliquer sur 'Enregistrer'",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "assignment-status",
        title: "Gérer les statuts des assignations",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Comprendre les statuts",
            description: "Actif = En cours, Inactif = Archivé/suspendu",
            image: "/help-screenshots/assignments/status-badges.jpg",
          },
          {
            step: 2,
            title: "Changer le statut",
            description:
              "Via le menu actions ou directement dans la vue grille",
            action: "Utiliser le switch dans la carte ou le menu",
          },
          {
            step: 3,
            title: "Impact du statut",
            description:
              "Les assignations inactives n'apparaissent pas dans les emplois du temps",
            action: "Vérifier les dépendances avant désactivation",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "medium",
      },
      {
        id: "bulk-assignment-actions",
        title: "Actions groupées sur les assignations",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Activer le mode sélection",
            description: "Cliquez sur le bouton 'Sélection' en haut de la page",
            action: "Cliquer sur l'icône ✓ Sélection",
          },
          {
            step: 2,
            title: "Sélectionner les assignations",
            description: "Cochez les cases à gauche de chaque assignation",
            image: "/help-screenshots/assignments/bulk-select.jpg",
          },
          {
            step: 3,
            title: "Barre d'actions groupées",
            description: "Une barre d'actions apparaît avec plusieurs options",
            action: "Utiliser les boutons dans la barre bleue",
          },
          {
            step: 4,
            title: "Actions disponibles",
            description: "Modifier le statut, exporter, supprimer",
            action: "Choisir l'action souhaitée",
          },
        ],
        targetRole: ["Admin"],
        importance: "medium",
      },
      {
        id: "assignment-validation",
        title: "Validation des assignations",
        type: "text",
        content: `**Contrôle des doublons**
      Le système empêche d'assigner le même professeur à la même matière dans la même classe
      
      **Vérification des disponibilités**
      Le système vérifie les conflits d'emploi du temps
      
      **Limites par professeur**
      Maximum 8 assignations simultanées par professeur
      
      **Compatibilité matière/classe**
      Seules les matières autorisées pour le niveau de classe sont proposées
      
      **Période académique**
      Les assignations doivent être dans la période de l'année académique active`,
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
    ],
    quickActions: [
      {
        id: "quick-add-assignment",
        label: "Nouvelle assignation",
        description: "Créer une nouvelle assignation",
        icon: "BookOpen",
        path: "/assignments/add",
      },
      {
        id: "export-assignments",
        label: "Exporter les assignations",
        description: "Exporter vers Excel",
        icon: "Download",
        path: "/assignments/export",
        shortcut: "Ctrl+Shift+E",
      },
      {
        id: "view-active-assignments",
        label: "Voir les actives",
        description: "Afficher uniquement les assignations actives",
        icon: "CheckCircle",
        path: "#",
      },
    ],
    commonIssues: [
      {
        id: "issue-assignment-001",
        problem: "Professeur non disponible dans la liste",
        solution:
          "Vérifiez que le professeur est actif et a les permissions nécessaires",
        fixSteps: [
          "Aller dans Utilisateurs > Filtrer par rôle 'Professeur'",
          "Vérifier que le statut est 'Actif'",
          "S'assurer que le professeur a les matières assignées dans son profil",
        ],
        preventTips: [
          "Maintenez à jour les statuts des professeurs",
          "Assignez les matières au profil professeur avant de créer l'assignation",
        ],
      },
      {
        id: "issue-assignment-002",
        problem: "Matière non disponible pour la classe sélectionnée",
        solution: "La matière n'est pas autorisée pour ce niveau de classe",
        fixSteps: [
          "Vérifier le programme académique de la classe",
          "Contacter l'administrateur pour ajouter la matière au programme",
          "Choisir une matière alternative",
        ],
        preventTips: [
          "Configurez les programmes académiques avant la rentrée",
          "Vérifiez les prérequis par niveau",
        ],
      },
      {
        id: "issue-assignment-003",
        problem: "Conflit d'emploi du temps détecté",
        solution: "Le professeur a déjà un cours à ce créneau",
        fixSteps: [
          "Consulter l'emploi du temps du professeur",
          "Changer l'horaire de l'assignation",
          "Assigner un autre professeur",
        ],
        preventTips: [
          "Planifiez les emplois du temps avant les assignations",
          "Utilisez l'outil de vérification de conflits",
        ],
      },
    ],
  },
  {
    id: "transcripts",
    title: "Bulletins",
    description: "Édition des bulletins de notes",
    icon: "ScrollText",
    color: "bg-orange-100 text-orange-800",
    permissions: [PERMISSIONS.GENERATE_TRANSCRIPTS],
    content: [
      {
        id: "generate-reports",
        title: "Générer les bulletins",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Sélectionner la période",
            description: "Trimestre ou semestre",
            action: "Choisir dans les filtres",
          },
          {
            step: 2,
            title: "Vérifier les notes",
            description: "S'assurer que toutes les notes sont saisies",
            image: "/help-screenshots/transcripts/check.png",
          },
          {
            step: 3,
            title: "Générer en masse",
            description: "Produire tous les bulletins d'une classe",
            action: "Cliquer sur 'Générer tous'",
          },
          {
            step: 4,
            title: "Imprimer ou exporter",
            description: "PDF individuel ou groupe",
            action: "Sélectionner le format d'export",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
    ],
    quickActions: [
      {
        id: "print-all",
        label: "Imprimer tous",
        description: "Imprimer bulletins classe",
        icon: "Printer",
        path: "/transcripts/print-all",
      },
    ],
  },
  {
    id: "users",
    title: "Gestion des Utilisateurs",
    description: "Administration des comptes utilisateurs et permissions",
    icon: "Users",
    color: "bg-orange-100 text-orange-800",
    permissions: [PERMISSIONS.VIEW_USERS, PERMISSIONS.MANAGE_USERS],
    content: [
      {
        id: "user-list-overview",
        title: "Navigation dans la liste des utilisateurs",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder aux utilisateurs",
            description: "Menu principal → 'Administration' → 'Utilisateurs'",
            action: "Naviguer vers Administration > Utilisateurs",
          },
          {
            step: 2,
            title: "Comprendre les badges",
            description:
              "Couleurs par rôle : Admin=rouge, Directeur=violet, etc.",
            image: "/help-screenshots/users/role-badges.jpg",
          },
          {
            step: 3,
            title: "Tri et filtrage",
            description: "Trier par colonne, filtrer par rôle ou statut",
            action: "Cliquer sur les en-têtes de colonne pour trier",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "add-new-user",
        title: "Ajouter un nouvel utilisateur",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Cliquer sur 'Nouvel Utilisateur'",
            description: "Bouton orange en haut à droite",
            action: "Cliquer sur + Nouvel Utilisateur",
          },
          {
            step: 2,
            title: "Remplir les informations personnelles",
            description: "Prénom, nom, email, téléphone",
            image: "/help-screenshots/users/add-form.jpg",
          },
          {
            step: 3,
            title: "Définir le rôle",
            description: "Sélectionner selon la hiérarchie des permissions",
            action: "Choisir dans la liste déroulante",
          },
          {
            step: 4,
            title: "Définir le mot de passe",
            description: "Minimum 6 caractères",
            action: "Saisir un mot de passe sécurisé",
          },
          {
            step: 5,
            title: "Configurer le statut",
            description: "Actif par défaut pour les nouveaux comptes",
            action: "Laisser activé",
          },
          {
            step: 6,
            title: "Sauvegarder",
            description: "Cliquez sur 'Ajouter'",
            action: "Cliquer sur le bouton orange Ajouter",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "edit-user",
        title: "Modifier un utilisateur",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Restrictions hiérarchiques",
            description:
              "Un utilisateur ne peut modifier que les comptes de niveau inférieur",
            image: "/help-screenshots/users/hierarchy-rules.jpg",
          },
          {
            step: 2,
            title: "Ouvrir le menu actions",
            description: "Cliquez sur les trois points (⋮) dans la ligne",
            action: "Cliquer sur l'icône menu",
          },
          {
            step: 3,
            title: "Sélectionner 'Modifier'",
            description: "Dans le menu déroulant",
            action: "Cliquer sur 'Modifier'",
          },
          {
            step: 4,
            title: "Modifier les informations",
            description: "Changer les champs nécessaires",
            action: "Sauvegarder les modifications",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "medium",
      },
      {
        id: "user-status-management",
        title: "Gérer les statuts des utilisateurs",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Changer le statut",
            description: "Actif ↔ Inactif ↔ Suspendu ↔ En attente",
            image: "/help-screenshots/users/status-change.jpg",
          },
          {
            step: 2,
            title: "Implications",
            description: "Un utilisateur inactif ne peut pas se connecter",
            action: "Vérifier les dépendances avant désactivation",
          },
          {
            step: 3,
            title: "Réactivation",
            description: "Réactiver un compte désactivé",
            action: "Utiliser 'Réactiver' dans le menu",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "medium",
      },
      {
        id: "user-role-management",
        title: "Gérer les rôles et permissions",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Hiérarchie des rôles",
            description: "Admin > Directeur > Secrétaire > Professeur > Élève",
            image: "/help-screenshots/users/role-hierarchy.jpg",
          },
          {
            step: 2,
            title: "Changer le rôle",
            description: "Via menu actions → 'Changer rôle'",
            action: "Sélectionner le nouveau rôle",
          },
          {
            step: 3,
            title: "Vérifier les permissions",
            description: "Les permissions sont automatiquement mises à jour",
            action: "Informer l'utilisateur du changement",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "user-security",
        title: "Sécurité et récupération",
        type: "text",
        content: `**Réinitialisation mot de passe**
      Envoi d'un email de réinitialisation à l'utilisateur
      
      **Dernière connexion**
      Suivi de l'activité dans la colonne correspondante
      
      **Auto-modification interdite**
      Un utilisateur ne peut pas se modifier lui-même
      
      **Suppression sécurisée**
      Vérification des dépendances avant suppression définitive
      
      **Logs d'activité**
      Historique des modifications disponible pour les admins`,
        targetRole: ["Admin"],
        importance: "high",
      },
    ],
    quickActions: [
      {
        id: "quick-add-user",
        label: "Nouvel utilisateur",
        description: "Créer un nouveau compte",
        icon: "UserPlus",
        path: "/users/add",
      },
      {
        id: "reset-password",
        label: "Réinitialiser MDP",
        description: "Envoyer un email de réinitialisation",
        icon: "Key",
        path: "#",
      },
      {
        id: "export-users",
        label: "Exporter la liste",
        description: "Exporter tous les utilisateurs",
        icon: "Download",
        path: "/users/export",
        shortcut: "Ctrl+U",
      },
    ],
    commonIssues: [
      {
        id: "issue-user-001",
        problem: "Email déjà utilisé",
        solution: "Chaque utilisateur doit avoir un email unique",
        fixSteps: [
          "Vérifier si un compte existe déjà avec cet email",
          "Utiliser un email alternatif",
          "Fusionner les comptes si nécessaire",
        ],
        preventTips: [
          "Vérifier la disponibilité avant création",
          "Utiliser les emails institutionnels",
        ],
      },
      {
        id: "issue-user-002",
        problem: "Impossible de modifier un utilisateur",
        solution: "Restrictions hiérarchiques",
        fixSteps: [
          "Vérifier que vous avez un rôle supérieur",
          "Contacter un administrateur de niveau supérieur",
          "Vérifier que ce n'est pas votre propre compte",
        ],
        preventTips: [
          "Respecter la hiérarchie des rôles",
          "Former les utilisateurs aux limitations",
        ],
      },
      {
        id: "issue-user-003",
        problem: "Utilisateur ne reçoit pas l'email de réinitialisation",
        solution: "Vérifier la configuration email et le spam",
        fixSteps: [
          "Vérifier l'adresse email dans le profil",
          "Demander à l'utilisateur de vérifier le spam",
          "Réessayer l'envoi",
          "Contacter l'administrateur système",
        ],
        preventTips: [
          "Maintenir à jour les adresses email",
          "Configurer correctement le serveur SMTP",
          "Informer les utilisateurs de vérifier le spam",
        ],
      },
    ],
  },
  {
    id: "classes",
    title: "Gestion des Classes",
    description: "Création et gestion des classes scolaires",
    icon: "Building",
    color: "bg-orange-100 text-orange-800",
    permissions: [PERMISSIONS.MANAGE_SUBJECTS, PERMISSIONS.VIEW_OWN_SUBJECTS],
    content: [
      {
        id: "class-list-overview",
        title: "Navigation dans la liste des classes",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder à la liste",
            description: "Dans le menu principal, cliquez sur 'Classes'",
            action: "Naviguer vers Classes > Gestion",
          },
          {
            step: 2,
            title: "Statistiques en temps réel",
            description:
              "3 cartes : Classes totales, Classes actives, Élèves total",
            image: "/help-screenshots/classes/dashboard.jpg",
          },
          {
            step: 3,
            title: "Filtres par niveau",
            description: "Filtrez par niveau (6ème à Terminale, NSI-NSIV)",
            action: "Utiliser le sélecteur 'Niveau'",
          },
        ],
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "high",
      },
      {
        id: "add-new-class",
        title: "Créer une nouvelle classe",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Cliquer sur 'Nouvelle Classe'",
            description: "Bouton orange en haut à droite",
            action: "Cliquer sur le bouton + Nouvelle Classe",
          },
          {
            step: 2,
            title: "Nom de la classe",
            description: "Ex: '6ème A', 'Terminale S1', 'NS II'",
            image: "/help-screenshots/classes/class-name.jpg",
          },
          {
            step: 3,
            title: "Sélectionner le niveau",
            description: "Choisir parmi la liste des niveaux disponibles",
            action: "Sélectionner dans la liste déroulante",
          },
          {
            step: 4,
            title: "Définir la capacité",
            description: "Nombre maximum d'élèves (entre 5 et 50)",
            action: "Saisir un nombre entre 5 et 50",
          },
          {
            step: 5,
            title: "Sauvegarder",
            description:
              "La classe est créée avec le statut 'Active' par défaut",
            action: "Cliquer sur 'Ajouter'",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "class-capacitys",
        title: "Gestion de la capacité des classes",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Visualiser l'occupation",
            description: "Barre de progression dans la colonne 'Élèves'",
            image: "/help-screenshots/classes/capacity-bar.jpg",
          },
          {
            step: 2,
            title: "Pourcentage d'occupation",
            description:
              "Calcul automatique : (élèves inscrits / capacité) × 100",
            action: "Regarder le pourcentage sous la barre",
          },
          {
            step: 3,
            title: "Alertes de capacité",
            description: "⚠️ Jaune : >80% occupé | 🔴 Rouge : >95% occupé",
          },
          {
            step: 4,
            title: "Ajuster la capacité",
            description: "Modifiez la classe pour changer la capacité",
            action: "Cliquer sur 'Modifier' dans le menu actions",
          },
        ],
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "medium",
      },
      {
        id: "edit-class",
        title: "Modifier une classe existante",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Trouver la classe",
            description: "Utilisez la recherche ou les filtres",
            action: "Entrer le nom de la classe dans la recherche",
          },
          {
            step: 2,
            title: "Menu d'actions",
            description: "Cliquez sur les trois points (⋮) dans la ligne",
            image: "/help-screenshots/classes/class-actions.jpg",
          },
          {
            step: 3,
            title: "Sélectionner 'Modifier'",
            description: "Dans le menu déroulant",
            action: "Cliquer sur 'Modifier'",
          },
          {
            step: 4,
            title: "Modifications possibles",
            description:
              "Nom, Niveau, Capacité - Le statut ne peut être changé que par Admin",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "class-statuss",
        title: "Gestion du statut des classes",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Statuts disponibles",
            description:
              "🟢 Active : Accepte de nouveaux élèves | 🔴 Inactive : Fermée aux nouvelles inscriptions",
            image: "/help-screenshots/classes/status-badges.jpg",
          },
          {
            step: 2,
            title: "Changer le statut",
            description: "Seulement via modification par Admin",
            action: "Modifier la classe > Changer le statut",
          },
          {
            step: 3,
            title: "Impact de l'inactivation",
            description:
              "Une classe inactive : 1) N'apparaît pas dans les listes d'inscription 2) Garde ses élèves actuels 3) Peut être réactivée",
          },
        ],
        targetRole: ["Admin"],
        importance: "high",
      },
      {
        id: "class-levels-explained",
        title: "Explication des niveaux de classe",
        type: "steps",
        content: `Système Français :
       
       Sixième (6ème) : Première année collège
       
       Cinquième (5ème) : Deuxième année
       
       Quatrième (4ème) : Troisième année
       
       Troisième (3ème) : Dernière année collège
       
       Seconde (2nde) : Première année lycée
       
       Première (1ère) : Deuxième année lycée
       
       Terminale : Dernière année lycée
       
       Niveaux Spéciaux (NS) :
       
       NS I à NS IV : Classes préparatoires/spécialisées`,
        targetRole: ["Admin", "Directeur", "Secretaire", "Professeur"],
        importance: "medium",
      },
      {
        id: "class-form-validation",
        title: "Validation du formulaire classe",
        type: "steps",
        content: `Règles de validation :
       
       Nom : 2 à 50 caractères, doit être unique
       
       Niveau : Obligatoire, sélection dans la liste
       
       Capacité : Entre 5 et 50 élèves
       
       Nom génération : Le système suggère des noms basés sur le niveau
       
       Vérification d'unicité : Pas deux classes avec même nom et même niveau`,
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "class-reports",
        title: "Rapports et statistiques par classe",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Statistiques globales",
            description: "Voir les totaux dans les 3 cartes du haut",
            action: "Consulter les cartes statistiques",
          },
          {
            step: 2,
            title: "Détail par classe",
            description: "Nombre d'élèves, capacité, pourcentage",
            image: "/help-screenshots/classes/detail-stats.jpg",
          },
          {
            step: 3,
            title: "Export des données",
            description: "Exporter la liste complète des classes",
            action: "Cliquer sur 'Exporter' (disponible pour Admin)",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "medium",
      },
    ],
    quickActions: [
      {
        id: "quick-add-class",
        label: "Nouvelle classe",
        description: "Créer une nouvelle classe",
        icon: "Building",
        path: "/classes/ajouter",
      },
      {
        id: "view-full-classes",
        label: "Classes pleines",
        description: "Voir les classes à capacité maximale",
        icon: "Users",
        path: "#",
        shortcut: "Ctrl+F",
      },
      {
        id: "export-classes",
        label: "Exporter liste",
        description: "Exporter toutes les classes",
        icon: "Download",
        path: "/classes/export",
      },
    ],
    commonIssues: [
      {
        id: "issue-class-001",
        problem: "Nom de classe déjà utilisé",
        solution: "Ajouter un suffixe ou changer légèrement le nom",
        fixSteps: [
          "Vérifier si une classe existe avec le même nom et niveau",
          "Ajouter un chiffre (ex: '6ème A1' au lieu de '6ème A')",
          "Ou changer la lettre de section",
        ],
        preventTips: [
          "Utiliser un système de nommage cohérent",
          "Vérifier la liste avant de créer",
        ],
      },
      {
        id: "issue-class-002",
        problem: "Impossible de réduire la capacité",
        solution: "La nouvelle capacité doit être ≥ nombre d'élèves actuels",
        fixSteps: [
          "Vérifier le nombre d'élèves inscrits",
          "La nouvelle capacité doit être ≥ ce nombre",
          "Déplacer des élèves si nécessaire",
        ],
        preventTips: [
          "Planifier la capacité à l'avance",
          "Sur-dimensionner légèrement les classes",
        ],
      },
      {
        id: "issue-class-003",
        problem: "Classe n'apparaît pas dans les listes d'inscription",
        solution: "Vérifier que la classe est 'Active'",
        fixSteps: [
          "Chercher la classe dans la liste",
          "Vérifier le badge de statut",
          "Si 'Inactive', modifier pour activer",
        ],
        preventTips: [
          "Toujours créer les classes comme 'Active'",
          "Vérifier régulièrement les statuts",
        ],
      },
      {
        id: "issue-class-004",
        problem: "Pourcentage d'occupation incorrect",
        solution: "Actualiser ou vérifier les inscriptions",
        fixSteps: [
          "Cliquer sur 'Actualiser' en haut de la page",
          "Vérifier les inscriptions des élèves",
          "Contacter l'admin si persiste",
        ],
        preventTips: [
          "Le système calcule automatiquement",
          "Les mises à jour sont en temps réel",
        ],
      },
    ],
  },
  {
    id: "fees",
    title: "Structures de Frais Académiques",
    description: "Configuration et gestion des frais par année académique",
    icon: "CreditCard",
    color: "bg-purple-100 text-purple-800",
    permissions: [PERMISSIONS.VIEW_FEES, PERMISSIONS.MANAGE_FEES],
    content: [
      {
        id: "fee-overview",
        title: "Vue d'ensemble des structures de frais",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder aux structures",
            description: "Menu principal → 'Finances' → 'Structures de Frais'",
            action: "Naviguer vers Finances > Structures",
          },
          {
            step: 2,
            title: "Comprendre les statistiques",
            description:
              "Les cartes montrent le total, les actives/inactives, et les montants",
            image: "/help-screenshots/fees/stats-cards.jpg",
          },
          {
            step: 3,
            title: "Navigation par onglets",
            description: "Filtrez par statut : Toutes, Actives, Inactives",
            action: "Utiliser les onglets sous la barre de recherche",
          },
        ],
        targetRole: ["Admin", "Directeur", "Comptable"],
        importance: "high",
      },
      {
        id: "create-fee-structure",
        title: "Créer une nouvelle structure de frais",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Cliquer sur 'Nouvelle Structure'",
            description: "Bouton violet en haut à droite",
            action: "Cliquer sur + Nouvelle Structure",
          },
          {
            step: 2,
            title: "Remplir les informations de base",
            description: "Nom descriptif, année académique, montant",
            image: "/help-screenshots/fees/create-form-1.jpg",
          },
          {
            step: 3,
            title: "Définir le montant",
            description:
              "Montant en HTG, avec validation automatique (max 10,000,000 HTG)",
            action: "Entrer le montant avec 2 décimales maximum",
          },
          {
            step: 4,
            title: "Ajouter une description",
            description:
              "Optionnel : détails sur les frais, modalités de paiement",
            action: "Remplir le champ description si nécessaire",
          },
          {
            step: 5,
            title: "Configurer le statut",
            description: "Par défaut 'Actif' pour les nouvelles structures",
            action: "Laisser activé ou désactiver selon les besoins",
          },
          {
            step: 6,
            title: "Sauvegarder",
            description: "Cliquez sur 'Créer' pour enregistrer",
            action: "Cliquer sur le bouton violet Créer",
          },
        ],
        targetRole: ["Admin", "Comptable"],
        importance: "high",
      },
      {
        id: "edit-fee-structure",
        title: "Modifier une structure existante",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Trouver la structure",
            description: "Utilisez la recherche par nom, année ou description",
            action: "Rechercher dans la barre de recherche",
          },
          {
            step: 2,
            title: "Ouvrir le menu actions",
            description: "Cliquez sur les trois points (⋮) dans la ligne",
            image: "/help-screenshots/fees/actions-menu.jpg",
          },
          {
            step: 3,
            title: "Sélectionner 'Modifier'",
            description: "Dans le menu déroulant, choisissez Modifier",
            action: "Cliquer sur 'Modifier'",
          },
          {
            step: 4,
            title: "Modifications limites",
            description:
              "L'année académique ne peut être changée si des étudiants sont associés",
            action: "Vérifier les dépendances avant modification",
          },
        ],
        targetRole: ["Admin", "Comptable"],
        importance: "medium",
      },
      {
        id: "fee-activation-deactivation",
        title: "Activer/Désactiver les structures",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Comprendre les implications",
            description:
              "Une structure désactivée n'est pas disponible pour les nouvelles affectations",
            image: "/help-screenshots/fees/status-implications.jpg",
          },
          {
            step: 2,
            title: "Changer le statut",
            description: "Via le menu actions → 'Changer statut'",
            action: "Sélectionner le nouveau statut",
          },
          {
            step: 3,
            title: "Raison du changement",
            description: "Fournir une raison optionnelle pour le suivi",
            action: "Remplir le champ raison si nécessaire",
          },
        ],
        targetRole: ["Admin", "Comptable"],
        importance: "medium",
      },
      {
        id: "fee-export",
        title: "Exporter les données des frais",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Exporter les données",
            description: "Cliquez sur 'Exporter' dans la barre d'actions",
            action: "Cliquer sur l'icône 📥 Exporter",
          },
          {
            step: 2,
            title: "Format d'export",
            description: "CSV avec toutes les colonnes, compatible Excel",
            image: "/help-screenshots/fees/export-format.jpg",
          },
          {
            step: 3,
            title: "Données incluses",
            description:
              "Nom, année académique, montant, statut, description, date de création",
            action: "Fichier téléchargé automatiquement",
          },
        ],
        targetRole: ["Admin", "Directeur", "Comptable"],
        importance: "medium",
      },
      {
        id: "fee-validation-rules",
        title: "Règles de validation des frais",
        type: "text",
        content: `**Nom obligatoire**
      2 à 200 caractères, sans caractères spéciaux
      
      **Montant valide**
      Entre 0.01 HTG et 10,000,000 HTG, maximum 2 décimales
      
      **Année académique**
      Doit correspondre à une année académique existante
      
      **Unicité**
      Pas de doublon nom/année académique
      
      **Description limite**
      Maximum 1000 caractères`,
        targetRole: ["Admin", "Comptable"],
        importance: "high",
      },
    ],
    quickActions: [
      {
        id: "quick-add-fee",
        label: "Nouvelle structure",
        description: "Créer une nouvelle structure de frais",
        icon: "CreditCard",
        path: "/fees/structures/add",
      },
      {
        id: "export-fees-csv",
        label: "Exporter CSV",
        description: "Exporter toutes les structures",
        icon: "Download",
        path: "/fees/structures/export",
        shortcut: "Ctrl+F",
      },
      {
        id: "view-inactive-fees",
        label: "Voir inactives",
        description: "Afficher les structures désactivées",
        icon: "EyeOff",
        path: "#",
      },
    ],
    commonIssues: [
      {
        id: "issue-fee-001",
        problem: "Impossible de modifier l'année académique",
        solution: "Des étudiants sont déjà associés à cette structure",
        fixSteps: [
          "Vérifier les dépendances via 'Vérifier dépendances'",
          "Désaffecter les étudiants ou créer une nouvelle structure",
          "Contacter l'administrateur si nécessaire",
        ],
        preventTips: [
          "Planifiez soigneusement les années académiques",
          "Créez des structures spécifiques par année",
        ],
      },
      {
        id: "issue-fee-002",
        problem: "Montant refusé (trop élevé)",
        solution: "La limite est de 10,000,000 HTG",
        fixSteps: [
          "Diviser le montant en plusieurs structures",
          "Vérifier l'unité (HTG vs autres devises)",
          "Contacter l'administrateur pour augmentation de limite",
        ],
        preventTips: [
          "Vérifiez les montants avant saisie",
          "Utilisez la notation compacte (K, M) pour les grands montants",
        ],
      },
      {
        id: "issue-fee-003",
        problem: "Structure non disponible dans les affectations",
        solution:
          "La structure est désactivée ou n'est pas pour la bonne année",
        fixSteps: [
          "Vérifier le statut dans la liste",
          "Vérifier l'année académique correspondante",
          "Réactiver si nécessaire",
        ],
        preventTips: [
          "Activez les structures avant la période d'inscription",
          "Vérifiez les années académiques actives",
        ],
      },
    ],
  },
  {
    id: "payments",
    title: "Gestion des Paiements",
    description: "Enregistrement, suivi et gestion des paiements scolaires",
    icon: "CreditCard",
    color: "bg-blue-100 text-blue-800",
    permissions: [PERMISSIONS.VIEW_PAYMENTS],
    content: [
      {
        id: "payment-dashboard",
        title: "Tableau de bord des paiements",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Vue d'ensemble",
            description:
              "4 cartes statistiques : Total, Montant total, Montant payé, Solde restant",
            image: "/help-screenshots/payments/dashboard.jpg",
          },
          {
            step: 2,
            title: "Filtres principaux",
            description:
              "Filtrez par étudiant, année académique et période (date)",
            action: "Utiliser les sélecteurs en haut de la page",
          },
          {
            step: 3,
            title: "Onglets de statut",
            description:
              "Tous, Payés, Partiels, En attente - Voir les paiements par statut",
            action: "Cliquer sur les onglets sous la barre de recherche",
          },
        ],
        targetRole: ["Admin", "Directeur", "Comptable"],
        importance: "high",
      },
      {
        id: "record-new-payment",
        title: "Enregistrer un nouveau paiement",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Cliquer sur 'Nouveau Paiement'",
            description: "Bouton bleu en haut à droite",
            action: "Cliquer sur le bouton + Nouveau Paiement",
          },
          {
            step: 2,
            title: "Sélectionner l'étudiant",
            description: "Recherchez ou sélectionnez dans la liste déroulante",
            image: "/help-screenshots/payments/select-student.jpg",
          },
          {
            step: 3,
            title: "Choisir les frais",
            description:
              "Sélectionnez les frais à payer - Le solde disponible s'affiche",
            action: "Choisir dans la liste des frais disponibles",
          },
          {
            step: 4,
            title: "Saisir les détails",
            description:
              "Montant, méthode de paiement, date, référence, description",
            action: "Remplir tous les champs obligatoires (*)",
          },
          {
            step: 5,
            title: "Validation",
            description:
              "Le système vérifie que le montant ne dépasse pas le solde disponible",
            action: "Cliquer sur 'Enregistrer le paiement'",
          },
        ],
        targetRole: ["Admin", "Comptable"],
        importance: "high",
      },
      {
        id: "edit-payment",
        title: "Modifier un paiement existant",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder à l'historique",
            description:
              "Cliquez sur l'icône historique (📜) à côté de l'étudiant",
            action: "Cliquer sur l'icône 📜 dans la liste",
          },
          {
            step: 2,
            title: "Ouvrir le menu d'actions",
            description: "Cliquez sur les trois points (⋮) dans la ligne",
            image: "/help-screenshots/payments/payment-actions.jpg",
          },
          {
            step: 3,
            title: "Sélectionner 'Modifier'",
            description: "Dans le menu déroulant",
            action: "Cliquer sur 'Modifier'",
          },
          {
            step: 4,
            title: "Limite temporelle",
            description: "Modification possible seulement dans les 30 jours",
          },
        ],
        targetRole: ["Admin", "Comptable"],
        importance: "medium",
      },
      {
        id: "delete-payment",
        title: "Supprimer un paiement",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Ouvrir l'historique",
            description: "Via l'icône historique (📜)",
            action: "Cliquer sur l'icône 📜",
          },
          {
            step: 2,
            title: "Menu actions",
            description: "Cliquez sur ⋮ puis 'Supprimer'",
            image: "/help-screenshots/payments/delete-payment.jpg",
          },
          {
            step: 3,
            title: "Confirmation",
            description: "Une fenêtre de confirmation s'affiche",
            action: "Cliquer sur 'Supprimer définitivement'",
          },
          {
            step: 4,
            title: "Limite temporelle",
            description: "Suppression possible seulement dans les 7 jours",
          },
        ],
        targetRole: ["Admin"],
        importance: "medium",
      },
      {
        id: "payment-history",
        title: "Consulter l'historique des paiements",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder à l'historique",
            description: "Via l'icône 📜 à côté de chaque étudiant",
            action: "Cliquer sur l'icône historique",
          },
          {
            step: 2,
            title: "Filtres d'historique",
            description: "Filtrer par période, méthode de paiement, montant",
            image: "/help-screenshots/payments/history-filters.jpg",
          },
          {
            step: 3,
            title: "Export de l'historique",
            description: "Exporter l'historique en Excel ou PDF",
            action: "Cliquer sur 'Exporter' en bas de la fenêtre",
          },
        ],
        targetRole: ["Admin", "Directeur", "Comptable"],
        importance: "medium",
      },
      {
        id: "payment-methods",
        title: "Méthodes de paiement disponibles",
        type: "steps",
        content: `💵 Espèces : Paiement en liquide au secrétariat
       
       💳 Carte : Paiement par carte bancaire
       
       🏦 Virement : Transfert bancaire (référence obligatoire)
       
       📄 Chèque : Chèque bancaire (numéro de chèque)
       
       📲 Mobile Money : Paiement mobile (à venir)`,
        targetRole: ["Admin", "Comptable"],
        importance: "medium",
      },
      {
        id: "payment-validation",
        title: "Validation des paiements",
        type: "steps",
        content: `Vérifications automatiques :
       
       1. Montant ne doit pas dépasser le solde disponible
       
       2. Date ne peut pas être dans le futur
       
       3. Montant minimum : 10 HTG
       
       4. Montant maximum : 10,000,000 HTG
       
       5. Référence unique pour les virements
       
       6. Description obligatoire`,
        targetRole: ["Admin", "Comptable"],
        importance: "high",
      },
      {
        id: "payment-reports",
        title: "Rapports et statistiques",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Statistiques journalières",
            description: "Voir le total des paiements par jour dans les cartes",
            action: "Regarder les cartes en haut de la page",
          },
          {
            step: 2,
            title: "Export complet",
            description: "Exporter tous les paiements avec tous les détails",
            image: "/help-screenshots/payments/export-reports.jpg",
          },
          {
            step: 3,
            title: "Rapport par méthode",
            description: "Voir la répartition des paiements par méthode",
            action: "Filtrer par méthode de paiement",
          },
        ],
        targetRole: ["Admin", "Directeur", "Comptable"],
        importance: "medium",
      },
    ],
    quickActions: [
      {
        id: "quick-add-payment",
        label: "Nouveau paiement",
        description: "Enregistrer un nouveau paiement",
        icon: "CreditCard",
        path: "/paiements/nouveau",
      },
      {
        id: "view-overdue",
        label: "Voir retards",
        description: "Afficher les paiements en retard",
        icon: "AlertTriangle",
        path: "#",
        shortcut: "Ctrl+R",
      },
      {
        id: "export-all-payments",
        label: "Exporter tout",
        description: "Exporter tous les paiements",
        icon: "Download",
        path: "/paiements/export",
      },
    ],
    commonIssues: [
      {
        id: "issue-payment-001",
        problem: "Montant dépasse le solde disponible",
        solution: "Réduire le montant ou vérifier le solde",
        fixSteps: [
          "Cliquer sur 'Information' pour voir le solde disponible",
          "Ajuster le montant pour qu'il soit ≤ solde",
          "Si nécessaire, faire plusieurs paiements",
        ],
        preventTips: [
          "Toujours vérifier le solde avant d'enregistrer",
          "Utiliser le montant suggéré par le système",
        ],
      },
      {
        id: "issue-payment-002",
        problem: "Date de paiement dans le futur",
        solution: "Utiliser la date d'aujourd'hui ou une date passée",
        fixSteps: [
          "Cliquer sur le champ date",
          "Choisir une date valide (pas dans le futur)",
          "La date maximale est aujourd'hui",
        ],
        preventTips: [
          "Utiliser le sélecteur de date plutôt que taper manuellement",
          "Vérifier le calendrier système",
        ],
      },
      {
        id: "issue-payment-003",
        problem: "Paiement déjà enregistré (doublon)",
        solution: "Vérifier l'historique avant d'ajouter",
        fixSteps: [
          "Consulter l'historique de l'étudiant",
          "Rechercher par date et montant",
          "Si doublon, supprimer le paiement erroné",
        ],
        preventTips: [
          "Toujours vérifier l'historique avant d'ajouter",
          "Utiliser des références uniques pour les virements",
        ],
      },
      {
        id: "issue-payment-004",
        problem: "Impossible de modifier/supprimer un ancien paiement",
        solution: "Les paiements sont verrouillés après certaines périodes",
        fixSteps: [
          "Modification : maximum 30 jours après la date",
          "Suppression : maximum 7 jours après la date",
          "Contacter l'administrateur pour les corrections",
        ],
        preventTips: [
          "Vérifier immédiatement après l'enregistrement",
          "Former les utilisateurs à bien saisir du premier coup",
        ],
      },
    ],
  },
  {
    id: "events",
    title: "Évènements",
    description: "Gestion des évènements",
    icon: "CalendarDays",
    color: "bg-fuchsia-100 text-fuchsia-800",
    permissions: [PERMISSIONS.VIEW_EXPENSES],
    content: [
      {
        id: "create-event",
        title: "Créer un événement",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Définir l'événement",
            description: "Nom, date, lieu, description",
            image: "/help-screenshots/events/create.png",
          },
          {
            step: 2,
            title: "Sélectionner les participants",
            description: "Classes, professeurs, tous...",
            action: "Cocher les groupes concernés",
          },

          {
            step: 4,
            title: "Publier",
            description: "Rendre visible dans l'agenda",
            action: "Cliquer sur 'Publier l'événement'",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "medium",
      },
    ],
  },
  {
    id: "announcements",
    title: "Annonces",
    description: "Gestion des annonces",
    icon: "Megaphone",
    color: "bg-sky-100 text-sky-800",
    permissions: [PERMISSIONS.VIEW_EXPENSES],
    content: [
      {
        id: "publish-announcement",
        title: "Publier une annonce",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Rédiger le contenu",
            description: "Titre, message, niveau d'importance",
            image: "/help-screenshots/announcements/editor.png",
          },
          {
            step: 2,
            title: "Cibler l'audience",
            description: "Parents, élèves, professeurs...",
            action: "Sélectionner les destinataires",
          },
          {
            step: 3,
            title: "Programmer",
            description: "Publication immédiate ou différée",
            action: "Choisir la date de publication",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "medium",
      },
    ],
  },
  {
    id: "audit-logs",
    title: "Journal d'audit",
    description: "Traçabilité des actions",
    icon: "ShieldAlert",
    color: "bg-red-100 text-red-800",
    permissions: [PERMISSIONS.VIEW_AUDIT_LOGS],
    content: [
      {
        id: "audit-trail",
        title: "Consulter les logs",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Filtrer par date",
            description: "Sélectionner la période",
            action: "Utiliser le sélecteur de dates",
          },
          {
            step: 2,
            title: "Filtrer par utilisateur",
            description: "Voir les actions d'un utilisateur",
            image: "/help-screenshots/audit/filter.png",
          },
          {
            step: 3,
            title: "Exporter les logs",
            description: "Pour analyse externe",
            action: "Cliquer sur 'Exporter en CSV'",
          },
          {
            step: 4,
            title: "Surveillance",
            description: "Alertes pour actions sensibles",
            action: "Configurer les alertes dans Paramètres",
          },
        ],
        targetRole: ["Admin"],
        importance: "low",
      },
    ],
  },
];

// ==================== DONNÉES POUR AUTRES RÔLES ====================
export const secretaireHelpSections: HelpSection[] = [
  {
    id: "students",
    title: "Gestion des Élèves",
    description: "Inscription, modification et suivi des élèves",
    icon: "Users",
    color: "bg-green-100 text-green-800",
    permissions: [PERMISSIONS.VIEW_STUDENTS, PERMISSIONS.MANAGE_STUDENTS],
    content: [
      {
        id: "student-list-overview",
        title: "Navigation dans la liste des élèves",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder à la liste",
            description:
              "Dans le menu principal, cliquez sur 'Élèves' pour accéder à la gestion",
            action: "Naviguer vers Élèves > Liste",
          },
          {
            step: 2,
            title: "Vue Tableau vs Cartes",
            description:
              "Basculez entre la vue tableau (ordinateur) et la vue cartes (mobile/tablette)",
            image: "/help-screenshots/students/list-view.jpg",
          },
          {
            step: 3,
            title: "Filtres avancés",
            description:
              "Utilisez les filtres par statut et classe pour affiner votre recherche",
            action: "Utiliser les sélecteurs en haut de la page",
          },
        ],
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "high",
      },
      {
        id: "add-new-student",
        title: "Ajouter un nouvel élève",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Cliquer sur 'Nouvel élève'",
            description: "Bouton bleu en haut à droite de l'interface",
            action: "Cliquer sur le bouton + Nouvel élève",
          },
          {
            step: 2,
            title: "Remplir les informations personnelles",
            description:
              "Onglet 'Informations élèves' - Tous les champs marqués d'une * sont obligatoires",
            image: "/help-screenshots/students/add-form-1.jpg",
          },
          {
            step: 3,
            title: "Ajouter les parents/tuteurs",
            description:
              "Onglet 'Parents/Tuteurs' - Au moins un parent principal est requis",
            action:
              "Cliquer sur 'Ajouter' pour ajouter un parent supplémentaire",
          },
          {
            step: 4,
            title: "Configurer l'inscription",
            description:
              "Onglet 'Inscription' - Sélectionner la classe et l'année académique",
            action: "Choisir dans les listes déroulantes",
          },
          {
            step: 5,
            title: "Sauvegarder",
            description:
              "Cliquez sur 'Créer l'élève' pour enregistrer la fiche",
            action: "Cliquer sur le bouton vert Enregistrer",
          },
        ],
        targetRole: ["Admin", "Secretaire"],
        importance: "high",
      },
      {
        id: "edit-student",
        title: "Modifier les informations d'un élève",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Trouver l'élève",
            description: "Utilisez la barre de recherche ou les filtres",
            action: "Entrer le nom ou code étudiant dans la recherche",
          },
          {
            step: 2,
            title: "Ouvrir le menu d'actions",
            description:
              "Cliquez sur les trois points verticaux (⋮) dans la ligne de l'élève",
            image: "/help-screenshots/students/actions-menu.jpg",
          },
          {
            step: 3,
            title: "Sélectionner 'Modifier'",
            description: "Dans le menu déroulant, choisissez l'option Modifier",
            action: "Cliquer sur 'Modifier'",
          },
          {
            step: 4,
            title: "Apporter les modifications",
            description: "Modifiez les champs nécessaires dans le formulaire",
            action: "Faire les changements et cliquer sur 'Enregistrer'",
          },
        ],
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "high",
      },
      {
        id: "view-student-details",
        title: "Consulter les détails complets d'un élève",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder aux détails",
            description:
              "Cliquez sur l'icône 'œil' ou 'Voir détails' dans le menu actions",
            action: "Cliquer sur l'icône 👁️",
          },
          {
            step: 2,
            title: "Navigation dans les onglets",
            description:
              "Explorez les différentes sections : Informations, Notes, Absences, Paiements",
            image: "/help-screenshots/students/details-view.jpg",
          },
          {
            step: 3,
            title: "Retour à la liste",
            description:
              "Utilisez le bouton 'Retour à la liste' pour revenir à la vue principale",
            action: "Cliquer sur '← Retour à la liste'",
          },
        ],
        targetRole: [
          "Admin",
          "Directeur",
          "Secretaire",
          "Professeur",
          "Comptable",
        ],
        importance: "medium",
      },
      {
        id: "bulk-actions",
        title: "Actions groupées sur plusieurs élèves",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Activer le mode sélection",
            description: "Cliquez sur le bouton 'Sélection' en haut de la page",
            action: "Cliquer sur l'icône ✓ Sélection",
          },
          {
            step: 2,
            title: "Sélectionner les élèves",
            description: "Cochez les cases à gauche de chaque élève",
            image: "/help-screenshots/students/bulk-select.jpg",
          },
          {
            step: 3,
            title: "Barre d'actions groupées",
            description: "Une barre d'actions apparaît avec plusieurs options",
            action: "Utiliser les boutons dans la barre bleue",
          },
          {
            step: 4,
            title: "Actions disponibles",
            description:
              "Modifier le statut, affecter à une classe, exporter, supprimer",
            action: "Choisir l'action souhaitée",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "medium",
      },
      {
        id: "export-students",
        title: "Exporter les données des élèves",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Export global",
            description:
              "Cliquez sur 'Exporter' pour télécharger tous les élèves",
            action: "Cliquer sur l'icône 📥 Exporter",
          },
          {
            step: 2,
            title: "Export sélectif",
            description:
              "Sélectionnez d'abord les élèves puis utilisez 'Exporter' dans la barre groupée",
            image: "/help-screenshots/students/export-options.jpg",
          },
          {
            step: 3,
            title: "Formats disponibles",
            description:
              "Excel (.xlsx) avec toutes les colonnes de la fiche élève",
            action: "Fichier téléchargé automatiquement",
          },
        ],
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "medium",
      },
      {
        id: "student-form-validation",
        title: "Validation du formulaire élève",
        type: "text",
        content: `
      **Champs obligatoires**
      Les champs marqués d'une * sont obligatoires : Prénom, Nom, Email, Date de naissance, Classe, Année académique
      
      **Format des dates**
      La date de naissance doit être au format JJ/MM/AAAA
      
      **Validation de l'email**
      Le système vérifie la disponibilité de l'email (icône verte ✅)
      
      **Validation du téléphone**
      Format Haïtien requis : +509XXXXXXXX
      
      **Âge requis**
      L'élève doit avoir entre 13 et 25 ans
               `,
        targetRole: ["Admin", "Secretaire"],
        importance: "high",
      },
      {
        id: "guardianss",
        title: "Gestion des parents/tuteurs",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Ajouter un parent",
            description: "Dans l'onglet Parents/Tuteurs, cliquez sur 'Ajouter'",
            action: "Cliquer sur le bouton + Ajouter",
          },
          {
            step: 2,
            title: "Définir le parent principal",
            description:
              "Cochez la case 'Principal' pour désigner le contact principal",
            image: "/help-screenshots/students/guardian-primary.jpg",
          },
          {
            step: 3,
            title: "Supprimer un parent",
            description:
              "Cliquez sur l'icône poubelle (sauf pour le parent principal)",
            action: "Cliquer sur l'icône 🗑️",
          },
          {
            step: 4,
            title: "Limite",
            description: "Maximum 5 parents/tuteurs par élève",
          },
        ],
        targetRole: ["Admin", "Secretaire"],
        importance: "medium",
      },
    ],
    quickActions: [
      {
        id: "quick-add-student",
        label: "Nouvel élève",
        description: "Ajouter un nouvel élève",
        icon: "UserPlus",
        path: "/students/add",
      },
      {
        id: "export-all-students",
        label: "Exporter tous",
        description: "Exporter tous les élèves",
        icon: "Download",
        path: "/students/export",
        shortcut: "Ctrl+E",
      },
      {
        id: "bulk-assign-class",
        label: "Affecter classe",
        description: "Affecter plusieurs élèves à une classe",
        icon: "Building",
        path: "/students/bulk-assign-class",
      },
    ],
    commonIssues: [
      {
        id: "issue-student-001",
        problem: "Impossible d'ajouter un élève - Email déjà utilisé",
        solution:
          "Vérifiez si l'email existe déjà ou utilisez un email différent",
        fixSteps: [
          "Cliquez sur l'icône 🔄 à côté du champ email",
          "Vérifiez l'icône de disponibilité (✅ = disponible, ❌ = utilisé)",
          "Si l'email est utilisé, modifiez-le légèrement (ajoutez un chiffre)",
        ],
        preventTips: [
          "Utilisez toujours l'email institutionnel si disponible",
          "Vérifiez la disponibilité avant de soumettre",
        ],
      },
      {
        id: "issue-student-002",
        problem: "Erreur de validation de la date de naissance",
        solution: "L'âge doit être entre 13 et 25 ans",
        fixSteps: [
          "Vérifiez l'année de naissance",
          "L'élève doit avoir au moins 13 ans",
          "L'élève ne doit pas avoir plus de 25 ans",
        ],
        preventTips: [
          "Utilisez le sélecteur de date au lieu de taper manuellement",
          "Vérifiez les documents officiels",
        ],
      },
      {
        id: "issue-student-003",
        problem: "Téléphone non valide",
        solution: "Format Haïtien requis : +509XXXXXXXX",
        fixSteps: [
          "Commencez toujours par +509",
          "Ajoutez 8 chiffres supplémentaires",
          "Exemple : +50944556677",
        ],
        preventTips: [
          "Le système formate automatiquement en +509 XX XX XX XX",
          "Copiez-collez depuis les documents officiels",
        ],
      },
      {
        id: "issue-student-004",
        problem: "Classe non disponible dans la liste",
        solution: "Vérifiez que la classe est active et existe",
        fixSteps: [
          "Aller dans Classes > Vérifier l'état de la classe",
          "Assurez-vous que la classe n'est pas archivée",
          "Contactez l'administrateur si nécessaire",
        ],
        preventTips: [
          "Créez les classes avant d'inscrire les élèves",
          "Vérifiez les classes actives régulièrement",
        ],
      },
    ],
  },
  {
    id: "enrollments",
    title: "Inscriptions et Réinscriptions",
    description: "Gestion des inscriptions académiques des élèves",
    icon: "UserPlus",
    color: "bg-indigo-100 text-indigo-800",
    permissions: [PERMISSIONS.VIEW_ENROLLMENTS, PERMISSIONS.MANAGE_ENROLLMENTS],
    content: [
      {
        id: "enrollment-overview",
        title: "Vue d'ensemble des inscriptions",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder aux inscriptions",
            description: "Menu principal → 'Élèves' → 'Inscriptions'",
            action: "Naviguer vers Élèves > Inscriptions",
          },
          {
            step: 2,
            title: "Statistiques en temps réel",
            description:
              "Cartes montrant les totaux, actifs, suspendus, terminés",
            image: "/help-screenshots/enrollments/stats.jpg",
          },
          {
            step: 3,
            title: "Navigation par onglets",
            description: "Tous, Inscrits, Non-inscrits",
            action: "Utiliser les onglets pour filtrer",
          },
        ],
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "high",
      },
      {
        id: "enroll-student",
        title: "Inscrire un nouvel élève",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Trouver l'élève",
            description: "Rechercher par nom ou code étudiant",
            action: "Utiliser la barre de recherche",
          },
          {
            step: 2,
            title: "Cliquer sur 'Inscrire'",
            description: "Bouton bleu dans la ligne de l'élève",
            image: "/help-screenshots/enrollments/enroll-button.jpg",
          },
          {
            step: 3,
            title: "Remplir le formulaire",
            description: "Classe, année académique, statut, date",
            action: "Sélectionner dans les listes déroulantes",
          },
          {
            step: 4,
            title: "Attribuer des frais",
            description: "Optionnel : sélectionner les structures de frais",
            action: "Cocher 'Attribuer des frais' et sélectionner",
          },
          {
            step: 5,
            title: "Sauvegarder",
            description: "Cliquez sur 'Créer l'inscription'",
            action: "Cliquer sur le bouton vert",
          },
        ],
        targetRole: ["Admin", "Secretaire"],
        importance: "high",
      },
      {
        id: "reenroll-student",
        title: "Réinscrire un élève",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Validation automatique",
            description: "Le système vérifie l'éligibilité avant réinscription",
            image: "/help-screenshots/enrollments/reenroll-validation.jpg",
          },
          {
            step: 2,
            title: "Cliquer sur 'Réinscrire'",
            description: "Bouton violet dans la ligne de l'élève",
            action: "Cliquer sur 'Réinscrire'",
          },
          {
            step: 3,
            title: "Sélectionner l'année précédente",
            description: "Choisir l'année académique de référence",
            action: "Sélectionner dans la liste",
          },
          {
            step: 4,
            title: "Choisir la nouvelle classe",
            description: "Classes disponibles selon le parcours académique",
            action: "Sélectionner la nouvelle classe",
          },
          {
            step: 5,
            title: "Confirmer",
            description: "Cliquez sur 'Confirmer la réinscription'",
            action: "Cliquer sur le bouton violet",
          },
        ],
        targetRole: ["Admin", "Secretaire"],
        importance: "high",
      },
      {
        id: "edit-enrollment",
        title: "Modifier une inscription",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Limite temporelle",
            description: "Seulement 24h après création pour les secrétaires",
            image: "/help-screenshots/enrollments/edit-time-limit.jpg",
          },
          {
            step: 2,
            title: "Développer l'élève",
            description: "Cliquer sur 'Voir les inscriptions'",
            action: "Cliquer sur la flèche",
          },
          {
            step: 3,
            title: "Modifier l'inscription",
            description: "Bouton 'Modifier' disponible selon permissions",
            action: "Cliquer sur 'Modifier'",
          },
          {
            step: 4,
            title: "Sauvegarder les modifications",
            description: "Apporter les changements nécessaires",
            action: "Cliquer sur 'Enregistrer'",
          },
        ],
        targetRole: ["Admin", "Secretaire"],
        importance: "medium",
      },
      {
        id: "enrollment-status",
        title: "Gérer les statuts d'inscription",
        type: "text",
        content: `**Actif**
      Élève actuellement inscrit et fréquentant les cours
      
      **Suspendu**
      Inscription temporairement interrompue
      
      **Terminé**
      Année académique achevée
      
      **Transitions autorisées**
      Actif ↔ Suspendu, Actif → Terminé`,
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "medium",
      },
      {
        id: "enrollment-validation",
        title: "Validation des réinscriptions",
        type: "text",
        content: `**Critères académiques**
      Moyenne minimum 50/100 pour le passage
      
      **Critères financiers**
      Pas de dette supérieure à 5,000 HTG
      
      **Parcours académique**
      Respect des transitions autorisées entre niveaux
      
      **Statut actuel**
      L'élève ne doit pas être actuellement inscrit
      
      **Disciplinaire**
      Pas de sanction majeure en cours`,
        targetRole: ["Admin", "Directeur", "Secretaire"],
        importance: "high",
      },
    ],
    quickActions: [
      {
        id: "quick-enroll",
        label: "Nouvelle inscription",
        description: "Inscrire un nouvel élève",
        icon: "UserPlus",
        path: "/enrollments/add",
      },
      {
        id: "view-not-enrolled",
        label: "Non-inscrits",
        description: "Afficher les élèves non inscrits",
        icon: "UserX",
        path: "#",
      },
      {
        id: "export-enrollments",
        label: "Exporter",
        description: "Exporter la liste des inscriptions",
        icon: "Download",
        path: "/enrollments/export",
        shortcut: "Ctrl+I",
      },
    ],
    commonIssues: [
      {
        id: "issue-enrollment-001",
        problem: "Élève non éligible à la réinscription",
        solution:
          "Vérifier les critères académiques, financiers et disciplinaires",
        fixSteps: [
          "Consulter les détails d'inéligibilité",
          "Régulariser la situation financière",
          "Contacter la direction pour dérogation",
        ],
        preventTips: [
          "Suivre régulièrement les résultats académiques",
          "Anticiper les paiements des frais",
          "Maintenir la discipline",
        ],
      },
      {
        id: "issue-enrollment-002",
        problem: "Classe complète",
        solution: "La capacité maximale est atteinte",
        fixSteps: [
          "Vérifier la capacité de la classe",
          "Choisir une autre classe du même niveau",
          "Contacter l'administration pour augmentation de capacité",
        ],
        preventTips: [
          "Planifier les capacités avant la rentrée",
          "Maintenir des listes d'attente",
        ],
      },
      {
        id: "issue-enrollment-003",
        problem: "Période d'inscription fermée",
        solution:
          "Les inscriptions ne sont ouvertes que pendant certaines périodes",
        fixSteps: [
          "Vérifier le calendrier académique",
          "Demander une dérogation exceptionnelle",
          "Inscrire pour l'année suivante",
        ],
        preventTips: [
          "Respecter les délais d'inscription",
          "Configurer les périodes d'inscription dans le système",
        ],
      },
    ],
  },
];

export const parentHelpSections: HelpSection[] = [
  {
    id: "payments",
    title: "Gestion des Paiements",
    description: "Enregistrement, suivi et gestion des paiements scolaires",
    icon: "CreditCard",
    color: "bg-blue-100 text-blue-800",
    permissions: [PERMISSIONS.VIEW_PAYMENTS],
    content: [
      {
        id: "payment-dashboard",
        title: "Tableau de bord des paiements",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Vue d'ensemble",
            description:
              "4 cartes statistiques : Total, Montant total, Montant payé, Solde restant",
            image: "/help-screenshots/payments/page.jpg",
          },
          {
            step: 2,
            title: "Filtres principaux",
            description:
              "Filtrez par étudiant, année académique et période (date)",
            action: "Utiliser les sélecteurs en haut de la page",
          },
          {
            step: 3,
            title: "Onglets de statut",
            description:
              "Tous, Payés, Partiels, En attente - Voir les paiements par statut",
            action: "Cliquer sur les onglets sous la barre de recherche",
          },
        ],
        targetRole: ["Admin", "Directeur", "Comptable"],
        importance: "high",
      },
      {
        id: "record-new-payment",
        title: "Enregistrer un nouveau paiement",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Cliquer sur 'Nouveau Paiement'",
            description: "Bouton bleu en haut à droite",
            action: "Cliquer sur le bouton + Nouveau Paiement",
          },
          {
            step: 2,
            title: "Sélectionner l'étudiant",
            description: "Recherchez ou sélectionnez dans la liste déroulante",
            image: "/help-screenshots/payments/forms/add-form.jpg",
          },
          {
            step: 3,
            title: "Choisir les frais",
            description:
              "Sélectionnez les frais à payer - Le solde disponible s'affiche",
            action: "Choisir dans la liste des frais disponibles",
          },
          {
            step: 4,
            title: "Saisir les détails",
            description:
              "Montant, méthode de paiement, date, référence, description",
            action: "Remplir tous les champs obligatoires (*)",
          },
          {
            step: 5,
            title: "Validation",
            description:
              "Le système vérifie que le montant ne dépasse pas le solde disponible",
            action: "Cliquer sur 'Enregistrer le paiement'",
          },
        ],
        targetRole: ["Admin", "Comptable"],
        importance: "high",
      },
      {
        id: "edit-payment",
        title: "Modifier un paiement existant",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder à l'historique",
            description:
              "Cliquez sur l'icône historique (📜) à côté de l'étudiant",
            action: "Cliquer sur l'icône 📜 dans la liste",
          },
          {
            step: 2,
            title: "Ouvrir le menu d'actions",
            description: "Cliquez sur les trois points (⋮) dans la ligne",
            image: "/help-screenshots/payments/payment-actions.jpg",
          },
          {
            step: 3,
            title: "Sélectionner 'Modifier'",
            description: "Dans le menu déroulant",
            action: "Cliquer sur 'Modifier'",
          },
          {
            step: 4,
            title: "Limite temporelle",
            description: "Modification possible seulement dans les 30 jours",
          },
        ],
        targetRole: ["Admin", "Comptable"],
        importance: "medium",
      },
      {
        id: "delete-payment",
        title: "Supprimer un paiement",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Ouvrir l'historique",
            description: "Via l'icône historique (📜)",
            action: "Cliquer sur l'icône 📜",
          },
          {
            step: 2,
            title: "Menu actions",
            description: "Cliquez sur ⋮ puis 'Supprimer'",
            image: "/help-screenshots/payments/delete-payment.jpg",
          },
          {
            step: 3,
            title: "Confirmation",
            description: "Une fenêtre de confirmation s'affiche",
            action: "Cliquer sur 'Supprimer définitivement'",
          },
          {
            step: 4,
            title: "Limite temporelle",
            description: "Suppression possible seulement dans les 7 jours",
          },
        ],
        targetRole: ["Admin"],
        importance: "medium",
      },
      {
        id: "payment-history",
        title: "Consulter l'historique des paiements",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder à l'historique",
            description: "Via l'icône 📜 à côté de chaque étudiant",
            action: "Cliquer sur l'icône historique",
          },
          {
            step: 2,
            title: "Filtres d'historique",
            description: "Filtrer par période, méthode de paiement, montant",
            image: "/help-screenshots/payments/history-filters.jpg",
          },
          {
            step: 3,
            title: "Export de l'historique",
            description: "Exporter l'historique en Excel ou PDF",
            action: "Cliquer sur 'Exporter' en bas de la fenêtre",
          },
        ],
        targetRole: ["Admin", "Directeur", "Comptable"],
        importance: "medium",
      },
      {
        id: "payment-methods",
        title: "Méthodes de paiement disponibles",
        type: "steps",
        content: `💵 Espèces : Paiement en liquide au secrétariat
       
       💳 Carte : Paiement par carte bancaire
       
       🏦 Virement : Transfert bancaire (référence obligatoire)
       
       📄 Chèque : Chèque bancaire (numéro de chèque)
       
       📲 Mobile Money : Paiement mobile (à venir)`,
        targetRole: ["Admin", "Comptable"],
        importance: "medium",
      },
      {
        id: "payment-validation",
        title: "Validation des paiements",
        type: "steps",
        content: `Vérifications automatiques :
       
       1. Montant ne doit pas dépasser le solde disponible
       
       2. Date ne peut pas être dans le futur
       
       3. Montant minimum : 10 HTG
       
       4. Montant maximum : 10,000,000 HTG
       
       5. Référence unique pour les virements
       
       6. Description obligatoire`,
        targetRole: ["Admin", "Comptable"],
        importance: "high",
      },
      {
        id: "payment-reports",
        title: "Rapports et statistiques",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Statistiques journalières",
            description: "Voir le total des paiements par jour dans les cartes",
            action: "Regarder les cartes en haut de la page",
          },
          {
            step: 2,
            title: "Export complet",
            description: "Exporter tous les paiements avec tous les détails",
            image: "/help-screenshots/payments/export-reports.jpg",
          },
          {
            step: 3,
            title: "Rapport par méthode",
            description: "Voir la répartition des paiements par méthode",
            action: "Filtrer par méthode de paiement",
          },
        ],
        targetRole: ["Admin", "Directeur", "Comptable"],
        importance: "medium",
      },
    ],
    quickActions: [
      {
        id: "quick-add-payment",
        label: "Nouveau paiement",
        description: "Enregistrer un nouveau paiement",
        icon: "CreditCard",
        path: "/paiements/nouveau",
      },
      {
        id: "view-overdue",
        label: "Voir retards",
        description: "Afficher les paiements en retard",
        icon: "AlertTriangle",
        path: "#",
        shortcut: "Ctrl+R",
      },
      {
        id: "export-all-payments",
        label: "Exporter tout",
        description: "Exporter tous les paiements",
        icon: "Download",
        path: "/paiements/export",
      },
    ],
    commonIssues: [
      {
        id: "issue-payment-001",
        problem: "Montant dépasse le solde disponible",
        solution: "Réduire le montant ou vérifier le solde",
        fixSteps: [
          "Cliquer sur 'Information' pour voir le solde disponible",
          "Ajuster le montant pour qu'il soit ≤ solde",
          "Si nécessaire, faire plusieurs paiements",
        ],
        preventTips: [
          "Toujours vérifier le solde avant d'enregistrer",
          "Utiliser le montant suggéré par le système",
        ],
      },
      {
        id: "issue-payment-002",
        problem: "Date de paiement dans le futur",
        solution: "Utiliser la date d'aujourd'hui ou une date passée",
        fixSteps: [
          "Cliquer sur le champ date",
          "Choisir une date valide (pas dans le futur)",
          "La date maximale est aujourd'hui",
        ],
        preventTips: [
          "Utiliser le sélecteur de date plutôt que taper manuellement",
          "Vérifier le calendrier système",
        ],
      },
      {
        id: "issue-payment-003",
        problem: "Paiement déjà enregistré (doublon)",
        solution: "Vérifier l'historique avant d'ajouter",
        fixSteps: [
          "Consulter l'historique de l'étudiant",
          "Rechercher par date et montant",
          "Si doublon, supprimer le paiement erroné",
        ],
        preventTips: [
          "Toujours vérifier l'historique avant d'ajouter",
          "Utiliser des références uniques pour les virements",
        ],
      },
      {
        id: "issue-payment-004",
        problem: "Impossible de modifier/supprimer un ancien paiement",
        solution: "Les paiements sont verrouillés après certaines périodes",
        fixSteps: [
          "Modification : maximum 30 jours après la date",
          "Suppression : maximum 7 jours après la date",
          "Contacter l'administrateur pour les corrections",
        ],
        preventTips: [
          "Vérifier immédiatement après l'enregistrement",
          "Former les utilisateurs à bien saisir du premier coup",
        ],
      },
    ],
  },
];

export const professeurHelpSections: HelpSection[] = [
  {
    id: "grades",
    title: "Gestion des Notes Académiques",
    description: "Saisie, validation et publication des notes par matière",
    icon: "GraduationCap",
    color: "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800",
    permissions: [PERMISSIONS.VIEW_GRADES, PERMISSIONS.MANAGE_GRADES],
    content: [
      {
        id: "grade-manager-overview",
        title: "Interface de gestion des notes",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder au module notes",
            description: "'Gestion des Notes'",
            action: "Naviguer vers Gestion des Notes",
          },
          {
            step: 2,
            title: "Comprendre l'interface",
            description:
              "Deux modes disponibles : Professeur (soumission) et Administrateur (validation)",
            image: "/help-screenshots/grades/page.jpg",
          },
          {
            step: 3,
            title: "Vue par défaut",
            description:
              "Filtrage par année académique, niveau, matière et type de contrôle",
            action: "Utiliser les filtres en haut de page",
          },
        ],
        targetRole: ["Admin", "Professeur", "Directeur"],
        importance: "high",
      },
      {
        id: "grade-filters-explained",
        title: "Comprendre les filtres",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Année académique",
            description:
              "Sélectionnez l'année pour laquelle vous souhaitez gérer les notes",
          },
          {
            step: 2,
            title: "Niveau",
            description: "7ème A.F à Terminale (système haïtien)",
          },
          {
            step: 3,
            title: "Matière",
            description:
              "Filtrée selon vos affectations (professeur) ou toutes les matières (admin)",
          },
          {
            step: 4,
            title: "Type de contrôle",
            description: "Contrôle 1 à 4, Examen, Devoir - ou tous les types",
          },
          {
            step: 5,
            title: "Recherche",
            description:
              "Recherche rapide d'étudiant par nom, prénom ou matricule",
          },
        ],
        targetRole: ["Admin", "Professeur"],
        importance: "high",
      },
      {
        id: "teacher-grade-entry",
        title: "Saisie des notes (Mode Professeur)",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Configuration initiale",
            description:
              "Sélectionnez année, niveau et matière que vous enseignez",
            image: "/help-screenshots/grades/page.jpg",
          },
          {
            step: 2,
            title: "Mode brouillon vs soumission",
            description:
              "Brouillon : sauvegarde locale / Soumission : envoi à l'admin",
            action: "Choisir dans le modal d'édition",
          },
          {
            step: 3,
            title: "Ajouter une note individuelle",
            description: "Cliquez sur l'icône 'Modifier' à côté d'un étudiant",
            action: "Cliquer sur l'icône ✏️",
          },
          {
            step: 4,
            title: "Remplir le formulaire",
            description:
              "Note (max selon matière), type contrôle, remarques optionnelles",
            image: "/help-screenshots/grades/forms/add-form.jpg",
          },
          {
            step: 5,
            title: "Sauvegarder",
            description:
              "Choisir 'Brouillon' (enregistrement local) ou 'Soumettre' (validation admin)",
            action: "Cliquer sur le bouton approprié",
          },
        ],
        targetRole: ["Professeur"],
        importance: "high",
      },
      {
        id: "bulk-grade-entry",
        title: "Saisie en masse des notes",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Activer le mode édition en masse",
            description: "Cliquez sur 'Édition en masse' en haut de la liste",
            action: "Cliquer sur 'Édition en masse'",
          },
          {
            step: 2,
            title: "Sélectionner les étudiants",
            description: "Cochez les cases ou 'Tout sélectionner'",
            image: "/help-screenshots/grades/bulk-select.jpg",
          },
          {
            step: 3,
            title: "Appliquer une note commune",
            description:
              "Entrez la note dans le champ dédié et cliquez sur 'Appliquer'",
            action: "Entrer la note et cliquer Appliquer",
          },
          {
            step: 4,
            title: "Ajustements individuels",
            description:
              "Modifiez les notes spécifiques directement dans les champs",
            image: "/help-screenshots/grades/bulk-adjust.jpg",
          },
          {
            step: 5,
            title: "Sauvegarder en masse",
            description:
              "Cliquez sur 'Sauvegarder' pour enregistrer toutes les modifications",
            action: "Cliquer sur Sauvegarder",
          },
        ],
        targetRole: ["Professeur"],
        importance: "medium",
      },
      {
        id: "admin-grade-validation",
        title: "Validation des notes (Mode Administrateur)",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Accéder aux notes soumises",
            description:
              "Les notes soumises par les professeurs apparaissent automatiquement",
            image: "/help-screenshots/grades/pending-approval.jpg",
          },
          {
            step: 2,
            title: "Vérifier une note",
            description:
              "Cliquez sur l'icône 'œil' pour voir les détails complets",
            action: "Cliquer sur 👁️",
          },
          {
            step: 3,
            title: "Approuver une note",
            description:
              "Cliquez sur 'Approuver' (pouce vers le haut) si la note est correcte",
            action: "Cliquer sur 👍",
          },
          {
            step: 4,
            title: "Rejeter une note",
            description:
              "Cliquez sur 'Rejeter' (pouce vers le bas) et saisissez la raison",
            image: "/help-screenshots/grades/reject-reason.jpg",
          },
          {
            step: 5,
            title: "Publier aux étudiants",
            description:
              "Une fois validées, les notes sont automatiquement publiées",
            action: "Vérifier le statut 'Publié'",
          },
        ],
        targetRole: ["Admin", "Directeur"],
        importance: "high",
      },
      {
        id: "grade-workflow",
        title: "Workflow de validation des notes",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Étape 1 : Saisie",
            description:
              "Professeur saisit la note en mode brouillon ou soumission",
          },
          {
            step: 2,
            title: "Étape 2 : Soumission",
            description: "Note soumise à l'administrateur pour validation",
          },
          {
            step: 3,
            title: "Étape 3 : Validation",
            description: "Admin approuve ou rejette avec commentaires",
          },
          {
            step: 4,
            title: "Étape 4 : Publication",
            description: "Note validée visible par l'étudiant et les parents",
          },
          {
            step: 5,
            title: "Étape 5 : Archivage",
            description: "Notes archivées en fin d'année pour conservation",
          },
        ],
        targetRole: ["Admin", "Professeur", "Directeur"],
        importance: "medium",
      },
      {
        id: "grade-statuses",
        title: "Statuts des notes",
        type: "text",
        content: `**Brouillon** (🗒️)
      Note saisie mais non soumise - visible uniquement par le professeur
      
      **Soumis** (📤)
      Note envoyée à l'admin pour validation - en attente
      
      **Approuvé** (✅)
      Note validée par l'admin - prête pour publication
      
      **Publié** (🌐)
      Note visible par l'étudiant et les parents
      
      **Rejeté** (❌)
      Note refusée par l'admin - retour au professeur`,
        targetRole: ["Admin", "Professeur"],
        importance: "medium",
      },
      {
        id: "grade-import-export",
        title: "Import et Export des notes",
        type: "steps",
        content: [
          {
            step: 1,
            title: "Exporter vers Excel",
            description:
              "Cliquez sur 'Exporter' pour télécharger toutes les notes",
            action: "Cliquer sur 📥 Exporter",
          },
          {
            step: 2,
            title: "Format d'export",
            description:
              "Fichier Excel avec colonnes : Étudiant, Matricule, Note, Statut, Type contrôle",
            image: "/help-screenshots/grades/export-format.jpg",
          },
          {
            step: 3,
            title: "Importer depuis Excel",
            description: "Préparer un fichier Excel selon le format template",
            action: "Télécharger le template d'import",
          },
          {
            step: 4,
            title: "Vérification des données",
            description:
              "Le système valide les matricules et les notes avant import",
            image: "/help-screenshots/grades/import-validation.jpg",
          },
          {
            step: 5,
            title: "Import en masse",
            description:
              "Utilisez l'import pour saisir rapidement de nombreuses notes",
            action: "Cliquer sur Importer et sélectionner le fichier",
          },
        ],
        targetRole: ["Admin", "Professeur"],
        importance: "medium",
      },
      {
        id: "grade-statistics",
        title: "Statistiques et indicateurs",
        type: "text",
        content: `**Moyenne générale**
      Moyenne de toutes les notes pour la matière sélectionnée
      
      **Taux de réussite**
      Pourcentage d'étudiants ayant validé la matière
      
      **Notes validées**
      Nombre de notes approuvées par l'administrateur
      
      **En attente**
      Notes soumises mais non encore validées
      
      **Étudiants sans note**
      Étudiants n'ayant pas encore de note pour cette matière`,
        targetRole: ["Admin", "Professeur", "Directeur"],
        importance: "medium",
      },
      {
        id: "grade-validation-rules",
        title: "Règles de validation des notes",
        type: "text",
        content: `**Note maximale**
      Définie par matière (généralement 20, 40 ou 100 points)
      
      **Seuil de validation**
      Note minimale requise pour valider (généralement 50%)
      
      **Format numérique**
      Les notes doivent être des nombres (décimaux acceptés)
      
      **Période de saisie**
      Les notes doivent être saisies dans les délais académiques
      
      **Contrôle des doublons**
      Un étudiant ne peut avoir qu'une note par type de contrôle et par matière`,
        targetRole: ["Admin", "Professeur"],
        importance: "high",
      },
    ],
    quickActions: [
      {
        id: "quick-bulk-edit",
        label: "Édition en masse",
        description: "Saisir des notes pour plusieurs étudiants",
        icon: "Edit",
        path: "#",
        shortcut: "Ctrl+E",
      },
      {
        id: "export-grades",
        label: "Exporter Excel",
        description: "Exporter toutes les notes",
        icon: "Download",
        path: "#",
        shortcut: "Ctrl+Shift+E",
      },
      {
        id: "view-pending",
        label: "Voir en attente",
        description: "Notes soumises à validation",
        icon: "Clock",
        path: "#",
        shortcut: "Ctrl+P",
      },
    ],
    commonIssues: [
      {
        id: "issue-grade-001",
        problem: "Note refusée par le système (trop élevée)",
        solution: "La note dépasse la note maximale définie pour la matière",
        fixSteps: [
          "Vérifier la note maximale dans les détails de la matière",
          "Adapter la note pour respecter la limite",
          "Contacter l'admin si la limite semble incorrecte",
        ],
        preventTips: [
          "Consulter les paramètres de la matière avant saisie",
          "Utiliser l'aperçu de note dans le formulaire",
        ],
      },
      {
        id: "issue-grade-002",
        problem: "Étudiant non visible dans la liste",
        solution:
          "L'étudiant n'est pas inscrit dans la classe ou le niveau sélectionné",
        fixSteps: [
          "Vérifier les filtres année académique et niveau",
          "Confirmer l'inscription de l'étudiant",
          "Vérifier que l'étudiant est actif (non désinscrit)",
        ],
        preventTips: [
          "Mettre à jour les inscriptions avant la saisie des notes",
          "Vérifier le statut des étudiants régulièrement",
        ],
      },
      {
        id: "issue-grade-003",
        problem: "Impossible de modifier une note soumise",
        solution:
          "Une fois soumise, seule l'admin peut modifier ou rejeter la note",
        fixSteps: [
          "Si vous êtes professeur, demander à l'admin de rejeter la note",
          "Si vous êtes admin, rejeter la note avec une raison",
          "Le professeur pourra alors la modifier et la resoumettre",
        ],
        preventTips: [
          "Utiliser le mode brouillon pour les saisies provisoires",
          "Vérifier attentivement avant soumission",
        ],
      },
      {
        id: "issue-grade-004",
        problem: "Type de contrôle verrouillé",
        solution: "Un filtre de type de contrôle est actif",
        fixSteps: [
          "Vérifier le filtre 'Type de contrôle' en haut de page",
          "Le changer en 'Tous les contrôles' pour déverrouiller",
          "Ou sélectionner un autre type de contrôle",
        ],
        preventTips: [
          "Faire attention aux filtres actifs",
          "Consulter l'indicateur de filtre actif",
        ],
      },
      {
        id: "issue-grade-005",
        problem: "Import Excel échoue",
        solution: "Format de fichier incorrect ou données invalides",
        fixSteps: [
          "Télécharger le template officiel",
          "Vérifier les colonnes obligatoires",
          "S'assurer que les matricules existent dans le système",
          "Vérifier les formats de notes numériques",
        ],
        preventTips: [
          "Toujours utiliser le template officiel",
          "Valider les données avant import",
          "Faire des imports de test sur un petit échantillon",
        ],
      },
    ],
  },
];

// ==================== FONCTIONS D'ACCÈS ====================
export const getHelpSectionsByRole = (role: UserRole): HelpSection[] => {
  switch (role) {
    case "Admin":
      return adminHelpSections;
    case "Secretaire":
      return secretaireHelpSections;
    case "Comptable":
      return parentHelpSections;
    case "Professeur":
      return professeurHelpSections;
    case "Directeur":
      return adminHelpSections.filter(
        (section) => !["audit-logs", "users"].includes(section.id)
      );
    default:
      return [];
  }
};

export const getSectionById = (
  id: ActiveTab,
  role: UserRole
): HelpSection | undefined => {
  return getHelpSectionsByRole(role).find((section) => section.id === id);
};

export const getAllFAQs = (): FAQItem[] => {
  return generalFAQs;
};

export const getFAQsBySection = (sectionId: ActiveTab): FAQItem[] => {
  return generalFAQs.filter((faq) => faq.relatedTo?.includes(sectionId));
};

export const getVideosByCategory = (category: string): VideoResource[] => {
  return tutorialVideos.filter((video) => video.category === category);
};

export const searchHelpContent = (query: string, role: UserRole): any[] => {
  const sections = getHelpSectionsByRole(role);
  const results = [];

  // Recherche dans les sections
  sections.forEach((section) => {
    if (
      section.title.toLowerCase().includes(query.toLowerCase()) ||
      section.description.toLowerCase().includes(query.toLowerCase())
    ) {
      results.push({
        type: "section",
        data: section,
        score: 2,
      });
    }

    // Recherche dans le contenu des sections
    section.content?.forEach((content) => {
      if (content.title.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: "content",
          data: content,
          section: section,
          score: 1,
        });
      }
    });
  });

  // Recherche dans les FAQs
  generalFAQs.forEach((faq) => {
    if (
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase())
    ) {
      results.push({
        type: "faq",
        data: faq,
        score: 1,
      });
    }
  });

  // Tri par score
  return results.sort((a, b) => b.score - a.score);
};
