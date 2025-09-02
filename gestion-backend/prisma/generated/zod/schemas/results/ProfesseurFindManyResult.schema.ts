import { z } from 'zod';
export const ProfesseurFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});