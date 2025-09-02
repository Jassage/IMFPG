import { z } from 'zod';
export const UserUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  role: z.unknown(),
  status: z.unknown(),
  lastLogin: z.date().optional(),
  avatar: z.string().optional(),
  password: z.string().optional(),
  student: z.unknown().optional(),
  professeur: z.unknown().optional(),
  createdUEs: z.array(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date()
}));