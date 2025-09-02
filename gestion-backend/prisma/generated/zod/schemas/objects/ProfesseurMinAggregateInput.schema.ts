import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ProfesseurMinAggregateInputObjectSchema: z.ZodType<Prisma.ProfesseurMinAggregateInputType, z.ZodTypeDef, Prisma.ProfesseurMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  firstName: z.literal(true).optional(),
  lastName: z.literal(true).optional(),
  email: z.literal(true).optional(),
  phone: z.literal(true).optional(),
  department: z.literal(true).optional(),
  office: z.literal(true).optional(),
  hireDate: z.literal(true).optional(),
  status: z.literal(true).optional(),
  speciality: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ProfesseurMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  firstName: z.literal(true).optional(),
  lastName: z.literal(true).optional(),
  email: z.literal(true).optional(),
  phone: z.literal(true).optional(),
  department: z.literal(true).optional(),
  office: z.literal(true).optional(),
  hireDate: z.literal(true).optional(),
  status: z.literal(true).optional(),
  speciality: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
