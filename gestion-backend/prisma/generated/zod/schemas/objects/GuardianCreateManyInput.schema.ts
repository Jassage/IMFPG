import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const GuardianCreateManyInputObjectSchema: z.ZodType<Prisma.GuardianCreateManyInput, z.ZodTypeDef, Prisma.GuardianCreateManyInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  relationship: z.string(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  address: z.string().nullish(),
  isPrimary: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const GuardianCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  relationship: z.string(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  address: z.string().nullish(),
  isPrimary: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
