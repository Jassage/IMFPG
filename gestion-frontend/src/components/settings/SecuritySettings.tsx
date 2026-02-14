import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Key, Clock, Lock } from "lucide-react";
import { SystemSettings } from "@/types/settings";

interface Props {
  settings: SystemSettings;
  setSettings: (settings: SystemSettings) => void;
}

export const SecuritySettings = ({ settings, setSettings }: Props) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Politique de sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Délai d'expiration session (minutes)</Label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    sessionTimeout: parseInt(e.target.value),
                  })
                }
                min={1}
                max={480}
              />
            </div>

            <div className="space-y-2">
              <Label>Nombre max de tentatives</Label>
              <Input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxLoginAttempts: parseInt(e.target.value),
                  })
                }
                min={1}
                max={10}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-1">
              <Label>Authentification à deux facteurs</Label>
              <p className="text-sm text-muted-foreground">
                Activer 2FA pour tous les utilisateurs
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, twoFactorAuth: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Politique de mot de passe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Longueur minimale</Label>
            <Input
              type="number"
              value={settings.passwordPolicy.minLength}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  passwordPolicy: {
                    ...settings.passwordPolicy,
                    minLength: parseInt(e.target.value),
                  },
                })
              }
              min={4}
              max={20}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label>Majuscules requises</Label>
              <Switch
                checked={settings.passwordPolicy.requireUppercase}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      requireUppercase: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label>Minuscules requises</Label>
              <Switch
                checked={settings.passwordPolicy.requireLowercase}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      requireLowercase: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label>Chiffres requis</Label>
              <Switch
                checked={settings.passwordPolicy.requireNumbers}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      requireNumbers: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label>Caractères spéciaux requis</Label>
              <Switch
                checked={settings.passwordPolicy.requireSpecialChars}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      requireSpecialChars: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
