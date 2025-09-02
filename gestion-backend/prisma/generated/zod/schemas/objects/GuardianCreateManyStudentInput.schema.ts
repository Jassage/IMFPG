import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const GuardianCreateManyStudentInputObjectSchema: z.ZodType<Prisma.GuardianCreateManyStudentInput, z.ZodTypeDef, Prisma.GuardianCreateManyStudentInput> = z.object({
  id: z.string().optional(),
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
export const GuardianCreateManyStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
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
