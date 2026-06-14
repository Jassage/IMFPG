import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import { SystemSettings } from "@/types/settings";

interface Props {
  settings: SystemSettings;
  setSettings: (settings: SystemSettings) => void;
}

export const ContactSettings = ({ settings, setSettings }: Props) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Coordonnées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone principal</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                placeholder="+509 00 00 0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryPhone">Téléphone secondaire</Label>
              <Input
                id="secondaryPhone"
                value={settings.secondaryPhone || ""}
                onChange={(e) =>
                  setSettings({ ...settings, secondaryPhone: e.target.value })
                }
                placeholder="+509 00 00 0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email principal</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                placeholder="contact@imfp.ht"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryEmail">Email secondaire</Label>
              <Input
                id="secondaryEmail"
                type="email"
                value={settings.secondaryEmail || ""}
                onChange={(e) =>
                  setSettings({ ...settings, secondaryEmail: e.target.value })
                }
                placeholder="administration@imfp.ht"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                value={settings.website || ""}
                onChange={(e) =>
                  setSettings({ ...settings, website: e.target.value })
                }
                placeholder="https://www.imfp.ht"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              value={settings.address || ""}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
              placeholder="123 Rue de l'École"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={settings.city || ""}
                onChange={(e) =>
                  setSettings({ ...settings, city: e.target.value })
                }
                placeholder="Port-au-Prince"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                value={settings.country || ""}
                onChange={(e) =>
                  setSettings({ ...settings, country: e.target.value })
                }
                placeholder="Haïti"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                value={settings.postalCode || ""}
                onChange={(e) =>
                  setSettings({ ...settings, postalCode: e.target.value })
                }
                placeholder="HT6110"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Réseaux sociaux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Label>
              <Input
                value={settings.facebook || ""}
                onChange={(e) =>
                  setSettings({ ...settings, facebook: e.target.value })
                }
                placeholder="https://facebook.com/imfp"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-sky-500" />
                Twitter
              </Label>
              <Input
                value={settings.twitter || ""}
                onChange={(e) =>
                  setSettings({ ...settings, twitter: e.target.value })
                }
                placeholder="https://twitter.com/imfp"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-blue-700" />
                LinkedIn
              </Label>
              <Input
                value={settings.linkedin || ""}
                onChange={(e) =>
                  setSettings({ ...settings, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/school/imfp"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-600" />
                Instagram
              </Label>
              <Input
                value={settings.instagram || ""}
                onChange={(e) =>
                  setSettings({ ...settings, instagram: e.target.value })
                }
                placeholder="https://instagram.com/imfp"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Youtube className="h-4 w-4 text-red-600" />
                YouTube
              </Label>
              <Input
                value={settings.youtube || ""}
                onChange={(e) =>
                  setSettings({ ...settings, youtube: e.target.value })
                }
                placeholder="https://youtube.com/imfp"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
