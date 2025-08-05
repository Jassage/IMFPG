import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Download, 
  Upload,
  Save,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';

export const SettingsPage = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profil
    profile: {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@ujeph.edu.ht',
      phone: '+509 1234 5678',
      bio: 'Administrateur système à l\'Université Saint Joseph de Pétionville',
      address: 'Pétion-Ville, Haïti',
      birthDate: '1985-06-15',
      department: 'Administration Système',
      position: 'Administrateur Principal',
    },
    
    // Notifications
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      academicAlerts: true,
      paymentReminders: true,
      systemUpdates: false,
    },
    
    // Apparence
    appearance: {
      theme: 'system',
      language: 'fr',
      dateFormat: 'dd/mm/yyyy',
      timeFormat: '24h',
    },
    
    // Sécurité
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginAlerts: true,
      deviceManagement: true,
    },
    
    // Préférences académiques
    academic: {
      defaultAcademicYear: '2024-2025',
      defaultSemester: 'Semestre 1',
      autoSaveInterval: 5,
    },
  });

  const handleSave = (section: string) => {
    toast({
      title: "Paramètres sauvegardés",
      description: `Les paramètres de ${section} ont été mis à jour avec succès.`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Vos données sont en cours d'exportation...",
    });
  };

  const handleImport = () => {
    toast({
      title: "Import",
      description: "Sélectionnez un fichier à importer",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground">Configurez vos préférences et paramètres du système</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="academic" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Académique
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Données
          </TabsTrigger>
        </TabsList>

        {/* Profil */}
        <TabsContent value="profile">
          <ProfileSettings 
            profile={settings.profile}
            onProfileUpdate={(profile) => setSettings({...settings, profile})}
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
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, emailNotifications: checked}
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
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, pushNotifications: checked}
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes académiques</Label>
                    <p className="text-sm text-muted-foreground">
                      Notes, présences, échéances importantes
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.academicAlerts}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, academicAlerts: checked}
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rappels de paiement</Label>
                    <p className="text-sm text-muted-foreground">
                      Échéances de paiement et factures
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.paymentReminders}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, paymentReminders: checked}
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mises à jour système</Label>
                    <p className="text-sm text-muted-foreground">
                      Nouvelles fonctionnalités et maintenance
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemUpdates}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, systemUpdates: checked}
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('notifications')} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les notifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apparence */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apparence et langue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Thème</Label>
                  <Select value={settings.appearance.theme} onValueChange={(value) => 
                    setSettings({
                      ...settings, 
                      appearance: {...settings.appearance, theme: value}
                    })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Langue</Label>
                  <Select value={settings.appearance.language} onValueChange={(value) => 
                    setSettings({
                      ...settings, 
                      appearance: {...settings.appearance, language: value}
                    })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ht">Krèyol Ayisyen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Format de date</Label>
                  <Select value={settings.appearance.dateFormat} onValueChange={(value) => 
                    setSettings({
                      ...settings, 
                      appearance: {...settings.appearance, dateFormat: value}
                    })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Format d'heure</Label>
                  <Select value={settings.appearance.timeFormat} onValueChange={(value) => 
                    setSettings({
                      ...settings, 
                      appearance: {...settings.appearance, timeFormat: value}
                    })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 heures</SelectItem>
                      <SelectItem value="12h">12 heures (AM/PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => handleSave('apparence')} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder l'apparence
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security">
          <SecuritySettings 
            security={settings.security}
            onSecurityUpdate={(security) => setSettings({...settings, security})}
          />
        </TabsContent>

        {/* Préférences académiques */}
        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Préférences académiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Année académique par défaut</Label>
                  <Select value={settings.academic.defaultAcademicYear} onValueChange={(value) => 
                    setSettings({
                      ...settings, 
                      academic: {...settings.academic, defaultAcademicYear: value}
                    })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Semestre par défaut</Label>
                  <Select value={settings.academic.defaultSemester} onValueChange={(value) => 
                    setSettings({
                      ...settings, 
                      academic: {...settings.academic, defaultSemester: value}
                    })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semestre 1">Semestre 1</SelectItem>
                      <SelectItem value="Semestre 2">Semestre 2</SelectItem>
                      <SelectItem value="Semestre d'été">Semestre d'été</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sauvegarde automatique (minutes)</Label>
                  <Select 
                    value={(settings.academic?.autoSaveInterval ?? 5).toString()}
                    onValueChange={(value) => 
                      setSettings({
                        ...settings, 
                        academic: {...settings.academic, autoSaveInterval: parseInt(value)}
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => handleSave('académique')} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les préférences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestion des données */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Gestion des données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Exporter les données</h3>
                  <p className="text-sm text-muted-foreground">
                    Téléchargez vos données dans différents formats
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter en Excel
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter en PDF
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Importer les données</h3>
                  <p className="text-sm text-muted-foreground">
                    Importez des données à partir de fichiers externes
                  </p>
                  <Button variant="outline" onClick={handleImport}>
                    <Upload className="h-4 w-4 mr-2" />
                    Importer un fichier
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-destructive">Zone de danger</h3>
                  <p className="text-sm text-muted-foreground">
                    Actions irréversibles
                  </p>
                  <Button variant="destructive" onClick={() => 
                    toast({
                      title: "Action non autorisée",
                      description: "Cette action nécessite une autorisation spéciale",
                      variant: "destructive"
                    })
                  }>
                    Réinitialiser toutes les données
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};