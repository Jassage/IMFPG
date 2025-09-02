import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const EventParticipantCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.EventParticipantCountOrderByAggregateInput, z.ZodTypeDef, Prisma.EventParticipantCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  eventId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const EventParticipantCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  eventId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
