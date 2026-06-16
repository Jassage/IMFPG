// src/pages/attendance/AttendancePage.tsx

import React, { useState, useEffect, useMemo } from "react";
import { useAttendance } from "@/hooks/useAttendance";
import {
  AttendanceFilters,
  Attendance,
  AttendanceStatus,
  AttendanceValidationStatus,
} from "@/types/attendance.types";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Calendar,
  CheckCircle,
  CalendarDays,
  QrCode,
  BarChart3,
  List,
  Filter,
  Search,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import useClassStore from "@/store/classStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { AttendanceExport } from "@/components/AttendanceExport";
import { NewAttendanceModal } from "@/components/NewAttendanceModal";
import { AttendanceCard } from "@/components/AttendanceCard";
import { AttendanceStats } from "@/components/AttendanceStats";
import { AttendanceScanner } from "@/components/AttendanceScanner";
import { BulkValidationModal } from "@/components/BulkValidationModal";
import { AttendanceDetailModal } from "@/components/AttendanceDetailModal";
import { SessionAttendanceSupervision } from "@/components/attendance/SessionAttendanceSupervision";

// Interface pour la réponse API
interface AttendanceApiResponse {
  success: boolean;
  message: string;
  data: {
    attendances: Attendance[];
    currentAcademicYear: any;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  code?: string;
}

export const AttendancePage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AttendanceFilters>({
    page: 1,
    limit: 20,
  });
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "list" | "scan" | "stats" | "sessions"
  >("list");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [selectedAcademicYearId, setSelectedAcademicYearId] =
    useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [validationFilter, setValidationFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const { fetchAttendances, fetchOverallStats, loading } = useAttendance();
  const { classes, fetchClasses, loading: classesLoading } = useClassStore();
  const {
    academicYears,
    fetchAcademicYears,
    loading: yearsLoading,
  } = useAcademicYearStore();
  const [stats, setStats] = useState<any>(null);

  // États pour les modaux et sélection
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [bulkValidationOpen, setBulkValidationOpen] = useState(false);
  const [selectedAttendances, setSelectedAttendances] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);

  // Charger les données initiales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchClasses(), fetchAcademicYears()]);
      } catch (error) {
        console.error("Erreur chargement données initiales:", error);
        toast.error("Erreur lors du chargement des données");
      }
    };

    loadInitialData();
  }, []);

  // Sélectionner l'année académique courante quand les années sont chargées
  useEffect(() => {
    if (academicYears.length > 0 && !selectedAcademicYearId) {
      const currentYear = academicYears.find((year: any) => year.isCurrent);
      if (currentYear) {
        setSelectedAcademicYearId(currentYear.id);
      } else if (academicYears.length > 0) {
        setSelectedAcademicYearId(academicYears[0].id);
      }
    }
  }, [academicYears, selectedAcademicYearId]);

  // Mettre à jour les filtres quand les sélections changent
  useEffect(() => {
    const newFilters: AttendanceFilters = {
      page: 1,
      limit: 20,
      classId: selectedClassId !== "all" ? selectedClassId : undefined,
      academicYearId: selectedAcademicYearId || undefined,
      status:
        statusFilter !== "all" ? (statusFilter as AttendanceStatus) : undefined,
      validationStatus:
        validationFilter !== "all"
          ? (validationFilter as AttendanceValidationStatus)
          : undefined,
      search: searchTerm || undefined,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    };
    setFilters(newFilters);
  }, [
    selectedClassId,
    selectedAcademicYearId,
    statusFilter,
    validationFilter,
    searchTerm,
    startDate,
    endDate,
  ]);

  // Charger les présences quand les filtres changent
  useEffect(() => {
    loadAttendances();
  }, [filters]);

  // Charger les statistiques
  useEffect(() => {
    if (activeTab === "stats") {
      loadStats();
    }
  }, [activeTab, selectedAcademicYearId, selectedClassId]);

  const loadAttendances = async () => {
    try {
      const response = (await fetchAttendances(
        filters,
      )) as AttendanceApiResponse;
      console.log("Réponse API:", response);

      if (response.success && response.data) {
        setAttendances(response.data.attendances || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalItems(response.data.pagination?.total || 0);
        // Réinitialiser la sélection quand les données changent
        setSelectedAttendances([]);
        setSelectMode(false);
      } else {
        console.error("Erreur dans la réponse:", response);
        toast.error(
          response.message || "Erreur lors du chargement des présences",
        );
      }
    } catch (error) {
      console.error("Erreur chargement présences:", error);
      toast.error("Erreur lors du chargement des présences");
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetchOverallStats(selectedAcademicYearId);
      if (response.success) {
        setStats(response);
      }
    } catch (error) {
      console.error("Erreur chargement statistiques:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleViewDetails = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setDetailModalOpen(true);
  };

  const handleEditAttendance = (id: string) => {
    const attendance = attendances.find((a) => a.id === id);
    if (attendance) {
      setSelectedAttendance(attendance);
      setDetailModalOpen(true);
    }
  };

  const handleBulkValidation = () => {
    const pendingAttendances = attendances.filter(
      (a) => a.validationStatus === "PENDING",
    );
    if (pendingAttendances.length === 0) {
      toast.info("Aucune présence en attente de validation");
      return;
    }
    setBulkValidationOpen(true);
  };

  const handleScanSuccess = (data: any) => {
    loadAttendances();
    loadStats();
    if (data?.student) {
      toast.success(
        `Présence enregistrée pour ${data.student.firstName} ${data.student.lastName}`,
      );
    } else {
      toast.success("Présence enregistrée avec succès");
    }
  };

  const handleResetFilters = () => {
    setSelectedClassId("all");
    const currentYear = academicYears.find((y: any) => y.isCurrent);
    setSelectedAcademicYearId(currentYear?.id || "");
    setSearchTerm("");
    setStatusFilter("all");
    setValidationFilter("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedAttendances([]);
    setSelectMode(false);
  };

  const handleSelectAttendance = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedAttendances([...selectedAttendances, id]);
    } else {
      setSelectedAttendances(selectedAttendances.filter((i) => i !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAttendances(attendances.map((a) => a.id));
    } else {
      setSelectedAttendances([]);
    }
  };

  // Calcul des statistiques pour les cartes
  const attendanceStats = useMemo(() => {
    if (!attendances.length) {
      return {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        sick: 0,
        rate: 0,
      };
    }

    const total = attendances.length;
    const present = attendances.filter((a) => a.status === "PRESENT").length;
    const absent = attendances.filter((a) => a.status === "ABSENT").length;
    const late = attendances.filter((a) => a.status === "LATE").length;
    const excused = attendances.filter((a) => a.status === "EXCUSED").length;
    const sick = attendances.filter((a) => a.status === "SICK").length;

    return {
      total,
      present,
      absent,
      late,
      excused,
      sick,
      rate: total > 0 ? (present / total) * 100 : 0,
    };
  }, [attendances]);

  const isLoading = loading || classesLoading || yearsLoading;

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des présences
          </h1>
          <p className="text-muted-foreground mt-1">
            Suivez et gérez les présences des étudiants
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={selectMode ? "default" : "outline"}
            onClick={() => setSelectMode(!selectMode)}
          >
            {selectMode ? "Annuler la sélection" : "Sélection multiple"}
          </Button>
          <AttendanceExport
            attendances={attendances}
            classes={classes}
            academicYears={academicYears}
            defaultClassId={selectedClassId !== "all" ? selectedClassId : ""}
            defaultYearId={selectedAcademicYearId}
          />
          {selectMode && selectedAttendances.length > 0 && (
            <Button onClick={handleBulkValidation}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Valider {selectedAttendances.length}
            </Button>
          )}
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle présence
          </Button>
        </div>
      </div>

      {/* Nouvelle présence modal */}
      <NewAttendanceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleScanSuccess}
        classId={selectedClassId !== "all" ? selectedClassId : ""}
        academicYearId={selectedAcademicYearId}
      />

      {/* Filtres rapides */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Classe */}
            <div className="space-y-2">
              <Label>Classe</Label>
              <Select
                value={selectedClassId}
                onValueChange={setSelectedClassId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {classes.map((cls: any) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - {cls.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Année académique */}
            <div className="space-y-2">
              <Label>Année académique</Label>
              <Select
                value={selectedAcademicYearId}
                onValueChange={setSelectedAcademicYearId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Année académique" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year: any) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.year} {year.isCurrent ? "(En cours)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="PRESENT">Présent</SelectItem>
                  <SelectItem value="ABSENT">Absent</SelectItem>
                  <SelectItem value="LATE">Retard</SelectItem>
                  <SelectItem value="EXCUSED">Excusé</SelectItem>
                  <SelectItem value="SICK">Malade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Validation */}
            <div className="space-y-2">
              <Label>Validation</Label>
              <Select
                value={validationFilter}
                onValueChange={setValidationFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="VALIDATED">Validé</SelectItem>
                  <SelectItem value="REJECTED">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recherche */}
            <div className="space-y-2 md:col-span-2">
              <Label>Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nom, code étudiant..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Bouton reset */}
            <div className="flex items-end">
              <Button variant="outline" onClick={handleResetFilters}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-xs font-medium text-blue-700">
                  Total présences
                </p>
                <p className="text-2xl font-bold text-blue-900">{totalItems}</p>
              </div>
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-xs font-medium text-green-700">Présents</p>
                <p className="text-2xl font-bold text-green-900">
                  {attendanceStats.present}
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-xs font-medium text-amber-700">Absents</p>
                <p className="text-2xl font-bold text-amber-900">
                  {attendanceStats.absent}
                </p>
              </div>
              <CalendarDays className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-xs font-medium text-purple-700">
                  Taux présence
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {attendanceStats.rate.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression */}
      {selectedClassId !== "all" && totalItems > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Taux de présence</span>
                <span className="text-sm text-muted-foreground">
                  {attendanceStats.rate.toFixed(1)}% ({attendanceStats.present}/
                  {attendanceStats.total})
                </span>
              </div>
              <Progress value={attendanceStats.rate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as any)}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Séances
          </TabsTrigger>
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des présences...</p>
        </div>
      ) : (
        <>
          {/* List Tab */}
          {activeTab === "list" && (
            <>
              {attendances.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Aucune présence trouvée
                  </h3>
                  <p className="text-muted-foreground">
                    Aucune présence ne correspond à vos critères de recherche
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={handleResetFilters}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réinitialiser les filtres
                  </Button>
                </div>
              ) : (
                <>
                  {/* Sélecteur tout sélectionner en mode sélection */}
                  {selectMode && (
                    <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
                      <Checkbox
                        checked={
                          selectedAttendances.length === attendances.length &&
                          attendances.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                      <Label className="text-sm">
                        Tout sélectionner ({attendances.length})
                      </Label>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {selectedAttendances.length} sélectionnée(s)
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attendances.map((attendance) => (
                      <div key={attendance.id} className="relative">
                        {selectMode && (
                          <div className="absolute top-2 left-2 z-10">
                            <Checkbox
                              checked={selectedAttendances.includes(
                                attendance.id,
                              )}
                              onCheckedChange={(checked) =>
                                handleSelectAttendance(
                                  attendance.id,
                                  checked as boolean,
                                )
                              }
                            />
                          </div>
                        )}
                        <div className={selectMode ? "opacity-90" : ""}>
                          <AttendanceCard
                            attendance={attendance}
                            onView={() => handleViewDetails(attendance)}
                            onEdit={() => handleEditAttendance(attendance.id)}
                            showActions={!selectMode}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          {filters.page && filters.page > 1 && (
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() =>
                                  handlePageChange((filters.page || 1) - 1)
                                }
                              />
                            </PaginationItem>
                          )}
                          {Array.from(
                            { length: Math.min(totalPages, 5) },
                            (_, i) => {
                              const currentPage = filters.page || 1;
                              let pageNum = i + 1;
                              if (totalPages > 5 && currentPage > 3) {
                                pageNum = currentPage - 2 + i;
                                if (pageNum > totalPages) return null;
                              }
                              return (
                                <PaginationItem key={pageNum}>
                                  <PaginationLink
                                    onClick={() => handlePageChange(pageNum)}
                                    isActive={pageNum === currentPage}
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            },
                          )}
                          {(filters.page || 1) < totalPages && (
                            <PaginationItem>
                              <PaginationNext
                                onClick={() =>
                                  handlePageChange((filters.page || 1) + 1)
                                }
                              />
                            </PaginationItem>
                          )}
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Sessions Tab (supervision des appels par séance) */}
          {activeTab === "sessions" && (
            <SessionAttendanceSupervision
              academicYearId={selectedAcademicYearId}
              classId={selectedClassId}
            />
          )}

          {/* Scan Tab */}
          {activeTab === "scan" && (
            <div className="max-w-md mx-auto">
              <AttendanceScanner
                classId={selectedClassId !== "all" ? selectedClassId : ""}
                session="FULL_DAY"
                onSuccess={handleScanSuccess}
                onError={(err) => toast.error(err)}
              />
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && stats && (
            <div className="grid grid-cols-1 gap-6">
              <AttendanceStats
                stats={{
                  totalDays: stats.totalStudents || 0,
                  presentDays: stats.todayStats?.present || 0,
                  absentDays: stats.todayStats?.absent || 0,
                  lateDays: 0,
                  excusedDays: 0,
                  sickDays: 0,
                  attendanceRate: stats.todayStats?.rate || 0,
                  punctualityRate: 0,
                }}
                title="Statistiques du jour"
              />

              {/* Statistiques par classe */}
              {stats.classStats && stats.classStats.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Statistiques par classe
                    </h3>
                    <div className="space-y-3">
                      {stats.classStats.map((cls: any) => (
                        <div
                          key={cls.classId}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{cls.className}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {cls.totalAttendances} présences
                            </span>
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              {cls.totalStudents} élèves
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}

      {/* Modaux */}
      <AttendanceDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        attendance={selectedAttendance}
        onUpdate={loadAttendances}
      />

      <BulkValidationModal
        open={bulkValidationOpen}
        onOpenChange={setBulkValidationOpen}
        attendances={attendances.filter((a) =>
          selectedAttendances.includes(a.id),
        )}
        onSuccess={() => {
          loadAttendances();
          setSelectedAttendances([]);
          setSelectMode(false);
        }}
      />
    </div>
  );
};
