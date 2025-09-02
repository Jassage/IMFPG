import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const EventParticipantMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.EventParticipantMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.EventParticipantMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  eventId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const EventParticipantMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  eventId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
