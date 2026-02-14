import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Users,
  BookOpen,
  Bus,
  Home,
  Wallet,
  Package,
  Calendar,
  FileText,
  CreditCard,
  GraduationCap,
} from "lucide-react";
import { SystemSettings } from "@/types/settings";

interface Props {
  settings: SystemSettings;
  setSettings: (settings: SystemSettings) => void;
}

export const ModulesSettings = ({ settings, setSettings }: Props) => {
  const modules = [
    {
      key: "attendance",
      label: "Gestion des présences",
      icon: Calendar,
      description: "Suivi des présences et absences",
    },
    {
      key: "library",
      label: "Bibliothèque",
      icon: BookOpen,
      description: "Gestion des livres et emprunts",
    },
    {
      key: "transport",
      label: "Transport scolaire",
      icon: Bus,
      description: "Gestion des bus et itinéraires",
    },
    {
      key: "hostel",
      label: "Internat",
      icon: Home,
      description: "Gestion des dortoirs et résidents",
    },
    {
      key: "payroll",
      label: "Paie",
      icon: Wallet,
      description: "Gestion des salaires",
    },
    {
      key: "inventory",
      label: "Inventaire",
      icon: Package,
      description: "Gestion des stocks et matériels",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modules activés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            const isEnabled =
              settings.enabledModules[
                module.key as keyof typeof settings.enabledModules
              ];

            return (
              <div
                key={module.key}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <Label className="font-medium">{module.label}</Label>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      enabledModules: {
                        ...settings.enabledModules,
                        [module.key]: checked,
                      },
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
