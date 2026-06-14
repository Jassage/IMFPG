// src/components/attendance/NewAttendanceModal.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AttendanceScanner } from "./AttendanceScanner";
import { useAttendance } from "@/hooks/useAttendance";
import { validateStudentCode } from "@/utils/attendanceUtils";
import {
  Scan,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface NewAttendanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  academicYearId: string;
  onSuccess?: (data: any) => void;
}

export const NewAttendanceModal: React.FC<NewAttendanceModalProps> = ({
  open,
  onOpenChange,
  classId,
  academicYearId,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"manual" | "scan">("manual");
  const [studentCode, setStudentCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSession, setSelectedSession] = useState<string>("MORNING");

  const { recordByScan } = useAttendance();

  const handleScanSuccess = async (response: any) => {
    setLoading(true);
    setError(null);

    try {
      if (response.success) {
        setSuccess(response);
        onSuccess?.(response);

        // Fermer après 2 secondes
        setTimeout(() => {
          resetForm();
          onOpenChange(false);
        }, 2000);
      } else {
        setError(response.message || "Erreur lors de l'enregistrement");
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStudentCode(studentCode)) {
      setError("Format de code invalide (ex: ET1234)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await recordByScan(
        studentCode,
        classId,
        selectedSession,
        selectedDate,
      );

      if (response.success) {
        setSuccess(response);
        onSuccess?.(response);

        setTimeout(() => {
          resetForm();
          onOpenChange(false);
        }, 2000);
      } else {
        setError(response.message || "Erreur lors de l'enregistrement");
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStudentCode("");
    setError(null);
    setSuccess(null);
    setSelectedDate(new Date());
    setSelectedSession("MORNING");
  };

  const sessionOptions = [
    { value: "MORNING", label: "Matin", icon: "🌅", time: "08:00 - 12:00" },
    {
      value: "AFTERNOON",
      label: "Après-midi",
      icon: "☀️",
      time: "14:00 - 17:00",
    },
    {
      value: "FULL_DAY",
      label: "Journée complète",
      icon: "📅",
      time: "08:00 - 17:00",
    },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm();
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Scan className="h-5 w-5 mr-2" />
            Nouvelle présence
          </DialogTitle>
          <DialogDescription>
            Enregistrez une présence par scan QR code ou saisie manuelle
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "manual" | "scan")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Saisie manuelle
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center">
              <Scan className="h-4 w-4 mr-2" />
              Scan QR code
            </TabsTrigger>
          </TabsList>

          {/* Messages d'état */}
          {success && (
            <Alert className="mb-4 border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Présence enregistrée pour {success.student?.firstName}{" "}
                {success.student?.lastName}
                <br />
                <span className="text-xs">
                  Code: {success.student?.studentCode} |{" "}
                  {format(new Date(), "dd/MM/yyyy HH:mm")}
                </span>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Formulaire commun pour les deux onglets - Date et Session */}
          <div className="space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
            {/* Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate
                      ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })
                      : "Choisir une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Session */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Session
              </Label>
              <Select
                value={selectedSession}
                onValueChange={setSelectedSession}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une session" />
                </SelectTrigger>
                <SelectContent>
                  {sessionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({option.time})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="manual" className="mt-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code étudiant</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="code"
                    placeholder="ET1234"
                    value={studentCode}
                    onChange={(e) =>
                      setStudentCode(e.target.value.toUpperCase())
                    }
                    className="pl-9"
                    disabled={loading || success}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Format: 2 lettres + 4 chiffres (ex: ET1234)
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || success}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer la présence"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="scan" className="mt-4">
            <AttendanceScanner
              classId={classId}
              session={selectedSession}
              onSuccess={handleScanSuccess}
              onError={(err) => setError(err)}
            />
          </TabsContent>
        </Tabs>

        {/* Informations supplémentaires */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            <span className="font-medium">💡 Astuce :</span> Les QR codes sont
            générés automatiquement pour chaque étudiant. Un scan réussi
            enregistre instantanément la présence.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
