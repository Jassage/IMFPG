import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UserStatusSchema } from '../enums/UserStatus.schema'

export const ProfesseurCreateManyInputObjectSchema: z.ZodType<Prisma.ProfesseurCreateManyInput, z.ZodTypeDef, Prisma.ProfesseurCreateManyInput> = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  department: z.string().nullish(),
  office: z.string().nullish(),
  hireDate: z.date().nullish(),
  status: UserStatusSchema.optional(),
  speciality: z.string().nullish(),
  userId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const ProfesseurCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  department: z.string().nullish(),
  office: z.string().nullish(),
  hireDate: z.date().nullish(),
  status: UserStatusSchema.optional(),
  speciality: z.string().nullish(),
  userId: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
