import React, { useEffect } from "react";
import { useTranscriptStore } from "@/store/transcriptStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  MoreVertical,
  FileText,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Printer,
  Archive,
  CheckSquare,
  Square,
  AlertCircle,
} from "lucide-react";
import { ControlType, TranscriptStatus } from "@/types/transcript";

export const TranscriptManager: React.FC = () => {
  const {
    transcripts,
    loading,
    error,
    filters,
    pagination,
    selectedIds,
    fetchTranscripts,
    setFilters,
    setSelectedIds,
    toggleSelectedId,
    deleteTranscript,
    downloadTranscript,
  } = useTranscriptStore();

  const [showForm, setShowForm] = React.useState(false);
  const [editingTranscript, setEditingTranscript] = React.useState<
    null | number
  >(null);

  // Charger les transcripts au montage
  useEffect(() => {
    fetchTranscripts();
  }, [fetchTranscripts]);

  const handleSearch = (search: string) => {
    setFilters({ search, page: 1 });
  };

  const handleStatusFilter = (status: string) => {
    setFilters({
      status: status ? (status as TranscriptStatus) : undefined,
      page: 1,
    });
  };

  const handleCreateTranscript = () => {
    setEditingTranscript(null);
    setShowForm(true);
  };

  const handleControlTypeFilter = (controlType: string) => {
    setFilters({
      controlType: controlType ? (controlType as ControlType) : undefined,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transcripts</h1>
          <p className="text-muted-foreground">
            Gérez les bulletins, relevés et attestations des étudiants
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Transcript
          </Button>
          <Button
            variant="outline"
            onClick={handleCreateTranscript}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom, prénom, matricule..."
                  value={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={filters.status || ""}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {Object.values(TranscriptStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="controlType">Type de contrôle</Label>
              <Select
                value={filters.controlType || ""}
                onValueChange={handleControlTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les contrôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {Object.values(ControlType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit">Par page</Label>
              <Select
                value={filters.limit?.toString() || "20"}
                onValueChange={(value) =>
                  setFilters({ limit: parseInt(value), page: 1 })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages d'erreur */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Actions groupées */}
      {selectedIds.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1">
                  {selectedIds.length} sélectionné(s)
                </Badge>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      selectedIds.forEach((id) => downloadTranscript(id))
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      /* Bulk archive logic */
                    }}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archiver
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      selectedIds.forEach((id) => deleteTranscript(id))
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds([])}
              >
                Tout désélectionner
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau des transcripts */}
      <Card>
        <CardHeader>
          <CardTitle>Transcripts</CardTitle>
          <CardDescription>
            {pagination.total} transcript(s) au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : transcripts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Aucun transcript trouvé</h3>
              <p className="text-muted-foreground mt-2">
                {filters.search || filters.status || filters.controlType
                  ? "Essayez de modifier vos filtres"
                  : "Commencez par créer votre premier transcript"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === transcripts.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIds(transcripts.map((t) => t.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Année</TableHead>
                    <TableHead>Contrôle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transcripts.map((transcript) => (
                    <TableRow key={transcript.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(transcript.id)}
                          onCheckedChange={() =>
                            toggleSelectedId(transcript.id)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {transcript.student.lastName}{" "}
                            {transcript.student.firstName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transcript.student.studentCode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{transcript.academicYear.year}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transcript.controlType.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {transcript.documentType.replace("_", " ")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">
                            {transcript.gpa.toFixed(2)}/20
                          </div>
                          <Progress
                            value={transcript.gpa * 5}
                            className="w-16"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transcript.status === "GENERATED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {transcript.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                /* View logic */
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => downloadTranscript(transcript.id)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                /* Edit logic */
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteTranscript(transcript.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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
          )}
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} sur {pagination.totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange(Math.max(1, pagination.page - 1))
                }
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handlePageChange(
                    Math.min(pagination.totalPages, pagination.page + 1)
                  )
                }
                disabled={pagination.page >= pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TranscriptManager;
