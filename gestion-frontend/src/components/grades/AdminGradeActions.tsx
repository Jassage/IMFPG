// components/grades/AdminGradeActions.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle, XCircle, Eye, Download, Send } from "lucide-react";
import { GradeStatus } from "@/types/bulletin";

interface AdminGradeActionsProps {
  grade: any;
  onApprove: (gradeId: string) => Promise<void>;
  onReject: (gradeId: string, reason: string) => Promise<void>;
  onViewDetails: (grade: any) => void;
  onExport: (grade: any) => void;
}

export const AdminGradeActions = ({
  grade,
  onApprove,
  onReject,
  onViewDetails,
  onExport,
}: AdminGradeActionsProps) => {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(grade.id);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Veuillez saisir une raison");
      return;
    }

    setLoading(true);
    try {
      await onReject(grade.id, rejectReason);
      setRejectDialogOpen(false);
      setRejectReason("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewDetails(grade)}
          className="h-8 w-8 p-0"
          title="Voir les détails"
        >
          <Eye className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onExport(grade)}
          className="h-8 w-8 p-0"
          title="Exporter"
        >
          <Download className="h-4 w-4" />
        </Button>

        {grade.status === GradeStatus.SUBMITTED && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleApprove}
              disabled={loading}
              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
              title="Approuver"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setRejectDialogOpen(true)}
              disabled={loading}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
              title="Rejeter"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la note</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison du rejet de cette note.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Raison du rejet</Label>
              <Textarea
                id="reason"
                placeholder="Ex: Note incorrecte, manque de justification, etc."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium">Détails de la note:</p>
              <p>Étudiant: {grade.studentName}</p>
              <p>Matière: {grade.subjectName}</p>
              <p>
                Note: {grade.grade}/{grade.maxGrade}
              </p>
              <p>Professeur: {grade.teacherName}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
              }}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={loading || !rejectReason.trim()}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
