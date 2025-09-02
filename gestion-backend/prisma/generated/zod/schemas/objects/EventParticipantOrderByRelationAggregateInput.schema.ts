import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const EventParticipantOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.EventParticipantOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.EventParticipantOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const EventParticipantOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
