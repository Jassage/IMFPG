import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { EventOrderByWithRelationInputObjectSchema } from './EventOrderByWithRelationInput.schema';
import { EventParticipantOrderByRelevanceInputObjectSchema } from './EventParticipantOrderByRelevanceInput.schema'

export const EventParticipantOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.EventParticipantOrderByWithRelationInput, z.ZodTypeDef, Prisma.EventParticipantOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  eventId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  event: z.lazy(() => EventOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => EventParticipantOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const EventParticipantOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  eventId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  event: z.lazy(() => EventOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => EventParticipantOrderByRelevanceInputObjectSchema).optional()
}).strict();
