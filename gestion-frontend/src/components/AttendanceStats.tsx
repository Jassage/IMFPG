// src/components/attendance/AttendanceStats.tsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getRateColor, calculateStatusStats } from "@/utils/attendanceUtils";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
} from "lucide-react";

interface StatusStat {
  status: string;
  label: string;
  count: number;
  percentage: number;
}

interface AttendanceStatsProps {
  stats: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    excusedDays: number;
    sickDays: number;
    attendanceRate: number;
    punctualityRate: number;
  };
  attendances?: any[];
  title?: string;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  stats,
  attendances = [],
  title = "Statistiques de présence",
}) => {
  const rateColor = getRateColor(stats.attendanceRate);
  const punctualityColor = getRateColor(stats.punctualityRate);

  const statusStats: StatusStat[] =
    attendances.length > 0 ? (calculateStatusStats(attendances) as StatusStat[]) : [];

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    subValue,
  }: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    color?: string;
    subValue?: string;
  }) => (
    <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
      <div className={`p-2 rounded-full ${color || "bg-primary-100"}`}>
        <Icon
          className={`h-5 w-5 ${color ? "text-white" : "text-primary-700"}`}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground">{subValue}</p>
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Taux globaux */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={CheckCircle}
            label="Taux de présence"
            value={`${stats.attendanceRate}%`}
            color="bg-green-100"
          />
          <StatCard
            icon={Clock}
            label="Taux de ponctualité"
            value={`${stats.punctualityRate}%`}
            color="bg-blue-100"
          />
        </div>

        {/* Détails des jours */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Répartition des jours
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-700">Présents</p>
              <p className="text-xl font-bold text-green-700">
                {stats.presentDays}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-red-700">Absents</p>
              <p className="text-xl font-bold text-red-700">
                {stats.absentDays}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-700">Retards</p>
              <p className="text-xl font-bold text-yellow-700">
                {stats.lateDays}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">Excusés</p>
              <p className="text-xl font-bold text-blue-700">
                {stats.excusedDays}
              </p>
            </div>
          </div>
        </div>

        {/* Barres de progression */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Taux de présence</span>
              <span className={`font-medium ${rateColor}`}>
                {stats.attendanceRate}%
              </span>
            </div>
            <Progress value={stats.attendanceRate} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Taux de ponctualité</span>
              <span className={`font-medium ${punctualityColor}`}>
                {stats.punctualityRate}%
              </span>
            </div>
            <Progress value={stats.punctualityRate} className="h-2" />
          </div>
        </div>

        {/* Distribution par statut */}
        {statusStats.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Distribution par statut
            </h4>
            <div className="space-y-2">
              {statusStats.map((stat) => (
                <div key={stat.status} className="flex items-center">
                  <Badge variant="outline" className="w-20 mr-2">
                    {stat.label}
                  </Badge>
                  <div className="flex-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium ml-2 w-8">
                    {stat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
