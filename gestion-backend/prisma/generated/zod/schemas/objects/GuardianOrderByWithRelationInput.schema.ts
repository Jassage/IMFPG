import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StudentOrderByWithRelationInputObjectSchema } from './StudentOrderByWithRelationInput.schema';
import { GuardianOrderByRelevanceInputObjectSchema } from './GuardianOrderByRelevanceInput.schema'

export const GuardianOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.GuardianOrderByWithRelationInput, z.ZodTypeDef, Prisma.GuardianOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  relationship: SortOrderSchema.optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  email: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  address: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isPrimary: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => GuardianOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const GuardianOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  relationship: SortOrderSchema.optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  email: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  address: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isPrimary: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => GuardianOrderByRelevanceInputObjectSchema).optional()
}).strict();
