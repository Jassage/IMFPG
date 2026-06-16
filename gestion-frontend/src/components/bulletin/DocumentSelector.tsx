import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  FileCheck,
  Award,
  GraduationCap,
  School,
  BadgeCheck,
  FileSignature,
  BookOpen,
} from "lucide-react";
import { DocumentType } from "@/types/bulletin";

interface DocumentSelectorProps {
  selected: DocumentType;
  onSelect: (type: DocumentType) => void;
}

const DOCUMENT_TYPES = [
  {
    type: DocumentType.BULLETIN,
    title: "Bulletin Scolaire",
    description:
      "Bulletin trimestriel ou annuel avec les notes et appréciations",
    icon: <FileText className="h-6 w-6" />,
    color: "bg-blue-100 text-blue-700 border-blue-300",
  },
  {
    type: DocumentType.RELEVE,
    title: "Relevé de Notes",
    description:
      "Relevé de notes annuel récapitulant tous les contrôles de l'année",
    icon: <FileCheck className="h-6 w-6" />,
    color: "bg-green-100 text-green-700 border-green-300",
  },
  {
    type: DocumentType.CERTIFICAT_SCOLARITE,
    title: "Certificat de Scolarité",
    description: "Justificatif officiel d'inscription de l'élève",
    icon: <School className="h-6 w-6" />,
    color: "bg-purple-100 text-purple-700 border-purple-300",
  },
];

export const DocumentSelector: React.FC<DocumentSelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSignature className="h-5 w-5" />
          Type de Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selected}
          onValueChange={(value) => onSelect(value as DocumentType)}
        >
          <TabsList className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {DOCUMENT_TYPES.map((doc) => (
              <TabsTrigger
                key={doc.type}
                value={doc.type}
                className="flex flex-col items-center gap-2 py-3"
              >
                <div
                  className={`p-2 rounded-full ${doc.color.replace(
                    "border-",
                    "border "
                  )}`}
                >
                  {doc.icon}
                </div>
                <span className="text-xs font-medium">{doc.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {DOCUMENT_TYPES.map((doc) => (
            <TabsContent key={doc.type} value={doc.type} className="mt-4">
              <div
                className={`p-4 rounded-lg border ${doc.color} bg-opacity-10`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-lg ${doc.color} bg-opacity-20`}>
                    {doc.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{doc.title}</h4>
                    <p className="text-gray-600 mt-1">{doc.description}</p>
                    <div className="mt-3">
                      <h5 className="font-semibold text-sm text-gray-700 mb-2">
                        Ce document contient:
                      </h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {doc.type === DocumentType.BULLETIN && (
                          <>
                            <li>✓ Notes par matière</li>
                            <li>✓ Moyennes et statistiques</li>
                            <li>✓ Appréciations des professeurs</li>
                            <li>✓ Décision du conseil de classe</li>
                          </>
                        )}
                        {doc.type === DocumentType.RELEVE && (
                          <>
                            <li>✓ Liste complète des notes</li>
                            <li>✓ Coefficients et mentions</li>
                            <li>✓ Historique des résultats</li>
                            <li>✓ Certification officielle</li>
                          </>
                        )}
                        {doc.type === DocumentType.ATTESTATION_NIVEAU && (
                          <>
                            <li>✓ Niveau scolaire atteint</li>
                            <li>✓ Date d'obtention</li>
                            <li>✓ Signature du directeur</li>
                            <li>✓ Cachet de l'établissement</li>
                          </>
                        )}
                        {doc.type === DocumentType.ATTESTATION_FIN_ETUDES && (
                          <>
                            <li>✓ Certificat de fin d'études</li>
                            <li>✓ Mention obtenue</li>
                            <li>✓ Date de délivrance</li>
                            <li>✓ Valeur officielle</li>
                          </>
                        )}
                        {doc.type === DocumentType.CERTIFICAT_SCOLARITE && (
                          <>
                            <li>✓ État d'inscription</li>
                            <li>✓ Période de scolarité</li>
                            <li>✓ Niveau actuel</li>
                            <li>✓ Justificatif officiel</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Format: PDF officiel
                    </span>
                    <BadgeCheck className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
