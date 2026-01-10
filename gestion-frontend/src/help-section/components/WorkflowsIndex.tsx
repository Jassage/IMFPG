// src/components/help/WorkflowsIndex.tsx
import React, { useState } from "react";
import { Search, Filter, Grid, List, BookOpen, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { getWorkflowsByCategory, IMFP_WORKFLOWS } from "./imfp-workflows";
import { IMFPWorkflowCard } from "./IMFPStyledComponents";
export const WorkflowsIndex: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const workflows = Object.values(IMFP_WORKFLOWS);

  // Extraire les catégories uniques
  const categories = Array.from(new Set(workflows.map((w) => w.category)));
  const roles = Array.from(new Set(workflows.flatMap((w) => w.roles)));
  const difficulties = ["easy", "medium", "hard"];

  // Filtrer les workflows
  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      searchTerm === "" ||
      workflow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || workflow.category === selectedCategory;
    const matchesRole =
      selectedRole === "all" || workflow.roles.includes(selectedRole);
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      workflow.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesRole && matchesDifficulty;
  });

  // Statistiques
  const stats = {
    total: workflows.length,
    byCategory: categories.reduce(
      (acc, cat) => ({
        ...acc,
        [cat]: workflows.filter((w) => w.category === cat).length,
      }),
      {}
    ),
    byDifficulty: {
      easy: workflows.filter((w) => w.difficulty === "easy").length,
      medium: workflows.filter((w) => w.difficulty === "medium").length,
      hard: workflows.filter((w) => w.difficulty === "hard").length,
    },
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Guides et Workflows
            </h1>
            <p className="text-gray-600 mt-1">
              Guides étape par étape pour toutes les procédures importantes
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-xl p-4">
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Guides disponibles</div>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.byDifficulty.easy}
            </div>
            <div className="text-sm text-gray-600">Guides faciles</div>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="text-2xl font-bold text-amber-600">
              {stats.byDifficulty.medium}
            </div>
            <div className="text-sm text-gray-600">Guides moyens</div>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="text-2xl font-bold text-red-600">
              {stats.byDifficulty.hard}
            </div>
            <div className="text-sm text-gray-600">Guides complexes</div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="mb-8 space-y-4">
        {/* Barre de recherche */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un guide (ex: 'inscription', 'notes', 'bulletins'...)"
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Filtrer par :</span>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                selectedCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Toutes catégories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Rôles */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les rôles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulté */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes difficultés</option>
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === "easy"
                    ? "Facile"
                    : diff === "medium"
                    ? "Moyen"
                    : "Complexe"}
                </option>
              ))}
            </select>
          </div>

          {/* Mode d'affichage */}
          <div className="ml-auto flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              )}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              )}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Guides disponibles ({filteredWorkflows.length})
          </h2>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedRole("all");
                setSelectedDifficulty("all");
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>

        {/* Liste des workflows */}
        {filteredWorkflows.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Aucun guide trouvé
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche ou consultez toutes
              les catégories
            </p>
          </div>
        ) : (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}
          >
            {filteredWorkflows.map((workflow) => (
              <IMFPWorkflowCard
                key={workflow.id}
                title={workflow.title}
                description={workflow.description}
                steps={workflow.steps.length}
                estimatedTime={workflow.estimatedTime}
                difficulty={workflow.difficulty as "easy" | "medium" | "hard"}
                roles={workflow.roles as any}
                onClick={() => {
                  // Navigation vers le guide détaillé
                  console.log("Ouvrir le guide:", workflow.id);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Catégories populaires */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Catégories populaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const categoryWorkflows = getWorkflowsByCategory(category);
            const iconMap = {
              Admission: "👨‍🎓",
              Académique: "📚",
              Documents: "📄",
              Financier: "💰",
              Organisation: "📅",
              Communication: "📢",
            };

            return (
              <div
                key={category}
                className="bg-white border rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                <div className="text-3xl mb-3">
                  {iconMap[category as keyof typeof iconMap] || "📁"}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category}</h3>
                <p className="text-sm text-gray-600">
                  {categoryWorkflows.length} guide
                  {categoryWorkflows.length > 1 ? "s" : ""}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
