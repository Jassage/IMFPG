// src/components/attendance/AttendanceCard.tsx

import React from "react";
import { Attendance } from "@/types/attendance.types";
import {
  getStatusColor,
  getStatusIcon,
  getStatusLabel,
  getSessionLabel,
  getValidationColor,
  getValidationLabel,
  formatDate,
  formatTime,
} from "@/utils/attendanceUtils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  Edit,
  CheckCircle,
  FileText,
  Clock,
  Calendar,
  User,
} from "lucide-react";

interface AttendanceCardProps {
  attendance: Attendance;
  onView?: () => void;
  onEdit?: () => void;
  onValidate?: () => void;
  onJustify?: () => void;
  showActions?: boolean;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  attendance,
  onView,
  onEdit,
  onValidate,
  onJustify,
  showActions = true,
}) => {
  const statusColor = getStatusColor(attendance.status);
  const statusIcon = getStatusIcon(attendance.status);
  const statusLabel = getStatusLabel(attendance.status);
  const validationColor = getValidationColor(attendance.validationStatus);
  const validationLabel = getValidationLabel(attendance.validationStatus);

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "?";
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        {/* En-tête */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={attendance.student?.photo} />
              <AvatarFallback className="bg-primary-100 text-primary-700">
                {getInitials(
                  attendance.student?.firstName,
                  attendance.student?.lastName,
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {attendance.student?.firstName} {attendance.student?.lastName}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center">
                <User className="h-3 w-3 mr-1" />
                {attendance.student?.studentCode} •{" "}
                {attendance.schoolClass.name}
              </p>
            </div>
          </div>
          <Badge className={statusColor}>
            <span className="mr-1">{statusIcon}</span>
            {statusLabel}
          </Badge>
        </div>

        {/* Informations */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Date
            </span>
            <span className="font-medium">
              {formatDate(attendance.date, "long")}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Session
            </span>
            <span className="font-medium">
              {getSessionLabel(attendance.session as any)}
            </span>
          </div>

          {attendance.checkInTime && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Arrivée</span>
              <span className="font-medium">
                {formatTime(attendance.checkInTime)}
              </span>
            </div>
          )}

          {attendance.checkOutTime && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Départ</span>
              <span className="font-medium">
                {formatTime(attendance.checkOutTime)}
              </span>
            </div>
          )}

          {attendance.expectedCheckIn && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Horaire prévu</span>
              <span className="font-medium">
                {attendance.expectedCheckIn} - {attendance.expectedCheckOut}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Validation</span>
            <Badge variant="outline" className={validationColor}>
              {validationLabel}
            </Badge>
          </div>

          {attendance.justification && (
            <div className="mt-2 p-2 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">
                {attendance.justification}
              </p>
            </div>
          )}

          {attendance.notes && (
            <div className="mt-2 text-xs text-muted-foreground italic">
              Note: {attendance.notes}
            </div>
          )}
        </div>
      </CardContent>

      {/* Actions */}
      {showActions && (
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 justify-end">
          {attendance.validationStatus === "PENDING" && onValidate && (
            <Button
              size="sm"
              variant="outline"
              onClick={onValidate}
              className="flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Valider
            </Button>
          )}
          {(attendance.status === "ABSENT" || attendance.status === "LATE") &&
            !attendance.justification &&
            onJustify && (
              <Button
                size="sm"
                variant="outline"
                onClick={onJustify}
                className="flex items-center"
              >
                <FileText className="h-4 w-4 mr-1" />
                Justifier
              </Button>
            )}
          {onView && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onView}
              className="flex items-center"
            >
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
          )}
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
