// components/RoleBasedDashboard.tsx
import React from "react";
import { UserRole } from "@/types/navigation";
import AdminDashboard from "./dashboards/AdminDashboard";
import SecretaryDashboard from "./dashboards/SecretaryDashboard";
import ParentDashboard from "./dashboards/ParentDashboard";
import StudentDashboard from "./dashboards/StudentDashboard";
import ProfessorDashboard from "./dashboards/ProfessorDashboard";
import DirectorDashboard from "./dashboards/DirectorDashboard";

interface RoleBasedDashboardProps {
  role: UserRole;
}

export const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({
  role,
}) => {
  switch (role) {
    case "Admin":
      return <AdminDashboard />;
    case "Secretaire":
      return <SecretaryDashboard />;
    case "Parent":
      return <ParentDashboard />;
    case "Student":
      return <StudentDashboard />;
    case "Professeur":
      return <ProfessorDashboard />;
    case "Directeur":
      return <DirectorDashboard />;
    default:
      return <AdminDashboard />;
  }
};
