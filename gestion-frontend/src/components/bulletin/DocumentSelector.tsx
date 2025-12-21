import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Award,
  Layers,
  GraduationCap,
  ScrollText,
} from "lucide-react";
import { DocumentType } from "@/types/bulletin";

interface DocumentConfig {
  type: DocumentType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const DOCUMENTS: DocumentConfig[] = [
  {
    type: DocumentType.BULLETIN,
    title: "Bulletin Scolaire",
    description: "Document officiel avec notes et statistiques",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    type: DocumentType.RELEVE,
    title: "Relevé de Notes",
    description: "Relevé détaillé des notes par matière",
    icon: <ScrollText className="h-5 w-5" />,
  },
  {
    type: DocumentType.ATTESTATION_NIVEAU,
    title: "Attestation de Niveau",
    description: "Certificat attestant du niveau atteint",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    type: DocumentType.ATTESTATION_FIN_ETUDES,
    title: "Attestation de Fin d'Études",
    description: "Attestation de réussite complète",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    type: DocumentType.CERTIFICAT_SCOLARITE,
    title: "Certificat de Scolarité",
    description: "Certificat de fréquentation scolaire",
    icon: <Award className="h-5 w-5" />,
  },
];

interface DocumentSelectorProps {
  selected: DocumentType;
  onSelect: (type: DocumentType) => void;
}

export const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Type de Document
        </CardTitle>
        <CardDescription>
          Sélectionnez le type de document à générer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {DOCUMENTS.map((doc) => (
            <button
              key={doc.type}
              onClick={() => onSelect(doc.type)}
              className={`
                p-4 rounded-lg border transition-all duration-200 text-left
                ${
                  selected === doc.type
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                }
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`
                  p-2 rounded-full
                  ${
                    selected === doc.type
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-100 text-gray-600"
                  }
                `}
                >
                  {doc.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{doc.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {doc.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
