
import { useState } from 'react';
import { Plus, BookOpen, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicStore } from '../store/academicStore';
import { UE } from '../types/academic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ueSchema = z.object({
  code: z.string().min(1, 'Code requis'),
  title: z.string().min(1, 'Titre requis'),
  credits: z.number().min(1, 'Crédits requis').max(30),
  type: z.enum(['Obligatoire', 'Optionnelle']),
  passingGrade: z.number().min(0).max(20),
  faculty: z.string().min(1, 'Faculté requise'),
  level: z.string().min(1, 'Niveau requis'),
  semester: z.enum(['S1', 'S2']),
  prerequisites: z.array(z.string()).default([])
});

type UEFormData = z.infer<typeof ueSchema>;

export const CoursesManager = () => {
  const { ues, addUE } = useAcademicStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const form = useForm<UEFormData>({
    resolver: zodResolver(ueSchema),
    defaultValues: {
      code: '',
      title: '',
      credits: 6,
      type: 'Obligatoire',
      passingGrade: 10,
      faculty: '',
      level: '',
      semester: 'S1',
      prerequisites: []
    }
  });

  const filteredUEs = ues.filter(ue => {
    const matchesSearch = ue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ue.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty = !selectedFaculty || ue.faculty === selectedFaculty;
    const matchesLevel = !selectedLevel || ue.level === selectedLevel;
    
    return matchesSearch && matchesFaculty && matchesLevel;
  });

  const onSubmit = async (data: UEFormData) => {
    try {
      const newUE: UE = {
        id: crypto.randomUUID(),
        ...data
      };
      addUE(newUE);
      toast.success('UE ajoutée avec succès');
      setIsFormOpen(false);
      form.reset();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const getTypeBadge = (type: UE['type']) => {
    return (
      <Badge variant={type === 'Obligatoire' ? 'default' : 'secondary'}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Unités d'Enseignement</h2>
          <p className="text-muted-foreground">
            Gérez les cours et unités d'enseignement
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle UE
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nouvelle Unité d'Enseignement</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code UE *</Label>
                  <Input
                    id="code"
                    {...form.register('code')}
                    placeholder="Ex: INFO101"
                  />
                  {form.formState.errors.code && (
                    <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credits">Crédits ECTS *</Label>
                  <Input
                    id="credits"
                    type="number"
                    {...form.register('credits', { valueAsNumber: true })}
                    min="1"
                    max="30"
                  />
                  {form.formState.errors.credits && (
                    <p className="text-sm text-red-500">{form.formState.errors.credits.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="Titre de l'UE"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select onValueChange={(value) => form.setValue('type', value as UE['type'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type d'UE" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Obligatoire">Obligatoire</SelectItem>
                      <SelectItem value="Optionnelle">Optionnelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passingGrade">Note de Passage *</Label>
                  <Input
                    id="passingGrade"
                    type="number"
                    step="0.5"
                    min="0"
                    max="20"
                    {...form.register('passingGrade', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Faculté *</Label>
                  <Select onValueChange={(value) => form.setValue('faculty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Faculté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Informatique">Informatique</SelectItem>
                      <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                      <SelectItem value="Physique">Physique</SelectItem>
                      <SelectItem value="Chimie">Chimie</SelectItem>
                      <SelectItem value="Biologie">Biologie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Niveau *</Label>
                  <Select onValueChange={(value) => form.setValue('level', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L1">Licence 1</SelectItem>
                      <SelectItem value="L2">Licence 2</SelectItem>
                      <SelectItem value="L3">Licence 3</SelectItem>
                      <SelectItem value="M1">Master 1</SelectItem>
                      <SelectItem value="M2">Master 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Semestre *</Label>
                  <Select onValueChange={(value) => form.setValue('semester', value as UE['semester'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S1">Semestre 1</SelectItem>
                      <SelectItem value="S2">Semestre 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Ajouter
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une UE..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Toutes les facultés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les facultés</SelectItem>
                <SelectItem value="Informatique">Informatique</SelectItem>
                <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                <SelectItem value="Physique">Physique</SelectItem>
                <SelectItem value="Chimie">Chimie</SelectItem>
                <SelectItem value="Biologie">Biologie</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les niveaux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les niveaux</SelectItem>
                <SelectItem value="L1">Licence 1</SelectItem>
                <SelectItem value="L2">Licence 2</SelectItem>
                <SelectItem value="L3">Licence 3</SelectItem>
                <SelectItem value="M1">Master 1</SelectItem>
                <SelectItem value="M2">Master 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des UE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Liste des UE ({filteredUEs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredUEs.map((ue) => (
              <Card key={ue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{ue.code}</h3>
                        {getTypeBadge(ue.type)}
                        <Badge variant="outline">{ue.credits} ECTS</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{ue.title}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{ue.faculty} - {ue.level}</span>
                        <span>{ue.semester}</span>
                        <span>Note de passage: {ue.passingGrade}/20</span>
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
