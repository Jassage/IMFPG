// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Student, Enrollment } from "@/types/academic";
// import {
//   FileText,
//   Download,
//   GraduationCap,
//   Award,
//   BookOpen,
//   CheckCircle,
//   Languages,
//   Stamp,
//   Signature,
//   Eye,
//   Loader2,
// } from "lucide-react";
// import { DocumentTypeI } from "@/types/academic";

// interface DocumentGeneratorModalProps {
//   student: Student;
//   enrollment: Enrollment;
//   isOpen: boolean;
//   onClose: () => void;
//   documentType: DocumentTypeI;
// }

// const DOCUMENT_CONFIG = {
//   [DocumentTypeI.BULLETIN]: {
//     title: "Bulletin de Notes",
//     icon: FileText,
//     description: "Notes détaillées par matière pour un semestre ou une année",
//     options: ["semester", "language", "signature"],
//     color: "blue",
//   },
//   [DocumentTypeI.RELEVE]: {
//     title: "Relevé de Notes",
//     icon: BookOpen,
//     description: "Synthèse des résultats académiques avec moyenne générale",
//     options: ["semester", "language", "signature", "stamp"],
//     color: "green",
//   },
//   [DocumentTypeI.ATTESTATION_NIVEAU]: {
//     title: "Attestation de Niveau",
//     icon: GraduationCap,
//     description: "Certificat attestant du niveau d'études actuel",
//     options: ["language", "signature", "stamp"],
//     color: "purple",
//   },
//   [DocumentTypeI.ATTESTATION_FIN_ETUDES]: {
//     title: "Attestation de Fin d'Études",
//     icon: Award,
//     description: "Certificat de réussite et fin de cycle d'études",
//     options: ["language", "signature", "stamp"],
//     color: "orange",
//   },
//   [DocumentTypeI.CERTIFICAT_SCOLARITE]: {
//     title: "Certificat de Scolarité",
//     icon: FileText,
//     description: "Attestation d'inscription et de fréquentation scolaire",
//     options: ["language", "signature", "stamp"],
//     color: "indigo",
//   },
// };

// export const DocumentGeneratorModal = ({
//   student,
//   enrollment,
//   isOpen,
//   onClose,
//   documentType,
// }: DocumentGeneratorModalProps) => {
//   const [options, setOptions] = useState({
//     semester: "all" as "S1" | "S2" | "all",
//     language: "fr" as "fr" | "en",
//     withSignature: true,
//     withStamp: true,
//     includeAllGrades: false,
//   });

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [generatedDocument, setGeneratedDocument] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   const { generateDocument, previewDocument, downloadDocument } =
//     useDocumentStore();

//   const config = DOCUMENT_CONFIG[documentType];
//   const IconComponent = config.icon;

//   // Générer et prévisualiser le document
//   const handleGenerateAndPreview = async () => {
//     setIsGenerating(true);
//     setError(null);

//     try {
//       console.log("🔄 Début de la génération du document...");

//       const document = await generateDocument({
//         type: documentType,
//         studentId: student.id,
//         academicYearId: enrollment.academicYearId,
//         semester: options.semester,
//         level: enrollment.level,
//         language: options.language,
//         withSignature: options.withSignature,
//         withStamp: options.withStamp,
//         includeAllGrades: options.includeAllGrades,
//       });

//       setGeneratedDocument(document);
//       console.log("✅ Document généré:", document);

//       // Prévisualiser automatiquement dans un nouvel onglet
//       await previewDocument(document.id);
//     } catch (error: any) {
//       console.error("❌ Erreur lors de la génération:", error);
//       setError(
//         error.message ||
//           "Une erreur est survenue lors de la génération du document"
//       );
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Télécharger le document après prévisualisation
//   const handleDownload = async () => {
//     if (!generatedDocument) return;

//     try {
//       await downloadDocument(generatedDocument.id, generatedDocument.fileName);
//       handleClose();
//     } catch (error: any) {
//       console.error("❌ Erreur lors du téléchargement:", error);
//       setError(
//         error.message || "Une erreur est survenue lors du téléchargement"
//       );
//     }
//   };

//   // Rouvrir la prévisualisation
//   const handlePreviewAgain = async () => {
//     if (!generatedDocument) return;

//     try {
//       await previewDocument(generatedDocument.id);
//     } catch (error: any) {
//       setError(error.message || "Erreur lors de la prévisualisation");
//     }
//   };

//   // Fermer le modal et réinitialiser
//   const handleClose = () => {
//     setGeneratedDocument(null);
//     setError(null);
//     setOptions({
//       semester: "all",
//       language: "fr",
//       withSignature: true,
//       withStamp: true,
//       includeAllGrades: false,
//     });
//     onClose();
//   };

//   const updateOption = (key: string, value: any) => {
//     setOptions((prev) => ({ ...prev, [key]: value }));
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <IconComponent className="h-5 w-5" />
//             {generatedDocument
//               ? "Document Généré"
//               : `Générer un ${config.title}`}
//           </DialogTitle>
//         </DialogHeader>

//         {/* Message d'erreur */}
//         {error && (
//           <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
//             <div className="flex items-center gap-2 text-red-700">
//               <div className="h-4 w-4 rounded-full bg-red-600 flex items-center justify-center">
//                 <span className="text-white text-xs">!</span>
//               </div>
//               <span className="font-medium">Erreur</span>
//             </div>
//             <p className="text-red-600 text-sm mt-1">{error}</p>
//           </div>
//         )}

//         <div className="space-y-6">
//           {/* Informations étudiant */}
//           <Card>
//             <CardContent className="pt-6">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <Label className="text-muted-foreground">Étudiant</Label>
//                   <p className="font-medium">
//                     {student.firstName} {student.lastName}
//                   </p>
//                 </div>
//                 <div>
//                   <Label className="text-muted-foreground">Niveau</Label>
//                   <p className="font-medium">{enrollment.level}</p>
//                 </div>
//                 <div>
//                   <Label className="text-muted-foreground">Faculté</Label>
//                   <p className="font-medium">{enrollment.faculty}</p>
//                 </div>
//                 <div>
//                   <Label className="text-muted-foreground">
//                     Année académique
//                   </Label>
//                   <p className="font-medium">{enrollment.academicYear}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {!generatedDocument ? (
//             <>
//               {/* Options de génération */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Options du document</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {config.options.includes("semester") && (
//                     <div className="space-y-2">
//                       <Label>Période</Label>
//                       <Select
//                         value={options.semester}
//                         onValueChange={(value: "S1" | "S2" | "all") =>
//                           updateOption("semester", value)
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">Année complète</SelectItem>
//                           <SelectItem value="S1">
//                             Semestre 1 seulement
//                           </SelectItem>
//                           <SelectItem value="S2">
//                             Semestre 2 seulement
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   )}

//                   {config.options.includes("language") && (
//                     <div className="space-y-2">
//                       <Label className="flex items-center gap-2">
//                         <Languages className="h-4 w-4" />
//                         Langue du document
//                       </Label>
//                       <RadioGroup
//                         value={options.language}
//                         onValueChange={(value: "fr" | "en") =>
//                           updateOption("language", value)
//                         }
//                         className="flex space-x-4"
//                       >
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="fr" id="fr" />
//                           <Label htmlFor="fr" className="cursor-pointer">
//                             Français
//                           </Label>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <RadioGroupItem value="en" id="en" />
//                           <Label htmlFor="en" className="cursor-pointer">
//                             Anglais
//                           </Label>
//                         </div>
//                       </RadioGroup>
//                     </div>
//                   )}

//                   {config.options.includes("signature") && (
//                     <div className="flex items-center space-x-2">
//                       <CheckCircle className="h-4 w-4 text-green-500" />
//                       <Label
//                         htmlFor="signature"
//                         className="flex items-center gap-2 cursor-pointer"
//                       >
//                         <Signature className="h-4 w-4" />
//                         Inclure la signature
//                       </Label>
//                       <input
//                         type="checkbox"
//                         id="signature"
//                         checked={options.withSignature}
//                         onChange={(e) =>
//                           updateOption("withSignature", e.target.checked)
//                         }
//                         className="h-4 w-4 rounded border-gray-300"
//                       />
//                     </div>
//                   )}

//                   {config.options.includes("stamp") && (
//                     <div className="flex items-center space-x-2">
//                       <CheckCircle className="h-4 w-4 text-blue-500" />
//                       <Label
//                         htmlFor="stamp"
//                         className="flex items-center gap-2 cursor-pointer"
//                       >
//                         <Stamp className="h-4 w-4" />
//                         Inclure le cachet officiel
//                       </Label>
//                       <input
//                         type="checkbox"
//                         id="stamp"
//                         checked={options.withStamp}
//                         onChange={(e) =>
//                           updateOption("withStamp", e.target.checked)
//                         }
//                         className="h-4 w-4 rounded border-gray-300"
//                       />
//                     </div>
//                   )}

//                   {documentType === DocumentTypeI.BULLETIN && (
//                     <div className="flex items-center space-x-2">
//                       <CheckCircle className="h-4 w-4 text-orange-500" />
//                       <Label
//                         htmlFor="allGrades"
//                         className="flex items-center gap-2 cursor-pointer"
//                       >
//                         <BookOpen className="h-4 w-4" />
//                         Inclure toutes les notes (même non validées)
//                       </Label>
//                       <input
//                         type="checkbox"
//                         id="allGrades"
//                         checked={options.includeAllGrades}
//                         onChange={(e) =>
//                           updateOption("includeAllGrades", e.target.checked)
//                         }
//                         className="h-4 w-4 rounded border-gray-300"
//                       />
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Aperçu du document */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Aperçu du processus</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
//                     <div className="flex items-center gap-3 mb-2">
//                       <Eye className="h-5 w-5 text-blue-600" />
//                       <h4 className="font-semibold text-blue-800">
//                         Prévisualisation automatique
//                       </h4>
//                     </div>
//                     <p className="text-sm text-blue-700">
//                       Le document sera généré et ouvert automatiquement dans un
//                       nouvel onglet pour vérification.
//                     </p>
//                     <div className="mt-2 text-xs text-blue-600 space-y-1">
//                       <p>• 📄 Le PDF s'ouvrira dans un nouvel onglet</p>
//                       <p>• 👁️ Vous pourrez vérifier le contenu</p>
//                       <p>• 💾 Téléchargez ensuite depuis ce modal</p>
//                       <p>• ⚡ Processus rapide et sécurisé</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </>
//           ) : (
//             /* État après génération réussie */
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2 text-green-600">
//                   <CheckCircle className="h-5 w-5" />
//                   Document Généré avec Succès
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="p-4 border rounded-lg bg-green-50 border-green-200">
//                   <div className="flex items-center gap-3 mb-3">
//                     <IconComponent className="h-5 w-5 text-green-600" />
//                     <div>
//                       <h4 className="font-semibold text-green-800">
//                         {generatedDocument.fileName}
//                       </h4>
//                       <p className="text-sm text-green-600">
//                         Le document a été ouvert dans un nouvel onglet
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mt-3 text-sm text-green-700 space-y-1">
//                     <p>✅ Génération terminée</p>
//                     <p>✅ Prévisualisation ouverte</p>
//                     <p>📋 Vérifiez le document dans l'onglet PDF</p>
//                     <p>💾 Téléchargez-le une fois validé</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         <DialogFooter className="flex flex-col sm:flex-row gap-2">
//           {!generatedDocument ? (
//             <>
//               <Button
//                 variant="outline"
//                 onClick={handleClose}
//                 className="sm:flex-1"
//               >
//                 Annuler
//               </Button>
//               <Button
//                 onClick={handleGenerateAndPreview}
//                 disabled={isGenerating}
//                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 sm:flex-1"
//               >
//                 {isGenerating ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Génération en cours...
//                   </>
//                 ) : (
//                   <>
//                     <Eye className="h-4 w-4" />
//                     Générer et Prévisualiser
//                   </>
//                 )}
//               </Button>
//             </>
//           ) : (
//             <>
//               <Button
//                 variant="outline"
//                 onClick={handleClose}
//                 className="sm:flex-1"
//               >
//                 Fermer
//               </Button>
//               <Button
//                 onClick={handlePreviewAgain}
//                 variant="outline"
//                 className="flex items-center gap-2 sm:flex-1"
//               >
//                 <Eye className="h-4 w-4" />
//                 Rouvrir la Prévisualisation
//               </Button>
//               <Button
//                 onClick={handleDownload}
//                 className="flex items-center gap-2 bg-green-600 hover:bg-green-700 sm:flex-1"
//               >
//                 <Download className="h-4 w-4" />
//                 Télécharger le PDF
//               </Button>
//             </>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
