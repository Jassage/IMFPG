// // Fichier: src/components/timetable/TimetablePlanner.tsx
// import React, { useState, useCallback, useEffect } from "react";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "@hello-pangea/dnd";
// import { useTimetableStore } from "@/store/timetableStore";
// import { useSubjectStore } from "@/store/subjectStore";
// import { useUserStore } from "@/store/userStore";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Calendar,
//   Clock,
//   Users,
//   BookOpen,
//   MapPin,
//   Filter,
//   Save,
//   Trash2,
//   Plus,
//   GripVertical,
//   AlertCircle,
// } from "lucide-react";
// import { toast } from "@/hooks/use-toast";

// interface TimetablePlannerProps {
//   timetableId: string;
//   onSave?: () => void;
// }

// const DAYS = [
//   { id: 0, name: "Lundi", short: "LUN" },
//   { id: 1, name: "Mardi", short: "MAR" },
//   { id: 2, name: "Mercredi", short: "MER" },
//   { id: 3, name: "Jeudi", short: "JEU" },
//   { id: 4, name: "Vendredi", short: "VEN" },
//   { id: 5, name: "Samedi", short: "SAM" },
// ];

// const TIME_SLOTS = [
//   { id: "slot1", start: "08:00", end: "09:30" },
//   { id: "slot2", start: "09:45", end: "11:15" },
//   { id: "slot3", start: "11:30", end: "13:00" },
//   { id: "slot4", start: "14:00", end: "15:30" },
//   { id: "slot5", start: "15:45", end: "17:15" },
//   { id: "slot6", start: "17:30", end: "19:00" },
// ];

// export const TimetablePlanner: React.FC<TimetablePlannerProps> = ({
//   timetableId,
//   onSave,
// }) => {
//   const {
//     timetableSessions,
//     fetchTimetableSessions,
//     createSession,
//     updateSession,
//     deleteSession,
//     createBulkSessions,
//     loading,
//   } = useTimetableStore();

//   const { subjects, fetchSubjects } = useSubjectStore();
//   const { users, fetchUsers } = useUserStore();

//   const [sessions, setSessions] = useState<any[]>([]);
//   const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);
//   const [availableTeachers, setAvailableTeachers] = useState<any[]>([]);
//   const [editingSession, setEditingSession] = useState<any | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [filters, setFilters] = useState({
//     day: null as number | null,
//     subject: null as string | null,
//     teacher: null as string | null,
//   });

//   useEffect(() => {
//     fetchTimetableSessions(timetableId);
//     fetchSubjects();
//     fetchUsers();
//   }, [timetableId]);

//   useEffect(() => {
//     setSessions(timetableSessions);
//   }, [timetableSessions]);

//   useEffect(() => {
//     if (subjects.length > 0) {
//       setAvailableSubjects(subjects);
//     }
//   }, [subjects]);

//   useEffect(() => {
//     if (users.length > 0) {
//       const teachers = users.filter((user) => user.role === "Professeur");
//       setAvailableTeachers(teachers);
//     }
//   }, [users]);

//   const handleDragEnd = useCallback(
//     (result: DropResult) => {
//       if (!result.destination) return;

//       const { source, destination, draggableId } = result;

//       // Si c'est un déplacement entre les listes (matière -> emploi du temps)
//       if (
//         source.droppableId === "subjects" &&
//         destination.droppableId.startsWith("day-")
//       ) {
//         const subjectId = draggableId;
//         const [_, dayId, timeSlotId] = destination.droppableId.split("-");

//         const subject = availableSubjects.find((s) => s.id === subjectId);
//         if (!subject) return;

//         const timeSlot = TIME_SLOTS.find((ts) => ts.id === timeSlotId);
//         if (!timeSlot) return;

//         const newSession = {
//           subjectId: subject.id,
//           dayOfWeek: parseInt(dayId),
//           startTime: `2024-01-01T${timeSlot.start}:00`,
//           endTime: `2024-01-01T${timeSlot.end}:00`,
//           sessionType: "Cours",
//           isRecurring: true,
//         };

//         handleCreateSession(newSession);
//       }

//       // Si c'est un réarrangement dans l'emploi du temps
//       if (
//         source.droppableId.startsWith("day-") &&
//         destination.droppableId.startsWith("day-")
//       ) {
//         const sessionId = draggableId;
//         const session = sessions.find((s) => s.id === sessionId);
//         if (!session) return;

//         const [_, newDayId, newTimeSlotId] = destination.droppableId.split("-");
//         const newTimeSlot = TIME_SLOTS.find((ts) => ts.id === newTimeSlotId);
//         if (!newTimeSlot) return;

//         const updatedSession = {
//           ...session,
//           dayOfWeek: parseInt(newDayId),
//           startTime: `2024-01-01T${newTimeSlot.start}:00`,
//           endTime: `2024-01-01T${newTimeSlot.end}:00`,
//         };

//         handleUpdateSession(sessionId, updatedSession);
//       }
//     },
//     [sessions, availableSubjects]
//   );

//   const handleCreateSession = async (sessionData: any) => {
//     try {
//       await createSession(timetableId, sessionData);
//       toast({
//         title: "Session créée",
//         description: "La session a été ajoutée à l'emploi du temps",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Erreur",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleUpdateSession = async (sessionId: string, data: any) => {
//     try {
//       await updateSession(timetableId, sessionId, data);
//       toast({
//         title: "Session modifiée",
//         description: "La session a été mise à jour",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Erreur",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDeleteSession = async (sessionId: string) => {
//     try {
//       await deleteSession(timetableId, sessionId);
//       toast({
//         title: "Session supprimée",
//         description: "La session a été retirée de l'emploi du temps",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Erreur",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const filteredSessions = sessions.filter((session) => {
//     if (filters.day !== null && session.dayOfWeek !== filters.day) return false;
//     if (filters.subject && session.subjectId !== filters.subject) return false;
//     if (filters.teacher && session.teacherId !== filters.teacher) return false;
//     return true;
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">
//             Planificateur d'emploi du temps
//           </h2>
//           <p className="text-muted-foreground">
//             Glissez-déposez les matières pour créer votre emploi du temps
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" onClick={onSave}>
//             <Save className="h-4 w-4 mr-2" />
//             Sauvegarder
//           </Button>
//           <Button>
//             <Plus className="h-4 w-4 mr-2" />
//             Générer automatiquement
//           </Button>
//         </div>
//       </div>

//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Liste des matières disponibles */}
//           <Card className="lg:col-span-1">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <BookOpen className="h-5 w-5" />
//                 Matières disponibles
//               </CardTitle>
//               <CardDescription>
//                 Glissez une matière vers un créneau horaire
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Droppable droppableId="subjects">
//                 {(provided, snapshot) => (
//                   <ScrollArea className="h-[600px]">
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       className={`space-y-2 p-1 ${
//                         snapshot.isDraggingOver ? "bg-primary/5 rounded-lg" : ""
//                       }`}
//                     >
//                       {availableSubjects.map((subject, index) => (
//                         <Draggable
//                           key={subject.id}
//                           draggableId={subject.id}
//                           index={index}
//                         >
//                           {(provided, snapshot) => (
//                             <div
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               className={`p-3 bg-card border rounded-lg cursor-move hover:shadow-md transition-shadow ${
//                                 snapshot.isDragging
//                                   ? "shadow-lg ring-2 ring-primary"
//                                   : ""
//                               }`}
//                             >
//                               <div className="flex items-center justify-between">
//                                 <div>
//                                   <div className="font-medium">
//                                     {subject.name}
//                                   </div>
//                                   <div className="text-sm text-muted-foreground">
//                                     Coef. {subject.coefficient}
//                                   </div>
//                                 </div>
//                                 <GripVertical className="h-4 w-4 text-muted-foreground" />
//                               </div>
//                             </div>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </div>
//                   </ScrollArea>
//                 )}
//               </Droppable>
//             </CardContent>
//           </Card>

//           {/* Emploi du temps */}
//           <Card className="lg:col-span-3">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle className="flex items-center gap-2">
//                   <Calendar className="h-5 w-5" />
//                   Emploi du temps
//                 </CardTitle>
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <Filter className="h-4 w-4" />
//                     <Select
//                       value={filters.day?.toString() || ""}
//                       onValueChange={(value) =>
//                         setFilters({
//                           ...filters,
//                           day: value ? parseInt(value) : null,
//                         })
//                       }
//                     >
//                       <SelectTrigger className="w-[120px]">
//                         <SelectValue placeholder="Jour" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="">Tous les jours</SelectItem>
//                         {DAYS.map((day) => (
//                           <SelectItem key={day.id} value={day.id.toString()}>
//                             {day.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() =>
//                       setFilters({ day: null, subject: null, teacher: null })
//                     }
//                   >
//                     Réinitialiser
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr>
//                       <th className="w-32 p-3 border text-left font-medium bg-muted/50">
//                         Créneaux
//                       </th>
//                       {DAYS.map((day) => (
//                         <th
//                           key={day.id}
//                           className="p-3 border text-center font-medium bg-muted/50"
//                         >
//                           <div className="flex flex-col items-center">
//                             <span className="font-semibold">{day.short}</span>
//                             <span className="text-xs text-muted-foreground">
//                               {day.name}
//                             </span>
//                           </div>
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {TIME_SLOTS.map((timeSlot) => (
//                       <tr key={timeSlot.id}>
//                         <td className="p-3 border text-center font-medium bg-muted/30">
//                           <div className="flex flex-col">
//                             <span>{timeSlot.start}</span>
//                             <span className="text-xs text-muted-foreground">
//                               à
//                             </span>
//                             <span>{timeSlot.end}</span>
//                           </div>
//                         </td>
//                         {DAYS.map((day) => (
//                           <td
//                             key={`${day.id}-${timeSlot.id}`}
//                             className="p-2 border min-w-[200px]"
//                           >
//                             <Droppable
//                               droppableId={`day-${day.id}-${timeSlot.id}`}
//                             >
//                               {(provided, snapshot) => (
//                                 <div
//                                   ref={provided.innerRef}
//                                   {...provided.droppableProps}
//                                   className={`min-h-[100px] rounded transition-colors ${
//                                     snapshot.isDraggingOver
//                                       ? "bg-primary/10 ring-2 ring-primary/20"
//                                       : "bg-background"
//                                   }`}
//                                 >
//                                   {filteredSessions
//                                     .filter(
//                                       (session) =>
//                                         session.dayOfWeek === day.id &&
//                                         session.startTime.substring(11, 16) ===
//                                           timeSlot.start
//                                     )
//                                     .map((session, index) => (
//                                       <Draggable
//                                         key={session.id}
//                                         draggableId={session.id}
//                                         index={index}
//                                       >
//                                         {(provided, snapshot) => (
//                                           <div
//                                             ref={provided.innerRef}
//                                             {...provided.draggableProps}
//                                             {...provided.dragHandleProps}
//                                             className={`mb-2 p-3 bg-card border rounded-lg cursor-move ${
//                                               snapshot.isDragging
//                                                 ? "shadow-lg ring-2 ring-primary"
//                                                 : ""
//                                             }`}
//                                             onClick={() => {
//                                               setEditingSession(session);
//                                               setIsDialogOpen(true);
//                                             }}
//                                           >
//                                             <div className="flex items-center justify-between">
//                                               <div className="flex-1">
//                                                 <div className="font-medium text-sm">
//                                                   {session.subject?.name}
//                                                 </div>
//                                                 <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
//                                                   {session.teacher && (
//                                                     <span className="flex items-center gap-1">
//                                                       <Users className="h-3 w-3" />
//                                                       {
//                                                         session.teacher
//                                                           .firstName
//                                                       }{" "}
//                                                       {session.teacher.lastName}
//                                                     </span>
//                                                   )}
//                                                   {session.classroom && (
//                                                     <span className="flex items-center gap-1">
//                                                       <MapPin className="h-3 w-3" />
//                                                       {session.classroom.name}
//                                                     </span>
//                                                   )}
//                                                 </div>
//                                                 <Badge
//                                                   variant="outline"
//                                                   className="mt-2 text-xs"
//                                                 >
//                                                   {session.sessionType}
//                                                 </Badge>
//                                               </div>
//                                               <Button
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 className="h-6 w-6 p-0"
//                                                 onClick={(e) => {
//                                                   e.stopPropagation();
//                                                   handleDeleteSession(
//                                                     session.id
//                                                   );
//                                                 }}
//                                               >
//                                                 <Trash2 className="h-3 w-3" />
//                                               </Button>
//                                             </div>
//                                           </div>
//                                         )}
//                                       </Draggable>
//                                     ))}
//                                   {provided.placeholder}
//                                   {filteredSessions.filter(
//                                     (session) =>
//                                       session.dayOfWeek === day.id &&
//                                       session.startTime.substring(11, 16) ===
//                                         timeSlot.start
//                                   ).length === 0 && (
//                                     <div className="flex items-center justify-center h-full text-sm text-muted-foreground italic py-4">
//                                       Libre
//                                     </div>
//                                   )}
//                                 </div>
//                               )}
//                             </Droppable>
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </DragDropContext>

//       {/* Dialog d'édition de session */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>
//               {editingSession ? "Modifier la session" : "Nouvelle session"}
//             </DialogTitle>
//           </DialogHeader>
//           {editingSession && (
//             <SessionForm
//               session={editingSession}
//               subjects={availableSubjects}
//               teachers={availableTeachers}
//               onSave={async (data) => {
//                 await handleUpdateSession(editingSession.id, data);
//                 setIsDialogOpen(false);
//               }}
//               onCancel={() => setIsDialogOpen(false)}
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// interface SessionFormProps {
//   session: any;
//   subjects: any[];
//   teachers: any[];
//   onSave: (data: any) => Promise<void>;
//   onCancel: () => void;
// }

// const SessionForm: React.FC<SessionFormProps> = ({
//   session,
//   subjects,
//   teachers,
//   onSave,
//   onCancel,
// }) => {
//   const [formData, setFormData] = useState({
//     subjectId: session.subjectId || "",
//     teacherId: session.teacherId || "",
//     classroomId: session.classroomId || "",
//     sessionType: session.sessionType || "Cours",
//     isRecurring: session.isRecurring !== false,
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const validationErrors: Record<string, string> = {};

//     if (!formData.subjectId) {
//       validationErrors.subjectId = "La matière est requise";
//     }

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       await onSave(formData);
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: "Impossible de sauvegarder la session",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="subjectId">Matière</Label>
//         <Select
//           value={formData.subjectId}
//           onValueChange={(value) =>
//             setFormData({ ...formData, subjectId: value })
//           }
//         >
//           <SelectTrigger
//             className={`${errors.subjectId ? "border-destructive" : ""}`}
//           >
//             <SelectValue placeholder="Sélectionner une matière" />
//           </SelectTrigger>
//           <SelectContent>
//             {subjects.map((subject) => (
//               <SelectItem key={subject.id} value={subject.id}>
//                 {subject.name} ({subject.code})
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {errors.subjectId && (
//           <p className="text-sm text-destructive">{errors.subjectId}</p>
//         )}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="teacherId">Enseignant</Label>
//         <Select
//           value={formData.teacherId}
//           onValueChange={(value) =>
//             setFormData({ ...formData, teacherId: value })
//           }
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Sélectionner un enseignant" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="">Non assigné</SelectItem>
//             {teachers.map((teacher) => (
//               <SelectItem key={teacher.id} value={teacher.id}>
//                 {teacher.firstName} {teacher.lastName}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="sessionType">Type de session</Label>
//         <Select
//           value={formData.sessionType}
//           onValueChange={(value) =>
//             setFormData({ ...formData, sessionType: value })
//           }
//         >
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="Cours">Cours</SelectItem>
//             <SelectItem value="TP">Travaux pratiques</SelectItem>
//             <SelectItem value="TD">Travaux dirigés</SelectItem>
//             <SelectItem value="Examen">Examen</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="flex items-center space-x-2">
//         <Switch
//           id="isRecurring"
//           checked={formData.isRecurring}
//           onCheckedChange={(checked) =>
//             setFormData({ ...formData, isRecurring: checked })
//           }
//         />
//         <Label htmlFor="isRecurring">
//           Session récurrente (toutes les semaines)
//         </Label>
//       </div>

//       <div className="flex justify-end gap-2 pt-4">
//         <Button type="button" variant="outline" onClick={onCancel}>
//           Annuler
//         </Button>
//         <Button type="submit">Sauvegarder</Button>
//       </div>
//     </form>
//   );
// };
