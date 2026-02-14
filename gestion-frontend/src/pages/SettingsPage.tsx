import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Settings,
  Shield,
  Bell,
  Palette,
  Download,
  Upload,
  Save,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone,
  ArrowLeft,
  Building2,
  DollarSign,
  School,
  HardDrive,
  Moon,
  Sun,
  Monitor,
  Loader2,
  AlertCircle,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore"; // ✅ CORRECTION: Importer useAuthStore
import { useTheme } from "@/providers/ThemeProvider"; // Ajustez le chemin selon votre structure

// Composants de paramètres
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { ContactSettings } from "@/components/settings/ContactSettings";
import { AcademicSettings } from "@/components/settings/AcademicSettings";
import { FinancialSettings } from "@/components/settings/FinancialSettings";
import { SecuritySettings as SecuritySettingsComponent } from "@/components/settings/SecuritySettings";
import { AppearanceSettings as AppearanceSettingsComponent } from "@/components/settings/AppearanceSettings";
import { ModulesSettings } from "@/components/settings/ModulesSettings";
import { useSettings } from "@/hooks/useSystemSettings";

export const SettingsPage = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const { user } = useAuthStore(); // ✅ CORRECTION: Utiliser useAuthStore au lieu de useAuth

  const {
    settings: dbSettings,
    isLoading,
    error,
    updateSettings,
    backupSettings,
    resetSettings,
    refetch,
  } = useSettings();

  const [activeTab, setActiveTab] = useState("general");
  const [localSettings, setLocalSettings] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Initialiser les paramètres locaux
  useEffect(() => {
    if (dbSettings) {
      setLocalSettings(dbSettings);
    }
  }, [dbSettings]);

  // Détecter les changements
  useEffect(() => {
    if (localSettings && dbSettings) {
      setHasChanges(
        JSON.stringify(localSettings) !== JSON.stringify(dbSettings),
      );
    }
  }, [localSettings, dbSettings]);

  // Gérer la sauvegarde
  const handleSave = async () => {
    if (!localSettings) return;

    setIsSaving(true);
    try {
      await updateSettings(localSettings);
      setHasChanges(false);
      toast({
        title: "Succès",
        description: "Paramètres enregistrés avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Gérer la réinitialisation
  const handleReset = async () => {
    if (
      !confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?")
    )
      return;

    try {
      await resetSettings();
      setHasChanges(false);
      toast({
        title: "Succès",
        description: "Paramètres réinitialisés",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la réinitialisation",
        variant: "destructive",
      });
    }
  };

  // Gérer la sauvegarde
  const handleBackup = async () => {
    try {
      await backupSettings();
      toast({
        title: "Succès",
        description: "Sauvegarde effectuée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la sauvegarde",
        variant: "destructive",
      });
    }
  };

  // Gérer l'import
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = JSON.parse(text);

      if (confirm("Importer écrasera les paramètres actuels. Continuer ?")) {
        await updateSettings(imported);
        toast({
          title: "Succès",
          description: "Paramètres importés",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Fichier invalide",
        variant: "destructive",
      });
    }
  };

  // Gérer l'export
  const handleExport = () => {
    if (!dbSettings) return;

    const blob = new Blob([JSON.stringify(dbSettings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `settings-backup-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Succès",
      description: "Paramètres exportés",
    });
  };

  if (isLoading && !dbSettings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  if (!localSettings) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
            <p className="text-muted-foreground">
              Gérez la configuration de votre établissement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            id="import-settings"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("import-settings")?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm" onClick={handleBackup}>
            <HardDrive className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      {/* Messages */}
      {hasChanges && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Vous avez des modifications non enregistrées. N'oubliez pas de
            sauvegarder.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Profil utilisateur - Optionnel, si vous voulez garder la section profil */}
      {user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Mon Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  Rôle: {user.role}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onglets */}
      <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 h-auto p-1">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden md:inline">Général</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden md:inline">Contact</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            <span className="hidden md:inline">Académique</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden md:inline">Financier</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden md:inline">Apparence</span>
          </TabsTrigger>
        </TabsList>

        {/* Général */}
        <TabsContent value="general">
          <GeneralSettings
            settings={localSettings}
            setSettings={setLocalSettings}
          />
        </TabsContent>

        {/* Contact */}
        <TabsContent value="contact">
          <ContactSettings
            settings={localSettings}
            setSettings={setLocalSettings}
          />
        </TabsContent>

        {/* Académique */}
        <TabsContent value="academic">
          <AcademicSettings
            settings={localSettings}
            setSettings={setLocalSettings}
          />
        </TabsContent>

        {/* Financier */}
        <TabsContent value="financial">
          <FinancialSettings
            settings={localSettings}
            setSettings={setLocalSettings}
          />
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security">
          <SecuritySettingsComponent
            settings={localSettings}
            setSettings={setLocalSettings}
          />
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les notifications importantes par email
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.enableEmailNotifications}
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        enableEmailNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les notifications par SMS
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.enableSmsNotifications}
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        enableSmsNotifications: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications push</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les notifications en temps réel
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.enablePushNotifications}
                    onCheckedChange={(checked) =>
                      setLocalSettings({
                        ...localSettings,
                        enablePushNotifications: checked,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apparence */}
        <TabsContent value="appearance">
          <AppearanceSettingsComponent
            settings={localSettings}
            setSettings={setLocalSettings}
          />
        </TabsContent>
      </Tabs>

      {/* Aperçu en direct */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Aperçu en direct</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={localSettings.schoolLogo}
                  alt={localSettings.schoolName}
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.src = "/logo.png")}
                />
              </div>
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: localSettings.primaryColor }}
                >
                  {localSettings.schoolName}
                </h3>
                <p className="text-muted-foreground">
                  {localSettings.schoolSlogan}
                </p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span>{localSettings.phone}</span>
                  <span>•</span>
                  <span>{localSettings.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
