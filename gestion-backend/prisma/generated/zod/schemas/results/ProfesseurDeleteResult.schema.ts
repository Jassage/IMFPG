import { z } from 'zod';
export const ProfesseurDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  department: z.string().optional(),
  office: z.string().optional(),
  hireDate: z.date().optional(),
  status: z.unknown(),
  speciality: z.string().optional(),
  user: z.unknown().optional(),
  userId: z.string().optional(),
  assignments: z.array(z.unknown()),
  schedules: z.array(z.unknown()),
  grades: z.array(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date()
}));