// API Service - Interface pour les appels API (MongoDB dans le futur)
import { 
  Student, UE, Grade, Retake, Guardian, User, Faculty, Schedule, Attendance, Payment, 
  Book, BookLoan, Transcript, Message, Event, Announcement, Scholarship, ScholarshipApplication,
  Room, RoomReservation, Certificate, Analytics, Enrollment
} from '../types/academic';

// Configuration de l'API (sera remplacée par votre URL MongoDB)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Interface pour les réponses API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Service API générique
class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      // Pour le moment, on simule des appels API avec des données mock
      // Plus tard, on remplacera par de vrais appels fetch vers MongoDB
      return this.mockApiCall<T>(endpoint, options);
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Erreur de connexion à l\'API' };
    }
  }

  // Simulation d'appels API (à remplacer par de vrais appels)
  private async mockApiCall<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Pour le moment, on retourne des données vides
    // Les données seront gérées par le store local
    return { success: true, data: [] as unknown as T };
  }

  // Students
  async getStudents(): Promise<ApiResponse<Student[]>> {
    return this.request<Student[]>('/students');
  }

  async createStudent(student: Omit<Student, 'id'>): Promise<ApiResponse<Student>> {
    return this.request<Student>('/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
  }

  async updateStudent(id: string, student: Partial<Student>): Promise<ApiResponse<Student>> {
    return this.request<Student>(`/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
  }

  async deleteStudent(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/students/${id}`, { method: 'DELETE' });
  }

  // Enrollments
  async getEnrollments(): Promise<ApiResponse<Enrollment[]>> {
    return this.request<Enrollment[]>('/enrollments');
  }

  async createEnrollment(enrollment: Omit<Enrollment, 'id'>): Promise<ApiResponse<Enrollment>> {
    return this.request<Enrollment>('/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrollment)
    });
  }

  // UEs
  async getUEs(): Promise<ApiResponse<UE[]>> {
    return this.request<UE[]>('/ues');
  }

  async createUE(ue: Omit<UE, 'id'>): Promise<ApiResponse<UE>> {
    return this.request<UE>('/ues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ue)
    });
  }

  // Grades
  async getGrades(): Promise<ApiResponse<Grade[]>> {
    return this.request<Grade[]>('/grades');
  }

  async createGrade(grade: Omit<Grade, 'id'>): Promise<ApiResponse<Grade>> {
    return this.request<Grade>('/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grade)
    });
  }

  // Users
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users');
  }

  async createUser(user: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
  }

  // Faculties
  async getFaculties(): Promise<ApiResponse<Faculty[]>> {
    return this.request<Faculty[]>('/faculties');
  }

  async createFaculty(faculty: Omit<Faculty, 'id'>): Promise<ApiResponse<Faculty>> {
    return this.request<Faculty>('/faculties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faculty)
    });
  }

  // Guardians
  async getGuardians(): Promise<ApiResponse<Guardian[]>> {
    return this.request<Guardian[]>('/guardians');
  }

  async createGuardian(guardian: Omit<Guardian, 'id'>): Promise<ApiResponse<Guardian>> {
    return this.request<Guardian>('/guardians', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guardian)
    });
  }
}

export const apiService = new ApiService();