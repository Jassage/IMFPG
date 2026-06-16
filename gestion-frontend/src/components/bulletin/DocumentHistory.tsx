import React, { useEffect, useState } from "react";
import { Download, Eye, FileText, Calendar, Award } from "lucide-react";
import bulletinService from "@/services/bulletinService";
import { Bulletin, DocumentType } from "@/types/bulletin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DocumentHistoryProps {
  studentId: string;
  academicYearId?: string;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  [DocumentType.BULLETIN]: "Bulletin",
  [DocumentType.RELEVE]: "Relevé de Notes",
  [DocumentType.CERTIFICAT_SCOLARITE]: "Certificat de Scolarité",
  [DocumentType.ATTESTATION_NIVEAU]: "Attestation de Niveau",
  [DocumentType.ATTESTATION_FIN_ETUDES]: "Attestation de Fin d'Études",
};

const CONTROL_TYPE_LABELS: Record<string, string> = {
  CONTROLE_1: "1er Trimestre",
  CONTROLE_2: "2ème Trimestre",
  CONTROLE_3: "3ème Trimestre",
  CONTROLE_4: "Examen Final",
};

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { color: string; label: string }> = {
    DRAFT: { color: "bg-gray-100 text-gray-800", label: "Brouillon" },
    GENERATED: { color: "bg-blue-100 text-blue-800", label: "Généré" },
    PUBLISHED: { color: "bg-green-100 text-green-800", label: "Publié" },
    ARCHIVED: { color: "bg-yellow-100 text-yellow-800", label: "Archivé" },
    DELETED: { color: "bg-red-100 text-red-800", label: "Supprimé" },
  };

  const config = statusConfig[status] || {
    color: "bg-gray-100 text-gray-800",
    label: status,
  };

  return (
    <Badge className={`${config.color} font-medium`}>{config.label}</Badge>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDocumentTypeLabel = (documentType: string) =>
  DOCUMENT_TYPE_LABELS[documentType] || documentType;

const getPeriodLabel = (bulletin: Bulletin) => {
  if (bulletin.documentType !== DocumentType.BULLETIN) {
    return "Année complète";
  }
  return CONTROL_TYPE_LABELS[bulletin.controlType] || bulletin.controlType;
};

export const DocumentHistory: React.FC<DocumentHistoryProps> = ({
  studentId,
  academicYearId,
}) => {
  const [documents, setDocuments] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, academicYearId]);

  const loadDocuments = async () => {
    if (!studentId) return;

    setLoading(true);
    setError("");
    try {
      const response = await bulletinService.getStudentBulletins(
        studentId,
        academicYearId
      );
      setDocuments(response.data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement de l'historique");
    } finally {
      setLoading(false);
    }
  };

  const openBlob = (blob: Blob, fileName: string, download: boolean) => {
    const url = URL.createObjectURL(blob);
    if (download) {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(url, "_blank");
    }
    URL.revokeObjectURL(url);
  };

  const handleAction = async (doc: Bulletin, download: boolean) => {
    try {
      const blob = await bulletinService.downloadBulletin(doc.id);
      openBlob(blob, doc.fileName, download);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ouverture du document");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historique des Documents
          </span>
          <Button onClick={loadDocuments} variant="outline" size="sm">
            Actualiser
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Aucun document généré
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Les documents générés pour cet élève apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-36">Période</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Généré le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2 font-medium">
                        <Award className="h-4 w-4 text-blue-500" />
                        {getDocumentTypeLabel(doc.documentType)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {getPeriodLabel(doc)}
                      </div>
                    </TableCell>
                    <TableCell>{doc.academicYear?.year || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(doc.generatedAt)}
                      </div>
                      {doc.generatedBy && (
                        <div className="text-xs text-gray-500">
                          Par: {doc.generatedBy}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleAction(doc, false)}
                          size="sm"
                          variant="outline"
                          className="h-8"
                          title="Aperçu"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleAction(doc, true)}
                          size="sm"
                          variant="outline"
                          className="h-8"
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentHistory;
