import React, { useState, useEffect } from "react";

import { Download, Eye, FileText, Calendar, User, Award } from "lucide-react";
import bulletinService from "../services/bulletinService";
import { Bulletin } from "../types/bulletin";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface BulletinListProps {
  studentId?: string;
  academicYearId?: string;
}

const BulletinList: React.FC<BulletinListProps> = ({
  studentId,
  academicYearId,
}) => {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadBulletins();
  }, [studentId, academicYearId]);

  const loadBulletins = async () => {
    if (!studentId) return;

    setLoading(true);
    try {
      const response = await bulletinService.getStudentBulletins(
        studentId,
        academicYearId
      );
      setBulletins(response.data);
    } catch (error: any) {
      setError(error.message || "Erreur lors du chargement des bulletins");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (transcriptId: string) => {
    try {
      await bulletinService.downloadBulletin(transcriptId);
    } catch (error: any) {
      setError(error.message || "Erreur lors du téléchargement");
    }
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

  const getControlTypeLabel = (controlType: string) => {
    const labels: Record<string, string> = {
      CONTROLE_1: "1er Trimestre",
      CONTROLE_2: "2ème Trimestre",
      CONTROLE_3: "3ème Trimestre",
      CONTROLE_4: "Examen Final",
    };
    return labels[controlType] || controlType;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (bulletins.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          Aucun bulletin trouvé
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {studentId
            ? "Aucun bulletin généré pour cet étudiant"
            : "Sélectionnez un étudiant pour voir ses bulletins"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Historique des Bulletins
        </h2>
        <Button onClick={loadBulletins} variant="outline" size="sm">
          Actualiser
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-32">Période</TableHead>
              <TableHead>Année</TableHead>
              <TableHead>Moyenne</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Généré le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bulletins.map((bulletin) => (
              <TableRow key={bulletin.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {getControlTypeLabel(bulletin.controlType)}
                  </div>
                </TableCell>
                <TableCell>{bulletin.academicYear?.year || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-lg">
                      {bulletin.gpa.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">/20</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Taux de réussite: {bulletin.successRate.toFixed(1)}%
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(bulletin.status)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(bulletin.generatedAt)}
                  </div>
                  {bulletin.generatedBy && (
                    <div className="text-xs text-gray-500">
                      Par: {bulletin.generatedBy}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleDownload(bulletin.id)}
                      size="sm"
                      variant="outline"
                      className="h-8"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => {
                        // Ouvrir le bulletin dans un nouvel onglet
                        const url = `${process.env.REACT_APP_API_URL}/bulletins/download/${bulletin.id}`;
                        window.open(url, "_blank");
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-800">
            Nombre de bulletins
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {bulletins.length}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm font-medium text-green-800">
            Moyenne générale
          </div>
          <div className="text-2xl font-bold text-green-900">
            {bulletins.length > 0
              ? (
                  bulletins.reduce((sum, b) => sum + b.gpa, 0) /
                  bulletins.length
                ).toFixed(2)
              : "0.00"}
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm font-medium text-purple-800">
            Dernière génération
          </div>
          <div className="text-lg font-bold text-purple-900">
            {bulletins.length > 0
              ? new Date(bulletins[0].generatedAt).toLocaleDateString("fr-FR")
              : "Jamais"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulletinList;
