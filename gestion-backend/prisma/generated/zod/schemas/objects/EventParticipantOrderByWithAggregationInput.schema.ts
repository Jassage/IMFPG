import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { EventParticipantCountOrderByAggregateInputObjectSchema } from './EventParticipantCountOrderByAggregateInput.schema';
import { EventParticipantMaxOrderByAggregateInputObjectSchema } from './EventParticipantMaxOrderByAggregateInput.schema';
import { EventParticipantMinOrderByAggregateInputObjectSchema } from './EventParticipantMinOrderByAggregateInput.schema'

export const EventParticipantOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.EventParticipantOrderByWithAggregationInput, z.ZodTypeDef, Prisma.EventParticipantOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  eventId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  _count: z.lazy(() => EventParticipantCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => EventParticipantMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => EventParticipantMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const EventParticipantOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  eventId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  _count: z.lazy(() => EventParticipantCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => EventParticipantMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => EventParticipantMinOrderByAggregateInputObjectSchema).optional()
}).strict();
