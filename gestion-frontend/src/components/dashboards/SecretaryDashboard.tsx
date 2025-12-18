import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  UserPlus,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Phone,
  Mail,
  Printer,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// import { useAcademicStore } from "@/store/studentStore";
// import { usePaymentStore } from "@/store/paymentStore";
import { useEnrollmentStore } from "@/store/enrollmentStore";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useStudentStore from "@/store/studentStore";

const SecretaryDashboard = () => {
  const { toast } = useToast();
  const { students, fetchStudents } = useStudentStore();
  // const { payments, fetchPayments } = usePaymentStore();
  const { enrollments, fetchEnrollments } = useEnrollmentStore();

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [todayTasks, setTodayTasks] = useState([
    {
      id: 1,
      title: "Traiter inscriptions en attente",
      count: 5,
      priority: "high",
    },
    {
      id: 2,
      title: "Générer cartes étudiantes",
      count: 12,
      priority: "medium",
    },
    { id: 3, title: "Envoyer rappels paiement", count: 8, priority: "high" },
    {
      id: 4,
      title: "Mettre à jour contacts parents",
      count: 3,
      priority: "low",
    },
    { id: 5, title: "Préparer bulletins", count: 15, priority: "medium" },
  ]);

  const [pendingEnrollments, setPendingEnrollments] = useState([
    {
      id: 1,
      studentName: "Jean Dupont",
      program: "Licence Sciences",
      date: "2024-03-15",
      status: "pending",
    },
    {
      id: 2,
      studentName: "Marie Curie",
      program: "Master Biologie",
      date: "2024-03-14",
      status: "pending",
    },
    {
      id: 3,
      studentName: "Albert Einstein",
      program: "Doctorat Physique",
      date: "2024-03-13",
      status: "approved",
    },
    {
      id: 4,
      studentName: "Ada Lovelace",
      program: "Licence Informatique",
      date: "2024-03-12",
      status: "pending",
    },
    {
      id: 5,
      studentName: "Nikola Tesla",
      program: "Master Électricité",
      date: "2024-03-11",
      status: "rejected",
    },
  ]);

  const [recentPayments, setRecentPayments] = useState([
    {
      id: 1,
      student: "Jean Dupont",
      amount: 50000,
      date: "2024-03-15",
      method: "Cash",
      status: "completed",
    },
    {
      id: 2,
      student: "Marie Curie",
      amount: 75000,
      date: "2024-03-14",
      method: "Transfert",
      status: "completed",
    },
    {
      id: 3,
      student: "Albert Einstein",
      amount: 60000,
      date: "2024-03-13",
      method: "Mobile Money",
      status: "pending",
    },
    {
      id: 4,
      student: "Ada Lovelace",
      amount: 45000,
      date: "2024-03-12",
      method: "Cash",
      status: "completed",
    },
    {
      id: 5,
      student: "Nikola Tesla",
      amount: 80000,
      date: "2024-03-11",
      method: "Transfert",
      status: "failed",
    },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchStudents(), fetchEnrollments()]);

      toast({
        title: "Données chargées",
        description: "Les données ont été mises à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEnrollment = (id: number) => {
    setPendingEnrollments((prev) =>
      prev.map((enrollment) =>
        enrollment.id === id
          ? { ...enrollment, status: "approved" }
          : enrollment
      )
    );
    toast({
      title: "Inscription approuvée",
      description: "L'inscription a été approuvée avec succès",
    });
  };

  const handleProcessPayment = (id: number) => {
    setRecentPayments((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, status: "completed" } : payment
      )
    );
    toast({
      title: "Paiement traité",
      description: "Le paiement a été marqué comme complet",
    });
  };

  const QuickStatCard = ({
    title,
    value,
    icon: Icon,
    color = "primary",
    action,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color?: string;
    action?: () => void;
  }) => (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={action}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div
            className={`p-3 rounded-full ${
              color === "primary"
                ? "bg-primary/10"
                : color === "success"
                ? "bg-green-100"
                : color === "warning"
                ? "bg-yellow-100"
                : "bg-blue-100"
            }`}
          >
            <Icon
              className={`h-6 w-6 ${
                color === "primary"
                  ? "text-primary"
                  : color === "success"
                  ? "text-green-600"
                  : color === "warning"
                  ? "text-yellow-600"
                  : "text-blue-600"
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TaskCard = ({ task }: { task: any }) => (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{task.title}</p>
            <div className="flex items-center mt-2">
              <Badge
                variant={
                  task.priority === "high"
                    ? "destructive"
                    : task.priority === "medium"
                    ? "default"
                    : "secondary"
                }
              >
                {task.count} {task.count === 1 ? "élément" : "éléments"}
              </Badge>
              {task.priority === "high" && (
                <AlertCircle className="h-4 w-4 text-red-500 ml-2" />
              )}
            </div>
          </div>
          <Button size="sm">Traiter</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de bord Secrétaire
          </h1>
          <p className="text-muted-foreground">
            Bienvenue, gestion des inscriptions et administration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Nouvelle inscription
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
        </div>
      </div>

      {/* Recherche et filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un étudiant, un paiement..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
              <Button variant="outline" onClick={loadData} disabled={loading}>
                Actualiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickStatCard
          title="Inscriptions aujourd'hui"
          value={3}
          icon={UserPlus}
          color="primary"
        />
        <QuickStatCard
          title="Paiements en attente"
          value={8}
          icon={DollarSign}
          color="warning"
        />
        <QuickStatCard
          title="Étudiants actifs"
          value={students.length}
          icon={Users}
          color="success"
        />
        <QuickStatCard
          title="Tâches urgentes"
          value={5}
          icon={AlertCircle}
          color="destructive"
        />
      </div>

      {/* Tâches du jour */}
      <Card>
        <CardHeader>
          <CardTitle>Tâches pour aujourd'hui</CardTitle>
          <CardDescription>Priorités et actions à traiter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tableaux côte à côte */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inscriptions en attente */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inscriptions en attente</CardTitle>
                <CardDescription>Approbations nécessaires</CardDescription>
              </div>
              <Badge variant="outline">
                {
                  pendingEnrollments.filter((e) => e.status === "pending")
                    .length
                }{" "}
                en attente
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Programme</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell className="font-medium">
                      {enrollment.studentName}
                    </TableCell>
                    <TableCell>{enrollment.program}</TableCell>
                    <TableCell>{enrollment.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          enrollment.status === "approved"
                            ? "default"
                            : enrollment.status === "pending"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {enrollment.status === "approved"
                          ? "Approuvé"
                          : enrollment.status === "pending"
                          ? "En attente"
                          : "Rejeté"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleApproveEnrollment(enrollment.id)}
                          disabled={enrollment.status !== "pending"}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Paiements récents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Paiements récents</CardTitle>
                <CardDescription>Dernières transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {payment.student}
                    </TableCell>
                    <TableCell>{payment.amount.toLocaleString()} HTG</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "completed"
                            ? "default"
                            : payment.status === "pending"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {payment.status === "completed"
                          ? "Complet"
                          : payment.status === "pending"
                          ? "En attente"
                          : "Échoué"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payment.status === "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleProcessPayment(payment.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides et communication */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accès direct aux fonctions fréquentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <UserPlus className="h-5 w-5 mb-2" />
                <span className="text-sm">Nouvelle inscription</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <FileText className="h-5 w-5 mb-2" />
                <span className="text-sm">Générer carte</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Printer className="h-5 w-5 mb-2" />
                <span className="text-sm">Imprimer bulletin</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Mail className="h-5 w-5 mb-2" />
                <span className="text-sm">Envoyer email</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <DollarSign className="h-5 w-5 mb-2" />
                <span className="text-sm">Enregistrer paiement</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col">
                <Calendar className="h-5 w-5 mb-2" />
                <span className="text-sm">Voir calendrier</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication rapide</CardTitle>
            <CardDescription>Contacts fréquents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Direction</p>
                    <p className="text-sm text-muted-foreground">
                      Contact administratif
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Comptabilité</p>
                    <p className="text-sm text-muted-foreground">
                      Questions financières
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Archives</p>
                    <p className="text-sm text-muted-foreground">
                      Documents anciens
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecretaryDashboard;
