import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
  ChevronsUpDown,
  Check,
  List,
  Star,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UE, UEType } from "../types/academic";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useUEStore } from "@/store/courseStore";
import ConfirmationModal from "./ui/ConfirmationModal";
import { SimpleSelect } from "./SimpleSelect";
import { useAuthStore } from "@/store/authStore";

interface UEFormData {
  code: string;
  title: string;
  credits: number;
  passingGrade: number;
  type: UEType;
  prerequisites: string[];
  createdById: string; // Ajouté pour correspondre à l'interface de createUE
}

export const CoursesManager = () => {
  const {
    ues,
    fetchUEs,
    loading,
    error,
    createUE,
    updateUE,
    deleteUE,
    addPrerequisite,
    removePrerequisite,
  } = useUEStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUE, setSelectedUE] = useState<UE | null>(null);
  const [prerequisitesOpen, setPrerequisitesOpen] = useState(false);
  const [prerequisitesSearch, setPrerequisitesSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ueToDelete, setUeToDelete] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState<UEFormData>({
    code: "",
    title: "",
    credits: 3,
    passingGrade: 70,
    type: "Obligatoire",
    prerequisites: [],
    createdById: "",
  });

  useEffect(() => {
    fetchUEs();
    // console.log(user);
  }, [fetchUEs]);

  // Protection contre les valeurs undefined
  // Protection renforcée
  const safeUEs = (() => {
    if (!ues) return [];
    if (!Array.isArray(ues)) return [];
    return ues.filter((ue) => ue && typeof ue === "object" && ue.id);
  })();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setFormData((prev) => ({
        ...prev,
        createdById: user?.id, // Assigner l'ID de l'utilisateur connecté
      }));
    }
  }, [isAuthenticated, user?.id]);

  // Filtrage sécurisé
  const filteredUEs = safeUEs.filter(
    (ue) =>
      ue?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ue?.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prérequis disponibles avec sécurité
  const availablePrerequisites = safeUEs.filter(
    (ue) =>
      ue?.id !== selectedUE?.id &&
      (ue?.code?.toLowerCase().includes(prerequisitesSearch.toLowerCase()) ||
        ue?.title?.toLowerCase().includes(prerequisitesSearch.toLowerCase()))
  );

  // Composant Command SÉCURISÉ
  const renderCommandItems = () => {
    // Vérification robuste
    if (!availablePrerequisites || !Array.isArray(availablePrerequisites)) {
      return <CommandEmpty>Aucune UE disponible</CommandEmpty>;
    }

    if (availablePrerequisites.length === 0) {
      return <CommandEmpty>Aucune UE disponible</CommandEmpty>;
    }

    return availablePrerequisites.map((ue) => {
      // Vérification de chaque élément
      if (!ue || !ue.id) return null;

      return (
        <CommandItem
          key={ue.id}
          value={ue.id}
          onSelect={() => {
            setFormData((prev) => ({
              ...prev,
              prerequisites: prev.prerequisites.includes(ue.id)
                ? prev.prerequisites.filter((id) => id !== ue.id)
                : [...prev.prerequisites, ue.id],
            }));
          }}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              formData.prerequisites.includes(ue.id)
                ? "opacity-100"
                : "opacity-0"
            )}
          />
          {ue.code} - {ue.title}
        </CommandItem>
      );
    });
  };

  const handleSubmit = async () => {
    // Vérifier qu'on a un createdById avant de soumettre
    if (!user?.id) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour créer une UE",
        variant: "destructive",
      });
      return;
    }

    if (!formData.code || !formData.title || formData.credits <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      if (selectedUE) {
        // Mise à jour de l'UE
        await updateUE(selectedUE.id, {
          code: formData.code,
          title: formData.title,
          credits: formData.credits,
          passingGrade: formData.passingGrade,
          type: formData.type,
          createdById: formData.createdById,
        });

        // Gestion des prérequis
        const currentPrereqIds = selectedUE.prerequisites.map(
          (p) => p.prerequisiteId
        );
        const newPrereqIds = formData.prerequisites;

        // Ajouter les nouveaux prérequis
        for (const prereqId of newPrereqIds) {
          if (!currentPrereqIds.includes(prereqId)) {
            await addPrerequisite(selectedUE.id, prereqId);
          }
        }

        // Supprimer les prérequis enlevés
        for (const prereqId of currentPrereqIds) {
          if (!newPrereqIds.includes(prereqId)) {
            await removePrerequisite(selectedUE.id, prereqId);
          }
        }

        toast({
          title: "UE mise à jour",
          description: `L'UE ${formData.code} a été modifiée avec succès`,
        });
      } else {
        // Création d'une nouvelle UE
        await createUE({
          code: formData.code,
          title: formData.title,
          credits: formData.credits,
          passingGrade: formData.passingGrade,
          type: formData.type,
          createdById: user?.id,
          prerequisites: [],
          requiredFor: [],
          assignments: [],
          grades: [],
          retakes: [],
          inCatalog: false,
          facultyId: "",
          level: "",
        });

        toast({
          title: "UE créée",
          description: `L'UE ${formData.code} a été ajoutée avec succès`,
        });
      }

      resetForm();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setFormData({
      code: "",
      title: "",
      credits: 3,
      passingGrade: 70,
      type: "Obligatoire",
      prerequisites: [],
      createdById: "current-user-id",
    });
    setSelectedUE(null);
  };

  const handleEdit = (ue: UE) => {
    setSelectedUE(ue);
    setFormData({
      code: ue.code,
      title: ue.title,
      credits: ue.credits,
      passingGrade: ue.passingGrade || 70,
      type: ue.type,
      prerequisites: ue.prerequisites.map((p) => p.prerequisiteId),
      createdById: ue.createdById,
    });
    setIsFormOpen(true);
  };

  // Ouvre la modal avec l'UE à supprimer
  const handleDeleteClick = (ueId: string) => {
    setUeToDelete(ueId);
    setIsModalOpen(true);
  };

  // Confirme la suppression
  const handleConfirmDelete = async () => {
    if (ueToDelete) {
      try {
        await deleteUE(ueToDelete);
        toast({
          title: "Suppression réussie",
          description: "L'UE a été supprimée avec succès",
        });
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message || "Erreur lors de la suppression",
          variant: "destructive",
        });
      } finally {
        setIsModalOpen(false);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Erreur de chargement des UEs</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestion des UEs</h2>
          <p className="text-muted-foreground">
            Ajouter, modifier et gérer les unités d'enseignement
          </p>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedUE(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle UE
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedUE ? "Modifier l'UE" : "Nouvelle UE"}
              </DialogTitle>
              <DialogDescription>
                {selectedUE
                  ? "Modifiez les détails de l'UE"
                  : "Créez une nouvelle unité d'enseignement"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code*</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="Ex: INFO101"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Crédits*</Label>
                  <Input
                    id="credits"
                    type="number"
                    min="1"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre*</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ex: Programmation Web"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingGrade">Note de passage (%)*</Label>
                <Input
                  id="passingGrade"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingGrade}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passingGrade: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Type d'UE*</Label>
                <div className="flex gap-4">
                  <Button
                    variant={
                      formData.type === "Obligatoire" ? "default" : "outline"
                    }
                    onClick={() =>
                      setFormData({ ...formData, type: "Obligatoire" })
                    }
                    type="button"
                  >
                    Obligatoire
                  </Button>
                  <Button
                    variant={
                      formData.type === "Optionnelle" ? "default" : "outline"
                    }
                    onClick={() =>
                      setFormData({ ...formData, type: "Optionnelle" })
                    }
                    type="button"
                  >
                    Optionnelle
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Prérequis</Label>
                <SimpleSelect
                  options={availablePrerequisites}
                  selectedValues={formData.prerequisites}
                  onSelect={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      prerequisites: [...prev.prerequisites, value],
                    }));
                  }}
                  onRemove={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      prerequisites: prev.prerequisites.filter(
                        (id) => id !== value
                      ),
                    }));
                  }}
                  placeholder="Sélectionner des prérequis"
                />
                {formData.prerequisites.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.prerequisites.map((prereqId) => {
                      const ue = safeUEs.find((u) => u.id === prereqId);
                      return ue ? (
                        <Badge
                          key={prereqId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {ue.code}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData((prev) => ({
                                ...prev,
                                prerequisites: prev.prerequisites.filter(
                                  (id) => id !== prereqId
                                ),
                              }));
                            }}
                            className="ml-1 rounded-full p-0.5 hover:bg-muted"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit}>
                  {selectedUE ? "Modifier" : "Créer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Liste des UEs ({filteredUEs.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une UE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredUEs.map((ue) => (
              <Card key={ue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold",
                        ue.type === "Obligatoire"
                          ? "bg-gradient-to-br from-purple-500 to-blue-600"
                          : "bg-gradient-to-br from-green-500 to-teal-600"
                      )}
                    >
                      {ue.code.substring(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{ue.title}</h3>
                        <Badge
                          variant={
                            ue.type === "Obligatoire" ? "default" : "outline"
                          }
                        >
                          {ue.type}
                        </Badge>
                        {ue.inCatalog && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Star className="h-3 w-3" />
                            Au catalogue
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {ue.code} • {ue.credits} crédits • Note de passage:{" "}
                        {ue.passingGrade}%
                      </div>
                      {ue.prerequisites && ue.prerequisites.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 mt-2">
                          <span className="text-xs text-muted-foreground">
                            Prérequis:
                          </span>
                          {ue.prerequisites.map((prereq) => {
                            const prereqUE = safeUEs.find(
                              (u) => u.id === prereq.prerequisiteId
                            );
                            return prereqUE ? (
                              <Badge
                                key={prereq.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {prereqUE.code}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ue)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(ue.id)}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredUEs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune UE trouvée</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette UE ? Cette action est irréversible."
        confirmLabel="Confirmer la suppression"
        cancelLabel="Annuler"
      />
    </div>
  );
};
