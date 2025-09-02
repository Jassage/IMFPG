import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ProfesseurMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProfesseurMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.ProfesseurMaxOrderByAggregateInput> = z.object({
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
export const ProfesseurMaxOrderByAggregateInputObjectZodSchema = z.object({
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
