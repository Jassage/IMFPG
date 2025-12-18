// components/AssignFeesButton.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFeeStructureStore } from "@/store/feeStructureStore";
import { toast } from "sonner";
import { CreditCard, Plus, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AssignFeesButtonProps {
  studentId: string;
  studentCode: string;
  academicYearId: string;
  onSuccess?: () => void;
}

export const AssignFeesButton: React.FC<AssignFeesButtonProps> = ({
  studentId,
  studentCode,
  academicYearId,
  onSuccess,
}) => {
  const { getFeeStructuresByAcademicYearId, assignFeeToStudent, loading } =
    useFeeStructureStore();

  const [open, setOpen] = useState(false);
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);

  const loadFeeStructures = async () => {
    try {
      const fees = await getFeeStructuresByAcademicYearId(academicYearId);
      setFeeStructures(fees);
    } catch (error) {
      console.error("Erreur chargement frais:", error);
      toast.error("Erreur lors du chargement des frais");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      loadFeeStructures();
    } else {
      setSelectedFees([]);
    }
  };

  const handleAssignFees = async () => {
    console.log("🔍 academicYearId reçu:", academicYearId);
    console.log("🔍 studentId reçu:", studentId);

    if (!academicYearId || academicYearId === "") {
      toast.error("ID d'année académique manquant");
      return;
    }
    if (selectedFees.length === 0) {
      toast.error("Veuillez sélectionner au moins un frais");
      return;
    }

    setAssigning(true);
    try {
      const academicYearId = feeStructures[0]?.academicYearId;

      for (const feeId of selectedFees) {
        await assignFeeToStudent(studentId, academicYearId, feeId, studentCode);
      }

      toast.success(`${selectedFees.length} frais assignés avec succès`);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erreur assignation frais:", error);
      toast.error("Erreur lors de l'assignation des frais");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          Assigner des frais
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Assigner des frais à l'étudiant
          </DialogTitle>
          <DialogDescription>
            Sélectionnez les frais à assigner pour cette année académique
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Chargement des frais...</p>
            </div>
          ) : feeStructures.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun frais disponible pour cette année académique</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {feeStructures.map((fee) => (
                <div
                  key={fee.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-slate-50"
                >
                  <Checkbox
                    id={`fee-${fee.id}`}
                    checked={selectedFees.includes(fee.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFees([...selectedFees, fee.id]);
                      } else {
                        setSelectedFees(
                          selectedFees.filter((id) => id !== fee.id)
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={`fee-${fee.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{fee.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {fee.description || "Sans description"}
                    </div>
                  </Label>
                  <div className="font-semibold text-green-700">
                    {(fee.amount || fee.totalAmount || 0).toLocaleString()} HTG
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedFees.length} frais sélectionné(s)
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={assigning}
              >
                Annuler
              </Button>
              <Button
                onClick={handleAssignFees}
                disabled={assigning || selectedFees.length === 0}
              >
                {assigning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Assignation...
                  </>
                ) : (
                  "Assigner les frais"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
