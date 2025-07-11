
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAcademicStore } from '../store/academicStore';
import { Payment } from '../types/academic';
import { DollarSign, Plus, Edit2, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export const PaymentManager = () => {
  const { payments, addPayment, updatePayment, students, faculties } = useAcademicStore();
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [formData, setFormData] = useState({
    studentId: '',
    amount: 0,
    type: 'Scolarité' as Payment['type'],
    status: 'En attente' as Payment['status'],
    dueDate: '',
    description: '',
    academicYear: '2024-2025'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payment: Payment = {
      id: editingPayment?.id || `payment_${Date.now()}`,
      ...formData,
      paidDate: formData.status === 'Payé' ? new Date().toISOString().split('T')[0] : undefined
    };

    if (editingPayment) {
      updatePayment(editingPayment.id, payment);
    } else {
      addPayment(payment);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      amount: 0,
      type: 'Scolarité',
      status: 'En attente',
      dueDate: '',
      description: '',
      academicYear: '2024-2025'
    });
    setEditingPayment(null);
    setShowForm(false);
  };

  const handleEdit = (payment: Payment) => {
    setFormData(payment);
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleStatusUpdate = (paymentId: string, status: Payment['status']) => {
    const updateData: Partial<Payment> = { status };
    if (status === 'Payé') {
      updateData.paidDate = new Date().toISOString().split('T')[0];
    }
    updatePayment(paymentId, updateData);
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Étudiant non trouvé';
  };

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'Payé':
        return <Badge className="bg-green-100 text-green-800">Payé</Badge>;
      case 'En attente':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'Retard':
        return <Badge className="bg-red-100 text-red-800">En retard</Badge>;
      case 'Annulé':
        return <Badge className="bg-gray-100 text-gray-800">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'Payé':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'En attente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Retard':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'Annulé':
        return <X className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStudent = !selectedStudent || payment.studentId === selectedStudent;
    const matchesStatus = !selectedStatus || payment.status === selectedStatus;
    return matchesStudent && matchesStatus;
  });

  const getPaymentStats = () => {
    const total = payments.length;
    const paid = payments.filter(p => p.status === 'Payé').length;
    const pending = payments.filter(p => p.status === 'En attente').length;
    const overdue = payments.filter(p => p.status === 'Retard').length;
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = payments.filter(p => p.status === 'Payé').reduce((sum, p) => sum + p.amount, 0);
    
    return { total, paid, pending, overdue, totalAmount, paidAmount };
  };

  const stats = getPaymentStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Paiements</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Paiement
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total des paiements</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payés</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En retard</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Étudiant</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les étudiants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les étudiants</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} - {student.studentId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="Payé">Payé</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Retard">En retard</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingPayment ? 'Modifier' : 'Ajouter'} un Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Étudiant *</Label>
                  <Select value={formData.studentId} onValueChange={(value) => setFormData({...formData, studentId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un étudiant" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName} - {student.studentId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type de paiement *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as Payment['type']})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inscription">Inscription</SelectItem>
                      <SelectItem value="Scolarité">Scolarité</SelectItem>
                      <SelectItem value="Examen">Examen</SelectItem>
                      <SelectItem value="Certificat">Certificat</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Montant (HTG) *</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date d'échéance *</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Statut *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as Payment['status']})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En attente">En attente</SelectItem>
                      <SelectItem value="Payé">Payé</SelectItem>
                      <SelectItem value="Retard">En retard</SelectItem>
                      <SelectItem value="Annulé">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description du paiement..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingPayment ? 'Modifier' : 'Ajouter'}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des paiements */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{getStudentName(payment.studentId)}</h3>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p><strong>Type:</strong> {payment.type}</p>
                      <p><strong>Montant:</strong> {payment.amount.toLocaleString()} HTG</p>
                      <p><strong>Échéance:</strong> {new Date(payment.dueDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      {payment.paidDate && (
                        <p><strong>Date de paiement:</strong> {new Date(payment.paidDate).toLocaleDateString('fr-FR')}</p>
                      )}
                      <p><strong>Année académique:</strong> {payment.academicYear}</p>
                      {payment.description && (
                        <p><strong>Description:</strong> {payment.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {payment.status !== 'Payé' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStatusUpdate(payment.id, 'Payé')}
                      className="text-green-600 hover:text-green-700"
                    >
                      Marquer comme payé
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(payment)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
