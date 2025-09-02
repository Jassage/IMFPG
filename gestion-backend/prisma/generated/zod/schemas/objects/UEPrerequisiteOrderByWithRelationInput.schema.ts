import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { UEOrderByWithRelationInputObjectSchema } from './UEOrderByWithRelationInput.schema';
import { UEPrerequisiteOrderByRelevanceInputObjectSchema } from './UEPrerequisiteOrderByRelevanceInput.schema'

export const UEPrerequisiteOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.UEPrerequisiteOrderByWithRelationInput, z.ZodTypeDef, Prisma.UEPrerequisiteOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  prerequisiteId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  ue: z.lazy(() => UEOrderByWithRelationInputObjectSchema).optional(),
  prerequisite: z.lazy(() => UEOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => UEPrerequisiteOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const UEPrerequisiteOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  prerequisiteId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  ue: z.lazy(() => UEOrderByWithRelationInputObjectSchema).optional(),
  prerequisite: z.lazy(() => UEOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => UEPrerequisiteOrderByRelevanceInputObjectSchema).optional()
}).strict();
