// src/components/attendance/BulkValidationModal.tsx

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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Attendance } from "@/types/attendance.types";
import {
  getStatusLabel,
  getSessionLabel,
  formatDate,
} from "@/utils/attendanceUtils";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAttendance } from "@/hooks/useAttendance";
import { toast } from "sonner";

interface BulkValidationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendances: Attendance[];
  onSuccess?: () => void;
}

export const BulkValidationModal: React.FC<BulkValidationModalProps> = ({
  open,
  onOpenChange,
  attendances,
  onSuccess,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [validationStatus, setValidationStatus] = useState<
    "VALIDATED" | "REJECTED"
  >("VALIDATED");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateAttendance } = useAttendance();

  const pendingAttendances = attendances.filter(
    (a) => a.validationStatus === "PENDING",
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(pendingAttendances.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleValidateAll = async () => {
    if (selectedIds.length === 0) {
      toast.error("Veuillez sélectionner au moins une présence à valider");
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedIds) {
      try {
        const response = await updateAttendance(id, {
          validationStatus,
          notes: notes || undefined,
        });
        if (response.success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    setLoading(false);

    if (successCount > 0) {
      toast.success(
        `${successCount} présence(s) ${validationStatus === "VALIDATED" ? "validée(s)" : "rejetée(s)"}`,
      );
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} présence(s) non traitées`);
    }

    onSuccess?.();
    onOpenChange(false);
  };

  const totalSelected = selectedIds.length;
  const totalPending = pendingAttendances.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Validation en masse
          </DialogTitle>
          <DialogDescription>
            Validez ou rejetez plusieurs présences en une seule fois
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-yellow-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-700">
                {totalPending}
              </p>
              <p className="text-xs text-yellow-600">En attente</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-700">
                {selectedIds.length}
              </p>
              <p className="text-xs text-green-600">Sélectionnées</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-700">
                {attendances.length}
              </p>
              <p className="text-xs text-blue-600">Total</p>
            </div>
          </div>

          {/* Action à appliquer */}
          <div className="p-4 border rounded-lg">
            <Label className="mb-2 block">Action à appliquer</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={
                  validationStatus === "VALIDATED" ? "default" : "outline"
                }
                onClick={() => setValidationStatus("VALIDATED")}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Valider
              </Button>
              <Button
                type="button"
                variant={
                  validationStatus === "REJECTED" ? "destructive" : "outline"
                }
                onClick={() => setValidationStatus("REJECTED")}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
            </div>
          </div>

          {/* Notes communes */}
          <div className="space-y-2">
            <Label>Notes (optionnel)</Label>
            <Textarea
              placeholder="Ajouter une note pour toutes les présences sélectionnées..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Liste des présences */}
          <div className="border rounded-lg overflow-hidden">
            <div className="p-3 bg-muted border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={totalSelected === totalPending && totalPending > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label className="font-medium">Tout sélectionner</Label>
              </div>
              <Badge variant="outline">{totalSelected} sélectionnée(s)</Badge>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {pendingAttendances.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune présence en attente de validation</p>
                </div>
              ) : (
                pendingAttendances.map((attendance) => (
                  <div
                    key={attendance.id}
                    className="p-3 border-b hover:bg-muted/30 flex items-center gap-3"
                  >
                    <Checkbox
                      checked={selectedIds.includes(attendance.id)}
                      onCheckedChange={(checked) =>
                        handleSelect(attendance.id, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <div className="font-medium">
                        {attendance.student?.firstName}{" "}
                        {attendance.student?.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground flex gap-3">
                        <span>Code: {attendance.student?.studentCode}</span>
                        <span>
                          Date: {formatDate(attendance.date, "short")}
                        </span>
                        <span>
                          Session: {getSessionLabel(attendance.session)}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={
                        getStatusLabel(attendance.status).toLowerCase() ===
                        "présent"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {getStatusLabel(attendance.status)}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleValidateAll}
            disabled={loading || selectedIds.length === 0}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Valider {selectedIds.length} présence(s)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
