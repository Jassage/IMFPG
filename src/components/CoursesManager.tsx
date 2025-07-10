import { useState } from 'react';
import { Plus, Search, Edit, Trash2, BookOpen, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicStore } from '../store/academicStore';
import { UE } from '../types/academic';

export const CoursesManager = () => {
  const { ues, addUE } = useAcademicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUE, setSelectedUE] = useState<UE | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    credits: 3,
    type: 'Obligatoire' as 'Obligatoire' | 'Optionnelle',
    passingGrade: 10,
    faculty: '',
    level: '',
    semester: 'S1' as 'S1' | 'S2',
    prerequisites: [] as string[]
  });

  const handleSubmit = () => {
    if (formData.code && formData.title && formData.faculty && formData.level) {
      const newUE: UE = {
        id: crypto.randomUUID(),
        ...formData
      };
      addUE(newUE);
      setIsFormOpen(false);
      setFormData({
        code: '',
        title: '',
        credits: 3,
        type: 'Obligatoire',
        passingGrade: 10,
        faculty: '',
        level: '',
        semester: 'S1',
        prerequisites: []
      });
    }
  };

  const filteredUEs = ues.filter(ue =>
    ue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ue.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ue.faculty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Unités d'Enseignement</h2>
          <p className="text-muted-foreground">
            Gérez les cours et modules
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedUE(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle UE
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedUE ? 'Modifier UE' : 'Nouvelle UE'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code UE</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="Ex: INFO101"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Crédits</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Programmation Web"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculté</Label>
                  <Select value={formData.faculty} onValueChange={(value) => setFormData({...formData, faculty: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une faculté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sciences Informatiques">Sciences Informatiques</SelectItem>
                      <SelectItem value="Sciences Agronomiques">Sciences Agronomiques</SelectItem>
                      <SelectItem value="Théologie">Théologie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Niveau</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L1">L1</SelectItem>
                      <SelectItem value="L2">L2</SelectItem>
                      <SelectItem value="L3">L3</SelectItem>
                      <SelectItem value="M1">M1</SelectItem>
                      <SelectItem value="M2">M2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit}>
                  Enregistrer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Liste des UE ({filteredUEs.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une UE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredUEs.map((ue) => (
              <Card key={ue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {ue.code.substring(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{ue.title}</h3>
                          <Badge variant={ue.type === 'Obligatoire' ? 'default' : 'secondary'}>
                            {ue.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{ue.code} • {ue.credits} crédits • {ue.faculty}</p>
                          <p>{ue.level} - {ue.semester}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredUEs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune UE trouvée</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
