// components/QuickGradeValidationModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface QuickGradeValidationModalProps {
  grade: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const QuickGradeValidationModal: React.FC<
  QuickGradeValidationModalProps
> = ({ grade, open, onOpenChange, onSuccess }) => {
  const [comment, setComment] = useState("");
  const [validating, setValidating] = useState(false);
  const { toast } = useToast();

  const handleValidate = async (action: "approve" | "reject") => {
    if (!grade) return;

    setValidating(true);

    try {
      const data = {
        status: action === "approve" ? "Approved" : "Rejected",
        notes: comment.trim() || undefined,
        validatedAt: new Date().toISOString(),
      };

      await api.patch(`/grades/${grade.id}/status`, data);

      toast({
        title: action === "approve" ? "✅ Note approuvée" : "❌ Note rejetée",
        description: `La note de ${grade.student?.firstName} a été ${
          action === "approve" ? "validée" : "rejetée"
        }`,
      });

      onSuccess();
      onOpenChange(false);
      setComment("");
    } catch (error: any) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description:
          error.response?.data?.message || "Impossible de traiter la note",
        variant: "destructive",
      });
    } finally {
      setValidating(false);
    }
  };

  if (!grade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Validation rapide de note</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informations de la note */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">
                {grade.student?.firstName} {grade.student?.lastName}
              </h4>
              <span className="text-2xl font-bold">
                {grade.grade}/{grade.subject?.maxGrade || 20}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>{grade.subject?.name}</div>
              <div>
                Contrôle: {grade.controlType} • Coefficient:{" "}
                {grade.subject?.coefficient || 1}
              </div>
            </div>
          </div>

          {/* Commentaire existant */}
          {grade.notes && (
            <div className="p-2 bg-gray-50 rounded text-sm">
              <div className="font-medium text-xs text-muted-foreground mb-1">
                Commentaire existant:
              </div>
              {grade.notes}
            </div>
          )}

          {/* Nouveau commentaire */}
          <div className="space-y-2">
            <Label htmlFor="comment">
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Ajouter un commentaire (optionnel)
            </Label>
            <Textarea
              id="comment"
              placeholder="Commentaire pour la validation..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={validating}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleValidate("reject")}
            className="flex-1"
            disabled={validating}
          >
            <X className="mr-2 h-4 w-4" />
            Rejeter
          </Button>
          <Button
            onClick={() => handleValidate("approve")}
            className="flex-1"
            disabled={validating}
          >
            <Check className="mr-2 h-4 w-4" />
            Approuver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
