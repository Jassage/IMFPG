
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Building2, 
  Edit, 
  Trash2,
  Users,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAcademicStore } from '../store/academicStore';
import { Faculty } from '../types/academic';

export const FacultiesManager = () => {
  const { faculties, students, enrollments, ues, addFaculty, updateFaculty, deleteFaculty } = useAcademicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    dean: '',
    levels: ['L1', 'L2', 'L3'],
    status: 'Active' as Faculty['status']
  });

  const handleSubmit = () => {
    if (formData.name && formData.code && formData.dean) {
      const studentsCount = students.filter(s => s.faculty === formData.name).length;
      const coursesCount = ues.filter(ue => ue.faculty === formData.name).length;
      
      const facultyData: Faculty = {
        id: selectedFaculty?.id || crypto.randomUUID(),
        ...formData,
        studentsCount,
        coursesCount,
        createdAt: selectedFaculty?.createdAt || new Date().toISOString()
      };
      
      if (selectedFaculty) {
        updateFaculty(selectedFaculty.id, facultyData);
      } else {
        addFaculty(facultyData);
      }
      
      setIsFormOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      dean: '',
      levels: ['L1', 'L2', 'L3'],
      status: 'Active'
    });
    setSelectedFaculty(null);
  };

  const handleEdit = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setFormData({
      name: faculty.name,
      code: faculty.code,
      description: faculty.description,
      dean: faculty.dean,
      levels: faculty.levels,
      status: faculty.status
    });
    setIsFormOpen(true);
  };

  const handleDelete = (facultyId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette faculté ?')) {
      deleteFaculty(facultyId);
    }
  };

  const filteredFaculties = faculties.filter(faculty =>
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Facultés</h1>
          <p className="text-muted-foreground">
            Gérez les facultés et leurs programmes d'études
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Faculté
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {selectedFaculty ? 'Modifier Faculté' : 'Ajouter une faculté'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nom de la faculté</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nom de la faculté" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="Code (ex: FST)" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Doyen</Label>
                <Input 
                  value={formData.dean}
                  onChange={(e) => setFormData({...formData, dean: e.target.value})}
                  placeholder="Doyen" 
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description" 
                  rows={3} 
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSubmit}>
                  {selectedFaculty ? 'Modifier' : 'Ajouter'}
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
            placeholder="Rechercher une faculté..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFaculties.map((faculty) => (
          <Card key={faculty.id} className="hover:shadow-md transition-shadow ujeph-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{faculty.name}</CardTitle>
                  <Badge variant="outline" className="w-fit">{faculty.code}</Badge>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(faculty)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(faculty.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{faculty.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Doyen:</span>
                  <span className="font-medium">{faculty.dean}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium">{faculty.studentsCount}</div>
                      <div className="text-xs text-muted-foreground">Étudiants</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="text-sm font-medium">{faculty.coursesCount}</div>
                      <div className="text-xs text-muted-foreground">Cours</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Niveaux:</div>
                <div className="flex flex-wrap gap-1">
                  {faculty.levels.map((level) => (
                    <Badge key={level} variant="secondary" className="text-xs">
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Badge 
                  variant={faculty.status === 'Active' ? 'default' : 'secondary'}
                  className={faculty.status === 'Active' ? 'ujeph-badge-success' : ''}
                >
                  {faculty.status}
                </Badge>
                <Button variant="outline" size="sm">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  Voir détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredFaculties.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune faculté trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};
