
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAcademicStore } from '../../store/academicStore';
import { Student } from '../../types/academic';
import { toast } from 'sonner';

const studentSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  studentId: z.string().min(1, 'Numéro étudiant requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Téléphone requis'),
  dateOfBirth: z.string().min(1, 'Date de naissance requise'),
  placeOfBirth: z.string().min(1, 'Lieu de naissance requis'),
  address: z.string().min(10, 'Adresse requise'),
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  disabilities: z.string().optional(),
  faculty: z.string().min(1, 'Faculté requise'),
  level: z.string().min(1, 'Niveau requis'),
  academicYear: z.string().min(1, 'Année académique requise'),
  status: z.enum(['Active', 'Inactive', 'Graduated'])
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: Student | null;
  onClose: () => void;
}

export const StudentForm = ({ student, onClose }: StudentFormProps) => {
  const { addStudent, updateStudent } = useAcademicStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: student || {
      firstName: '',
      lastName: '',
      studentId: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      placeOfBirth: '',
      address: '',
      bloodGroup: '',
      allergies: '',
      disabilities: '',
      faculty: '',
      level: '',
      academicYear: '2024-2025',
      status: 'Active'
    }
  });

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      if (student) {
        updateStudent(student.id, data);
        toast.success('Étudiant modifié avec succès');
      } else {
        const newStudent: Student = {
          id: crypto.randomUUID(),
          ...data
        };
        addStudent(newStudent);
        toast.success('Étudiant ajouté avec succès');
      }
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            {...form.register('firstName')}
            placeholder="Prénom"
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            {...form.register('lastName')}
            placeholder="Nom de famille"
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentId">Numéro Étudiant *</Label>
          <Input
            id="studentId"
            {...form.register('studentId')}
            placeholder="Ex: 2024001"
          />
          {form.formState.errors.studentId && (
            <p className="text-sm text-red-500">{form.formState.errors.studentId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="email@exemple.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone *</Label>
          <Input
            id="phone"
            {...form.register('phone')}
            placeholder="+33 1 23 45 67 89"
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date de Naissance *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...form.register('dateOfBirth')}
          />
          {form.formState.errors.dateOfBirth && (
            <p className="text-sm text-red-500">{form.formState.errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="placeOfBirth">Lieu de Naissance *</Label>
          <Input
            id="placeOfBirth"
            {...form.register('placeOfBirth')}
            placeholder="Ville, Pays"
          />
          {form.formState.errors.placeOfBirth && (
            <p className="text-sm text-red-500">{form.formState.errors.placeOfBirth.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="faculty">Faculté *</Label>
          <Select onValueChange={(value) => form.setValue('faculty', value)} defaultValue={form.getValues('faculty')}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une faculté" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Informatique">Informatique</SelectItem>
              <SelectItem value="Mathématiques">Mathématiques</SelectItem>
              <SelectItem value="Physique">Physique</SelectItem>
              <SelectItem value="Chimie">Chimie</SelectItem>
              <SelectItem value="Biologie">Biologie</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.faculty && (
            <p className="text-sm text-red-500">{form.formState.errors.faculty.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Niveau *</Label>
          <Select onValueChange={(value) => form.setValue('level', value)} defaultValue={form.getValues('level')}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L1">Licence 1</SelectItem>
              <SelectItem value="L2">Licence 2</SelectItem>
              <SelectItem value="L3">Licence 3</SelectItem>
              <SelectItem value="M1">Master 1</SelectItem>
              <SelectItem value="M2">Master 2</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.level && (
            <p className="text-sm text-red-500">{form.formState.errors.level.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="academicYear">Année Académique *</Label>
          <Input
            id="academicYear"
            {...form.register('academicYear')}
            placeholder="2024-2025"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select onValueChange={(value) => form.setValue('status', value as Student['status'])} defaultValue={form.getValues('status')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Actif</SelectItem>
              <SelectItem value="Inactive">Inactif</SelectItem>
              <SelectItem value="Graduated">Diplômé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Groupe Sanguin</Label>
          <Select onValueChange={(value) => form.setValue('bloodGroup', value)} defaultValue={form.getValues('bloodGroup')}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse *</Label>
        <Textarea
          id="address"
          {...form.register('address')}
          placeholder="Adresse complète"
        />
        {form.formState.errors.address && (
          <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies</Label>
        <Textarea
          id="allergies"
          {...form.register('allergies')}
          placeholder="Allergies connues (optionnel)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="disabilities">Handicaps</Label>
        <Textarea
          id="disabilities"
          {...form.register('disabilities')}
          placeholder="Handicaps ou besoins spéciaux (optionnel)"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sauvegarde...' : student ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};
