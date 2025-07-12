import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAcademicStore } from '../../store/academicStore';
import { Student } from '../../types/academic';

interface StudentFormProps {
  student?: Student | null;
  onClose: () => void;
}

export const StudentForm = ({ student, onClose }: StudentFormProps) => {
  const { addStudent, updateStudent, faculties } = useAcademicStore();
  
  const [formData, setFormData] = useState({
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
    status: 'Active' as 'Active' | 'Inactive' | 'Graduated'
  });

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        studentId: student.studentId || '',
        email: student.email || '',
        phone: student.phone || '',
        dateOfBirth: student.dateOfBirth || '',
        placeOfBirth: student.placeOfBirth || '',
        address: student.address || '',
        bloodGroup: student.bloodGroup || '',
        allergies: student.allergies || '',
        disabilities: student.disabilities || '',
        faculty: student.faculty || '',
        level: student.level || '',
        academicYear: student.academicYear || '2024-2025',
        status: student.status || 'Active'
      });
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.firstName && formData.lastName && formData.studentId && formData.email && formData.faculty && formData.level) {
      const studentData: Student = {
        id: student?.id || crypto.randomUUID(),
        ...formData
      };

      if (student) {
        updateStudent(student.id, studentData);
      } else {
        addStudent(studentData);
      }
      
      onClose();
    }
  };

  // Filter faculties to only include those with valid names
  const validFaculties = faculties.filter(faculty => faculty.name && faculty.name.trim() !== '');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studentId">ID Étudiant *</Label>
          <Input
            id="studentId"
            value={formData.studentId}
            onChange={(e) => setFormData({...formData, studentId: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="faculty">Faculté *</Label>
          <Select value={formData.faculty || undefined} onValueChange={(value) => setFormData({...formData, faculty: value || ''})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une faculté" />
            </SelectTrigger>
            <SelectContent>
              {validFaculties.map((faculty) => (
                <SelectItem key={faculty.id} value={faculty.name}>
                  {faculty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Niveau *</Label>
          <Select value={formData.level || undefined} onValueChange={(value) => setFormData({...formData, level: value || ''})}>
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

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date de Naissance</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="placeOfBirth">Lieu de Naissance</Label>
          <Input
            id="placeOfBirth"
            value={formData.placeOfBirth}
            onChange={(e) => setFormData({...formData, placeOfBirth: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Groupe Sanguin</Label>
          <Input
            id="bloodGroup"
            value={formData.bloodGroup}
            onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as 'Active' | 'Inactive' | 'Graduated'})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Graduated">Graduated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies">Allergies</Label>
        <Input
          id="allergies"
          value={formData.allergies}
          onChange={(e) => setFormData({...formData, allergies: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="disabilities">Handicaps</Label>
        <Input
          id="disabilities"
          value={formData.disabilities}
          onChange={(e) => setFormData({...formData, disabilities: e.target.value})}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit">
          {student ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};
