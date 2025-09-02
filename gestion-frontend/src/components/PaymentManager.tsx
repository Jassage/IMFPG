import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Payment } from "../types/academic";
import {
  DollarSign,
  Plus,
  Edit2,
  Check,
  X,
  Clock,
  AlertTriangle,
  Search,
  ChevronsUpDown,
  Filter,
  TrendingUp,
  Calendar,
  User,
  CreditCard,
  Loader2,
  Wallet,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePaymentStore } from "@/store/paymentStore";
import { useAcademicStore } from "@/store/studentStore";
import { useAcademicYearStore } from "@/store/academicYearStore";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

export const PaymentManager = () => {
  const { fetchPayments, payments, addPayment, updatePayment, isLoading } =
    usePaymentStore();
  const { students, fetchStudents } = useAcademicStore();
  const { academicYears, fetchAcademicYears } = useAcademicYearStore();

  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Trouver l'année académique courante par défaut
  const currentAcademicYear = useMemo(() => {
    return academicYears.find((ay) => ay.isCurrent) || academicYears[0];
  }, [academicYears]);

  const [formData, setFormData] = useState({
    studentId: "",
    amount: 0,
    type: "Scolarité" as Payment["type"],
    status: "En attente" as Payment["status"],
    moyen: "Cash" as Payment["moyen"],
    description: "",
    academicYearId: currentAcademicYear?.id || "",
  });

  useEffect(() => {
    fetchPayments();
    fetchStudents();
    fetchAcademicYears();
  }, [fetchPayments, fetchStudents, fetchAcademicYears]);

  // Mettre à jour le formData quand l'année académique courante change
  useEffect(() => {
    if (currentAcademicYear && !formData.academicYearId) {
      setFormData((prev) => ({
        ...prev,
        academicYear: currentAcademicYear.id,
      }));
    }
  }, [currentAcademicYear, formData.academicYearId]);

  const [open, setOpen] = useState(false);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;

    return students.filter((student) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower)
      );
    });
  }, [students, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trouver l'année académique sélectionnée
    const academicYearObj = academicYears.find(
      (ay) => ay.id === formData.academicYearId
    );
    if (!academicYearObj) {
      // Toast.error("Veuillez sélectionner une année académique valide");
      return;
    }

    const payment: Payment = {
      id: editingPayment?.id || `payment_${Date.now()}`,
      ...formData,
      academicYear: academicYearObj.year, // Stocker l'année (ex: "2024-2025")
      academicYearId: academicYearObj.id, // Stocker l'ID de l'année
      paidDate:
        formData.status === "Payé"
          ? new Date().toISOString().split("T")[0]
          : undefined,
    };

    if (editingPayment) {
      updatePayment(editingPayment.id, payment);
    } else {
      addPayment(payment);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      amount: 0,
      type: "Scolarité",
      status: "En attente",
      moyen: "Cash",
      description: "",
      academicYearId: currentAcademicYear?.id || "",
    });
    setEditingPayment(null);
    setShowForm(false);
    setSearchTerm("");
  };

  const handleEdit = (payment: Payment) => {
    setFormData({
      studentId: payment.studentId,
      amount: payment.amount,
      type: payment.type,
      status: payment.status,
      moyen: payment.moyen,
      description: payment.description || "",
      academicYearId: payment.academicYearId || currentAcademicYear?.id || "",
    });
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleStatusUpdate = (paymentId: string, status: Payment["status"]) => {
    const updateData: Partial<Payment> = { status };
    if (status === "Payé") {
      updateData.paidDate = new Date().toISOString().split("T")[0];
    }
    updatePayment(paymentId, updateData);
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student
      ? `${student.firstName} ${student.lastName}`
      : "Étudiant non trouvé";
  };

  const getAcademicYearLabel = (academicYearId: string) => {
    const academicYear = academicYears.find((ay) => ay.id === academicYearId);
    return academicYear ? academicYear.year : "Année inconnue";
  };

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "Payé":
        return (
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            Payé
          </Badge>
        );
      case "En attente":
        return (
          <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
            En attente
          </Badge>
        );
      case "Annulé":
        return (
          <Badge className="bg-gray-500 text-white hover:bg-gray-600">
            Annulé
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMoyenBadge = (moyen: Payment["moyen"]) => {
    const colors = {
      Cash: "bg-blue-100 text-blue-800 border-blue-200",
      Natcash: "bg-purple-100 text-purple-800 border-purple-200",
      Moncash: "bg-orange-100 text-orange-800 border-orange-200",
      Sogebank: "bg-green-100 text-green-800 border-green-200",
      Fonkoze: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <Badge variant="outline" className={colors[moyen]}>
        {moyen}
      </Badge>
    );
  };

  const filteredPayments = useMemo(() => {
    let result = payments;

    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter((payment) => payment.status === activeTab);
    }

    // Filter by student
    if (selectedStudent && selectedStudent !== "ALL_STUDENTS") {
      result = result.filter(
        (payment) => payment.studentId === selectedStudent
      );
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== "ALL_STATUSES") {
      result = result.filter((payment) => payment.status === selectedStatus);
    }

    // Filter by academic year
    if (selectedAcademicYear && selectedAcademicYear !== "ALL_YEARS") {
      result = result.filter(
        (payment) => payment.academicYearId === selectedAcademicYear
      );
    }

    return result;
  }, [
    payments,
    activeTab,
    selectedStudent,
    selectedStatus,
    selectedAcademicYear,
  ]);

  const getPaymentStats = () => {
    const total = filteredPayments.length;
    const paid = filteredPayments.filter((p) => p.status === "Payé").length;
    const pending = filteredPayments.filter(
      (p) => p.status === "En attente"
    ).length;
    const cancelled = filteredPayments.filter(
      (p) => p.status === "Annulé"
    ).length;
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = filteredPayments
      .filter((p) => p.status === "Payé")
      .reduce((sum, p) => sum + p.amount, 0);

    return { total, paid, pending, cancelled, totalAmount, paidAmount };
  };

  const stats = getPaymentStats();
  const paymentProgress =
    stats.total > 0 ? (stats.paid / stats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestion des Paiements
          </h2>
          <p className="text-muted-foreground">
            Suivez et gérez tous les paiements des étudiants
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          Nouveau Paiement
        </Button>
      </div>

      {/* Filtres avec onglets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="Payé">Payés</TabsTrigger>
              <TabsTrigger value="En attente">En attente</TabsTrigger>
              <TabsTrigger value="Annulé">Annulés</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Étudiant</Label>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les étudiants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_STUDENTS">
                    Tous les étudiants
                  </SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} -{" "}
                      {student.studentId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_STATUSES">Tous les statuts</SelectItem>
                  <SelectItem value="Payé">Payé</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Année académique</Label>
              <Select
                value={selectedAcademicYear}
                onValueChange={setSelectedAcademicYear}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les années" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_YEARS">Toutes les années</SelectItem>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.year}
                      {year.isCurrent && " (En cours)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques avec design amélioré */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Total des paiements
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-200">
                <DollarSign className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Payés</p>
                <p className="text-3xl font-bold text-green-900">
                  {stats.paid}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-200">
                <Check className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">
                  En attente
                </p>
                <p className="text-3xl font-bold text-yellow-900">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-200">
                <Clock className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Annulés</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.cancelled}
                </p>
              </div>
              <div className="p-3 rounded-full bg-gray-200">
                <X className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Progression des paiements</p>
            <span className="text-sm font-bold">
              {Math.round(paymentProgress)}%
            </span>
          </div>
          <Progress value={paymentProgress} className="h-3" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{stats.paid} payés</span>
            <span>{stats.total - stats.paid} restants</span>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire avec animation */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-blue-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {editingPayment ? "Modifier" : "Ajouter"} un Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Étudiant *</Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                          >
                            {formData.studentId
                              ? students.find(
                                  (student) => student.id === formData.studentId
                                )?.firstName +
                                " " +
                                students.find(
                                  (student) => student.id === formData.studentId
                                )?.lastName
                              : "Sélectionner un étudiant..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder="Rechercher un étudiant..."
                              value={searchTerm}
                              onValueChange={setSearchTerm}
                            />
                            <CommandList>
                              <CommandEmpty>Aucun étudiant trouvé</CommandEmpty>
                              <CommandGroup>
                                {filteredStudents.map((student) => (
                                  <CommandItem
                                    key={student.id}
                                    value={student.id}
                                    onSelect={() => {
                                      setFormData({
                                        ...formData,
                                        studentId: student.id,
                                      });
                                      setOpen(false);
                                      setSearchTerm("");
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        formData.studentId === student.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {student.firstName} {student.lastName} (
                                    {student.studentId})
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Année académique *</Label>
                      <Select
                        value={formData.academicYearId}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            academicYearId: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une année" />
                        </SelectTrigger>
                        <SelectContent>
                          {academicYears.map((year) => (
                            <SelectItem key={year.id} value={year.id}>
                              {year.year}
                              {year.isCurrent && " (En cours)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type de paiement *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            type: value as Payment["type"],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inscription">
                            Inscription
                          </SelectItem>
                          <SelectItem value="Scolarité">Scolarité</SelectItem>
                          <SelectItem value="Examen">Examen</SelectItem>
                          <SelectItem value="Certificat">Certificat</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Moyen de paiement *</Label>
                      <Select
                        value={formData.moyen}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            moyen: value as Payment["moyen"],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un moyen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Natcash">Natcash</SelectItem>
                          <SelectItem value="Moncash">Moncash</SelectItem>
                          <SelectItem value="Sogebank">Sogebank</SelectItem>
                          <SelectItem value="Fonkoze">Fonkoze</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Montant (HTG) *</Label>
                      <Input
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.00"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Statut *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            status: value as Payment["status"],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="En attente">En attente</SelectItem>
                          <SelectItem value="Payé">Payé</SelectItem>
                          <SelectItem value="Annulé">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description du paiement..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit">
                      {editingPayment ? "Modifier" : "Ajouter"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Liste des paiements avec design amélioré */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            Paiements ({filteredPayments.length})
          </h3>
          <span className="text-sm text-muted-foreground">
            {stats.paidAmount.toLocaleString()} HTG collectés sur{" "}
            {stats.totalAmount.toLocaleString()} HTG
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPayments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg">Aucun paiement trouvé</p>
              <p className="text-sm">
                Essayez de modifier vos filtres ou ajoutez un nouveau paiement
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {filteredPayments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div
                          className={cn(
                            "w-2 md:w-1 md:h-auto flex-shrink-0",
                            payment.status === "Payé" && "bg-green-500",
                            payment.status === "En attente" && "bg-yellow-500",
                            payment.status === "Annulé" && "bg-gray-500"
                          )}
                        ></div>

                        <div className="flex-1 p-4">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold">
                                  {getStudentName(payment.studentId)}
                                </h3>
                                {getStatusBadge(payment.status)}
                                {getMoyenBadge(payment.moyen)}
                                <Badge
                                  variant="outline"
                                  className="bg-gray-100"
                                >
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  {payment.academicYear}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div className="space-y-1">
                                  <p className="flex items-center gap-2">
                                    <CreditCard className="h-3 w-3" />
                                    <span>{payment.type}</span>
                                  </p>
                                  <p className="flex items-center gap-2">
                                    <DollarSign className="h-3 w-3" />
                                    <span className="font-medium text-foreground">
                                      {payment.amount.toLocaleString()} HTG
                                    </span>
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="flex items-center gap-2">
                                    <Wallet className="h-3 w-3" />
                                    <span>Moyen: {payment.moyen}</span>
                                  </p>
                                  {payment.paidDate && (
                                    <p className="flex items-center gap-2">
                                      <Check className="h-3 w-3" />
                                      <span>
                                        Payé le:{" "}
                                        {new Date(
                                          payment.paidDate
                                        ).toLocaleDateString("fr-FR")}
                                      </span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              {payment.description && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {payment.description}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                              {payment.status !== "Payé" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleStatusUpdate(payment.id, "Payé")
                                  }
                                  className="text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50"
                                >
                                  Marquer comme payé
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(payment)}
                              >
                                <Edit2 className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
