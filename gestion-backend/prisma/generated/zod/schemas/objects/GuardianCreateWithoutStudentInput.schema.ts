import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const GuardianCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.GuardianCreateWithoutStudentInput, z.ZodTypeDef, Prisma.GuardianCreateWithoutStudentInput> = z.object({
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
export const GuardianCreateWithoutStudentInputObjectZodSchema = z.object({
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
