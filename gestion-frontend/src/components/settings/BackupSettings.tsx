import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { HardDrive, Clock, Calendar, Download } from "lucide-react";
import { SystemSettings } from "@/types/settings";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Props {
  settings: SystemSettings;
  setSettings: (settings: SystemSettings) => void;
}

export const BackupSettings = ({ settings, setSettings }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Sauvegarde
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="space-y-1">
            <Label>Sauvegarde automatique</Label>
            <p className="text-sm text-muted-foreground">
              Activer les sauvegardes automatiques
            </p>
          </div>
          <Switch
            checked={settings.autoBackup}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, autoBackup: checked })
            }
          />
        </div>

        {settings.autoBackup && (
          <>
            <div className="space-y-2">
              <Label>Fréquence des sauvegardes</Label>
              <Select
                value={settings.backupFrequency}
                onValueChange={(value: any) =>
                  setSettings({ ...settings, backupFrequency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Quotidienne</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuelle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Durée de conservation (jours)</Label>
              <Input
                type="number"
                value={settings.backupRetention}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    backupRetention: parseInt(e.target.value),
                  })
                }
                min={1}
                max={365}
              />
            </div>

            {settings.lastBackup && (
              <div className="p-3 bg-muted rounded-lg flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Dernière sauvegarde :{" "}
                  {format(new Date(settings.lastBackup), "PPP à HH:mm", {
                    locale: fr,
                  })}
                </span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
