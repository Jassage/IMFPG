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

export const SettingsPage = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profil
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@ujeph.edu.ht',
    phone: '+509 1234 5678',
    bio: 'Administrateur système à l\'Université Saint Joseph de Pétionville',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    academicAlerts: true,
    paymentReminders: true,
    systemUpdates: false,
    
    // Apparence
    theme: 'system',
    language: 'fr',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h',
    
    // Sécurité
    twoFactorAuth: false,
    sessionTimeout: 30,
    
    // Préférences académiques
    defaultAcademicYear: '2024-2025',
    defaultSemester: 'Semestre 1',
    autoSaveInterval: 5,
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations du profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo de profil */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg">
                    {settings.firstName[0]}{settings.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Changer la photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG ou GIF. Taille maximale : 2MB
                  </p>
                </div>
              </div>

              <Separator />

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={settings.firstName}
                    onChange={(e) => setSettings({...settings, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={settings.lastName}
                    onChange={(e) => setSettings({...settings, lastName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-9"
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-9"
                      value={settings.phone}
                      onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  value={settings.bio}
                  onChange={(e) => setSettings({...settings, bio: e.target.value})}
                  placeholder="Décrivez votre rôle et vos responsabilités..."
                />
              </div>

              <Button onClick={() => handleSave('profil')} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder le profil
              </Button>
            </CardContent>
          </Card>
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
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, emailNotifications: checked})
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
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, pushNotifications: checked})
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
                    checked={settings.academicAlerts}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, academicAlerts: checked})
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
                    checked={settings.paymentReminders}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, paymentReminders: checked})
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
                    checked={settings.systemUpdates}
                    onCheckedChange={(checked) => 
                      setSettings({...settings, systemUpdates: checked})
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
                  <Select value={settings.theme} onValueChange={(value) => 
                    setSettings({...settings, theme: value})
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
                  <Select value={settings.language} onValueChange={(value) => 
                    setSettings({...settings, language: value})
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
                  <Select value={settings.dateFormat} onValueChange={(value) => 
                    setSettings({...settings, dateFormat: value})
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
                  <Select value={settings.timeFormat} onValueChange={(value) => 
                    setSettings({...settings, timeFormat: value})
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité et authentification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Changement de mot de passe */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mot de passe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mot de passe actuel"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Nouveau mot de passe"
                    />
                  </div>
                </div>
                <Button variant="outline">Changer le mot de passe</Button>
              </div>

              <Separator />

              {/* Authentification à deux facteurs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Sécurisez votre compte avec un code à usage unique
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.twoFactorAuth && (
                      <Badge variant="secondary">Activé</Badge>
                    )}
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, twoFactorAuth: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Délai d'expiration de session */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session</h3>
                <div className="space-y-2">
                  <Label>Délai d'expiration (minutes)</Label>
                  <Select 
                    value={settings.sessionTimeout.toString()} 
                    onValueChange={(value) => 
                      setSettings({...settings, sessionTimeout: parseInt(value)})
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                      <SelectItem value="120">2 heures</SelectItem>
                      <SelectItem value="480">8 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => handleSave('sécurité')} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder la sécurité
              </Button>
            </CardContent>
          </Card>
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
                  <Select value={settings.defaultAcademicYear} onValueChange={(value) => 
                    setSettings({...settings, defaultAcademicYear: value})
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
                  <Select value={settings.defaultSemester} onValueChange={(value) => 
                    setSettings({...settings, defaultSemester: value})
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
                    value={settings.autoSaveInterval.toString()} 
                    onValueChange={(value) => 
                      setSettings({...settings, autoSaveInterval: parseInt(value)})
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