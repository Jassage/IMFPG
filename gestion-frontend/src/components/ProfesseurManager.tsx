import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Filter,
  Calendar,
  Download,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  UserPlus,
  Shield,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useProfessorStore } from "../store/professorStore";
import { Professeur } from "../types/academic";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

export const ProfesseurManager = () => {
  const {
    professors,
    assignments,
    loading,
    error,
    fetchProfessors,
    fetchProfessorAssignments,
    addProfessor,
    updateProfessor,
    deleteProfessor,
    bulkUpdateStatus, // Cette fonction existe maintenant
  } = useProfessorStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProfessor, setSelectedProfessor] = useState<Professeur | null>(
    null
  );
  const [isProfessorFormOpen, setIsProfessorFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    speciality: "",
    status: "Actif" as "Actif" | "Inactif",
  });
  const [selectedProfessors, setSelectedProfessors] = useState<Set<string>>(
    new Set()
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Professeur;
    direction: "asc" | "desc";
  }>({ key: "lastName", direction: "asc" });

  useEffect(() => {
    fetchProfessors();
  }, [fetchProfessors]);

  useEffect(() => {
    if (selectedProfessor) {
      fetchProfessorAssignments(selectedProfessor.id);
    }
  }, [selectedProfessor, fetchProfessorAssignments]);

  const handleSubmitProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedProfessor) {
        await updateProfessor(selectedProfessor.id, formData);
        toast({
          title: "Succès",
          description: "Professeur modifié avec succès",
        });
      } else {
        await addProfessor(formData);
        toast({
          title: "Succès",
          description: "Professeur ajouté avec succès",
        });
      }
      setIsProfessorFormOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      speciality: "",
      status: "Actif" as const,
    });
    setSelectedProfessor(null);
  };

  const handleEdit = (professor: Professeur) => {
    setSelectedProfessor(professor);
    setFormData({
      firstName: professor.firstName,
      lastName: professor.lastName,
      email: professor.email,
      phone: professor.phone || "",
      speciality: professor.speciality || "",
      status: professor.status,
    });
    setIsProfessorFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce professeur ?")) {
      try {
        await deleteProfessor(id);
        toast({
          title: "Succès",
          description: "Professeur supprimé avec succès",
        });
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la suppression",
          variant: "destructive",
        });
      }
    }
  };

  const handleBulkStatusChange = async (status: "Actif" | "Inactif") => {
    if (selectedProfessors.size === 0) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner au moins un professeur",
        variant: "destructive",
      });
      return;
    }

    try {
      await bulkUpdateStatus(Array.from(selectedProfessors), status);
      toast({
        title: "Succès",
        description: `Statut de ${selectedProfessors.size} professeur(s) modifié(s)`,
      });
      setSelectedProfessors(new Set());
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = () => {
    if (
      selectedProfessors.size === filteredProfessors.length &&
      filteredProfessors.length > 0
    ) {
      setSelectedProfessors(new Set());
    } else {
      setSelectedProfessors(new Set(filteredProfessors.map((prof) => prof.id)));
    }
  };

  const handleSelectProfessor = (id: string) => {
    const newSelected = new Set(selectedProfessors);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProfessors(newSelected);
  };

  const handleSort = (key: keyof Professeur) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const exportToExcel = () => {
    const data = filteredProfessors.map((professor) => ({
      ID: professor.id,
      Prénom: professor.firstName,
      Nom: professor.lastName,
      Email: professor.email,
      Téléphone: professor.phone || "",
      Spécialité: professor.speciality || "",
      Statut: professor.status,
      "Date de création": professor.createdAt
        ? new Date(professor.createdAt).toLocaleDateString()
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Professeurs");
    XLSX.writeFile(workbook, "professeurs.xlsx");

    toast({
      title: "Export réussi",
      description: `${filteredProfessors.length} professeur(s) exporté(s)`,
    });
  };

  const filteredProfessors = professors
    .filter(
      (professor) =>
        (professor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          professor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          professor.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || professor.status === statusFilter)
    )
    .sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  if (loading)
    return <div className="flex justify-center p-8">Chargement...</div>;
  if (error) return <div className="text-red-500 p-4">Erreur: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Gestion des Professeurs
          </h1>
          <p className="text-muted-foreground">
            Administration des professeurs et de leurs affectations
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>

          <Dialog
            open={isProfessorFormOpen}
            onOpenChange={setIsProfessorFormOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Professeur
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {selectedProfessor
                    ? "Modifier le Professeur"
                    : "Ajouter un Professeur"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitProfessor} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prénom *</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom *</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Spécialité</Label>
                    <Input
                      value={formData.speciality}
                      onChange={(e) =>
                        setFormData({ ...formData, speciality: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as "Actif" | "Inactif",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actif">Actif</SelectItem>
                      <SelectItem value="Inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsProfessorFormOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">
                    {selectedProfessor ? "Modifier" : "Ajouter"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un professeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="Actif">Actifs</SelectItem>
                  <SelectItem value="Inactif">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedProfessors.size > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange("Actif")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Activer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange("Inactif")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Désactiver
                </Button>
                <Badge variant="secondary" className="ml-2">
                  {selectedProfessors.size} sélectionné(s)
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Professors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des professeurs</CardTitle>
          <CardDescription>
            {filteredProfessors.length} professeur(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedProfessors.size === filteredProfessors.length &&
                        filteredProfessors.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort("lastName")}
                  >
                    Nom
                    {sortConfig.key === "lastName" &&
                      (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort("firstName")}
                  >
                    Prénom
                    {sortConfig.key === "firstName" &&
                      (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Spécialité</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSort("status")}
                  >
                    Statut
                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessors.map((professor) => (
                  <TableRow key={professor.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProfessors.has(professor.id)}
                        onCheckedChange={() =>
                          handleSelectProfessor(professor.id)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {professor.lastName}
                    </TableCell>
                    <TableCell>{professor.firstName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {professor.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {professor.phone || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {professor.speciality || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          professor.status === "Actif" ? "default" : "secondary"
                        }
                      >
                        {professor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              window.location.href = `/professeurs/${professor.id}`;
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(professor)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(professor.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProfessors.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun professeur trouvé</p>
              {searchTerm || statusFilter !== "all" ? (
                <p className="text-sm">
                  Essayez de modifier vos critères de recherche
                </p>
              ) : (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsProfessorFormOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter le premier professeur
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{professors.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {professors.filter((p) => p.status === "Actif").length}
                </p>
                <p className="text-sm text-muted-foreground">Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {professors.filter((p) => p.status === "Inactif").length}
                </p>
                <p className="text-sm text-muted-foreground">Inactifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{assignments.length}</p>
                <p className="text-sm text-muted-foreground">Affectations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
