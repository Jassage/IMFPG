import { useState, useEffect } from "react";
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
  Users,
  UserCheck,
  Link,
  UserPlus,
  Shield,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
// import { useGuardianStore } from "../store/guardianStore";
import { Guardian, Student } from "../types/academic";
import { ScrollArea } from "@/components/ui/scroll-area";
import useStudentStore from "@/store/studentStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { api } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import api from "@/services/api";
import { useGuardianStore } from "@/store/guardianStore";

export const GuardiansManager = () => {
  const { students, fetchStudents } = useStudentStore();
  const {
    guardians,
    loading: guardiansLoading,
    error: guardiansError,
    fetchGuardians,
    addGuardian,
    updateGuardian,
    deleteGuardian,
    setPrimaryGuardian,
    clearError,
  } = useGuardianStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isParentFormOpen, setIsParentFormOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(
    null
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Guardian | "studentName" | "parentAccount";
    direction: "ascending" | "descending";
  } | null>(null);

  // État du formulaire guardian
  const [guardianFormData, setGuardianFormData] = useState({
    firstName: "",
    lastName: "",
    relationship: "Père",
    phone: "",
    email: "",
    address: "",
    studentId: "",
    isPrimary: false,
    linkToParent: false,
    parentId: "",
    createParentAccount: false,
    notes: "",
  });

  // État du formulaire parent
  const [parentFormData, setParentFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    children: [] as string[],
    address: "",
    sendWelcomeEmail: true,
  });

  // Charger les données au montage
  useEffect(() => {
    fetchGuardians();
    fetchStudents();
  }, [fetchGuardians, fetchStudents]);

  // Réinitialiser le formulaire guardian
  const resetGuardianForm = () => {
    setGuardianFormData({
      firstName: "",
      lastName: "",
      relationship: "Père",
      phone: "",
      email: "",
      address: "",
      studentId: "",
      isPrimary: false,
      linkToParent: false,
      parentId: "",
      createParentAccount: false,
      notes: "",
    });
    setSelectedGuardian(null);
  };

  // Réinitialiser le formulaire parent
  const resetParentForm = () => {
    setParentFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      children: [],
      address: "",
      sendWelcomeEmail: true,
    });
  };

  // Rechercher un parent existant
  const searchExistingParent = async () => {
    if (!guardianFormData.email && !guardianFormData.phone) {
      alert(
        "Veuillez entrer un email ou un numéro de téléphone pour rechercher"
      );
      return;
    }

    try {
      const response = await api.post("/guardians/find-parent", {
        email: guardianFormData.email,
        phone: guardianFormData.phone,
      });

      if (response.data.success) {
        const { action, parent, guardian } = response.data.data;

        switch (action) {
          case "existingParent":
            // Remplir automatiquement les champs
            setGuardianFormData((prev) => ({
              ...prev,
              firstName: parent.user.firstName,
              lastName: parent.user.lastName,
              email: parent.user.email,
              phone: parent.user.phone || prev.phone,
              linkToParent: true,
              parentId: parent.id,
            }));
            break;

          case "createFromGuardian":
            // Proposer de créer un compte
            setGuardianFormData((prev) => ({
              ...prev,
              firstName: guardian.firstName,
              lastName: guardian.lastName,
              email: guardian.email || prev.email,
              phone: guardian.phone,
              createParentAccount: true,
            }));
            break;

          default:
            alert("Aucun parent ou tuteur trouvé avec ces coordonnées");
            break;
        }
      }
    } catch (error: any) {
      console.error("Erreur recherche parent:", error);
      alert(error.response?.data?.message || "Erreur lors de la recherche");
    }
  };

  // Gérer la soumission du formulaire guardian
  const handleGuardianSubmit = async () => {
    if (
      !guardianFormData.firstName ||
      !guardianFormData.lastName ||
      !guardianFormData.studentId
    ) {
      alert("Veuillez remplir le prénom, le nom et sélectionner un étudiant");
      return;
    }

    if (!guardianFormData.phone) {
      alert("Le numéro de téléphone est obligatoire");
      return;
    }

    try {
      const guardianData = {
        firstName: guardianFormData.firstName,
        lastName: guardianFormData.lastName,
        relationship: guardianFormData.relationship,
        phone: guardianFormData.phone,
        email: guardianFormData.email || undefined,
        address: guardianFormData.address || undefined,
        studentId: guardianFormData.studentId,
        isPrimary: guardianFormData.isPrimary,
        linkToParent: guardianFormData.linkToParent,
        parentId: guardianFormData.linkToParent
          ? guardianFormData.parentId
          : undefined,
        notes: guardianFormData.notes || undefined,
      };

      if (selectedGuardian) {
        await updateGuardian(selectedGuardian.id, guardianData);
      } else {
        await addGuardian(guardianData);
      }

      setIsFormOpen(false);
      resetGuardianForm();
      clearError();
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert(error.message || "Erreur lors de la sauvegarde");
    }
  };

  // Gérer la création d'un compte parent
  const handleCreateParentAccount = async () => {
    // Validation
    if (parentFormData.password !== parentFormData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (
      !parentFormData.firstName ||
      !parentFormData.lastName ||
      !parentFormData.email
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!parentFormData.password) {
      alert("Le mot de passe est obligatoire");
      return;
    }

    try {
      const response = await api.post("/parents/create", {
        firstName: parentFormData.firstName,
        lastName: parentFormData.lastName,
        email: parentFormData.email,
        phone: parentFormData.phone || undefined,
        password: parentFormData.password,
        address: parentFormData.address || undefined,
        children: parentFormData.children,
        sendWelcomeEmail: parentFormData.sendWelcomeEmail,
      });

      if (response.data?.success) {
        alert("Compte parent créé avec succès");
        setIsParentFormOpen(false);
        resetParentForm();
        // Rafraîchir la liste pour refléter les liaisons de tuteurs
        fetchGuardians();
      } else {
        alert(
          response.data?.message || "Erreur lors de la création du compte parent"
        );
      }
    } catch (error: any) {
      console.error("Erreur création compte parent:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Erreur lors de la création du compte parent"
      );
    }
  };

  // Gérer l'édition d'un guardian
  const handleEditGuardian = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setGuardianFormData({
      firstName: guardian.firstName,
      lastName: guardian.lastName,
      relationship: guardian.relationship,
      phone: guardian.phone,
      email: guardian.email || "",
      address: guardian.address || "",
      studentId: guardian.studentId,
      isPrimary: guardian.isPrimary,
      linkToParent: !!guardian.parentId,
      parentId: guardian.parentId || "",
      createParentAccount: false,
      notes: guardian.notes || "",
    });
    setIsFormOpen(true);
  };

  // Gérer la suppression d'un guardian
  const handleDeleteGuardian = async (guardianId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce tuteur ?")) {
      try {
        await deleteGuardian(guardianId);
      } catch (error: any) {
        console.error("Erreur lors de la suppression:", error);
        alert(error.message || "Erreur lors de la suppression");
      }
    }
  };

  // Gérer la définition comme principal
  const handleSetPrimary = async (guardianId: string, studentId: string) => {
    try {
      await setPrimaryGuardian(studentId, guardianId);
    } catch (error: any) {
      console.error(
        "Erreur lors de la définition du responsable principal:",
        error
      );
      alert(error.message || "Erreur lors de la définition");
    }
  };

  // Créer un compte parent à partir d'un guardian
  const handleCreateParentFromGuardian = (guardian: Guardian) => {
    setParentFormData({
      firstName: guardian.firstName,
      lastName: guardian.lastName,
      email: guardian.email || "",
      phone: guardian.phone,
      password: "",
      confirmPassword: "",
      children: [guardian.studentId],
      address: guardian.address || "",
      sendWelcomeEmail: true,
    });
    setIsParentFormOpen(true);
  };

  // Trier les guardians
  const handleSort = (
    key: keyof Guardian | "studentName" | "parentAccount"
  ) => {
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

  // Filtrer les guardians
  const filteredGuardians = guardians.filter((guardian) => {
    const student = students.find((s) => s.id === guardian.studentId);
    const guardianName =
      `${guardian.firstName} ${guardian.lastName}`.toLowerCase();
    const studentName = student
      ? `${student.firstName} ${student.lastName}`.toLowerCase()
      : "";

    // Filtre par tab
    if (activeTab === "withAccount" && !guardian.parentId) return false;
    if (activeTab === "withoutAccount" && guardian.parentId) return false;
    if (activeTab === "primary" && !guardian.isPrimary) return false;

    // Filtre par recherche
    return (
      guardianName.includes(searchTerm.toLowerCase()) ||
      studentName.includes(searchTerm.toLowerCase()) ||
      guardian.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guardian.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Trier les guardians
  let sortedGuardians = [...filteredGuardians];
  if (sortConfig) {
    sortedGuardians.sort((a, b) => {
      let aValue: any, bValue: any;

      if (sortConfig.key === "studentName") {
        const studentA = students.find((s) => s.id === a.studentId);
        const studentB = students.find((s) => s.id === b.studentId);
        aValue = studentA ? `${studentA.firstName} ${studentA.lastName}` : "";
        bValue = studentB ? `${studentB.firstName} ${studentB.lastName}` : "";
      } else if (sortConfig.key === "parentAccount") {
        aValue = a.parentId ? 1 : 0;
        bValue = b.parentId ? 1 : 0;
      } else {
        aValue = a[sortConfig.key as keyof Guardian] || "";
        bValue = b[sortConfig.key as keyof Guardian] || "";
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

  // Composant d'icône de tri
  const SortIcon = ({
    columnKey,
  }: {
    columnKey: keyof Guardian | "studentName" | "parentAccount";
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

  // Récupérer les étudiants d'un parent
  const getParentChildren = (parentId: string) => {
    return guardians
      .filter((g) => g.parentId === parentId)
      .map((g) => students.find((s) => s.id === g.studentId))
      .filter(Boolean) as Student[];
  };

  // Rendre le composant
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestion des Tuteurs & Parents
          </h1>
          <p className="text-muted-foreground">
            Gérez les tuteurs et les comptes parents
          </p>
        </div>

        <div className="flex gap-2">
          {/* Bouton Compte Parent */}
          <Dialog open={isParentFormOpen} onOpenChange={setIsParentFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetParentForm}>
                <UserPlus className="h-4 w-4 mr-2" />
                Compte Parent
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer un compte parent</DialogTitle>
                <DialogDescription>
                  Un compte parent peut suivre plusieurs enfants
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent-firstName">Prénom *</Label>
                    <Input
                      id="parent-firstName"
                      value={parentFormData.firstName}
                      onChange={(e) =>
                        setParentFormData({
                          ...parentFormData,
                          firstName: e.target.value,
                        })
                      }
                      placeholder="Prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-lastName">Nom *</Label>
                    <Input
                      id="parent-lastName"
                      value={parentFormData.lastName}
                      onChange={(e) =>
                        setParentFormData({
                          ...parentFormData,
                          lastName: e.target.value,
                        })
                      }
                      placeholder="Nom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent-email">Email *</Label>
                    <Input
                      id="parent-email"
                      type="email"
                      value={parentFormData.email}
                      onChange={(e) =>
                        setParentFormData({
                          ...parentFormData,
                          email: e.target.value,
                        })
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-phone">Téléphone</Label>
                    <Input
                      id="parent-phone"
                      value={parentFormData.phone}
                      onChange={(e) =>
                        setParentFormData({
                          ...parentFormData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+509 44 55 66 77"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent-address">Adresse</Label>
                  <Textarea
                    id="parent-address"
                    value={parentFormData.address}
                    onChange={(e) =>
                      setParentFormData({
                        ...parentFormData,
                        address: e.target.value,
                      })
                    }
                    placeholder="Adresse complète"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Enfants</Label>
                  <Select
                    onValueChange={(value) => {
                      if (!parentFormData.children.includes(value)) {
                        setParentFormData({
                          ...parentFormData,
                          children: [...parentFormData.children, value],
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ajouter un enfant" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem
                          key={student.id}
                          value={student.id}
                          disabled={parentFormData.children.includes(
                            student.id
                          )}
                        >
                          {student.firstName} {student.lastName} (
                          {student.studentCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {parentFormData.children.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Enfants sélectionnés:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {parentFormData.children.map((childId) => {
                          const student = students.find(
                            (s) => s.id === childId
                          );
                          return student ? (
                            <Badge
                              key={childId}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {student.firstName} {student.lastName}
                              <button
                                type="button"
                                onClick={() =>
                                  setParentFormData({
                                    ...parentFormData,
                                    children: parentFormData.children.filter(
                                      (id) => id !== childId
                                    ),
                                  })
                                }
                                className="ml-1 text-xs"
                              >
                                ✕
                              </button>
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="parent-password">Mot de passe *</Label>
                  <Input
                    id="parent-password"
                    type="password"
                    value={parentFormData.password}
                    onChange={(e) =>
                      setParentFormData({
                        ...parentFormData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Mot de passe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent-confirmPassword">
                    Confirmer le mot de passe *
                  </Label>
                  <Input
                    id="parent-confirmPassword"
                    type="password"
                    value={parentFormData.confirmPassword}
                    onChange={(e) =>
                      setParentFormData({
                        ...parentFormData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirmer le mot de passe"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sendWelcomeEmail"
                    checked={parentFormData.sendWelcomeEmail}
                    onCheckedChange={(checked) =>
                      setParentFormData({
                        ...parentFormData,
                        sendWelcomeEmail: checked,
                      })
                    }
                  />
                  <Label htmlFor="sendWelcomeEmail" className="text-sm">
                    Envoyer un email de bienvenue avec les informations de
                    connexion
                  </Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={handleCreateParentAccount}
                    disabled={guardiansLoading}
                  >
                    {guardiansLoading
                      ? "Création..."
                      : "Créer le compte parent"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsParentFormOpen(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Bouton Nouveau Tuteur */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetGuardianForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Tuteur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedGuardian ? "Modifier Tuteur" : "Ajouter un tuteur"}
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="guardian" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="guardian">
                    Informations Tuteur
                  </TabsTrigger>
                  <TabsTrigger value="link">Options Avancées</TabsTrigger>
                </TabsList>

                <TabsContent value="guardian" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prénom *</Label>
                      <Input
                        value={guardianFormData.firstName}
                        onChange={(e) =>
                          setGuardianFormData({
                            ...guardianFormData,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="Prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nom *</Label>
                      <Input
                        value={guardianFormData.lastName}
                        onChange={(e) =>
                          setGuardianFormData({
                            ...guardianFormData,
                            lastName: e.target.value,
                          })
                        }
                        placeholder="Nom"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Étudiant *</Label>
                    <Select
                      value={guardianFormData.studentId}
                      onValueChange={(value) =>
                        setGuardianFormData({
                          ...guardianFormData,
                          studentId: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un étudiant" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.firstName} {student.lastName} (
                            {student.studentCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Relation *</Label>
                    <Select
                      value={guardianFormData.relationship}
                      onValueChange={(value) =>
                        setGuardianFormData({
                          ...guardianFormData,
                          relationship: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Relation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Père">Père</SelectItem>
                        <SelectItem value="Mère">Mère</SelectItem>
                        <SelectItem value="Tuteur">Tuteur</SelectItem>
                        <SelectItem value="Tutrice">Tutrice</SelectItem>
                        <SelectItem value="Oncle">Oncle</SelectItem>
                        <SelectItem value="Tante">Tante</SelectItem>
                        <SelectItem value="Grand-parent">
                          Grand-parent
                        </SelectItem>
                        <SelectItem value="Frère">Frère</SelectItem>
                        <SelectItem value="Sœur">Sœur</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Téléphone *</Label>
                      <Input
                        value={guardianFormData.phone}
                        onChange={(e) =>
                          setGuardianFormData({
                            ...guardianFormData,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+509 44 55 66 77"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={guardianFormData.email}
                        onChange={(e) =>
                          setGuardianFormData({
                            ...guardianFormData,
                            email: e.target.value,
                          })
                        }
                        placeholder="email@example.com"
                        type="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input
                      value={guardianFormData.address}
                      onChange={(e) =>
                        setGuardianFormData({
                          ...guardianFormData,
                          address: e.target.value,
                        })
                      }
                      placeholder="Adresse"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={guardianFormData.notes}
                      onChange={(e) =>
                        setGuardianFormData({
                          ...guardianFormData,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Informations supplémentaires..."
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPrimary"
                      checked={guardianFormData.isPrimary}
                      onChange={(e) =>
                        setGuardianFormData({
                          ...guardianFormData,
                          isPrimary: e.target.checked,
                        })
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="isPrimary" className="text-sm">
                      Définir comme responsable principal pour cet étudiant
                    </Label>
                  </div>
                </TabsContent>

                <TabsContent value="link" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          Lier à un compte parent existant
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Rechercher un parent existant par email ou téléphone
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={searchExistingParent}
                        disabled={
                          !guardianFormData.email && !guardianFormData.phone
                        }
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Rechercher
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="linkToParent"
                        checked={guardianFormData.linkToParent}
                        onCheckedChange={(checked) =>
                          setGuardianFormData({
                            ...guardianFormData,
                            linkToParent: checked,
                          })
                        }
                      />
                      <Label htmlFor="linkToParent" className="text-sm">
                        Lier ce tuteur à un compte parent existant
                      </Label>
                    </div>

                    {guardianFormData.linkToParent &&
                      guardianFormData.parentId && (
                        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                          <div className="flex items-center">
                            <UserCheck className="h-5 w-5 text-blue-600 mr-2" />
                            <div>
                              <p className="font-medium text-blue-800">
                                Parent trouvé: {guardianFormData.firstName}{" "}
                                {guardianFormData.lastName}
                              </p>
                              <p className="text-sm text-blue-600">
                                Ce tuteur sera lié au compte parent existant
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    <Separator />

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="createParentAccount"
                        checked={guardianFormData.createParentAccount}
                        onCheckedChange={(checked) =>
                          setGuardianFormData({
                            ...guardianFormData,
                            createParentAccount: checked,
                          })
                        }
                      />
                      <Label htmlFor="createParentAccount" className="text-sm">
                        Créer un compte parent pour ce tuteur
                      </Label>
                    </div>

                    {guardianFormData.createParentAccount && (
                      <div className="p-3 bg-green-50 rounded-md border border-green-200">
                        <div className="flex items-center">
                          <UserPlus className="h-5 w-5 text-green-600 mr-2" />
                          <div>
                            <p className="font-medium text-green-800">
                              Compte parent sera créé
                            </p>
                            <p className="text-sm text-green-600">
                              Un email de bienvenue sera envoyé avec les
                              informations de connexion
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={handleGuardianSubmit}
                  disabled={guardiansLoading}
                >
                  {guardiansLoading
                    ? "Sauvegarde..."
                    : selectedGuardian
                    ? "Modifier le tuteur"
                    : "Ajouter le tuteur"}
                </Button>
                <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                  Annuler
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tous les tuteurs</TabsTrigger>
            <TabsTrigger value="withAccount">
              <UserCheck className="h-4 w-4 mr-2" />
              Avec compte
            </TabsTrigger>
            <TabsTrigger value="withoutAccount">Sans compte</TabsTrigger>
            <TabsTrigger value="primary">
              <Shield className="h-4 w-4 mr-2" />
              Principaux
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un tuteur ou un étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Badge variant="outline" className="px-3 py-1">
            <Users className="h-3 w-3 mr-1" />
            {filteredGuardians.length} tuteur(s)
          </Badge>
        </div>
      </div>

      {/* Affichage des erreurs */}
      {guardiansError && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{guardiansError}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={clearError}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                >
                  <span className="sr-only">Fermer</span>✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tableau des guardians */}
      <Card>
        <CardContent className="p-0">
          {guardiansLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Chargement des tuteurs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th
                      className="text-left py-3 px-4 font-medium cursor-pointer"
                      onClick={() => handleSort("firstName")}
                    >
                      <div className="flex items-center">
                        <span>Tuteur</span>
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
                    <th
                      className="text-left py-3 px-4 font-medium cursor-pointer"
                      onClick={() => handleSort("parentAccount")}
                    >
                      <div className="flex items-center">
                        <span>Compte</span>
                        <SortIcon columnKey="parentAccount" />
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedGuardians.map((guardian) => {
                    const student = students.find(
                      (s) => s.id === guardian.studentId
                    );
                    const parentChildren = guardian.parentId
                      ? getParentChildren(guardian.parentId)
                      : [];

                    return (
                      <tr
                        key={guardian.id}
                        className="border-b hover:bg-muted/30"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                guardian.parentId
                                  ? "bg-gradient-to-br from-blue-500 to-purple-600"
                                  : "bg-gradient-to-br from-pink-500 to-red-600"
                              } text-white`}
                            >
                              {guardian.parentId ? (
                                <UserCheck className="h-4 w-4" />
                              ) : (
                                <Heart className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {guardian.firstName} {guardian.lastName}
                                {guardian.parentId && (
                                  <Badge variant="outline" className="text-xs">
                                    <Link className="h-3 w-3 mr-1" />
                                    Compte
                                  </Badge>
                                )}
                              </div>
                              {guardian.email && (
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {guardian.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {guardian.relationship}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {student ? (
                            <div>
                              <div className="font-medium">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {student.studentCode}
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
                            {guardian.address && (
                              <div className="flex items-center text-sm">
                                <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="truncate max-w-xs">
                                  {guardian.address}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {guardian.isPrimary ? (
                              <Badge className="bg-green-600">Principal</Badge>
                            ) : (
                              <Badge variant="outline">Secondaire</Badge>
                            )}
                            {parentChildren.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {parentChildren.length} autre(s) enfant(s)
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditGuardian(guardian)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteGuardian(guardian.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {!guardian.isPrimary && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleSetPrimary(
                                    guardian.id,
                                    guardian.studentId
                                  )
                                }
                                title="Définir comme principal"
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                            )}
                            {!guardian.parentId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleCreateParentFromGuardian(guardian)
                                }
                                title="Créer un compte parent"
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            )}
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
                  <p>
                    {searchTerm || activeTab !== "all"
                      ? "Aucun tuteur trouvé"
                      : "Aucun tuteur enregistré"}
                  </p>
                  {!searchTerm && activeTab === "all" && (
                    <p className="text-sm mt-2">
                      Cliquez sur "Nouveau Tuteur" pour ajouter le premier
                      tuteur
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
