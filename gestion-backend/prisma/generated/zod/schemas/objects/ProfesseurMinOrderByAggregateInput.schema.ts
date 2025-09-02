import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ProfesseurMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProfesseurMinOrderByAggregateInput, z.ZodTypeDef, Prisma.ProfesseurMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  department: SortOrderSchema.optional(),
  office: SortOrderSchema.optional(),
  hireDate: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  speciality: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ProfesseurMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  department: SortOrderSchema.optional(),
  office: SortOrderSchema.optional(),
  hireDate: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  speciality: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
