import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProfesseurCountOrderByAggregateInputObjectSchema } from './ProfesseurCountOrderByAggregateInput.schema';
import { ProfesseurMaxOrderByAggregateInputObjectSchema } from './ProfesseurMaxOrderByAggregateInput.schema';
import { ProfesseurMinOrderByAggregateInputObjectSchema } from './ProfesseurMinOrderByAggregateInput.schema'

export const ProfesseurOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ProfesseurOrderByWithAggregationInput, z.ZodTypeDef, Prisma.ProfesseurOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  department: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  office: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  hireDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  speciality: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ProfesseurCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ProfesseurMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ProfesseurMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ProfesseurOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  firstName: SortOrderSchema.optional(),
  lastName: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  phone: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  department: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  office: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  hireDate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  speciality: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ProfesseurCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ProfesseurMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ProfesseurMinOrderByAggregateInputObjectSchema).optional()
}).strict();
