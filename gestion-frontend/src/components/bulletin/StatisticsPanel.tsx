import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, Award, TrendingUp } from "lucide-react";
import { BulletinStatistics } from "@/types/bulletin";

interface StatisticsPanelProps {
  statistics: BulletinStatistics;
  controlType?: string;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  statistics,
  controlType,
}) => {
  const getMention = (average: number): string => {
    if (average >= 16) return "Très Bien";
    if (average >= 14) return "Bien";
    if (average >= 12) return "Assez Bien";
    if (average >= 10) return "Passable";
    return "Insuffisant";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Moyenne générale */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">
                Moyenne générale
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {statistics.weightedAverage.toFixed(2)}/20
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {getMention(statistics.weightedAverage)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-200">
              <BarChart3 className="h-6 w-6 text-blue-700" />
            </div>
          </div>
          <Progress
            value={(statistics.weightedAverage / 20) * 100}
            className="h-2 mt-4 bg-blue-200"
          />
        </CardContent>
      </Card>

      {/* Taux de réussite */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">
                Taux de réussite
              </p>
              <p className="text-3xl font-bold text-green-900">
                {statistics.successRate.toFixed(1)}%
              </p>
              <p className="text-sm text-green-700 mt-1">
                {statistics.totalCoefficient} coefficients
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-200">
              <Target className="h-6 w-6 text-green-700" />
            </div>
          </div>
          <Progress
            value={statistics.successRate}
            className="h-2 mt-4 bg-green-200"
          />
        </CardContent>
      </Card>

      {/* Notes extrêmes */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">
                Notes extrêmes
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-sm text-purple-600">Min</p>
                  <p className="text-xl font-bold text-purple-900">
                    {statistics.minGrade?.toFixed(2) || "0.00"}/20
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-600">Max</p>
                  <p className="text-xl font-bold text-purple-900">
                    {statistics.maxGrade?.toFixed(2) || "0.00"}/20
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-full bg-purple-200">
              <TrendingUp className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statut */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Statut</p>
              <div className="mt-2">
                <Badge
                  variant={
                    statistics.weightedAverage >= 10 ? "default" : "destructive"
                  }
                  className="text-lg px-3 py-1"
                >
                  {statistics.weightedAverage >= 10 ? "Admis" : "Non admis"}
                </Badge>
              </div>
              {controlType && (
                <p className="text-sm text-orange-600 mt-2">
                  Période: {controlType}
                </p>
              )}
            </div>
            <div className="p-3 rounded-full bg-orange-200">
              <Award className="h-6 w-6 text-orange-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
