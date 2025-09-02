import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StudentOrderByWithRelationInputObjectSchema } from './StudentOrderByWithRelationInput.schema';
import { UEOrderByWithRelationInputObjectSchema } from './UEOrderByWithRelationInput.schema';
import { RetakeOrderByRelevanceInputObjectSchema } from './RetakeOrderByRelevanceInput.schema'

export const RetakeOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.RetakeOrderByWithRelationInput, z.ZodTypeDef, Prisma.RetakeOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scheduledSemester: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  ue: z.lazy(() => UEOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => RetakeOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const RetakeOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scheduledSemester: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  student: z.lazy(() => StudentOrderByWithRelationInputObjectSchema).optional(),
  ue: z.lazy(() => UEOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => RetakeOrderByRelevanceInputObjectSchema).optional()
}).strict();
