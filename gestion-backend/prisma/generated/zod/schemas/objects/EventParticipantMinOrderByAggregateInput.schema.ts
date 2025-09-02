import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const EventParticipantMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.EventParticipantMinOrderByAggregateInput, z.ZodTypeDef, Prisma.EventParticipantMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  eventId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const EventParticipantMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  eventId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
