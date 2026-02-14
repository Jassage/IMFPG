import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemSettings } from "@/types/settings";

interface Props {
  settings: SystemSettings;
  setSettings: (settings: SystemSettings) => void;
}

export const GeneralSettings = ({ settings, setSettings }: Props) => {
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({
          ...settings,
          schoolLogo: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Informations générales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="schoolName">Nom de l'établissement</Label>
            <Input
              id="schoolName"
              value={settings.schoolName}
              onChange={(e) =>
                setSettings({ ...settings, schoolName: e.target.value })
              }
              placeholder="Institution Mixte Faustin 1er"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolSlogan">Slogan</Label>
            <Input
              id="schoolSlogan"
              value={settings.schoolSlogan}
              onChange={(e) =>
                setSettings({ ...settings, schoolSlogan: e.target.value })
              }
              placeholder="L'excellence pour tous"
            />
          </div>

          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 border rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={settings.schoolLogo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.src = "/logo.png")}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("logo-upload")?.click()
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Changer le logo
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="favicon">Favicon</Label>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={settings.schoolFavicon}
                  alt="Favicon"
                  className="w-full h-full object-contain"
                />
              </div>
              <Input
                id="favicon"
                value={settings.schoolFavicon}
                onChange={(e) =>
                  setSettings({ ...settings, schoolFavicon: e.target.value })
                }
                placeholder="/favicon.ico"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
