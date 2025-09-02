import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { EventParticipantOrderByRelationAggregateInputObjectSchema } from './EventParticipantOrderByRelationAggregateInput.schema';
import { EventOrderByRelevanceInputObjectSchema } from './EventOrderByRelevanceInput.schema'

export const EventOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.EventOrderByWithRelationInput, z.ZodTypeDef, Prisma.EventOrderByWithRelationInput> = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  startDate: SortOrderSchema.optional(),
  endDate: SortOrderSchema.optional(),
  location: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  organizer: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  category: SortOrderSchema.optional(),
  isPublic: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  participants: z.lazy(() => EventParticipantOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => EventOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const EventOrderByWithRelationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  startDate: SortOrderSchema.optional(),
  endDate: SortOrderSchema.optional(),
  location: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  organizer: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  category: SortOrderSchema.optional(),
  isPublic: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  participants: z.lazy(() => EventParticipantOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => EventOrderByRelevanceInputObjectSchema).optional()
}).strict();
