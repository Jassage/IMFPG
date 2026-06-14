// src/components/attendance/AttendanceFilters.tsx

import React, { useState, useEffect } from "react";
import {
  AttendanceFilters,
  AttendanceStatus,
  AttendanceSession,
  AttendanceSessionn,
} from "@/types/attendance.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Card } from "@/components/ui/card";
import { Search, X } from "lucide-react";

interface AttendanceFiltersProps {
  filters: AttendanceFilters;
  onFilterChange: (filters: AttendanceFilters) => void;
  classes?: Array<{ id: string; name: string }>;
  academicYears?: Array<{ id: string; year: string }>;
  className?: string;
}

export const AttendanceFiltersComponent: React.FC<AttendanceFiltersProps> = ({
  filters,
  onFilterChange,
  classes = [],
  academicYears = [],
  className = "",
}) => {
  const [localFilters, setLocalFilters] = useState<AttendanceFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = <K extends keyof AttendanceFilters>(
    key: K,
    value: AttendanceFilters[K],
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilterChange({ ...localFilters, page: 1 });
  };

  const handleReset = () => {
    const resetFilters: AttendanceFilters = {
      page: 1,
      limit: 20,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const statusOptions: Array<{ value: AttendanceStatus; label: string }> = [
    { value: "PRESENT", label: "Présent" },
    { value: "ABSENT", label: "Absent" },
    { value: "LATE", label: "Retard" },
    { value: "EXCUSED", label: "Excusé" },
    { value: "SICK", label: "Malade" },
    { value: "HOLIDAY", label: "Congé" },
    { value: "SUSPENDED", label: "Suspendu" },
    { value: "OTHER", label: "Autre" },
  ];

  const sessionOptions: Array<{ value: AttendanceSession; label: string }> = [
    { value: "MORNING" as unknown as AttendanceSession, label: "Matin" },
    { value: "AFTERNOON" as unknown as AttendanceSession, label: "Après-midi" },
    {
      value: "FULL_DAY" as unknown as AttendanceSession,
      label: "Journée complète",
    },
  ];

  const validationOptions = [
    { value: "PENDING", label: "En attente" },
    { value: "VALIDATED", label: "Validé" },
    { value: "REJECTED", label: "Rejeté" },
  ];

  return (
    <Card className={`p-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un étudiant..."
            value={localFilters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Classe */}
        <Select
          value={localFilters.classId}
          onValueChange={(value) => handleChange("classId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Année académique */}
        <Select
          value={localFilters.academicYearId}
          onValueChange={(value) => handleChange("academicYearId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Année académique" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les années</SelectItem>
            {academicYears.map((year) => (
              <SelectItem key={year.id} value={year.id}>
                {year.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Statut */}
        <Select
          value={localFilters.status}
          onValueChange={(value) =>
            handleChange("status", value as AttendanceStatus)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Session */}
        <Select
          value={localFilters.session}
          onValueChange={(value) =>
            handleChange("session", value as AttendanceSessionn)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les sessions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les sessions</SelectItem>
            {sessionOptions.map((option) => (
              <SelectItem
                key={String(option.value)}
                value={String(option.value)}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Validation */}
        <Select
          value={localFilters.validationStatus}
          onValueChange={(value) =>
            handleChange("validationStatus", value as any)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Statut validation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {validationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date début */}
        <DatePicker
          date={
            localFilters.startDate
              ? new Date(localFilters.startDate)
              : undefined
          }
          onSelect={(date) => handleChange("startDate", date?.toISOString())}
          placeholder="Date début"
        />

        {/* Date fin */}
        <DatePicker
          date={
            localFilters.endDate ? new Date(localFilters.endDate) : undefined
          }
          onSelect={(date) => handleChange("endDate", date?.toISOString())}
          placeholder="Date fin"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex items-center"
        >
          <X className="mr-2 h-4 w-4" />
          Réinitialiser
        </Button>
        <Button onClick={handleApply} className="flex items-center">
          <Search className="mr-2 h-4 w-4" />
          Appliquer
        </Button>
      </div>
    </Card>
  );
};
