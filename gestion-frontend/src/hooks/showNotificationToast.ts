import { toast } from "react-toastify";

// Fonction helper pour afficher les toasts (ajoutez-la en dehors du store)
const showNotificationToast = (notification: Notification) => {
  const toastConfig: any = {
    description: notification.message,
    duration: 8000,
  };

  switch (notification.type) {
    case "GRADE_APPROVED":
      toast.success(notification.title, {
        ...toastConfig,
        action: {
          label: "Voir",
          onClick: () => handleNotificationClick(notification),
        },
      });
      break;

    case "GRADE_SUBMITTED":
      toast.info(notification.title, {
        ...toastConfig,
        duration: 10000,
        action: {
          label: "Vérifier",
          onClick: () => handleNotificationClick(notification),
        },
      });
      break;

    case "GRADE_REJECTED":
      toast.error(notification.title, {
        ...toastConfig,
        duration: 10000,
        action: {
          label: "Corriger",
          onClick: () => handleNotificationClick(notification),
        },
      });
      break;

    case "BULK_GRADES_SUBMITTED":
      toast.warning(notification.title, {
        ...toastConfig,
        action: {
          label: "Vérifier",
          onClick: () => handleNotificationClick(notification),
        },
      });
      break;
  }
};

const handleNotificationClick = (notification: Notification) => {
  switch (notification.type) {
    case "GRADE_SUBMITTED":
    case "BULK_GRADES_SUBMITTED":
      // Rediriger vers les notes en attente
      if (typeof window !== "undefined") {
        window.open("/admin/grades?filter=submitted", "_blank");
      }
      break;

    case "GRADE_REJECTED":
      // Rediriger vers les notes rejetées
      if (typeof window !== "undefined") {
        window.open("/professor/grades?filter=rejected", "_blank");
      }
      break;

    case "GRADE_APPROVED":
      // Rediriger vers les notes approuvées
      if (typeof window !== "undefined") {
        window.open("/professor/grades?filter=approved", "_blank");
      }
      break;
  }
};
