import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateNestedOneWithoutGuardiansInputObjectSchema } from './StudentCreateNestedOneWithoutGuardiansInput.schema'

export const GuardianCreateInputObjectSchema: z.ZodType<Prisma.GuardianCreateInput, z.ZodTypeDef, Prisma.GuardianCreateInput> = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  relationship: z.string(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  address: z.string().nullish(),
  isPrimary: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutGuardiansInputObjectSchema)
}).strict();
export const GuardianCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  relationship: z.string(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  address: z.string().nullish(),
  isPrimary: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutGuardiansInputObjectSchema)
}).strict();
