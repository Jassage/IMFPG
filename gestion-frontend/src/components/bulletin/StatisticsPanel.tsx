import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  BookOpen,
  Calculator,
  Percent,
  Minus,
  Plus,
  Hash,
} from "lucide-react";
import { BulletinStatistics } from "@/types/bulletin";
import { ControlType } from "@/types/bulletin";

interface StatisticsPanelProps {
  statistics: BulletinStatistics;
  controlType?: ControlType | string;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  statistics,
  controlType,
}) => {
  const getDecision = (
    average: number
  ): {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ReactNode;
    description: string;
  } => {
    if (average >= 10) {
      return {
        label: "ADMIS",
        color: "text-green-800",
        bgColor: "bg-green-50 border-green-200",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        description: "Admis en classe supérieure",
      };
    } else if (average >= 8) {
      return {
        label: "À REFAIRE",
        color: "text-yellow-800",
        bgColor: "bg-yellow-50 border-yellow-200",
        icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
        description: "À refaire dans la même école",
      };
    } else {
      return {
        label: "À REFAIRE AILLEURS",
        color: "text-red-800",
        bgColor: "bg-red-50 border-red-200",
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        description: "À refaire dans une autre école",
      };
    }
  };

  const getControlLabel = (type?: ControlType | string): string => {
    if (!type) return "Général";

    switch (type) {
      case ControlType.CONTROLE_1:
        return "1er Trimestre";
      case ControlType.CONTROLE_2:
        return "2ème Trimestre";
      case ControlType.CONTROLE_3:
        return "3ème Trimestre";
      case ControlType.CONTROLE_4:
        return "Examen Final";
      default:
        return "Général";
    }
  };

  const getMention = (note: number): string => {
    if (note >= 16) return "Très Bien";
    if (note >= 14) return "Bien";
    if (note >= 12) return "Assez Bien";
    if (note >= 10) return "Passable";
    return "Insuffisant";
  };

  const getMentionColor = (note: number): string => {
    if (note >= 16) return "text-purple-600 bg-purple-50";
    if (note >= 14) return "text-blue-600 bg-blue-50";
    if (note >= 12) return "text-green-600 bg-green-50";
    if (note >= 10) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const decision = getDecision(statistics.weightedAverage);
  const controlLabel = getControlLabel(controlType);
  const mention = getMention(statistics.weightedAverage);
  const mentionColor = getMentionColor(statistics.weightedAverage);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {/* Carte 1: Base et Structure */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${mentionColor}`}>
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                BASE
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Base de notation
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  20
                </span>
                <span className="text-sm text-gray-500">/20</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Période:</span>
                  <span className="font-medium">{controlLabel}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Matières:</span>
                  <span className="font-medium">
                    {statistics.totalSubjects || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Mention:</span>
                  <span
                    className={`font-medium px-2 py-0.5 rounded ${mentionColor}`}
                  >
                    {mention}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte 2: Moyenne Générale */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                MOYENNE
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Moyenne {controlLabel}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {statistics.weightedAverage.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">/20</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  style={{
                    width: `${Math.min(
                      100,
                      (statistics.weightedAverage / 20) * 100
                    )}%`,
                  }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-1 text-sm">
                  <Minus className="h-3 w-3 text-red-500" />
                  <span className="text-gray-600">Min:</span>
                  <span className="font-medium text-gray-900 ml-auto">
                    {statistics.minGrade?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Plus className="h-3 w-3 text-green-500" />
                  <span className="text-gray-600">Max:</span>
                  <span className="font-medium text-gray-900 ml-auto">
                    {statistics.maxGrade?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte 3: Taux de Réussite */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
                RÉUSSITE
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Taux de réussite
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {statistics.successRate.toFixed(1)}
                </span>
                <Percent className="h-4 w-4 text-gray-500" />
              </div>

              <div
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium mb-3 ${
                  statistics.successRate >= 60
                    ? "bg-green-100 text-green-800"
                    : statistics.successRate >= 40
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {statistics.successRate >= 60
                  ? "Excellent"
                  : statistics.successRate >= 40
                  ? "Satisfaisant"
                  : "À améliorer"}
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Validées:</span>
                  </div>
                  <span className="font-medium text-green-700">
                    {statistics.passingSubjects || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-sm text-gray-600">Total:</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {statistics.totalSubjects || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte 4: Coefficients */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Calculator className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-600">
                COEFFS
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Coefficients totaux
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-5 w-5 text-gray-400" />
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {statistics.totalCoefficient}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Points totaux:</span>
                  <span className="font-medium text-gray-900">
                    {(
                      statistics.weightedAverage * statistics.totalCoefficient
                    ).toFixed(1)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  Moyenne × Coefficients
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
                <Award className="h-4 w-4" />
                <span>Moyenne pondérée</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte 5: Décision */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-orange-50">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-600">
                DÉCISION
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Décision finale
              </h3>

              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${decision.bgColor} border mb-3`}
              >
                {decision.icon}
                <span className={`font-bold text-lg ${decision.color}`}>
                  {decision.label}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {decision.description}
              </p>

              <div className="mt-auto">
                <div className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1">
                  <div className="flex items-center justify-between">
                    <span>Basé sur la moyenne générale</span>
                    <span className="font-medium">
                      {statistics.weightedAverage.toFixed(2)}/20
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
