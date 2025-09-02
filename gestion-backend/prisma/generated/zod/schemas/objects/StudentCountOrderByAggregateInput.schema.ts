import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const StudentCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StudentCountOrderByAggregateInput, z.ZodTypeDef, Prisma.StudentCountOrderByAggregateInput> = z.object({
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
export const StudentCountOrderByAggregateInputObjectZodSchema = z.object({
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
