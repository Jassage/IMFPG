// src/components/help/WorkflowGuide.tsx
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Share2,
  Bookmark,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Clock,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Home,
} from "lucide-react";
import { HelpImage } from "./HelpImage";

import { cn } from "@/lib/utils";
import { IMFPProgressIndicator, IMFPRoleBadge } from "./IMFPStyledComponents";

interface WorkflowStep {
  id: string;
  step: number;
  title: string;
  description: string;
  actions?: string[];
  image?: string;
  imageCaption?: string;
  role?: string;
  tips?: string[];
  warnings?: string[];
}

interface WorkflowIssue {
  id: string;
  problem: string;
  solution: string;
  fixSteps: string[];
  preventTips?: string[];
}

interface WorkflowGuideProps {
  workflow: {
    id: string;
    title: string;
    description: string;
    category: string;
    roles: string[];
    difficulty: "easy" | "medium" | "hard";
    estimatedTime: string;
    prerequisites: string[];
    steps: WorkflowStep[];
    commonIssues?: WorkflowIssue[];
    successTips?: string[];
  };
}

export const WorkflowGuide: React.FC<WorkflowGuideProps> = ({ workflow }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showIssues, setShowIssues] = useState(false);

  const currentStepData = workflow.steps.find(
    (step) => step.step === currentStep
  );
  const totalSteps = workflow.steps.length;

  const helpImageProps: any =
    currentStepData && currentStepData.image
      ? {
          src: currentStepData.image,
          alt: `Étape ${currentStepData.step}: ${currentStepData.title}`,
          caption: currentStepData.imageCaption,
          role: currentStepData.role as any,
          bordered: true,
          zoomable: true,
        }
      : null;
  const categoryIcons = {
    Admission: Users,
    Académique: FileText,
    Documents: FileText,
    Financier: DollarSign,
    Organisation: Calendar,
    Communication: Share2,
  };

  const difficultyConfig = {
    easy: { color: "text-green-600", bg: "bg-green-100", label: "Facile" },
    medium: { color: "text-amber-600", bg: "bg-amber-100", label: "Moyen" },
    hard: { color: "text-red-600", bg: "bg-red-100", label: "Difficile" },
  };

  const CategoryIcon =
    categoryIcons[workflow.category as keyof typeof categoryIcons] || Home;
  const diff = difficultyConfig[workflow.difficulty];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setIsCompleted(false);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    setIsCompleted(false);
  };

  const downloadGuide = () => {
    // Logique de téléchargement PDF
    console.log("Téléchargement du guide:", workflow.title);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* En-tête du workflow */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <CategoryIcon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                  {workflow.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-1">
                  {workflow.title}
                </h1>
              </div>
            </div>

            <p className="text-lg text-gray-600 max-w-3xl">
              {workflow.description}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={downloadGuide}
              className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Télécharger le guide"
            >
              <Download className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Imprimer"
            >
              <Printer className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => {
                /* Share logic */
              }}
              className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Partager"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Métadonnées */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {workflow.estimatedTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                diff.bg,
                diff.color
              )}
            >
              {diff.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{totalSteps} étapes</span>
          </div>

          <div className="flex items-center gap-2">
            {workflow.roles.map((role, idx) => (
              <IMFPRoleBadge key={idx} role={role as any} size="sm" />
            ))}
          </div>
        </div>

        {/* Prérequis */}
        {workflow.prerequisites.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800">Prérequis</h3>
            </div>
            <ul className="space-y-1">
              {workflow.prerequisites.map((prereq, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-amber-700"
                >
                  <span className="mt-1">•</span>
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Indicateur de progression */}
      <div className="mb-8">
        <IMFPProgressIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={workflow.steps.map((step) => ({
            title: step.title,
            description: step.description,
          }))}
        />
      </div>

      {/* Contenu de l'étape courante */}
      {currentStepData && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Étape {currentStepData.step} : {currentStepData.title}
              </h2>
              <p className="text-gray-600 mt-2">
                {currentStepData.description}
              </p>
            </div>

            {currentStepData.role && (
              <IMFPRoleBadge role={currentStepData.role as any} />
            )}
          </div>

          {/* Actions */}
          {currentStepData.actions && currentStepData.actions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Actions à effectuer
              </h3>
              <ul className="space-y-2">
                {currentStepData.actions.map((action, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Image */}
          {/* Image */}
          {helpImageProps && (
            <div className="mb-6">
              <HelpImage {...helpImageProps} />
            </div>
          )}
          {/* Conseils et avertissements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStepData.tips && currentStepData.tips.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Conseils</h3>
                </div>
                <ul className="space-y-1">
                  {currentStepData.tips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-green-700">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentStepData.warnings &&
              currentStepData.warnings.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-800">Attention</h3>
                  </div>
                  <ul className="space-y-1">
                    {currentStepData.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-red-700">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
            currentStep === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Étape précédente
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowIssues(!showIssues)}
            className="px-4 py-2 text-sm bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg transition-colors"
          >
            {showIssues
              ? "Masquer les problèmes"
              : "Voir les problèmes courants"}
          </button>

          <button
            onClick={handleNext}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors",
              isCompleted
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90"
            )}
          >
            {currentStep === totalSteps
              ? isCompleted
                ? "Guide terminé ✓"
                : "Terminer le guide"
              : "Étape suivante"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Problèmes courants */}
      {showIssues &&
        workflow.commonIssues &&
        workflow.commonIssues.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Problèmes courants et solutions
            </h3>
            <div className="space-y-4">
              {workflow.commonIssues.map((issue, idx) => (
                <div key={idx} className="border rounded-lg overflow-hidden">
                  <div className="bg-red-50 px-4 py-3 border-b">
                    <h4 className="font-semibold text-red-800">
                      {issue.problem}
                    </h4>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700 mb-3">
                      <strong>Solution :</strong> {issue.solution}
                    </p>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Étapes de résolution :
                      </p>
                      <ol className="space-y-1 pl-4">
                        {issue.fixSteps.map((step, stepIdx) => (
                          <li key={stepIdx} className="text-sm text-gray-600">
                            {stepIdx + 1}. {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {issue.preventTips && issue.preventTips.length > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-700 mb-1">
                          Pour éviter ce problème :
                        </p>
                        <ul className="space-y-1">
                          {issue.preventTips.map((tip, tipIdx) => (
                            <li key={tipIdx} className="text-sm text-green-600">
                              • {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Conseils de réussite */}
      {isCompleted &&
        workflow.successTips &&
        workflow.successTips.length > 0 && (
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Félicitations ! Vous avez terminé le guide
                </h3>
                <p className="text-gray-600">
                  Voici quelques conseils pour assurer le succès de cette
                  opération :
                </p>
              </div>
            </div>

            <ul className="space-y-3">
              {workflow.successTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-white border border-green-300 text-green-600 flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
};
