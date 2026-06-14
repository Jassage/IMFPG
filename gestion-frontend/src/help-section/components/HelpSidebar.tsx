import React from "react";
import { ChevronRight, Star, Lock } from "lucide-react";
// import { useHelp } from "@/context/HelpContext";
import { HelpSection } from "@/types/help.types";
import { ICONS } from "@/config/roleConfig";
import { useHelp } from "../context/HelpContext";

interface HelpSidebarProps {
  sections: HelpSection[];
}

export const HelpSidebar: React.FC<HelpSidebarProps> = ({ sections }) => {
  const { activeSection, setActiveSection, userRole } = useHelp();

  // Grouper par catégorie (comme dans roleConfig)
  const mainSections = sections.filter((s) =>
    ["dashboard", "students", "enrollments", "professeurs"].includes(s.id)
  );

  const academicSections = sections.filter((s) =>
    ["subject", "grades", "schedule", "class_assignment", "attendance"].includes(s.id)
  );

  const documentSections = sections.filter((s) =>
    ["transcripts", "reports"].includes(s.id)
  );

  const adminSections = sections.filter((s) =>
    [
      "users",
      "classes",
      "fees",
      "payments",
      "events",
      "announcements",
      "audit-logs",
    ].includes(s.id)
  );

  const renderSectionGroup = (title: string, groupSections: HelpSection[]) => {
    if (groupSections.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
          {title}
        </h3>
        <div className="space-y-1">
          {groupSections.map((section) => {
            const IconComponent = ICONS[section.icon] || ICONS.Home;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? `${section.color
                        .replace("text-", "bg-")
                        .replace("800", "100")} border-l-4 border-blue-500`
                    : "hover:bg-gray-100"
                }`}
              >
                <div
                  className={`p-1.5 rounded-md ${section.color} ${
                    isActive ? "ring-2 ring-offset-1 ring-blue-300" : ""
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{section.title}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {section.description}
                  </div>
                </div>
                <ChevronRight
                  className={`h-4 w-4 text-gray-400 ${
                    isActive ? "text-blue-500" : ""
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* En-tête sidebar */}
      <div className="mb-6 px-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
            {ICONS.Home && <ICONS.Home className="h-4 w-4" />}
          </div>
          <span className="font-semibold">Navigation Aide</span>
        </div>
        <p className="text-xs text-gray-500">
          Rôle: <span className="font-medium capitalize">{userRole}</span>
        </p>
      </div>

      {/* Sections groupées */}
      <div className="space-y-1">
        {renderSectionGroup("Principal", mainSections)}
        {renderSectionGroup("Académique", academicSections)}
        {renderSectionGroup("Documents", documentSections)}
        {renderSectionGroup("Administration", adminSections)}
      </div>

      {/* Section d'apprentissage */}
      <div className="mt-8 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium">À découvrir</span>
        </div>
        <p className="text-xs text-gray-600 mb-2">
          Nouveau: Guide d'import CSV
        </p>
        <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
          Explorer →
        </button>
      </div>

      {/* Indicateur de permissions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Lock className="h-3 w-3" />
          <span>Certaines sections peuvent être restreintes</span>
        </div>
      </div>
    </div>
  );
};
