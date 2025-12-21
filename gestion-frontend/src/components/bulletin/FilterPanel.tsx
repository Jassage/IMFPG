import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ControlType } from "@/types/bulletin";
import { Calendar, Filter, Layers, User } from "lucide-react";

interface FilterPanelProps {
  filters: {
    academicYearId: string;
    controlType: ControlType | "all";
    classLevel: string;
  };
  academicYears: Array<{ id: string; year: string; isCurrent: boolean }>;
  onFilterChange: (filters: Partial<FilterPanelProps["filters"]>) => void;
}

const CONTROL_TYPES = [
  { value: "all", label: "Toutes les périodes" },
  { value: ControlType.CONTROLE_1, label: "1er Trimestre" },
  { value: ControlType.CONTROLE_2, label: "2ème Trimestre" },
  { value: ControlType.CONTROLE_3, label: "3ème Trimestre" },
  { value: ControlType.CONTROLE_4, label: "Examen Final" },
];

const CLASS_LEVELS = [
  { value: "all", label: "Tous les niveaux" },
  { value: "Sixieme", label: "6ème" },
  { value: "Cinquieme", label: "5ème" },
  { value: "Quatrieme", label: "4ème" },
  { value: "Troisieme", label: "3ème" },
  { value: "Seconde", label: "2nde" },
  { value: "Premiere", label: "1ère" },
  { value: "Terminale", label: "Terminale" },
  { value: "NSI", label: "NS I" },
  { value: "NSII", label: "NS II" },
  { value: "NSIII", label: "NS III" },
  { value: "NSIV", label: "NS IV" },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  academicYears,
  onFilterChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres de Sélection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Année académique */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Année Académique
          </Label>
          <Select
            value={filters.academicYearId}
            onValueChange={(value) => onFilterChange({ academicYearId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une année" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  {year.year}
                  {year.isCurrent && " (En cours)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type de contrôle */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Période de Contrôle
          </Label>
          <Select
            value={filters.controlType}
            onValueChange={(value) =>
              onFilterChange({ controlType: value as ControlType | "all" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              {CONTROL_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Niveau de classe */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Niveau de Classe
          </Label>
          <Select
            value={filters.classLevel}
            onValueChange={(value) => onFilterChange({ classLevel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              {CLASS_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
