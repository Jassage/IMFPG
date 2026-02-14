import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, BookOpen, Award } from "lucide-react";
import { SystemSettings } from "@/types/settings";

interface Props {
  settings: SystemSettings;
  setSettings: (settings: SystemSettings) => void;
}

export const AcademicSettings = ({ settings, setSettings }: Props) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Année académique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Année académique courante</Label>
            <Select
              value={settings.currentAcademicYearId || ""}
              onValueChange={(value) =>
                setSettings({ ...settings, currentAcademicYearId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2025-2026">2025-2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Système de notation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type de notation</Label>
              <Select
                value={settings.gradingSystem}
                onValueChange={(value: any) =>
                  setSettings({ ...settings, gradingSystem: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                  <SelectItem value="letter">Lettres (A, B, C...)</SelectItem>
                  <SelectItem value="gpa">GPA (4.0, 3.5...)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Note de passage</Label>
              <Input
                type="number"
                value={settings.passingGrade}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    passingGrade: parseInt(e.target.value),
                  })
                }
                min={0}
                max={100}
              />
            </div>

            <div className="space-y-2">
              <Label>Note maximale</Label>
              <Input
                type="number"
                value={settings.maxGrade}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxGrade: parseInt(e.target.value),
                  })
                }
                min={1}
                max={100}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Mentions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border rounded-lg text-center">
              <div className="text-sm font-medium">Passable</div>
              <div className="text-xs text-muted-foreground">
                {settings.passingGrade} - 60%
              </div>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <div className="text-sm font-medium">Assez bien</div>
              <div className="text-xs text-muted-foreground">60 - 70%</div>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <div className="text-sm font-medium">Bien</div>
              <div className="text-xs text-muted-foreground">70 - 80%</div>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <div className="text-sm font-medium">Très bien</div>
              <div className="text-xs text-muted-foreground">80 - 100%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
