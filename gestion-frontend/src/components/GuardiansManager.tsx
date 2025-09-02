import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Heart,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
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
import { useAcademicStore } from "../store/academicStore";
import { Guardian } from "../types/academic";

export const GuardiansManager = () => {
  const { guardians, students, addGuardian, updateGuardian, deleteGuardian } =
    useAcademicStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(
    null
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Guardian | "studentName";
    direction: "ascending" | "descending";
  } | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    relationship: "",
    phone: "",
    email: "",
    address: "",
    studentId: "",
  });

  const handleSubmit = () => {
    if (formData.firstName && formData.lastName && formData.studentId) {
      const guardianData: Guardian = {
        id: selectedGuardian?.id || crypto.randomUUID(),
        ...formData,
        isPrimary: false,
      };

      if (selectedGuardian) {
        updateGuardian(selectedGuardian.id, guardianData);
      } else {
        addGuardian(guardianData);
      }

      setIsFormOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      relationship: "",
      phone: "",
      email: "",
      address: "",
      studentId: "",
    });
    setSelectedGuardian(null);
  };

  const handleEdit = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setFormData({
      firstName: guardian.firstName,
      lastName: guardian.lastName,
      relationship: guardian.relationship,
      phone: guardian.phone,
      email: guardian.email,
      address: guardian.address,
      studentId: guardian.studentId,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (guardianId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce tuteur ?")) {
      deleteGuardian(guardianId);
    }
  };

  const handleSort = (key: keyof Guardian | "studentName") => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredGuardians = guardians.filter((guardian) => {
    const student = students.find((s) => s.id === guardian.studentId);
    const guardianName =
      `${guardian.firstName} ${guardian.lastName}`.toLowerCase();
    const studentName = student
      ? `${student.firstName} ${student.lastName}`.toLowerCase()
      : "";

    return (
      guardianName.includes(searchTerm.toLowerCase()) ||
      studentName.includes(searchTerm.toLowerCase()) ||
      guardian.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Trier les données si nécessaire
  let sortedGuardians = [...filteredGuardians];
  if (sortConfig !== null) {
    sortedGuardians.sort((a, b) => {
      let aValue: any, bValue: any;

      if (sortConfig.key === "studentName") {
        const studentA = students.find((s) => s.id === a.studentId);
        const studentB = students.find((s) => s.id === b.studentId);
        aValue = studentA ? `${studentA.firstName} ${studentA.lastName}` : "";
        bValue = studentB ? `${studentB.firstName} ${studentB.lastName}` : "";
      } else {
        aValue = a[sortConfig.key as keyof Guardian];
        bValue = b[sortConfig.key as keyof Guardian];
      }

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }

  const SortIcon = ({
    columnKey,
  }: {
    columnKey: keyof Guardian | "studentName";
  }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronDown className="h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestion des Tuteurs
          </h1>
          <p className="text-muted-foreground">
            Gérez les tuteurs et responsables des étudiants
          </p>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={resetForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Tuteur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedGuardian ? "Modifier Tuteur" : "Ajouter un tuteur"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="Prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Nom"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Étudiant</Label>
                <Select
                  value={formData.studentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, studentId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un étudiant" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} (
                        {student.studentId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Relation</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) =>
                    setFormData({ ...formData, relationship: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Relation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Père">Père</SelectItem>
                    <SelectItem value="Mère">Mère</SelectItem>
                    <SelectItem value="Tuteur">Tuteur</SelectItem>
                    <SelectItem value="Oncle">Oncle</SelectItem>
                    <SelectItem value="Tante">Tante</SelectItem>
                    <SelectItem value="Grand-parent">Grand-parent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Téléphone"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label>Adresse</Label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Adresse"
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSubmit}>
                  {selectedGuardian ? "Modifier" : "Ajouter"}
                </Button>
                <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un tuteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th
                    className="text-left py-3 px-4 font-medium cursor-pointer"
                    onClick={() => handleSort("firstName")}
                  >
                    <div className="flex items-center">
                      <span>Nom</span>
                      <SortIcon columnKey="firstName" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 font-medium cursor-pointer"
                    onClick={() => handleSort("relationship")}
                  >
                    <div className="flex items-center">
                      <span>Relation</span>
                      <SortIcon columnKey="relationship" />
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 font-medium cursor-pointer"
                    onClick={() => handleSort("studentName")}
                  >
                    <div className="flex items-center">
                      <span>Étudiant</span>
                      <SortIcon columnKey="studentName" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Contact</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedGuardians.map((guardian) => {
                  const student = students.find(
                    (s) => s.id === guardian.studentId
                  );

                  return (
                    <tr
                      key={guardian.id}
                      className="border-b hover:bg-muted/30"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white mr-3">
                            <Heart className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {guardian.firstName} {guardian.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {guardian.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{guardian.relationship}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {student ? (
                          <div>
                            <div className="font-medium">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {student.studentId}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Non assigné
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                            {guardian.phone || "Non renseigné"}
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="truncate max-w-xs">
                              {guardian.address || "Non renseignée"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(guardian)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(guardian.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {sortedGuardians.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun tuteur trouvé</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
