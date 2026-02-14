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
import { Palette, Type } from "lucide-react";
import { SystemSettings } from "@/types/settings";

interface Props {
  settings: SystemSettings;
  setSettings: (settings: SystemSettings) => void;
}

export const AppearanceSettings = ({ settings, setSettings }: Props) => {
  const fonts = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Raleway",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Apparence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Couleur primaire</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.primaryColor}
                onChange={(e) =>
                  setSettings({ ...settings, primaryColor: e.target.value })
                }
                className="w-12 p-1 h-10"
              />
              <Input
                value={settings.primaryColor}
                onChange={(e) =>
                  setSettings({ ...settings, primaryColor: e.target.value })
                }
                placeholder="#2563eb"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Couleur secondaire</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) =>
                  setSettings({ ...settings, secondaryColor: e.target.value })
                }
                className="w-12 p-1 h-10"
              />
              <Input
                value={settings.secondaryColor}
                onChange={(e) =>
                  setSettings({ ...settings, secondaryColor: e.target.value })
                }
                placeholder="#4f46e5"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Couleur d'accent</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.accentColor}
                onChange={(e) =>
                  setSettings({ ...settings, accentColor: e.target.value })
                }
                className="w-12 p-1 h-10"
              />
              <Input
                value={settings.accentColor}
                onChange={(e) =>
                  setSettings({ ...settings, accentColor: e.target.value })
                }
                placeholder="#f59e0b"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Police d'écriture
          </Label>
          <Select
            value={settings.fontFamily}
            onValueChange={(value) =>
              setSettings({ ...settings, fontFamily: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map((font) => (
                <SelectItem
                  key={font}
                  value={font}
                  style={{ fontFamily: font }}
                >
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          className="p-4 border rounded-lg"
          style={{
            backgroundColor: settings.primaryColor + "20",
            borderColor: settings.primaryColor,
            color: settings.primaryColor,
          }}
        >
          <p className="text-sm">
            Aperçu des couleurs : Texte avec la couleur primaire
          </p>
          <button
            className="px-4 py-2 rounded mt-2 text-white"
            style={{ backgroundColor: settings.secondaryColor }}
          >
            Bouton secondaire
          </button>
          <span
            className="inline-block px-2 py-1 ml-2 rounded text-white"
            style={{ backgroundColor: settings.accentColor }}
          >
            Accent
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
