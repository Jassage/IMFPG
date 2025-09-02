import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const GuardianUncheckedCreateInputObjectSchema: z.ZodType<Prisma.GuardianUncheckedCreateInput, z.ZodTypeDef, Prisma.GuardianUncheckedCreateInput> = z.object({
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
export const GuardianUncheckedCreateInputObjectZodSchema = z.object({
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
