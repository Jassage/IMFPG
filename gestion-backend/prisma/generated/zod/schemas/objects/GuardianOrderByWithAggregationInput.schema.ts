import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { GuardianCountOrderByAggregateInputObjectSchema } from './GuardianCountOrderByAggregateInput.schema';
import { GuardianMaxOrderByAggregateInputObjectSchema } from './GuardianMaxOrderByAggregateInput.schema';
import { GuardianMinOrderByAggregateInputObjectSchema } from './GuardianMinOrderByAggregateInput.schema'

export const GuardianOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.GuardianOrderByWithAggregationInput, z.ZodTypeDef, Prisma.GuardianOrderByWithAggregationInput> = z.object({
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
  _count: z.lazy(() => GuardianCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => GuardianMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => GuardianMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const GuardianOrderByWithAggregationInputObjectZodSchema = z.object({
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
  _count: z.lazy(() => GuardianCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => GuardianMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => GuardianMinOrderByAggregateInputObjectSchema).optional()
}).strict();
