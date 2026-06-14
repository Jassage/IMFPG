// src/components/attendance/AttendanceDetailModal.tsx

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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Attendance, formatDateTime } from "@/types/attendance.types";
import {
  getStatusColor,
  getStatusLabel,
  getSessionLabel,
  getValidationColor,
  getValidationLabel,
  formatDate,
  formatTime,
} from "@/utils/attendanceUtils";
import {
  User,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAttendance } from "@/hooks/useAttendance";
import { toast } from "sonner";

interface AttendanceDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendance: Attendance | null;
  onUpdate?: () => void;
  readOnly?: boolean;
}

export const AttendanceDetailModal: React.FC<AttendanceDetailModalProps> = ({
  open,
  onOpenChange,
  attendance,
  onUpdate,
  readOnly = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: "",
    notes: "",
    justification: "",
  });
  const [loading, setLoading] = useState(false);
  const { updateAttendance, validateAttendance, justifyAttendance } =
    useAttendance();

  if (!attendance) return null;

  const handleEdit = () => {
    setEditData({
      status: attendance.status,
      notes: attendance.notes || "",
      justification: attendance.justification || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await updateAttendance(attendance.id, {
        status: editData.status as any,
        notes: editData.notes,
      });

      if (response.success) {
        toast.success("Présence mise à jour avec succès");
        setIsEditing(false);
        onUpdate?.();
      } else {
        toast.error(response.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (status: "VALIDATED" | "REJECTED") => {
    setLoading(true);
    try {
      const response = await validateAttendance(attendance.id, status);
      if (response.success) {
        toast.success(
          `Présence ${status === "VALIDATED" ? "validée" : "rejetée"} avec succès`,
        );
        onUpdate?.();
      } else {
        toast.error(response.message || "Erreur lors de la validation");
      }
    } catch (error) {
      toast.error("Erreur lors de la validation");
    } finally {
      setLoading(false);
    }
  };

  const handleJustify = async () => {
    if (!editData.justification.trim()) {
      toast.error("Veuillez fournir une justification");
      return;
    }

    setLoading(true);
    try {
      const response = await justifyAttendance(
        attendance.id,
        editData.justification,
        "OTHER",
      );
      if (response.success) {
        toast.success("Présence justifiée avec succès");
        setIsEditing(false);
        onUpdate?.();
      } else {
        toast.error(response.message || "Erreur lors de la justification");
      }
    } catch (error) {
      toast.error("Erreur lors de la justification");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: "PRESENT", label: "Présent" },
    { value: "ABSENT", label: "Absent" },
    { value: "LATE", label: "Retard" },
    { value: "EXCUSED", label: "Excusé" },
    { value: "SICK", label: "Malade" },
  ];

  const student = attendance.student;
  const studentName = student
    ? `${student.firstName} ${student.lastName}`
    : "Étudiant inconnu";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Détails de la présence
            </span>
            {!readOnly && !isEditing && (
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            {studentName} - {formatDate(attendance.date, "long")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informations étudiant */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{studentName}</h3>
                <p className="text-sm text-muted-foreground">
                  Code: {student?.studentCode || "N/A"} | Classe:{" "}
                  {attendance.schoolClass?.name || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Informations présence */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </span>
              <span className="font-medium">
                {formatDate(attendance.date, "long")}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Session
              </span>
              <Badge variant="outline">
                {getSessionLabel(attendance.session)}
              </Badge>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Statut
              </span>
              {isEditing ? (
                <Select
                  value={editData.status}
                  onValueChange={(v) => setEditData({ ...editData, status: v })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getStatusColor(attendance.status)}>
                  {getStatusLabel(attendance.status)}
                </Badge>
              )}
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Validation
              </span>
              <Badge
                variant="outline"
                className={getValidationColor(attendance.validationStatus)}
              >
                {getValidationLabel(attendance.validationStatus)}
              </Badge>
            </div>

            {attendance.checkInTime && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Arrivée</span>
                <span className="font-medium">
                  {formatDateTime(attendance.checkInTime)}
                </span>
              </div>
            )}

            {attendance.checkOutTime && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Départ</span>
                <span className="font-medium">
                  {formatDateTime(attendance.checkOutTime)}
                </span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </Label>
            {isEditing ? (
              <Textarea
                placeholder="Notes..."
                value={editData.notes}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
                rows={3}
              />
            ) : (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{attendance.notes || "Aucune note"}</p>
              </div>
            )}
          </div>

          {/* Justification */}
          {(attendance.status === "ABSENT" || attendance.status === "LATE") && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Justification
              </Label>
              {isEditing || !attendance.justification ? (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Motif de l'absence/retard..."
                    value={editData.justification}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        justification: e.target.value,
                      })
                    }
                    rows={3}
                  />
                  {!attendance.justification && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleJustify}
                      disabled={loading}
                      className="w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Justifier
                    </Button>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{attendance.justification}</p>
                  {attendance.justificationType && (
                    <Badge variant="outline" className="mt-2">
                      {attendance.justificationType}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </>
          ) : (
            <>
              {attendance.validationStatus === "PENDING" && !readOnly && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleValidate("REJECTED")}
                    disabled={loading}
                    className="text-destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                  <Button
                    onClick={() => handleValidate("VALIDATED")}
                    disabled={loading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Valider
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fermer
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
