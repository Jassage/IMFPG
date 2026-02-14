import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, MessageSquare, BellRing } from "lucide-react";
import { SystemSettings } from "@/types/settings";

interface Props {
  settings: SystemSettings;
  setSettings: (settings: SystemSettings) => void;
}

export const NotificationSettings = ({ settings, setSettings }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label>Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Envoyer des notifications par email
              </p>
            </div>
          </div>
          <Switch
            checked={settings.enableEmailNotifications}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, enableEmailNotifications: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label>Notifications par SMS</Label>
              <p className="text-sm text-muted-foreground">
                Envoyer des notifications par SMS
              </p>
            </div>
          </div>
          <Switch
            checked={settings.enableSmsNotifications}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, enableSmsNotifications: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <BellRing className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label>Notifications push</Label>
              <p className="text-sm text-muted-foreground">
                Notifications en temps réel
              </p>
            </div>
          </div>
          <Switch
            checked={settings.enablePushNotifications}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, enablePushNotifications: checked })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
