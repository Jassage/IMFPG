// components/attendance/ProfessorAttendance.tsx
// Écran d'appel destiné au professeur : il choisit un de ses cours,
// charge le roster de la classe et enregistre la présence de chaque élève.

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  ClipboardCheck,
  Save,
  Loader2,
  Check,
  X,
  Clock,
  FileMinus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useProfesseurStore } from "@/store/professorStore";
import useClassStore from "@/store/classStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { attendanceService } from "@/services/attendanceService";
import api from "@/services/api";

type RosterRow = {
  id: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  status: string;
  notes?: string;
};

const STATUS_OPTIONS = [
  { value: "PRESENT", label: "Présent", icon: Check },
  { value: "ABSENT", label: "Absent", icon: X },
  { value: "LATE", label: "Retard", icon: Clock },
  { value: "EXCUSED", label: "Excusé", icon: FileMinus },
];

const STATUS_BADGE: Record<string, string> = {
  PRESENT: "bg-green-100 text-green-800",
  ABSENT: "bg-red-100 text-red-800",
  LATE: "bg-amber-100 text-amber-800",
  EXCUSED: "bg-blue-100 text-blue-800",
};

export const ProfessorAttendance = () => {
  const { user } = useAuthStore();
  const { fetchProfesseurByUserId } = useProfesseurStore();
  const { classes, fetchClasses } = useClassStore();
  const { currentAcademicYear, fetchAcademicYears } = useAcademicYearStore();

  const [professeurId, setProfesseurId] = useState("");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");

  const [session, setSession] = useState<any>(null);
  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [opening, setOpening] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  // Chargement initial : classes, années, profil professeur et ses affectations
  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([fetchClasses(), fetchAcademicYears()]);
        if (user?.id) {
          const prof = await fetchProfesseurByUserId(user.id);
          if (prof?.id) {
            setProfesseurId(prof.id);
            const res = await api.get("/class-assignments", {
              params: { professeurId: prof.id, status: "Active", limit: 100 },
            });
            const data = res.data?.data?.assignments || res.data?.data || [];
            setAssignments(Array.isArray(data) ? data : []);
          }
        }
      } catch (e) {
        toast.error("Impossible de charger vos cours");
      } finally {
        setInitLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const resetSession = () => {
    setSession(null);
    setRoster([]);
  };

  // Matières distinctes enseignées par le professeur
  const subjects = useMemo(() => {
    const map = new Map<string, { id: string; name: string; code: string }>();
    assignments.forEach((a) => {
      if (a.subject?.id) map.set(a.subject.id, a.subject);
    });
    return Array.from(map.values());
  }, [assignments]);

  // Niveaux enseignés pour la matière sélectionnée
  const levelsForSubject = useMemo(
    () =>
      assignments
        .filter((a) => a.subject?.id === selectedSubjectId)
        .map((a) => a.classLevel),
    [assignments, selectedSubjectId],
  );

  // Classes proposées : celles dont le niveau correspond à la matière choisie
  const availableClasses = useMemo(() => {
    if (!selectedSubjectId) return [];
    return (classes || []).filter((c: any) =>
      levelsForSubject.includes(c.level),
    );
  }, [classes, levelsForSubject, selectedSubjectId]);

  const handleOpen = async () => {
    if (!selectedSubjectId || !selectedClassId) {
      toast.error("Sélectionnez une matière et une classe");
      return;
    }
    if (!currentAcademicYear?.id) {
      toast.error("Aucune année académique courante définie");
      return;
    }
    setOpening(true);
    try {
      const res = await attendanceService.openSession({
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        professeurId,
        academicYearId: currentAcademicYear.id,
        date: new Date(date).toISOString(),
        startTime,
        endTime,
      });
      if (!res.success || !res.data?.session) {
        toast.error(res.message || "Impossible d'ouvrir la séance");
        return;
      }
      setSession(res.data.session);

      const rosterRes = await attendanceService.getSessionRoster(
        res.data.session.id,
      );
      if (rosterRes.success) {
        const rows = (rosterRes.data?.roster || []).map((r: any) => ({
          id: r.id,
          firstName: r.firstName,
          lastName: r.lastName,
          studentCode: r.studentCode,
          status: r.status || "PRESENT",
          notes: r.notes || "",
        }));
        setRoster(rows);
        if (rows.length === 0) {
          toast.info("Aucun élève actif rattaché à cette classe");
        }
      } else {
        toast.error(rosterRes.message || "Impossible de charger les élèves");
      }
    } catch (e: any) {
      toast.error(
        e.response?.data?.message || "Erreur lors de l'ouverture de l'appel",
      );
    } finally {
      setOpening(false);
    }
  };

  const setStatus = (studentId: string, status: string) => {
    setRoster((prev) =>
      prev.map((r) => (r.id === studentId ? { ...r, status } : r)),
    );
  };

  const markAllPresent = () => {
    setRoster((prev) => prev.map((r) => ({ ...r, status: "PRESENT" })));
  };

  const handleSave = async () => {
    if (!session?.id || roster.length === 0) return;
    setSaving(true);
    try {
      const entries = roster.map((r) => ({
        studentId: r.id,
        status: r.status,
        notes: r.notes || undefined,
      }));
      const res = await attendanceService.saveSessionAttendance(
        session.id,
        entries,
      );
      if (res.success) {
        toast.success("Appel enregistré avec succès");
      } else {
        toast.error(res.message || "Échec de l'enregistrement");
      }
    } catch (e: any) {
      toast.error(
        e.response?.data?.message || "Erreur lors de l'enregistrement",
      );
    } finally {
      setSaving(false);
    }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      EXCUSED: 0,
    };
    roster.forEach((r) => {
      c[r.status] = (c[r.status] || 0) + 1;
    });
    return c;
  }, [roster]);

  if (initLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardCheck className="h-7 w-7" />
          Faire l'appel
        </h1>
        <p className="text-muted-foreground">
          Sélectionnez votre cours, puis enregistrez la présence de vos élèves.
        </p>
      </div>

      {subjects.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Aucun cours ne vous est affecté pour le moment. Contactez
            l'administration pour vos affectations.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sélection du cours</CardTitle>
            <CardDescription>
              Matière, classe, date et horaire de la séance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Matière</Label>
                <Select
                  value={selectedSubjectId}
                  onValueChange={(v) => {
                    setSelectedSubjectId(v);
                    setSelectedClassId("");
                    resetSession();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Classe</Label>
                <Select
                  value={selectedClassId}
                  onValueChange={(v) => {
                    setSelectedClassId(v);
                    resetSession();
                  }}
                  disabled={!selectedSubjectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClasses.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    resetSession();
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Heure de début</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    resetSession();
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Heure de fin</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    resetSession();
                  }}
                />
              </div>
            </div>

            <Button
              className="mt-4"
              onClick={handleOpen}
              disabled={!selectedSubjectId || !selectedClassId || opening}
            >
              {opening ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Users className="mr-2 h-4 w-4" />
              )}
              Ouvrir l'appel
            </Button>
          </CardContent>
        </Card>
      )}

      {session && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle>
                  {session.schoolClass?.name} · {session.subject?.name}
                </CardTitle>
                <CardDescription>
                  {new Date(date).toLocaleDateString("fr-FR")} · {startTime} -{" "}
                  {endTime} · {roster.length} élève(s)
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={STATUS_BADGE.PRESENT}>
                  Présents : {counts.PRESENT}
                </Badge>
                <Badge className={STATUS_BADGE.ABSENT}>
                  Absents : {counts.ABSENT}
                </Badge>
                <Badge className={STATUS_BADGE.LATE}>
                  Retards : {counts.LATE}
                </Badge>
                <Badge className={STATUS_BADGE.EXCUSED}>
                  Excusés : {counts.EXCUSED}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {roster.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                Aucun élève à afficher pour cette classe.
              </p>
            ) : (
              <>
                <div className="flex justify-end mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllPresent}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Tout marquer présent
                  </Button>
                </div>

                <div className="space-y-2">
                  {roster.map((student, index) => (
                    <div
                      key={student.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-6">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">
                            {student.lastName} {student.firstName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.studentCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {STATUS_OPTIONS.map((opt) => {
                          const Icon = opt.icon;
                          const active = student.status === opt.value;
                          return (
                            <Button
                              key={opt.value}
                              type="button"
                              size="sm"
                              variant={active ? "default" : "outline"}
                              onClick={() => setStatus(student.id, opt.value)}
                            >
                              <Icon className="mr-1 h-3.5 w-3.5" />
                              {opt.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Enregistrer l'appel
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfessorAttendance;
