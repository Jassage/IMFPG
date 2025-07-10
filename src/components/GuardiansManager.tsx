
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Heart, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAcademicStore } from '../store/academicStore';
import { Guardian } from '../types/academic';

export const GuardiansManager = () => {
  const { guardians, students, addGuardian, updateGuardian, deleteGuardian } = useAcademicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    studentId: ''
  });

  const handleSubmit = () => {
    if (formData.firstName && formData.lastName && formData.studentId) {
      const guardianData: Guardian = {
        id: selectedGuardian?.id || crypto.randomUUID(),
        ...formData
      };
      
      if (selectedGuardian) {
        updateGuardian(selectedGuardian.id, guardianData);
      } else {
        addGuardian(guardianData);
      }
      
      setIsFormOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      relationship: '',
      phone: '',
      email: '',
      address: '',
      studentId: ''
    });
    setSelectedGuardian(null);
  };

  const handleEdit = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setFormData({
      firstName: guardian.firstName,
      lastName: guardian.lastName,
      relationship: guardian.relationship,
      phone: guardian.phone,
      email: guardian.email,
      address: guardian.address,
      studentId: guardian.studentId
    });
    setIsFormOpen(true);
  };

  const handleDelete = (guardianId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce tuteur ?')) {
      deleteGuardian(guardianId);
    }
  };

  const filteredGuardians = guardians.filter(guardian => {
    const student = students.find(s => s.id === guardian.studentId);
    const guardianName = `${guardian.firstName} ${guardian.lastName}`.toLowerCase();
    const studentName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
    
    return guardianName.includes(searchTerm.toLowerCase()) ||
           studentName.includes(searchTerm.toLowerCase()) ||
           guardian.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Tuteurs</h1>
          <p className="text-muted-foreground">
            Gérez les tuteurs et responsables des étudiants
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Tuteur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedGuardian ? 'Modifier Tuteur' : 'Ajouter un tuteur'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="Prénom" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Nom" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Étudiant</Label>
                <Select value={formData.studentId} onValueChange={(value) => setFormData({...formData, studentId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un étudiant" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} ({student.studentId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Relation</Label>
                <Select value={formData.relationship} onValueChange={(value) => setFormData({...formData, relationship: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Relation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Père">Père</SelectItem>
                    <SelectItem value="Mère">Mère</SelectItem>
                    <SelectItem value="Tuteur">Tuteur</SelectItem>
                    <SelectItem value="Oncle">Oncle</SelectItem>
                    <SelectItem value="Tante">Tante</SelectItem>
                    <SelectItem value="Grand-parent">Grand-parent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Téléphone" 
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Email" 
                  type="email" 
                />
              </div>
              <div className="space-y-2">
                <Label>Adresse</Label>
                <Input 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Adresse" 
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSubmit}>
                  {selectedGuardian ? 'Modifier' : 'Ajouter'}
                </Button>
                <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un tuteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuardians.map((guardian) => {
          const student = students.find(s => s.id === guardian.studentId);
          
          return (
            <Card key={guardian.id} className="hover:shadow-md transition-shadow ujeph-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{guardian.firstName} {guardian.lastName}</CardTitle>
                      <Badge variant="outline">{guardian.relationship}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(guardian)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(guardian.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {student && (
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">Étudiant:</p>
                    <p className="text-sm text-muted-foreground">
                      {student.firstName} {student.lastName} ({student.studentId})
                    </p>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{guardian.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{guardian.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{guardian.address}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredGuardians.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun tuteur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};
