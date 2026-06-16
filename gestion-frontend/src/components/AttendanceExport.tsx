// src/components/attendance/AttendanceExport.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Attendance } from "@/types/attendance.types";
import { Download, FileSpreadsheet, FileText, ClipboardList } from "lucide-react";
import { formatDate } from "@/utils/attendanceUtils";
import { toast } from "sonner";
import { AttendanceSheetDialog } from "@/components/AttendanceSheetDialog";

interface AttendanceExportProps {
  attendances:    Attendance[];
  filename?:      string;
  classes?:       Array<{ id: string; name: string; level: string }>;
  academicYears?: Array<{ id: string; year: string; isCurrent?: boolean }>;
  defaultClassId?: string;
  defaultYearId?:  string;
}

export const AttendanceExport: React.FC<AttendanceExportProps> = ({
  attendances,
  filename       = "presences",
  classes        = [],
  academicYears  = [],
  defaultClassId = "",
  defaultYearId  = "",
}) => {
  const [sheetDialogOpen, setSheetDialogOpen] = useState(false);
  const exportToCSV = () => {
    if (!attendances.length) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    const headers = [
      "Étudiant",
      "Code",
      "Classe",
      "Date",
      "Session",
      "Statut",
      "Validation",
      "Heure arrivée",
      "Heure départ",
      "Justification",
      "Notes",
    ];

    const rows = attendances.map((a) => [
      `${a.student?.firstName} ${a.student?.lastName}`,
      a.student?.studentCode,
      a.student?.class?.name,
      formatDate(a.date, "short"),
      a.session,
      a.status,
      a.validationStatus,
      a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString("fr-FR") : "",
      a.checkOutTime
        ? new Date(a.checkOutTime).toLocaleTimeString("fr-FR")
        : "",
      a.justification || "",
      a.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Export CSV réussi");
  };

  const exportToJSON = () => {
    if (!attendances.length) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    const data = JSON.stringify(attendances, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.json`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Export JSON réussi");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setSheetDialogOpen(true)}>
            <ClipboardList className="h-4 w-4 mr-2" />
            Feuille de présence PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={exportToCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exporter en CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToJSON}>
            <FileText className="h-4 w-4 mr-2" />
            Exporter en JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AttendanceSheetDialog
        open={sheetDialogOpen}
        onOpenChange={setSheetDialogOpen}
        classes={classes}
        academicYears={academicYears}
        defaultClassId={defaultClassId}
        defaultYearId={defaultYearId}
      />
    </>
  );
};
