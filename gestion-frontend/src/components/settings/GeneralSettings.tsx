// components/settings/GeneralSettings.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemSettings } from "@/types/settings";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface Props {
  settings: SystemSettings;
  setSettings: (settings: SystemSettings) => void;
}

export const GeneralSettings = ({ settings, setSettings }: Props) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erreur",
        description: "Le fichier doit être une image",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const response = await api.post("/settings/upload-logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Mettre à jour les settings locaux
        setSettings({
          ...settings,
          schoolLogo: response.data.data.settings.schoolLogo,
        });

        toast({
          title: "Succès",
          description: "Logo mis à jour avec succès",
        });
      }
    } catch (error: any) {
      console.error("Erreur upload:", error);
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de l'upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
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

          <div className="space-y-2 md:col-span-2">
            <Label>Logo de l'école</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 border rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={
                    settings?.schoolLogo
                      ? `http://localhost:5000${settings.schoolLogo}`
                      : "/logo.png"
                  }
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
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("logo-upload")?.click()
                  }
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Changer le logo
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPEG, PNG, GIF. Max 5MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
