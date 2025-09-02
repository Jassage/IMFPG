import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const StudentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StudentMinOrderByAggregateInput, z.ZodTypeDef, Prisma.StudentMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  dateOfBirth: SortOrderSchema.optional(),
  placeOfBirth: SortOrderSchema.optional(),
  address: SortOrderSchema.optional(),
  photo: SortOrderSchema.optional(),
  bloodGroup: SortOrderSchema.optional(),
  allergies: SortOrderSchema.optional(),
  disabilities: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const StudentMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  dateOfBirth: SortOrderSchema.optional(),
  placeOfBirth: SortOrderSchema.optional(),
  address: SortOrderSchema.optional(),
  photo: SortOrderSchema.optional(),
  bloodGroup: SortOrderSchema.optional(),
  allergies: SortOrderSchema.optional(),
  disabilities: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
