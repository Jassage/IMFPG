// src/components/AttendanceSheetDialog.tsx
// Boîte de dialogue pour générer et télécharger une feuille de présence PDF.

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileDown } from "lucide-react";
import { toast } from "sonner";
import { attendanceService } from "@/services/attendanceService";

interface AttendanceSheetDialogProps {
  open:            boolean;
  onOpenChange:    (open: boolean) => void;
  classes:         Array<{ id: string; name: string; level: string }>;
  academicYears:   Array<{ id: string; year: string; isCurrent?: boolean }>;
  defaultClassId?: string;
  defaultYearId?:  string;
}

export const AttendanceSheetDialog: React.FC<AttendanceSheetDialogProps> = ({
  open,
  onOpenChange,
  classes,
  academicYears,
  defaultClassId = "",
  defaultYearId  = "",
}) => {
  const today      = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [classId,        setClassId]        = useState(defaultClassId || "");
  const [academicYearId, setAcademicYearId] = useState(defaultYearId || "all");
  const [startDate,      setStartDate]      = useState(firstOfMonth.toISOString().split("T")[0]);
  const [endDate,        setEndDate]        = useState(today.toISOString().split("T")[0]);
  const [loading,        setLoading]        = useState(false);

  const handleGenerate = async () => {
    if (!classId) {
      toast.error("Veuillez sélectionner une classe");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner une période");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("La date de début doit être antérieure à la date de fin");
      return;
    }

    setLoading(true);
    try {
      const blob = await attendanceService.downloadAttendanceSheet({
        classId,
        startDate,
        endDate,
        academicYearId: academicYearId !== "all" ? academicYearId : undefined,
      });

      const url  = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const selectedClass = classes.find((c) => c.id === classId);
      link.href     = url;
      link.download = `feuille_presence_${selectedClass?.name || classId}_${startDate}_au_${endDate}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Feuille de présence téléchargée");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erreur génération feuille présence:", error);
      toast.error("Erreur lors de la génération de la feuille de présence");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Feuille de présence PDF</DialogTitle>
          <DialogDescription>
            Sélectionnez une classe et une période pour générer la feuille de présence.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Classe */}
          <div className="space-y-1.5">
            <Label htmlFor="sheet-class">Classe *</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger id="sheet-class">
                <SelectValue placeholder="Choisir une classe" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} — {cls.level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Année académique */}
          {academicYears.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="sheet-year">Année académique</Label>
              <Select value={academicYearId} onValueChange={setAcademicYearId}>
                <SelectTrigger id="sheet-year">
                  <SelectValue placeholder="Toutes les années" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {academicYears.map((y) => (
                    <SelectItem key={y.id} value={y.id}>
                      {y.year} {y.isCurrent ? "(En cours)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Période */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="sheet-start">Date de début *</Label>
              <Input
                id="sheet-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sheet-end">Date de fin *</Label>
              <Input
                id="sheet-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Légende dans le PDF : <strong>P</strong>=Présent, <strong>A</strong>=Absent,{" "}
            <strong>R</strong>=Retard, <strong>E</strong>=Excusé, <strong>M</strong>=Malade
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4 mr-2" />
                Télécharger PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
