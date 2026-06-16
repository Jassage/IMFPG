// components/attendance/SessionAttendanceSupervision.tsx
// Vue de supervision (admin / directeur) des appels faits par séance/cours.
// Liste les séances et permet de déplier le détail de présence par élève.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { attendanceService } from "@/services/attendanceService";

interface Props {
  academicYearId?: string;
  classId?: string;
}

const STATUS_BADGE: Record<string, string> = {
  PRESENT: "bg-green-100 text-green-800",
  ABSENT: "bg-red-100 text-red-800",
  LATE: "bg-amber-100 text-amber-800",
  EXCUSED: "bg-blue-100 text-blue-800",
  SICK: "bg-purple-100 text-purple-800",
};

const STATUS_LABEL: Record<string, string> = {
  PRESENT: "Présent",
  ABSENT: "Absent",
  LATE: "Retard",
  EXCUSED: "Excusé",
  SICK: "Malade",
  HOLIDAY: "Congé",
  SUSPENDED: "Suspendu",
  OTHER: "Autre",
};

export const SessionAttendanceSupervision: React.FC<Props> = ({
  academicYearId,
  classId,
}) => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      const res = await attendanceService.getAttendanceSessions({
        academicYearId: academicYearId || undefined,
        classId: classId && classId !== "all" ? classId : undefined,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        limit: 100,
      } as any);

      const data: any = res.data;
      const list = data?.sessions || data || [];
      setSessions(Array.isArray(list) ? list : []);
    } catch (e) {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [academicYearId, classId, date]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const toggleSession = async (sessionId: string) => {
    if (expandedId === sessionId) {
      setExpandedId(null);
      setRoster([]);
      return;
    }
    setExpandedId(sessionId);
    setRoster([]);
    setRosterLoading(true);
    try {
      const res = await attendanceService.getSessionRoster(sessionId);
      if (res.success) {
        setRoster(res.data?.roster || []);
      }
    } catch (e) {
      setRoster([]);
    } finally {
      setRosterLoading(false);
    }
  };

  const rosterCounts = useMemo(() => {
    const c: Record<string, number> = { PRESENT: 0, ABSENT: 0, LATE: 0, EXCUSED: 0 };
    roster.forEach((r) => {
      c[r.status] = (c[r.status] || 0) + 1;
    });
    return c;
  }, [roster]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setExpandedId(null);
                }}
                className="w-48"
              />
            </div>
            <p className="text-sm text-muted-foreground sm:pb-2">
              {sessions.length} séance(s) ce jour
              {classId && classId !== "all" ? " pour la classe filtrée" : ""}
            </p>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-50" />
          Aucune séance enregistrée pour cette date.
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => {
            const expanded = expandedId === s.id;
            return (
              <Card key={s.id}>
                <CardContent className="p-0">
                  <button
                    type="button"
                    onClick={() => toggleSession(s.id)}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {expanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">
                          {s.schoolClass?.name} · {s.subject?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.startTime} - {s.endTime} ·{" "}
                          {s.professeur
                            ? `${s.professeur.firstName} ${s.professeur.lastName}`
                            : "Professeur inconnu"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {s.isCompleted ? (
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Appel effectué
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-300">
                          En attente
                        </Badge>
                      )}
                    </div>
                  </button>

                  {expanded && (
                    <div className="border-t p-4">
                      {rosterLoading ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : !s.isCompleted ? (
                        <p className="text-sm text-amber-600 text-center py-4">
                          L'appel n'a pas encore été effectué pour cette séance.
                        </p>
                      ) : roster.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Aucun élève enregistré.
                        </p>
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {rosterCounts.PRESENT > 0 && (
                              <Badge className={STATUS_BADGE.PRESENT}>
                                Présents : {rosterCounts.PRESENT}
                              </Badge>
                            )}
                            {rosterCounts.ABSENT > 0 && (
                              <Badge className={STATUS_BADGE.ABSENT}>
                                Absents : {rosterCounts.ABSENT}
                              </Badge>
                            )}
                            {rosterCounts.LATE > 0 && (
                              <Badge className={STATUS_BADGE.LATE}>
                                Retards : {rosterCounts.LATE}
                              </Badge>
                            )}
                            {rosterCounts.EXCUSED > 0 && (
                              <Badge className={STATUS_BADGE.EXCUSED}>
                                Excusés : {rosterCounts.EXCUSED}
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            {roster.map((r, i) => (
                              <div
                                key={r.id}
                                className="flex items-center justify-between gap-3 rounded border px-3 py-2 text-sm"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="text-muted-foreground w-5">
                                    {i + 1}
                                  </span>
                                  {r.lastName} {r.firstName}
                                  <span className="text-xs text-muted-foreground">
                                    {r.studentCode}
                                  </span>
                                </span>
                                <Badge
                                  className={
                                    STATUS_BADGE[r.status] ||
                                    "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {STATUS_LABEL[r.status] || r.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SessionAttendanceSupervision;
